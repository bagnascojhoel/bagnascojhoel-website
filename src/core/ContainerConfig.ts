import { Container } from 'inversify';
import type { LocalizedMessagesRepository } from '@/core/domain/LocalizedMessagesRepository';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { ArticleRepository } from '@/core/domain/ArticleRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import type { Logger } from '@/core/domain/Logger';
import { LocalizedMessagesRepositoryToken } from '@/core/domain/LocalizedMessagesRepository';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { ArticleRepositoryToken } from '@/core/domain/ArticleRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LoggerToken } from '@/core/domain/Logger';
import { LocalizedMessagesRepositoryJsonAdapter } from '@/core/infrastructure/LocalizedMessagesRepositoryJson';
import { GithubRepositoryRestAdapter } from '@/core/infrastructure/GithubRepositoryRestAdapter';
import { ArticleRepositoryJsonAdapter } from '@/core/infrastructure/ArticleRepositoryJsonAdapter';
import { CertificationRepositoryJsonAdapter } from '@/core/infrastructure/CertificationRepositoryJsonAdapter';
import { LoggerSentryAdapter } from '@/core/infrastructure/LoggerSentryAdapter';
import { LoggerConsoleAdapter } from '@/core/infrastructure/LoggerConsoleAdapter';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import {
  MessagesApplicationService,
  MessagesApplicationServiceToken,
} from '@/core/application-services/MessagesApplicationService';
import {
  PublicWorkApplicationService,
  PublicWorkApplicationServiceToken,
} from '@/core/application-services/PublicWorkApplicationService';
import {
  GetPublicWorkItemsService,
  GetPublicWorkItemsServiceToken,
} from './domain/GetPublicWorkItemsService';

const container = new Container();

// Determine which logger implementation to use based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// domain bindings
container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);
container
  .bind<GetPublicWorkItemsService>(GetPublicWorkItemsServiceToken)
  .to(GetPublicWorkItemsService);

// repository bindings
container
  .bind<LocalizedMessagesRepository>(LocalizedMessagesRepositoryToken)
  .to(LocalizedMessagesRepositoryJsonAdapter);
container.bind<GithubRepository>(GithubRepositoryToken).to(GithubRepositoryRestAdapter);
container.bind<ArticleRepository>(ArticleRepositoryToken).to(ArticleRepositoryJsonAdapter);
container
  .bind<CertificationRepository>(CertificationRepositoryToken)
  .to(CertificationRepositoryJsonAdapter);

// logger binding - use Sentry in production, Console in dev/test
container
  .bind<Logger>(LoggerToken)
  .to(isProduction && !isTest ? LoggerSentryAdapter : LoggerConsoleAdapter)
  .inSingletonScope();

// application-service bindings

container
  .bind<MessagesApplicationService>(MessagesApplicationServiceToken)
  .to(MessagesApplicationService);
container
  .bind<PublicWorkApplicationService>(PublicWorkApplicationServiceToken)
  .to(PublicWorkApplicationService);

export { container };
