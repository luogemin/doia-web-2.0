import {
    fetchGet
} from '@/utils/request.js';
import API from '@/services/api';
import { parseParamsToUrl } from '@/utils/util';

const baseUrl = API.PATH_V1;

// 获取集群节点
export function getWorkerListService(params) {
    let queryParam = "";
    if (params) {
        queryParam = parseParamsToUrl(params);
        queryParam = (queryParam && queryParam.length) ? (`?${queryParam}`) : "";
    }
    return fetchGet(`${baseUrl}/workers${queryParam}`);
}