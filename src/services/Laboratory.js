import API from '@/services/api';
import {parseParamsToUrl} from '@/utils/util';
import fetch from '@/utils/request.js';
import moment from 'moment';

const {
    fetchGet,
    fetchPut,
    fetchDelete,
    fetchPost,
} = fetch;

//指定模式的日志趋势图
export const patternTrendsService = (params = {}) => {
    return fetchPost(API.TB_PATTERNTRENDS, {
        body: params
    });
};
//指定日志模式 查询结果
export const patternLogsService = (params = {}) => {
    return fetchPost(API.TB_PATTERNLOGS, {
        body: params
    });
};
//原始日志
export const checkOriginLogsService = (params = {}) => {
    return fetchPost(API.TB_CHECKORIGINLOGS, {
        body: params
    });
};
//模式识别
export const patternResultsService = (params = {}) => {
    return fetchPost(API.TB_PATTERNRESULTS, {
        body: params
    });
};
//模式识别查询计算结果
export const logOriginTrenService = (params = {}) => {
    return fetchGet(API.TB_LOGORIGINTREND + '/' + params.id + '/' + params.genericId);
};
//模式识别查询计算结果
export const queryLogpatternreService = (id) => {
    return fetchGet(API.TB_LOGPATTERNRECOGNITION + '/' + id);
};
//根据模型对象分组
export const modelGroupService = (params = {}) => {
    return fetchPost(API.TB_MODELGROUP, {
        body: params
    });
};
//根据指标维度分组
export const tagsGroupService = (params = {}) => {
    return fetchPost(API.TB_TAGSGROUP, {
        body: params
    });
};

//添加单个公有化泛型
export const addModifService = (params = {}) => {
    return fetchPost(API.TB_ADDGENERIC, {
        body: params
    });
};
//修改公有化泛型
export const updataModifService = (params = {}) => {
    return fetchPost(API.TB_UPDATEMO, {
        body: params
    });
};
//删除列表
export const delGenericListService = (id) => {
    return fetchGet(API.TB_DELGENERIC + '?id=' + id);
};
//删除
export const delTbListService = (id) => {
    return fetchGet(API.TB_DEL + '/' + id);
};

//新建算法实验室列表列表//创建任务
export const addTbListService = (params = {}) => {
    return fetchPost(API.TB_ADD, {
        body: params
    });
};
//获取泛型列表
export const searchAlgorithmService = (params = {}) => {
    return fetchPost(API.GENERICS_API, {
        body: params
    });
};

//获取算法实验室列表
export const getTbList = (params = {}) => {
    return fetchPost(API.TB_LIST, {
        body: params
    });
};
//获取任务信息
export const getTbDetail = (id) => {
    return fetchGet(API.TB_DETAIL + '/' + id);
};
//编辑列表
export const modifyTb = (params) => {
    return fetchPost(API.TB_MODIFY, {
        body: params
    });
};
//点击名称获取列表
export const getTbDetailList = (params) => {
    return fetchPost(API.TB_TASKLIST, {
        body: params
    });
};
//获取模型指标下对应的列表
export const getSeriesList = (params) => {
    return fetchPost(API.TB_SERIESLIST, {
        body: params
    });
};
//获取模型指标的弹窗数据
export const getSeriesData = (params) => {
    return fetchPost(API.TB_SERIESDATA, {
        body: params
    });
};
//依据模型或者对象查找模型或者对象
export const getModelOrObjList = (params) => {
    return fetchPost(API.TB_MODELLIST, {
        body: params
    });
};
//收藏单个序列
export const addSingleFavo = (params) => {
    return fetchPost(API.TB_ADDSINGLEFAVO, {
        body: params
    });
};
//取消收藏单个序列
export const cancelSingleFavo = (params) => {
    return fetchPost(API.TB_DELSINGLEFAVO, {
        body: params
    });
};
//获取全局时间
export const getTime = () => {
    return fetchGet(API.TB_GETMODALTIME);
};
//修改全局时间
export const modifyTime = (params) => {
    return fetchPost(API.TB_MODIFYTIME, {
        body: params
    });
};
//编辑算法实验室泛型管理
export const modifyGeneric = (params) => {
    return fetchPost(API.TB_GENERIC_MODIFY, {
        body: params
    });
};
export const addFavoriteList = (id) => {
    return fetchGet(API.TB_ADDFAVOR + '/' + id);
};

