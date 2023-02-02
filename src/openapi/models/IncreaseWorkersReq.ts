/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Tag } from './Tag';

export type IncreaseWorkersReq = {
    number: number;
    tags: Array<Tag>;
    name?: string | null;
};

