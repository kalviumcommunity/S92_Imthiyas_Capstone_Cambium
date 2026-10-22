import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { OpportunitiesService } from '../src/modules/opportunities/opportunities.service';
import { AssistantService } from '../src/modules/assistant/assistant.service';

async function testServices() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  console.log('App context created.');

  const oppService = app.get(OpportunitiesService);
  const assistantService = app.get(AssistantService);

  try {
    console.log('Testing oppService.findAll()...');
    const res = await oppService.findAll({});
    console.log('findAll success! Total opportunities:', res.count);
  } catch (err: any) {
    console.error('findAll failed:', err);
  }

  try {
    console.log('Testing assistantService.chat()...');
    const reply = await assistantService.chat({
      messages: [{ role: 'user', content: 'What quantum computing grants do you recommend?' }],
    });
    console.log('Assistant reply:', reply.reply.slice(0, 100));
  } catch (err: any) {
    console.error('assistantService.chat failed:', err);
  }

  await app.close();
}

testServices();
