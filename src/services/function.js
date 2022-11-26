import API from '@/services/api';
import {fetchGet} from '@/utils/request.js';

/**
 * 获取function列表
 * @param {} params 
 */
export function listFunctionService(params={}) {
    return fetchGet(API.FUNCTION_API);
}