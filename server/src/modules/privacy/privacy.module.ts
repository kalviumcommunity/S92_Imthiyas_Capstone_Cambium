import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPrivacyPreference } from './entities/user-privacy-preference.entity';
import { ConsentRecord } from './entities/consent-record.entity';
import { PrivacyRequest } from './entities/privacy-request.entity';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPrivacyPreference, ConsentRecord, PrivacyRequest]),
  ],
  controllers: [PrivacyController],
  providers: [PrivacyService],
  exports: [PrivacyService, TypeOrmModule],
})
export class PrivacyModule {}
