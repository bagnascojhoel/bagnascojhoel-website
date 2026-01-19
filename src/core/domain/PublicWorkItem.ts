import { Article } from './Article';
import { Certification } from './Certification';
import { Project } from './Project';
import { WorkItemType } from './WorkItemType';

type _PublicWorkItem = { workItemType: WorkItemType };

export type PublicWorkItem = _PublicWorkItem & (Project | Article | Certification);
