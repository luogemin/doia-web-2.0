import {parseParamsToUrl} from '@/utils/util';
import API from '@/services/api';
import fetch from '@/utils/request.js';
import {isDev} from "@/globalConstants";

const {
    fetchGet,
    fetchPut,
    fetchDelete,
    fetchPost,
} = fetch;

// 获取列表
export const searchAlgorithmService = (params = {}) => {
    return fetchPost(API.GENERICS_API, {
        body: params
    });
};

// 添加列表
export const addAlgorithmService = (params = {}) => {
    return fetchPost(API.GENERICS_ADD_API, {
        body: params
    });
};

// 发布列表
export const publishAlgorithmService = (id) => {
    return fetchGet(API.GENERICS_PUBLISH_API + '/' + id);
};

//删除
export function deleteAlgorithmService(params = {}) {
    let {id, force = false} = params;

    let url = API.GENERICS_DELETE_API + "/" + id;
    //是否强制删除
    if (force) {
        url = url + "?force=true";
    }
    return fetchGet(url);
}

//获取详情
export function getAlgorithmDetailService(params) {
    const {id, ...rest} = params;
    return fetchGet(API.GENERICS_DETAIL_API + `/${id}?` + parseParamsToUrl(rest));
}

//获取根因泛型
export function getRootAlgorithmDetailService(params) {
    return fetchPost(API.GETROOTALGORITHMDETAIL, {
        body: params
    });
}

