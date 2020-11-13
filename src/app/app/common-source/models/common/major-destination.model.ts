import * as _ from 'lodash';

import { environment } from '@/environments/environment';

import { Condition, RequestParam, RequestSet } from './condition.model';

const majorCondition: Condition = {
    compCode: environment.COMP_CODE,
};
const request = _.cloneDeep(RequestSet);
request.condition = majorCondition;
export const majorDestinationRq: RequestParam = request;