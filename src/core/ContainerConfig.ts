import { Container } from 'inversify';
import type { LocalizedMessagesRepository } from '@/core/domain/LocalizedMessagesRepository';
import type { GithubRepository } from '@/core/domain/GithubRepository';
import type { NotionRepository } from '@/core/domain/NotionRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import { LocalizedMessagesRepositoryToken } from '@/core/domain/LocalizedMessagesRepository';
import { GithubRepositoryToken } from '@/core/domain/GithubRepository';
import { NotionRepositoryToken } from '@/core/domain/NotionRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LocalizedMessagesRepositoryJson } from '@/core/infrastructure/LocalizedMessagesRepositoryJson';
import { GithubRepositoryRest } from '@/core/infrastructure/GithubRepositoryRest';
import { NotionRepositoryJson } from '@/core/infrastructure/NotionRepositoryJson';
import { CertificationRepositoryJson } from '@/core/infrastructure/CertificationRepositoryJson';
import { ProjectFactory, ProjectFactoryToken } from '@/core/domain/ProjectFactory';
import {
  LocalizationApplicationService,
  LocalizationApplicationServiceToken,
} from '@/core/application-services/LocalizationApplicationService';
import {
  PublicWorkApplicationService,
  PublicWorkApplicationServiceToken,
} from '@/core/application-services/PublicWorkApplicationService';

const container = new Container();
// repository bindings
container
  .bind<LocalizedMessagesRepository>(LocalizedMessagesRepositoryToken)
  .to(LocalizedMessagesRepositoryJson);
container.bind<GithubRepository>(GithubRepositoryToken).to(GithubRepositoryRest);
container.bind<NotionRepository>(NotionRepositoryToken).to(NotionRepositoryJson);
container
  .bind<CertificationRepository>(CertificationRepositoryToken)
  .to(CertificationRepositoryJson);
container.bind<ProjectFactory>(ProjectFactoryToken).to(ProjectFactory);

// application-service bindings

container
  .bind<LocalizationApplicationService>(LocalizationApplicationServiceToken)
  .to(LocalizationApplicationService);
container
  .bind<PublicWorkApplicationService>(PublicWorkApplicationServiceToken)
  .to(PublicWorkApplicationService);

export { container };
