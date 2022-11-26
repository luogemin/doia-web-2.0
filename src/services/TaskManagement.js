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
export const searchTaskService = (params = {}) => {
    return fetchPost(API.TASK_API, {
        body: params
    });
};

// 新建列表
export const addTaskService = (params = {}) => {
    return fetchPost(API.TASK_ADD_API, {
        body: params
    });
};

// 修改列表-数据设定
export const modifyTaskService = (params = {}) => {
    return fetchPost(API.TASK_MODIFY_API, {
        body: params
    });
};

// 修改列表-算法选择
export const modifyTaskGenericsService = (params = {}) => {
    return fetchPost(API.TASK_MODIFY_GENERICS_API, {
        body: params
    });
};

//删除
export function deleteTaskService(params = {}) {
    let {ids, force = false} = params;
    let url = API.TASK_DELETE_API;
    //是否强制删除
    if (force) {
        url = url + "?force=true";
    }
    return fetchPost(url, {
        body: ids
    });
}

//详情页-列表
export function searchTaskDetailListService(params) {
    return fetchPost(API.TASK_DETAIL_LIST_API, {
        body: params
    });
}

//详情页-列表-搜索
export function searchModelListService(params) {
    return fetchPost(API.TASK_GROUP_OPTIONS__API, {
        body: params
    });
}

//详情页-图表
export function searchTaskInfoDetailService(params) {
    return fetchPost(API.TASK_DETAIL_LIST_INFO_API, {
        body: params
    });
}

//详情页-图表-训练时间
export function searchTaskInfoDetailTimeListService(params) {
    return fetchPost(API.TASK_DETAIL_LIST_INFO_TIME_API, {
        body: params
    });
}

//详情页-图表-另一个训练时间
export function searchTaskInfoDetailAnotherTimeListService(taskId) {
    return fetchGet(API.TASK_DETAIL_LIST_INFO_ANOTHER_TIME_API + `?taskId=${taskId}`);

}

//详情页-图表-图表列表
export function searchTaskInfoChartsListService(params) {
    return fetchPost(API.TASK_DETAIL_LIST_CHARTS_API, {
        body: params
    });
}

//详情页-图表-图表数据
export function searchChartsInfoService(params) {
    return fetchPost(API.TASK_DETAIL_CHARTS_INFO_API, {
        body: params
    });
}

//详情页-图表-原始数据
export function searchChartsRawDataInfoService(params) {
    return fetchPost(API.TASK_DETAIL_CHARTS_RAWDATA_INFO_API, {
        body: params
    });
}

//详情页-图表-图表数据-心跳监听
export function heartBeatingService(params) {
    return fetchPost(API.TASK_DETAIL_CHARTS_INFO_HEARTBEATING_API, {
        body: params
    });
}

//详情页-图表-新建对比
export function addContrastChartService(params) {
    return fetchPost(API.TASK_DETAIL_ADD_CHART_API, {
        body: params
    });
}

//详情页-对比模型，获取任务级别参数
export function getTaskParamsService(id) {
    return fetchGet(API.TASK_DETAIL_ADD_PARAMS + '/' + id);
}

//获取详情-基本信息
export function getTaskDetailService(params) {
    const {id, ...rest} = params;
    return fetchGet(API.TASK_DETAIL_API + `?id=${id}`);
}

//获取详情-泛型信息
export function getTaskDetailGenericsService(params) {
    const {id, ...rest} = params;
    return fetchGet(API.TASK_DETAIL_GENERICS_API + `?id=${id}`);
}

//启动任务
export function startTaskService(params) {
    return fetchGet(API.TASK_START_API + `?` + parseParamsToUrl(params));
}

//停止任务
export function stopTaskService(params) {
    return fetchGet(API.TASK_STOP_API + `?` + parseParamsToUrl(params));
}

//检验任务名称是否重复
export function postTaskNameService(params) {
    const {id, ...rest} = params;
    return fetchGet(API.TASK_NAME_API + `?` + parseParamsToUrl(params));
}

//获取任务场景
export function getTaskSceneService(scene) {
    return fetchGet(API.TASK_SCENE_API + `/${scene}`);
}

//获取任务模型
export function getTaskModelService(params) {
    return fetchPost(API.TASK_MODEL_API, {
        body: params
    });
}

//获取任务对象
export function getTaskTargetService(params) {
    return fetchPost(API.TASK_TARGET_API, {
        body: params
    });
}

//获取任务指标
export function getTaskMetricService(params) {
    return fetchPost(API.TASK_METRIC_API, {
        body: params
    });
}

//获取任务指标
export function getTaskTagsService(params) {
    return fetchPost(API.TASK_TAGS_API, {
        body: params
    });
}

//获取维度key
export const getTagsKeysService = (params) => {
    return fetchPost(API.TB_GETTAGSKEYS, {
        body: params
    });
};
//获取维度value
export const getTagsValueService = (params) => {
    return fetchPost(API.TB_GETTAGSVALUE, {
        body: params
    });
};