export const delFavorite = (id) => {
    return fetchGet(API.TB_DELFAVOR + '/' + id);
};

//全部收藏
export const addAllFavorite = (params) => {
    return fetchPost(API.TB_ADDALLFAVOR, {
        body: params
    });
};
//全部取消收藏
export const delAllFavorite = (params) => {
    return fetchPost(API.TB_DELALLFAVOR, {
        body: params
    });
};

export const getResult = (params) => {
    const {seriesId = '', tuningBenchGenericIds = []} = params;
    return fetchPost(API.TB_RESULT + '/' + seriesId, {
        body: tuningBenchGenericIds
    });
};
export const getOriginData = (params) => {
    return fetchGet(API.TB_GETORIGIN + '?' + parseParamsToUrl(params));
};
export const getTrigger = (params) => {
    return fetchGet(API.TB_TRIGGER + '?' + parseParamsToUrl(params));
};
export const getDenericList = (params) => {
    return fetchGet(API.TB_GENERICLIST);
};
export const modifyGenericList = (params) => {
    const {scene} = params;
    let url = API.TB_GENERICMODI;
    if (scene) {
        url += `?scene=${scene}`;
    }
    return fetchPost(url, {
        body: params
    });
};
//保存并发布泛型
export const saveAndAddGeneric = (params) => {
    return fetchPost(API.TB_SAVEANDADD, {
        body: params
    });
};
export const getGenericSericeList = (params) => {
    const {scene} = params;
    let url = API.TB_GENERICSERIESLIST;
    if (scene) {
        url += `?scene=${scene}`;
    }
    return fetchPost(url, {
        body: params
    });
};
//新建似有泛型
export const addGenericList = (params) => {
    const {scene} = params;
    let url = API.TB_ADDGENERICLIST;
    if (scene) {
        url += `?scene=${scene}`;
    }
    return fetchPost(url, {
        body: params
    });
};

export const deleteDenericList = (id) => {
    return fetchGet(API.TB_DELETEDENERIC + '/' + id);
};
//新建任务获取模型，根据数据源获取模型
export const getModel = (params) => {
    const {
        pageInfo,
        id,
        searchValue,
        time,
        scene, dataSourceRelationId,
    } = params;

    let filters = {
        scene, dataSourceRelationId,
    };
    if (searchValue || searchValue === '') {
        filters = {
            ...filters,
            modelFilter: {
                compare: 'LIKE',
                value: searchValue
            },
        };
    }
    return fetchPost(API.TB_GETMODEL + '/' + id + '/model-list', {
        body: {
            ...pageInfo,
            query: Object.assign({}, {
                dataSourceId: null,
                scene, dataSourceRelationId,
                filters: filters,
                taskType: 1
            }, time ? {
                startTime: time[0] && moment(time[0]).valueOf(),
                endTime: time[1] && moment(time[1]).valueOf(),
            } : {})
        }
    });
};
//根据模型获取对象
export const getObjList = (params) => {
    const {
        id = '', modelValue = [], pageInfo = {}, searchValue, time,
        scene, dataSourceRelationId,
    } = params;
    let filters = {
        modelFilter: {},
        scene, dataSourceRelationId,
    };
    if (modelValue.length) {
        filters.modelFilter = {
            compare: modelValue.length > 1 ? 'IN' : 'E',
            value: modelValue.length > 1 ? modelValue : modelValue[0]
        };
    }
    if (searchValue || searchValue === '') {
        filters.targetFilter = {
            compare: 'LIKE',
            value: searchValue
        };
    }
    return fetchPost(API.TB_GETMODEL + '/' + id + '/target-list', {
        body: {
            ...pageInfo,
            query: Object.assign({}, {
                dataSourceId: null,
                scene, dataSourceRelationId,
                filters,
                taskType: 1
            }, time ? {
                startTime: time[0] && moment(time[0]).valueOf(),
                endTime: time[1] && moment(time[1]).valueOf(),
            } : {})
        }
    });
};

