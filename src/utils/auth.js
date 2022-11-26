import React from 'react';
import API from "@/services/api";
import fetch from '@/utils/request.js';

const {
    fetchGet,
    fetchPut,
    fetchDelete,
    fetchPost,
} = fetch;

const {nacosDomain, ifCheckNacos, ...rest} = window.DOIA_CONFIG;

export const getGroupBySceneAsync = (param = {}) => {
    return fetchPost(API.MULTITENANCY_VERSION_GROUPBYSCENE_API, {
        body: param
    });
};

// 获取nacos配置
export const getNacosConfig = async () => {
    if (ifCheckNacos && process.env.NODE_ENV !== 'development') {
        return fetchGet(nacosDomain);
    } else {
        return {
            data: {
                'doia': window.DOIA_CONFIG
            }
        };
    }
};
