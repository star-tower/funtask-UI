/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Func } from '../models/Func';
import type { FuncWithCursor } from '../models/FuncWithCursor';
import type { IncreaseWorkersReq } from '../models/IncreaseWorkersReq';
import type { NewCronTaskReq } from '../models/NewCronTaskReq';
import type { NewFuncReq } from '../models/NewFuncReq';
import type { NewTaskReq } from '../models/NewTaskReq';
import type { ParameterSchema } from '../models/ParameterSchema';
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
     * @param fuzzyName
     * @returns WorkersWithCursor Successful Response
     * @throws ApiError
     */
    public static getWorkersApiWorkersGet(
        limit: number,
        cursor?: number,
        fuzzyName?: string,
    ): CancelablePromise<WorkersWithCursor> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/workers',
            query: {
                'limit': limit,
                'cursor': cursor,
                'fuzzy_name': fuzzyName,
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
     * Create Task
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createTaskApiTaskPost(
        requestBody: NewTaskReq,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/task',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Func
     * @param limit
     * @param cursor
     * @param fuzzyName
     * @returns FuncWithCursor Successful Response
     * @throws ApiError
     */
    public static getFuncApiFuncGet(
        limit: number,
        cursor?: number,
        fuzzyName?: string,
    ): CancelablePromise<FuncWithCursor> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/func',
            query: {
                'limit': limit,
                'cursor': cursor,
                'fuzzy_name': fuzzyName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add Func
     * @param requestBody
     * @returns Func Successful Response
     * @throws ApiError
     */
    public static addFuncApiFuncPost(
        requestBody: NewFuncReq,
    ): CancelablePromise<Func> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/func',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Func Schema
     * @param funcBase64
     * @returns ParameterSchema Successful Response
     * @throws ApiError
     */
    public static getFuncSchemaApiFuncSchemaGet(
        funcBase64: string,
    ): CancelablePromise<ParameterSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/func_schema',
            query: {
                'func_base64': funcBase64,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create Cron Task
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createCronTaskApiCronTaskPost(
        requestBody: NewCronTaskReq,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/cron_task',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
