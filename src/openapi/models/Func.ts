/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ParameterSchema } from './ParameterSchema';
import type { Tag } from './Tag';

export type Func = {
    uuid: string;
    func: Blob;
    dependencies: Array<string>;
    parameter_schema: (ParameterSchema | string);
    description: string;
    tags?: Array<Tag>;
    name?: string;
};

