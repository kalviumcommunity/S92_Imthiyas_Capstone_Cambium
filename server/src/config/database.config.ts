import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const localEnv = path.resolve(process.cwd(), '.env');
const parentEnv = path.resolve(process.cwd(), '..', '.env');
if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else if (fs.existsSync(parentEnv)) {
  dotenv.config({ path: parentEnv });
} else {
  dotenv.config();
}

import { User } from '../modules/users/entities/user.entity';
import { ResearchInterest } from '../modules/users/entities/research-interest.entity';
import { ResearchOpportunity } from '../modules/opportunities/entities/research-opportunity.entity';
import { Tag } from '../modules/opportunities/entities/tag.entity';
import { Bookmark } from '../modules/bookmarks/entities/bookmark.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProd = process.env.NODE_ENV === 'production';

  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const username = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const database = process.env.POSTGRES_DB || 'cambium';

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [User, ResearchInterest, ResearchOpportunity, Tag, Bookmark, Notification],
    synchronize: true, // Auto-sync entities into normalized schema
    logging: !isProd,
    retryAttempts: 2,
    retryDelay: 1000,
  };
};
