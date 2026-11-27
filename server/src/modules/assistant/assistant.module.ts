import { Module, forwardRef } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { AiModule } from '../ai/ai.module';
import { PrivacyModule } from '../privacy/privacy.module';
import { ProjectsModule } from '../projects/projects.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    forwardRef(() => OpportunitiesModule),
    AiModule,
    PrivacyModule,
    ProjectsModule,
    UploadModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
