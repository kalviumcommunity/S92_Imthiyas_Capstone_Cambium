import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { CitationVerifierService } from './citation-verifier.service';
import { AiToolRegistry } from './ai-tool-registry';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { AiModule } from '../ai/ai.module';
import { ProjectMember } from '../projects/entities/project-member.entity';

@Module({
  imports: [
    forwardRef(() => OpportunitiesModule),
    AiModule,
    TypeOrmModule.forFeature([ProjectMember]),
  ],
  controllers: [AssistantController],
  providers: [AssistantService, CitationVerifierService, AiToolRegistry],
  exports: [AssistantService, CitationVerifierService, AiToolRegistry],
})
export class AssistantModule {}
