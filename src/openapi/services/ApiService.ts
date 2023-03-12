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
import type { TaskDescribesWithCursor } from '../models/TaskDescribesWithCursor';
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
     * Get Tasks
     * get tasks on specific worker.
     * :param worker_inactive2dead_second: time interval of current to last heart beat to determine if a worker dead, dead
     * worker's running function will not show
     * :param worker_uuid: worker uuid
     * :param begin_time: query tasks start time after this time
     * :param end_time: query tasks start time before this time, begin time and end time compose a time range
     * :param limit: how many tasks will get in this query, the rest of it can be got by cursor
     * :param cursor: the cursor returned by last query
     * :param include_cross_task: if this option is true, any task cross the time range will as result
     * :return: list of task describe
     * @param workerUuid
     * @param beginTime
     * @param workerInactive2DeadSecond
     * @param endTime
     * @param limit
     * @param cursor
     * @param includeCrossTask
     * @returns TaskDescribesWithCursor Successful Response
     * @throws ApiError
     */
    public static getTasksApiTasksOnWorkerGet(
        workerUuid: string,
        beginTime: string,
        workerInactive2DeadSecond: number,
        endTime?: string,
        limit?: number,
        cursor?: number,
        includeCrossTask: boolean = true,
    ): CancelablePromise<TaskDescribesWithCursor> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tasks_on_worker',
            query: {
                'worker_uuid': workerUuid,
                'begin_time': beginTime,
                'worker_inactive2dead_second': workerInactive2DeadSecond,
                'end_time': endTime,
                'limit': limit,
                'cursor': cursor,
                'include_cross_task': includeCrossTask,
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
