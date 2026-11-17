import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'room_id', type: 'varchar', length: 255 })
  roomId: string;

  @Index()
  @Column({ name: 'sender_id', type: 'varchar', length: 255 })
  senderId: string;

  @Column({ name: 'sender_name', type: 'varchar', length: 255 })
  senderName: string;

  @Column({ name: 'sender_avatar', type: 'varchar', length: 500, nullable: true })
  senderAvatar?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', default: '[]' })
  attachments: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
