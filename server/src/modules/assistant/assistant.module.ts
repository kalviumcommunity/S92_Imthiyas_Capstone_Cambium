import { Module, forwardRef } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { OpportunitiesModule } from '../opportunities/opportunities.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [forwardRef(() => OpportunitiesModule), AiModule],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
