import { Article } from './Article';
import { Certification } from './Certification';
import { Project } from './Project';
import { PublicWorkItemType } from './PublicWorkItemType';

type _PublicWorkItem = { workItemType: PublicWorkItemType };

export type PublicWorkItem = _PublicWorkItem & (Project | Article | Certification);
