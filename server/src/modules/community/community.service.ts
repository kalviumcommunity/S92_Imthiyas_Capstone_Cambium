import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicPost, AcademicPostType } from './entities/academic-post.entity';
import { Comment } from './entities/comment.entity';
import { PostReaction } from './entities/post-reaction.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(AcademicPost)
    private readonly postRepo: Repository<AcademicPost>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(PostReaction)
    private readonly reactionRepo: Repository<PostReaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Retrieve community feed with optional filtering by post primitive or tag
   */
  async getFeed(params?: { type?: string; tag?: string; limit?: number }) {
    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .orderBy('post.createdAt', 'DESC')
      .take(params?.limit || 20);

    if (params?.type && params.type !== 'all') {
      qb.andWhere('post.type = :type', { type: params.type });
    }

    if (params?.tag) {
      qb.andWhere(':tag = ANY(post.tags)', { tag: params.tag });
    }

    const posts = await qb.getMany();

    return {
      success: true,
      count: posts.length,
      data: posts,
    };
  }

  /**
   * Retrieve single post by UUID
   */
  async getPostById(id: string) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: {
        author: true,
        comments: {
          author: true,
          replies: {
            author: true,
          },
        },
        reactions: {
          user: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Academic post with ID ${id} not found.`);
    }

    return {
      success: true,
      data: post,
    };
  }

  /**
   * Create a new verified academic post
   */
  async createPost(userId: string, dto: CreatePostDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Scholar author profile not found.');
    }

    const post = this.postRepo.create({
      authorId: user.id,
      type: dto.type,
      title: dto.title,
      content: dto.content,
      tags: dto.tags || [],
      doiReference: dto.doiReference,
      opportunityId: dto.opportunityId,
      collaborationMetadata: dto.collaborationMetadata || {},
      metrics: { comments: 0, saves: 0, shares: 0, likes: 0 },
    });

    const saved = await this.postRepo.save(post);

    return {
      success: true,
      message: 'Academic post published successfully.',
      data: saved,
    };
  }

  /**
   * Append a nested peer discussion comment
   */
  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found.`);
    }

    const comment = this.commentRepo.create({
      postId,
      authorId: userId,
      parentId: dto.parentId,
      content: dto.content,
    });

    const saved = await this.commentRepo.save(comment);

    // Increment metrics counter
    post.metrics.comments = (post.metrics.comments || 0) + 1;
    await this.postRepo.save(post);

    return {
      success: true,
      data: saved,
    };
  }

  /**
   * Toggle reaction/endorsement on a post
   */
  async toggleReaction(postId: string, userId: string, reactionType = 'like') {
    const existing = await this.reactionRepo.findOne({
      where: { postId, userId, type: reactionType },
    });

    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post ${postId} not found.`);
    }

    if (existing) {
      await this.reactionRepo.remove(existing);
      if (reactionType === 'like' && post.metrics.likes > 0) post.metrics.likes -= 1;
      if (reactionType === 'save' && post.metrics.saves > 0) post.metrics.saves -= 1;
      await this.postRepo.save(post);
      return { success: true, action: 'removed', type: reactionType };
    }

    const reaction = this.reactionRepo.create({
      postId,
      userId,
      type: reactionType,
    });

    await this.reactionRepo.save(reaction);
    if (reactionType === 'like') post.metrics.likes = (post.metrics.likes || 0) + 1;
    if (reactionType === 'save') post.metrics.saves = (post.metrics.saves || 0) + 1;
    await this.postRepo.save(post);

    return { success: true, action: 'added', type: reactionType };
  }
}
