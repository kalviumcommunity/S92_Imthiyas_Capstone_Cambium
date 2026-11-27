import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPrivacyPreference } from './entities/user-privacy-preference.entity';
import { ConsentRecord } from './entities/consent-record.entity';
import { PrivacyRequest } from './entities/privacy-request.entity';
import { User } from '../users/entities/user.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { GroupProject } from '../projects/entities/group-project.entity';
import { UploadModule } from '../upload/upload.module';
import { PrivacyService } from './privacy.service';
import { PrivacyController } from './privacy.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserPrivacyPreference,
      ConsentRecord,
      PrivacyRequest,
      User,
      Bookmark,
      Notification,
      GroupProject,
    ]),
    UploadModule,
  ],
  controllers: [PrivacyController],
  providers: [PrivacyService],
  exports: [PrivacyService, TypeOrmModule],
})
export class PrivacyModule {}
