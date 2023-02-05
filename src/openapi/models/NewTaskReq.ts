/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Tag } from './Tag';

export type NewTaskReq = {
    timeout: number;
    dependencies: Array<string>;
    change_state: boolean;
    description: string;
    func_uuid: string;
    name?: string | null;
    worker_uuids?: Array<string> | null;
    worker_tags?: Array<Tag> | null;
};

