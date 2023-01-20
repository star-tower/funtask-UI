/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchQueryReq } from '../models/BatchQueryReq';
import type { IncreaseWorkerReq } from '../models/IncreaseWorkerReq';
import type { Worker } from '../models/Worker';
import type { WorkersWithCursor } from '../models/WorkersWithCursor';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiService {

    /**
     * Increase Worker
     * @param requestBody
     * @returns Worker Successful Response
     * @throws ApiError
     */
    public static increaseWorkerApiIncreaseWorkerPost(
        requestBody: IncreaseWorkerReq,
    ): CancelablePromise<Array<Worker>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/increase_worker',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Workers
     * @param requestBody
     * @returns WorkersWithCursor Successful Response
     * @throws ApiError
     */
    public static getWorkersApiGetWorkersPost(
        requestBody: BatchQueryReq,
    ): CancelablePromise<WorkersWithCursor> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/get_workers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