//根据对象获取指标
export const getMetricList = (params) => {
    const {
        id = '', modelValue = [], targetValue = [], pageInfo = {}, searchValue, time,
        scene, dataSourceRelationId,
    } = params;
    let filters = {
        modelFilter: {},
        targetFilter: {},
        scene, dataSourceRelationId,
    };
    if (modelValue.length) {
        filters.modelFilter = {
            compare: modelValue.length > 1 ? 'IN' : 'E',
            value: modelValue.length > 1 ? modelValue : modelValue[0]
        };
    }
    if (targetValue.length) {
        filters.targetFilter = {
            compare: targetValue.length > 1 ? 'IN' : 'E',
            value: targetValue.length > 1 ? targetValue : targetValue[0]
        };
    }
    if (searchValue || searchValue === '') {
        filters.metricFilter = {
            compare: 'LIKE',
            value: searchValue
        };
    }
    return fetchPost(API.TB_GETMODEL + '/' + id + '/metric-list', {
        body: {
            ...pageInfo,
            query: Object.assign({}, {
                dataSourceId: null,
                scene, dataSourceRelationId,
                filters,
                taskType: 1
            }, time ? {
                startTime: time[0] && moment(time[0]).valueOf(),
                endTime: time[1] && moment(time[1]).valueOf(),
            } : {})
        }
    });
};
//根据模型，指标，对象获取tags
export const getTagsList = (params) => {
    const {
        id = '', modelValue = [], targetValue = [], metricValue = [], time,pageInfo = {},
        scene, dataSourceRelationId,
    } = params;
    let filters = {
        modelFilter: {},
        targetFilter: {},
        metricFilter: {},
        scene, dataSourceRelationId,
    };
    if (modelValue.length) {
        filters.modelFilter = {
            compare: modelValue.length > 1 ? 'IN' : 'E',
            value: modelValue.length > 1 ? modelValue : modelValue[0]
        };
    }
    if (targetValue.length) {
        filters.targetFilter = {
            compare: targetValue.length > 1 ? 'IN' : 'E',
            value: targetValue.length > 1 ? targetValue : targetValue[0]
        };
    }
    if (metricValue.length) {
        filters.metricFilter = {
            compare: metricValue.length > 1 ? 'IN' : 'E',
            value: metricValue.length > 1 ? metricValue : metricValue[0]
        };
    }
    return fetchPost(API.TB_GETMODEL + '/' + id + '/tags-list', {
        body: {
            ...pageInfo,
            query: Object.assign({}, {
                dataSourceId: null,
                scene, dataSourceRelationId,
                filters,
                taskType: 1
            }, time ? {
                startTime: time[0] && moment(time[0]).valueOf(),
                endTime: time[1] && moment(time[1]).valueOf(),
            } : {})
        }
    });
};

//创建算法实验室根据数据源id获取时间赋值
export const getDataSourceTime = (id) => {
    return fetchGet(API.TB_GETSOURCE_TIME + '/' + id);
};

export const getTaskTrainingDaysService = (params) => {
    return fetchGet(API.TB_GETTASKTRAININGDAYS + '?' + parseParamsToUrl(params));
};

export const getTaskTimerangeService = (params) => {
    return fetchPost(API.TB_GETTASKTIMERANGE, {
        body: params
    });
};

export const getTaskParamsService = (id) => {
    return fetchGet(API.TB_GETTASKPARAMS + '/' + id);
};
//获取新建对比模型/新建泛型，对大数量
export const getGenericsNumService = () => {
    return fetchGet(API.TB_GETGENERICSNUM);
};

//根因-获取入口节点
export const getGroupNodelistService = (id) => {
    return fetchGet(API.TB_GETGROUPNODE + '/' + id);
};

//根因-获取入口指标
export const getGroupMetriclistService = (params) => {
    return fetchPost(API.TB_GETGROUPMETRIC, {
        body: params
    });
};

//根因-获取训练结果
export const getRootCauseAnalysisResultService = (params) => {
    const {id, analysisTriggerTime, tuningBenchGenericId} = params;
    return fetchGet(`${API.TB_GETROOTCAUSEANALYSISRESULT}/${id}?analysisTriggerTime=${analysisTriggerTime}&tuningBenchGenericId=${tuningBenchGenericId}`);
};

//根因-手动选择
export const rootCauseFeedBackAddService = (params) => {
    return fetchPost(API.TB_ROOTCAUSEFEEDBACKADD, {
        body: params
    });
};

