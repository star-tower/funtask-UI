/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Tag } from './Tag';
import type { WorkerStatus } from './WorkerStatus';

export type Worker = {
    uuid: string;
    status: WorkerStatus;
    name?: string;
    tags?: Array<Tag>;
};

