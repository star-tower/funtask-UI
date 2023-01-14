/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Worker } from './Worker';

export type WorkersWithCursor = {
    workers: Array<Worker>;
    cursor: number;
};

