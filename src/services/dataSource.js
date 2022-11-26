import API from '@/services/api';
import fetch from '@/utils/request.js';

const {
    fetchGet,
    fetchPut,
    fetchDelete,
    fetchPost,
} = fetch;

//新增数据源
export const datasourceAdd = (params = {}) => {
    return fetchPost(API.DATASOURCE_ADD, {
        body: params
    });
};
//新增数据源
export const getCsvHeaderService = (file = null) => {
    const fd = new FormData();
    fd.append('file', file);
    const option = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        data: fd
    };

    return fetchPost(API.GETCSVHEADER, option);
};
//添加标签
export const addTAg = (params = {}) => {
    return fetchPost(API.DATASOURCE_ADD_TAG, {
        body: params
    });
};

//获取标签信息
export const getTagList = (params = {}) => {
    return fetchPost(API.DATASOURCE_TAG_LIST, {
        body: params
    });
};
//获取数据表
export const getDodbDataList = (params = {}) => {
    return fetchPost(API.DATASOURCE_DODB_LIST, {
        body: params
    });
};
//获取数据源列表
export const getDataSourceList = (params = {}) => {
    const {query = {}} = params;
    const {scene} = query || {};
    let url = API.DATASOURCE_LIST;
    if (scene) {
        url += `?scene=${scene}`;
    }
    return fetchPost(url, {
        body: params
    });
    // return fetchPost('/datasource/list');
};
//根据数据表请求下拉列表的数据
export const getSchemList = (id) => {
    return fetchGet(API.DATASOURCE_GETSCHEM + '/' + id);
};
//根据数据表类型请求下拉列表的数据
export const getSchemListByTableTypeService = (id) => {
    return fetchGet(API.DATASOURCE_GETSCHEMBYTABLETYPE + '/' + id);
};
//删除数据源列表
export const delDataSourceList = (id) => {
    return fetchDelete(API.DATASOURCE_DEL + '/' + id + '/remove');
};
//添加文件数据源
export const addFileDataSource = ({params, file}) => {
    const fd = new FormData();
    fd.append('file', file[0]);
    if (params) {
        Object.keys(params).forEach(key => {
            if (params[key]) {
                fd.append(key, params[key]);
            }
        });
    }
    const option = {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        data: fd
    };
    return fetchPost(API.DATASOURCE_ADDFILE, option);
};
//获取数据源详情
export const getDataSourceDetail = (id) => {
    return fetchGet(API.DATASOURCE_DEL + '/' + id);
};
//编辑数据源基本信息
export const modifyDataSourceBasic = (id, params = {}) => {
    return fetchPost(API.DATASOURCE_DEL + '/' + id + '/modify/base', {
        body: params
    });
};
//编辑数据源字段
export const modifyDataSourceData = (id, params = {}) => {
    return fetchPost(API.DATASOURCE_DEL + '/' + id + '/modify/data', {
        body: params
    });
};