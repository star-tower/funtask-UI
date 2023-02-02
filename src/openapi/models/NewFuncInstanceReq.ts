/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Tag } from './Tag';

export type NewFuncInstanceReq = {
    timeout: number;
    dependencies: Array<string>;
    change_state: boolean;
    func_base64?: string | null;
    func_uuid?: string | null;
    name?: string | null;
    worker_uuids?: Array<string> | null;
    worker_tags?: Array<Tag> | null;
};

