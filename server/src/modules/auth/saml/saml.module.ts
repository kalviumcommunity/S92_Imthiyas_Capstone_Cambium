import { Module } from '@nestjs/common';
import { SamlService } from './saml.service';
import { SamlController } from './saml.controller';

@Module({
  controllers: [SamlController],
  providers: [SamlService],
  exports: [SamlService],
})
export class SamlModule {}
