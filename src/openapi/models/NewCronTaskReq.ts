/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TimePoint } from './TimePoint';

export type NewCronTaskReq = {
    function_uuid: string;
    timepoints: Array<TimePoint>;
    worker_uuid: string;
};

