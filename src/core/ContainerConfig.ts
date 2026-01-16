import { Container } from 'inversify';
import type { LocalizedMessagesRepository } from '@/core/domain/LocalizedMessagesRepository';
import type { GitHubRepository } from '@/core/domain/GitHubRepository';
import type { NotionRepository } from '@/core/domain/NotionRepository';
import type { CertificationRepository } from '@/core/domain/CertificationRepository';
import { LocalizedMessagesRepositoryToken } from '@/core/domain/LocalizedMessagesRepository';
import { GitHubRepositoryToken } from '@/core/domain/GitHubRepository';
import { NotionRepositoryToken } from '@/core/domain/NotionRepository';
import { CertificationRepositoryToken } from '@/core/domain/CertificationRepository';
import { LocalizedMessagesRepositoryJson } from '@/core/infrastructure/LocalizedMessagesRepositoryJson';
import { GitHubRepositoryRest } from '@/core/infrastructure/GitHubRepositoryRest';
import { NotionRepositoryJson } from '@/core/infrastructure/NotionRepositoryJson';
import { CertificationRepositoryJson } from '@/core/infrastructure/CertificationRepositoryJson';
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
container.bind<GitHubRepository>(GitHubRepositoryToken).to(GitHubRepositoryRest);
container.bind<NotionRepository>(NotionRepositoryToken).to(NotionRepositoryJson);
container
  .bind<CertificationRepository>(CertificationRepositoryToken)
  .to(CertificationRepositoryJson);

// application-service bindings

container
  .bind<LocalizationApplicationService>(LocalizationApplicationServiceToken)
  .to(LocalizationApplicationService);
container
  .bind<PublicWorkApplicationService>(PublicWorkApplicationServiceToken)
  .to(PublicWorkApplicationService);

export { container };
