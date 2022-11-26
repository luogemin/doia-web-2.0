import API from '@/services/api';
import {fetchGet,fetchPost,} from '@/utils/request.js';
import { parseParamsToUrl } from '@/utils/util';

export function searchTags(params={}) {
    let paramsStr = parseParamsToUrl(params);
    let url = API.TAG_API + ((paramsStr && paramsStr.length) ? ("?" + paramsStr) :"");
    return fetchGet(url);
}
export function addTag(params={}) {
    return fetchPost(API.TAG_API,{
        body:params
    });
}