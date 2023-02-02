/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IncreaseWorkersReq } from '../models/IncreaseWorkersReq';
import type { NewFuncInstanceReq } from '../models/NewFuncInstanceReq';
import type { Worker } from '../models/Worker';
import type { WorkersWithCursor } from '../models/WorkersWithCursor';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiService {

    /**
     * Get Workers
     * @param limit
     * @param cursor
     * @returns WorkersWithCursor Successful Response
     * @throws ApiError
     */
    public static getWorkersApiWorkersGet(
        limit: number,
        cursor?: number,
    ): CancelablePromise<WorkersWithCursor> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/workers',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Increase Worker
     * @param requestBody
     * @returns Worker Successful Response
     * @throws ApiError
     */
    public static increaseWorkerApiWorkersPost(
        requestBody: IncreaseWorkersReq,
    ): CancelablePromise<Array<Worker>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/workers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Trigger Func
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static triggerFuncApiFuncInstancePost(
        requestBody: NewFuncInstanceReq,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/func_instance',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