//根因-算法图数据
export const rootCauseGenericDataService = (params) => {
    return fetchPost(API.TB_ROOTCAUSEGENERICDATA, {
        body: params
    });
};

//根因-计算
export const rootCauseCalculatService = (params) => {
    return fetchPost(API.TB_ROOTCAUSECALCULAT, {
        body: params
    });
};

// //根因-重置根因分析参数
// export const rootCauseResetService = (params) => {
//     return fetchPost(API.TB_ROOTCAUSERESET, {
//         body: params
//     });
// };

// //根因-重置根因分析参数
export const rootCauseResetService = () => {
    return fetchPost(API.TB_ROOTCAUSERESET);
};
//根因-训练
export const runRootCauseService = (params) => {
    const {isSaveEntry} = params;
    let url = API.TB_RUNROOTCAUSE;
    if (isSaveEntry) {
        url += '?isSaveEntry=true';
    }
    return fetchPost(url, {
        body: params
    });
};

//根因-获取拓扑数据
export const getNodeRelationsService = (id) => {
    return fetchGet(API.TB_GETNODERELATIONS + '/' + id);
};

//日志模式 触发计算
export const getlogPatternCalculateService = (taskId, genericId) => {
    return fetchGet(API.TB_GETLOGPATTERNCALCULATE + '/' + taskId + '/' + genericId);
};
//查看单数据源下的时序数据
export const taskUnsaveRawdataService = (params) => {
    return fetchPost(API.TB_TASKUNSAVERAWDATA + "?dataSourceId=" + params.dataSourceId, {
        body: params
    });
};
//查看单数据源下的时序数据
export const handUpdateService = (params) => {
    return fetchPost(API.TB_HANDUPDATE, {
        body: params
    });
};

export const originLogTrendService = (id) => {
    return fetchGet(API.TB_ORIGINLOGTREND + '/' + id);
};

export const getCalculateService = (params) => {
    return fetchGet(API.TB_GETCALCULATE + '?taskId=' + params.taskId + '&genericId=' + params.genericId);
};

export const getPartitionFieldValuesService = (params) => {
    return fetchGet(API.TB_GETPARTITIONFIELDVALUE + '?taskId=' + params.taskId + '&genericId=' + params.genericId);
};

export const getAnomalyCountInfoService = (params) => {
    return fetchPost(API.TB_GETANOMALYCOUNTINFO, {
        body: params
    });
};
//原始日志
export const anmalyOrginLogService = (params) => {
    return fetchPost(API.TB_ANMALYORGINLOG, {
        body: params
    });
};
//字段分析
export const anmalyFieldsAnalyzService = (params) => {
    return fetchPost(API.TB_ANMALYFIELDSANALYZ, {
        body: params
    });
};
//进度条
export const getProcessRatioService = (params) => {
    return fetchGet(API.TB_PROCESSRATIO + '?taskId=' + params.taskId + '&genericId=' + params.genericId);
};
//新加趋势图
export const getAnomalyResultService = (params) => {
    return fetchGet(API.TB_ANOMALYRESULT + '?taskId=' + params.taskId);
};
//异常趋势图
export const getAnomalyResultTrendService = (params) => {
    return fetchGet(API.TB_ANOMALYRESULTREND + '/' + params.taskId);
};
//日志模式的进度
export const logGetProgressService = (params) => {
    return fetchGet(API.TB_LOGGETPROGRESS + '/' + params.taskId + '/' + params.tuningBenchGenericId);
};
//模式识别重新计算防并发接口
export const taskRecognitionService = (params) => {
    return fetchGet(API.TB_TASKRECOGNITION + '/' + params.taskId + '/' + params.genericId);
};
//异常重新计算
export const singleCalculateService = (params) => {
    return fetchPost(API.TB_SINGLECALCULATE, {
        body: params
    });
};
//异常重新计算
export const originLogTrendDetailService = (params) => {
    return fetchPost(API.TB_ANOMALYRESULTRENDDETAIL, {
        body: params
    });
};
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
export const getTuningbenchModelService = (params) => {
    return fetchPost(API.TB_TUNINGBENCHMODEL, {
        body: params
    });
};
export const getTuningbenchMetricService = (params) => {
    return fetchPost(API.TB_TUNINGBENCHMETRIC , {
        body: params
    });
};