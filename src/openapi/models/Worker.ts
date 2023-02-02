/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Tag } from './Tag';
import type { WorkerStatus } from './WorkerStatus';

export type Worker = {
    uuid: string;
    status: WorkerStatus;
    last_heart_beat?: string;
    start_time?: string;
    stop_time?: string;
    name?: string;
    tags?: Array<Tag>;
};

