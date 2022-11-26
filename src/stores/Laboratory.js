import {toMobx} from '@chaoswise/cw-mobx';
import {error, success, warning} from "@/utils/tip";
import {connect, toJS} from "@chaoswise/cw-mobx";
import {call} from '@/utils/effects';
import {
    getTbList,
    addTbListService,
    searchAlgorithmService,
    delTbListService,
    addModifService,
    updataModifService,
    getTbDetail,
    modifyTb,
    getTbDetailList,
    getSeriesList,
    getSeriesData,
    getModelOrObjList,
    cancelSingleFavo,
    addSingleFavo,
    getTime,
    modifyTime,
    addAllFavorite,
    delAllFavorite,
    getResult,
    getTrigger,
    getDenericList,
    modifyGenericList,
    getGenericSericeList,
    addGenericList,
    deleteDenericList,
    getModel,
    getObjList,
    getMetricList,
    getTagsList,
    saveAndAddGeneric,
    modifyGeneric,
    getDataSourceTime,
    modelGroupService,
    tagsGroupService,
    checkRelationService,
    getOriginData,
    getTaskTrainingDaysService,
    getTaskParamsService,
    getGenericsNumService,
    delGenericListService,
    getGroupNodelistService,
    runRootCauseService,
    getGroupMetriclistService,
    getNodeRelationsService,
    rootCauseResetService,
    getRootCauseAnalysisResultService,
    rootCauseFeedBackAddService,
    rootCauseGenericDataService,
    getlogPatternCalculateService,
    logOriginTrenService,
    patternResultsService,
    checkOriginLogsService,
    patternLogsService,
    patternTrendsService,
    queryLogpatternreService,
    taskUnsaveRawdataService,
    handUpdateService,
    originLogTrendService,
    getCalculateService, getPartitionFieldValuesService, getAnomalyCountInfoService,
    anmalyOrginLogService, anmalyFieldsAnalyzService, getProcessRatioService,
    getAnomalyResultService, logGetProgressService, rootCauseCalculatService,
    taskRecognitionService, singleCalculateService, getTaskTimerangeService,
    getAnomalyResultTrendService, originLogTrendDetailService, getTagsKeysService,
    getTagsValueService, getTuningbenchModelService, getTuningbenchMetricService
} from '@/services/Laboratory';
import {
    getDataSourceList,
} from '@/services/dataSource';
import {
    getTaskModelService,
    getTaskTargetService,
    getTaskMetricService,
    getTaskTagsService
} from '@/services/TaskManagement';
import {
    addAlgorithmService
} from '@/services/AlgorithmicGenerics';
import moment from 'moment';
import {IntlFormatMessage} from "@/utils/util";

const laboratory = {

    namespace: 'laboratoryStore',

    state: {
        tuningbenchModelObj: {
            pageNum: 0,
            pageSize: 10,
            total: 0,
            content: [],
        },
        tuningbenchMetricObj: {
            pageNum: 0,
            pageSize: 10,
            total: 0,
            content: [],
        },
        rootAnalysisList: [],
        groupNodelist: [],
        groupTopoData: [],
        groupMetriclist: [],
        groupMetricDetaillist: {},
        genericityList: [],
        dimensionalList: [],
        dataSetInfo: {
            taskName: undefined,
            scene: 'anomaly_detection',
            dataSourceType: 'FILE',
            datasourceId: undefined,
            model: [],
            obj: [],
            method: undefined,
            aggTimeUnit: undefined,
            time: undefined,
            number: undefined,
            description: undefined,
            forecastTimeNumber: undefined,
            forecastTimeUnit: undefined,
            upperThreshold: undefined,
            lowerThreshold: undefined,
            mode: [],
            selectRowKey: [],
            nowDate: 0
        },
        dataSetTableList: [],
        pageInfo: {},
        dataList: [],
        dataSourceList: [],
        genericityData: [],
        currentPage: 0,
        modelList: [],
        objList: [],
        metricList: [],
        tagsList: [],
        tagsValueList: [],
        currentList: {},
        searchHeader: {
            scene: null,
            taskName: null
        },
        dataSourcePage: {
            pageNum: 1,
            pageSize: 100,
            total: 0
        },
        modelPage: {
            pageNum: 1,
            pageSize: 100,
            total: 0
        },
        objPage: {
            pageNum: 1,
            pageSize: 100,
            total: 0
        },
        metricPage: {
            pageNum: 1,
            pageSize: 100,
            total: 0
        },
        publicLimit: 0,
        privateLimit: 0,
        taskId: '',
        laboratoryRecord: {
            startTime: '',
            endTime: '',
        },
        dataZoomCharts: {}
    },
    effects: {
        //异常数量趋势
        * originLogTrendDetailAsync(params, {cb}) {
            const res = yield call(originLogTrendDetailService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //重新计算
        * singleCalculateAsync(params, {cb}) {
            const res = yield call(singleCalculateService, params);
            const {data} = res;
            if (res.code && res.code === 100000) {
                cb && cb(data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //日志模式进度
        * taskRecognitionAsync(params, {cb, err}) {
            const res = yield call(taskRecognitionService, params);
            const {data} = res;
            if (res.code && res.code === 100000) {
                cb && cb(data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        //日志模式进度
        * logGetProgressAsync(params, {cb, err}) {
            const res = yield call(logGetProgressService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        //新加的所有趋势图
        * getAnomalyResultAsync(params, {cb}) {
            const res = yield call(getAnomalyResultService, params);
            cb && cb(res);
        },
        //查看异常趋势
        * getAnomalyResultTrendAsync(params, {cb}) {
            const res = yield call(getAnomalyResultTrendService, params);
            cb && cb(res);
        },
        //进度条
        * getProcessRatioAsync(params, {cb}) {
            const res = yield call(getProcessRatioService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //字段分析
        * anmalyFieldsAnalyzAsync(params, {cb}) {
            const res = yield call(anmalyFieldsAnalyzService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //原始日志
        * anmalyOrginLogAsync(params, {cb}) {
            const res = yield call(anmalyOrginLogService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },

        //日志异常-获取分区字段
        * getPartitionFieldValuesAsync(params, {cb}) {
            const res = yield call(getPartitionFieldValuesService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //日志异常-右侧table
        * getAnomalyCountInfoAsync(params, {cb, err}) {
            const res = yield call(getAnomalyCountInfoService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        //获取日志分析后的信息
        * getCalculateAsync(params, {cb, err}) {
            const res = yield call(getCalculateService, params);
            if (res.code && res.code === 100000) {
                const {data = {}} = res;
                if (data.message === undefined) {
                    cb && cb(data);
                } else {
                    warning(data.message);
                    cb && cb(data);
                }
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //原始日志趋势
        * originLogTrendAsync(id, {cb}) {
            const res = yield call(originLogTrendService, id);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //添加指标，抽屉，查看
        * handUpdate(params, {cb}) {
            const res = yield call(handUpdateService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //添加指标，抽屉，查看
        * taskUnsaveRawdata(params, {cb}) {
            const res = yield call(taskUnsaveRawdataService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        * queryModelGroup(params, {cb, err}) {
            const res = yield call(modelGroupService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        * queryTagsGroup(params, {cb}) {
            const res = yield call(tagsGroupService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //添加单个私有泛型
        * rootAddGenericityList(params) {
            const res = yield call(addModifService, params);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('laboratory.anomaly.addedBtn'));
                this.rootAnalysisList(Object.assign({}, params, res.data, {
                    genericId: res.data.id
                }));
            } else {
                error(res.msg || IntlFormatMessage('laboratory.anomaly.resetAdded'));
            }
        },
        //修改私有化泛型
        * rootModifyGeneric(params) {
            const res = yield call(updataModifService, params);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('datasource.create.modified'));
                this.rootAnalysisList(Object.assign({}, params, res.data, {
                    genericId: res.data.id
                }));
            } else {
                error(res.msg || IntlFormatMessage('laboratory.anomaly.failModified'));
            }
        },
        //删除私有化泛型
        * rootDeleteGeneric(params) {
            const res = yield call(updataModifService, params);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('laboratory.anomaly.deleted'));
                this.rootAnalysisList(Object.assign({}, params, res.data, {
                    genericId: res.data.id
                }));
            } else {
                error(res.msg || IntlFormatMessage('task.common.deletionFailed'));
            }
        },
        //添加单个泛型
        * addModifyGeneric(params) {
            const res = yield call(addModifService, params);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('laboratory.anomaly.addedBtn'));
                this.addGenericityList(Object.assign({}, params, res.data, {
                    genericId: res.data.id
                }));
            } else {
                error(res.msg || IntlFormatMessage('laboratory.anomaly.resetAdded'));
            }
        },
        //修改公有化泛型
        * updateModifyGeneric(params) {
            const res = yield call(updataModifService, params);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('datasource.create.modified'));
                this.modifyGenericityList(Object.assign({}, params, res.data, {
                    genericId: res.data.id
                }));
            } else {
                error(res.msg || IntlFormatMessage('laboratory.anomaly.failModified'));
            }
        },

        //获取数据源列表
        * getDataSourceList(params, callBack) {
            this.dataSourceList = [];
            if (!params.query.dataType) {
                params.query['dataType'] = this.dataSetInfo.scene === 'root_cause_analysis' ?
                    'NODE_RELATION' :
                    ['log_parsing', 'log_anomaly_detection'].includes(this.dataSetInfo.scene) ? 'LOG' : 'TIME_SERIES';
            }
            params.query['scene'] = this.dataSetInfo.scene;
            const res = yield call(getDataSourceList, params);
            if (res.code && res.code === 100000) {
                if (params.pageNum > 1) {
                    this.dataSourceList = this.dataSourceList.concat(res.data.content || []);
                } else {
                    this.dataSourceList = res.data.content || [];
                }
                callBack && callBack(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //获取实验室列表
        * getDataList(params) {
            const res = yield call(getTbList, params);
            if (res.code && res.code === 100000) {
                const resp = res.data;
                const {
                    pageNum = 1,
                    pageSize = 10,
                    totalPages = 0,
                    totalSize = 0
                } = res.data || {};
                this.dataList = resp.content;
                this.pageInfo = {
                    pageNum,
                    pageSize,
                    totalPages,
                    totalSize
                };
                if (!resp.content.length && pageNum > 1) {
                    this.getDataList(Object.assign({}, params, {
                        pageNum: pageNum - 1
                    }));
                }
            } else {
                error(res.msg || IntlFormatMessage('task.common.listFails'));
            }
        },
        //新建算法实验室列表列表 //创建任务
        * addTbList(params, {cb, err}) {
            const res = yield call(addTbListService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
                this.taskId = res.data.id;
            } else {
                error(res.msg || IntlFormatMessage('task.common.createTwoFailed'));
                err && err();
            }
        },
        //获取泛型列表
        * searchAlgorithmService(params) {
            const res = yield call(searchAlgorithmService, params);
            if (res.code && res.code === 100000) {
                this.genericityData = res.data.content || [];
            } else {
                error(res.msg || IntlFormatMessage('task.common.listFails'));
            }
        },
        * modifyGeneric(params, {cb}) {
            const res = yield call(modifyGeneric, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.editFailed'));
            }
        },
        //删除实验室列表//删除共有泛型
        * delGeneric(id, {cb}) {
            const res = yield call(delGenericListService, id);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('laboratory.anomaly.deleted'));
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.deletionFailed'));
            }
        },
        * delTbList(id, {cb}) {
            const res = yield call(delTbListService, id);
            if (res.code && res.code === 100000) {
                success(IntlFormatMessage('laboratory.anomaly.deleted'));
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.deletionFailed'));
            }
        },
        //获取任务信息
        * getTbDetail(id, {cb}) {
            const res = yield call(getTbDetail, id);
            if (!!res && res.code && res.code === 100000) {
                cb && cb(res.data);
                const {taskPublicGenericList = [],} = res.data || {};
                this.genericityList = taskPublicGenericList.map((item, index) => {
                    return {
                        name: item.name || item.algorithmName,
                        algorithmId: item.algorithmId,
                        algorithmVersion: item.algorithmVersion,
                        algorithmParams: item.algorithmParams,
                        algorithmName: item.algorithmName,
                        eid: index + 1,
                        genericId: item.algorithmGenericId,
                        algorithmNameZh: item.displayAlgorithmNames || '',
                        isOverwriteForecastParams: item.isOverwriteForecastParams,
                        checked: item.isOverwriteForecastParams,
                        genericName: item.displayGenericNames || (item.genericName || ''),
                        genericityname: item.genericName,
                        id: item.id,
                    };
                });
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //新增泛型获取原始数据
        * getOriginData(params, {cb}) {
            const res = yield call(getOriginData, params);
            if (res.code && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //编辑任务
        * modifyTb(params, {cb}) {
            const res = yield call(modifyTb, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.editFailed'));
            }
        },
        //点击名称获取列表
        * getTbDetailList(params, {cb}) {
            const res = yield call(getTbDetailList, params);
            if (res.code && res.code === 100000) {
                cb && cb({
                    taskName: res.data.taskName || '',
                    content: res.data.tuningBenchModelMetrics.content || [],
                    metricKeySet: res.data.metricKeySet,
                    targetModelSet: res.data.targetModelSet,
                    page: res.data.tuningBenchModelMetrics
                });
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //获取每一个模型指标下面对应的数据
        * getSeriesList(params, {cb}) {
            const res = yield call(getSeriesList, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data || {});
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //点击查看弹窗获取数据
        * getSeriesData(params, {cb, err}) {
            const res = yield call(getSeriesData, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data || {});
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        //保存并发布泛型
        * saveAndAddGeneric(params, {cb, err}) {
            const res = yield call(saveAndAddGeneric, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        //依据模型或者对象查找模型或者对象
        * getModelOrObjList(params, {cb}) {
            const res = yield call(getModelOrObjList, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        * getTuningbenchModelAsync(params, {cb}) {
            const res = yield call(getTuningbenchModelService, params);
            if (res.code && res.code === 100000) {
                const obj = res.data;
                this.tuningbenchModelObj = {
                    pageNum: obj.pageNum,
                    pageSize: obj.pageSize,
                    total: obj.totalSize,
                    content: obj.pageNum === 1 ?
                        obj.content :
                        this.tuningbenchModelObj.content.concat(obj.content),
                };
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        * getTuningbenchMetricAsync(params, {cb}) {
            const res = yield call(getTuningbenchMetricService, params);
            if (res.code && res.code === 100000) {
                const obj = res.data;
                this.tuningbenchMetricObj = {
                    pageNum: obj.pageNum,
                    pageSize: obj.pageSize,
                    total: obj.totalSize,
                    content: obj.pageNum === 1 ?
                        obj.content :
                        this.tuningbenchMetricObj.content.concat(obj.content),
                };
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        //取消单个收藏
        * cancelSingleFavo(params, {cb}) {
            const res = yield call(cancelSingleFavo, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.removeFavorites'));
            }
        },
        //新增收藏
        * addSingleFavo(params, {cb}) {
            const res = yield call(addSingleFavo, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.favoritesFailed'));
            }
        },
        //获取时间
        * getTime({cb}) {
            const res = yield call(getTime);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.globalFails'));
            }
        },
        //编辑时间
        * modifyTime(params, {cb}) {
            const res = yield call(modifyTime, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.globalEdited'));
            }
        },
        //全部收藏
        * addAllFavorite(params, {cb}) {
            const res = yield call(addAllFavorite, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.addBatchFailed'));
            }
        },
        //全部取消收藏
        * delAllFavorite(params, {cb}) {
            const res = yield call(delAllFavorite, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.batchFavorites'));
            }
        },
        * getResult(params, {cd, err}) {
            const res = yield call(getResult, params);
            if (res.code && res.code === 100000) {
                cd && cd(res.data);
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        * getTrigger(params, {cb, err}) {
            const res = yield call(getTrigger, params);
            if (res.code && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        * getDenericList(params) {
            const res = yield call(getDenericList, params);
            if (res.code && res.code === 100000) {
                console.log(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        * getGenericSericeList(params, {cb}) {
            const res = yield call(getGenericSericeList, params);
            if (res.code && res.code === 100000) {
                this.rootAnalysisList = (res.data || []).map(item => {
                    return Object.assign({}, item, {
                        genericityname: item.genericName,
                    });
                });

                cb && cb(toJS(this.rootAnalysisList));
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        * addGenericList(params, {cb, err}) {
            const res = yield call(addGenericList, params);
            if (res.code && res.code === 100000) {
                this.rootAnalysisList = this.rootAnalysisList.concat(res.data);
                cb && cb(res.data);
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.createTwoFailed'));
            }
        },
        * modifyGenericList(params, {cb, err}) {
            const res = yield call(modifyGenericList, params);
            if (res.code && res.code === 100000) {
                this.rootAnalysisList = this.rootAnalysisList.map(item => {
                    if (item.id === params.id) {
                        return params;
                    }
                    return item;
                });
                cb && cb(res.data);
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.editFailed'));
            }
        },
        //删除泛型
        * deleteDenericList(id, {cb}) {
            const res = yield call(deleteDenericList, id);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.deletionFailed'));
            }
        },
        //保存泛型
        * addAlgorithmService(params, {cb, err}) {
            const res = yield call(addAlgorithmService, params);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.saveFailed'));
                err && err();
            }
        },
        //根据数据源获取模型列表
        * getModel(id, pageInfo, callBack, searchValue) {
            const time = toJS(this.dataSetInfo.time);
            const res = yield call(getModel, Object.assign({}, {
                pageInfo,
                id,
                searchValue,
                scene: this.dataSetInfo.scene,
                taskType: 1,
                dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
            }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                time,
            } : {}));
            if (res.code && res.code === 100000) {
                if (pageInfo.pageNum && pageInfo.pageNum === 1) {
                    this.modelList = [];
                }
                const {result = {}} = res.data || {};
                if (result.content) {
                    this.modelList = this.modelList.concat(result.content);
                } else {
                    this.modelList = [];
                }
                callBack && callBack(result);
            } else {
                error(res.msg || IntlFormatMessage('task.common.typeFails'));
                this.modelList = [];
                callBack && callBack({});
            }
        },
        //根据模型获取对象
        * getObjList(id, modelValue, pageInfo, callBack, searchValue) {
            const time = toJS(this.dataSetInfo.time);
            const res = yield call(getObjList, Object.assign({
                id,
                modelValue,
                pageInfo,
                searchValue,
                scene: this.dataSetInfo.scene,
                taskType: 1,
                dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
            }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                time,
            } : {}));
            if (res.code && res.code === 100000) {
                if (pageInfo.pageNum && pageInfo.pageNum === 1) {
                    this.objList = [];
                }
                const {result = {}} = res.data || {};
                this.objList = this.objList.concat(result.content);
                callBack && callBack(result);
            } else {
                error(res.msg || IntlFormatMessage('task.common.objectFails'));
                this.objList = [];
                callBack && callBack({});
            }
        },
        //根据模型和对象获取指标
        * getMetricList(id, modelValue, targetValue, pageInfo, callBack, searchValue) {
            const time = toJS(this.dataSetInfo.time);
            const res = yield call(getMetricList, Object.assign({
                id,
                modelValue,
                targetValue,
                pageInfo,
                searchValue,
                time,
                scene: this.dataSetInfo.scene,
                taskType: 1,
                dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
            }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                time,
            } : {}));
            if (res.code && res.code === 100000) {
                if (pageInfo.pageNum && pageInfo.pageNum === 1) {
                    this.metricList = [];
                }
                const {result = {}} = res.data || {};
                this.metricList = this.metricList.concat(result.content);
                callBack && callBack(result);
            } else {
                error(res.msg || IntlFormatMessage('task.common.objectFails'));
                this.metricList = [];
                callBack && callBack({});
            }
        },
        //根据模型对象指标获取维度
        * getTagsKeysAsync(params, callBack) {
            const res = yield call(getTagsKeysService, params);
            if (res.code && res.code === 100000) {
                const {pageNum = 1, pageSize = 10, totalSize = 0, totalPages = 0, content = []} = res?.data?.result || {};
                if (pageNum === 1) {
                    this.tagsList = [];
                }
                this.tagsList = this.tagsList.concat(content || []);
                callBack && callBack(res?.data?.result || {});
            } else {
                error(res.msg || IntlFormatMessage('task.common.objectFails'));
                this.tagsList = [];
                callBack && callBack({});
            }
        },
        //根据模型对象指标获取维度
        * getTagsValueAsync(params, callBack) {
            const time = toJS(this.dataSetInfo.time);
            const res = yield call(getTagsValueService, params);
            if (res.code && res.code === 100000) {
                const {pageNum = 1, pageSize = 10, totalSize = 0, totalPages = 0, content = []} = res?.data?.result || {};
                if (pageNum === 1) {
                    this.tagsValueList = [];
                }
                this.tagsValueList = this.tagsValueList.concat(content || []);
                callBack && callBack(res?.data?.result || {});
            } else {
                error(res.msg || IntlFormatMessage('task.common.objectFails'));
                this.tagsValueList = [];
                callBack && callBack({});
            }
        },
        * getTagsList(id, modelValue, targetValue, metricValue, pageInfo, callBack) {
            const time = toJS(this.dataSetInfo.time);
            const res = yield call(getTagsList, Object.assign({
                id,
                modelValue,
                targetValue,
                metricValue,
                pageInfo,
                time,
                scene: this.dataSetInfo.scene,
                taskType: 1,
                dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
            }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                time,
            } : {}));
            if (res.code && res.code === 100000) {
                const {result = {}, pageNum = 1, pageSize = 10, totalSize = 0, totalPages = 0,} = res.data || {};
                this.tagsList = (result?.content || []).reduce((prev, cent) => {
                    return Object.assign({}, prev, cent);
                }, {});
                callBack && callBack(result);
            } else {
                error(res.msg || IntlFormatMessage('task.common.objectFails'));
                this.tagsList = [];
                callBack && callBack({});
            }
        },
        * getLabModelAsync(params, page, callBack, searchValue) {
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskModelService, {
                ...page,
                query: {
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    scene: this.dataSetInfo.scene,
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                    filters: this.formatData(params, searchValue, 'model'),
                    taskType: 1
                }
            });
            if (response && response.status == "success") {
                if (page.pageNum && page.pageNum === 1) {
                    this.modelList = [];
                }
                if (response.data.existenceMapping) {
                    this.modelList = this.modelList.concat(response.data.result.content || []);
                    callBack && callBack(response.data.result);
                } else {
                    this.modelList = this.modelList.concat([]);
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }
                // callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.typeFails'));
                this.modelList = this.modelList.concat([]);
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getTaskModelAsync(params, page, callBack, searchValue) {
            const {dataSourceId, ...rest} = params;
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskModelService, {
                ...page,
                query: Object.assign({}, {
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: dataSourceId,
                    scene: this.dataSetInfo.scene,
                    dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    filters: this.formatData(rest, searchValue, 'model')
                }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                } : {})
            });
            if (response && response.status == "success") {
                if (page.pageNum && page.pageNum === 1) {
                    this.modelList = [];
                }
                if (response.data.existenceMapping) {
                    this.modelList = this.modelList.concat(response.data.result.content || []);
                    callBack && callBack(response.data.result);
                } else {
                    this.modelList = this.modelList.concat([]);
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }
                // callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.typeFails'));
                this.modelList = this.modelList.concat([]);
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getTaskTargetAsync(params, page, callBack, searchValue) {
            const {dataSourceId, ...rest} = params;
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskTargetService, {
                ...page,
                query: Object.assign({
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: dataSourceId,
                    dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    scene: this.dataSetInfo.scene,
                    filters: this.formatData(params, searchValue, 'target')
                }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                } : {})
            });
            if (response && response.status === "success") {
                if (page?.pageNum === 1) {
                    this.objList = [];
                }
                if (response?.data?.existenceMapping) {
                    this.objList = this.objList.concat(response.data?.result?.content || []);
                    callBack && callBack(response.data?.result);
                } else {
                    this.objList = this.objList.concat([]);
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }

            } else {
                error(response.msg || IntlFormatMessage('task.common.objectFails'));
                this.objList = this.objList.concat([]);
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getLaboratoryAsync(params, page, callBack, searchValue) {
            const {dataSourceId, ...rest} = params;
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskTargetService, {
                ...page,
                query: Object.assign({
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    scene: this.dataSetInfo.scene,
                    // dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    filters: this.formatData(rest, searchValue, 'target'),
                    taskType: 1
                }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                } : {})
            });
            if (response && response.status == "success") {
                if (page.pageNum && page.pageNum === 1) {
                    this.objList = [];
                }
                if (response.data.existenceMapping) {
                    this.objList = this.objList.concat(response.data.result.content || []);
                    callBack && callBack(response.data.result);
                } else {
                    this.objList = this.objList.concat([]);
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }

            } else {
                error(response.msg || IntlFormatMessage('task.common.objectFails'));
                this.objList = this.objList.concat([]);
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getLabMetricAsync(params, page, callBack, searchValue,) {
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskMetricService, {
                ...page,
                query: {
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    scene: this.dataSetInfo.scene,
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                    filters: this.formatData(params, searchValue, 'metric'),
                    taskType: 1
                }
            });
            if (response && response.status == "success") {
                if (page.pageNum && page.pageNum === 1) {
                    this.metricList = [];
                }
                if (response.data.existenceMapping) {
                    this.metricList = this.metricList.concat(response.data.result.content || []);
                    callBack && callBack(response.data.result);
                } else {
                    this.metricList = this.metricList.concat([]);
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }

            } else {
                error(response.msg || "获取任务指标失败!");
                this.metricList = this.metricList.concat([]);
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getTaskMetricAsync(params, page, callBack, searchValue,) {
            const {dataSourceId, ...rest} = params;
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskMetricService, {
                ...page,
                query: Object.assign({
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: dataSourceId,
                    scene: this.dataSetInfo.scene,
                    dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    filters: this.formatData(rest, searchValue, 'metric')
                }, this.dataSetInfo.scene !== 'root_cause_analysis' ? {
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                } : {})
            });
            if (response && response.status == "success") {
                if (page.pageNum && page.pageNum === 1) {
                    this.metricList = [];
                }
                if (response.data.existenceMapping) {
                    this.metricList = this.metricList.concat(response.data.result.content || []);
                    callBack && callBack(response.data.result);
                } else {
                    this.metricList = this.metricList.concat([]);
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }

            } else {
                error(response.msg || "获取任务指标失败!");
                this.metricList = this.metricList.concat([]);
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getLabTagsAsync(params, page, callBack) {
            const time = toJS(this.dataSetInfo.time);
            // const response = yield call(getTagsList, {
            const response = yield call(getTaskTagsService, {
                ...page,
                query: {
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    scene: this.dataSetInfo.scene,
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                    filters: this.formatData(params),
                    taskType: 1,
                }
            });
            if (response && response.status == "success") {
                if (response?.data?.existenceMapping) {
                    this.tagsList = (response?.data?.result?.content || []).reduce((prev, cent) => {
                        return Object.assign({}, prev, cent);
                    }, {});
                    callBack && callBack(response.data.result);
                } else {
                    this.tagsList = [];
                    callBack && callBack({
                        pageNum: 1,
                        pageSize: 100,
                        total: 0,
                    });
                }
            } else {
                error(response.msg || "获取任务指标失败!");
                this.tagsList = [];
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        * getTaskTagsAsync(params, page, callBack,) {
            const {dataSourceId, ...rest} = params;
            const time = toJS(this.dataSetInfo.time);
            const response = yield call(getTaskTagsService, {
                ...page,
                query: Object.assign({}, {
                    nowDate: this.dataSetInfo.nowDate,
                    dataSourceId: dataSourceId,
                    scene: this.dataSetInfo.scene,
                    dataSourceRelationId: (this.dataSetInfo.datasourceId) instanceof Object ? this.dataSetInfo.datasourceId.value : this.dataSetInfo.datasourceId,
                    filters: this.formatData(rest)
                }, time ? {
                    startTime: time[0] && moment(time[0]).valueOf(),
                    endTime: time[1] && moment(time[1]).valueOf(),
                } : {})
            });
            if (response && response.status === "success") {
                if (response?.data?.existenceMapping) {
                    this.tagsList = (response?.data?.result?.content || []).reduce((prev, cent) => {
                        return Object.assign({}, prev, cent);
                    }, {});
                } else {
                    this.tagsList = [];
                }
            } else {
                error(response.msg || "获取任务指标失败!");
                this.tagsList = [];
                callBack && callBack({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0,
                });
            }
        },
        //根据选择的数据源id获取选择的时间并赋值
        * getDataSourceTime(id, {cb}) {
            const res = yield call(getDataSourceTime, id);
            if (res && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.timeFails'));
            }
        },
        //创建任务时，根据时间范围，获取任务级别训练时间
        * getTaskTrainingDaysAsync(params, {cb}) {
            const res = yield call(getTaskTrainingDaysService, params);
            if (res && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.timeFails'));
            }
        },
        //创建任务时，根据时序数据源，获取任务级别训练时间
        * getTaskTimerangeAsync(params, {cb}) {
            const res = yield call(getTaskTimerangeService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.timeFails'));
            }
        },
        //新建对比模型时，获取任务级别参数
        * getTaskParamsAsync(id, {cb}) {
            const res = yield call(getTaskParamsService, id);
            if (res && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.timeFails'));
            }
        },
        //列表里面总共增加几个泛型
        * getGenericsNumAsync() {
            const res = yield call(getGenericsNumService);
            if (res && res.code === 100000) {
                const {publicLimit = 0, privateLimit = 0} = res.data;
                this.publicLimit = publicLimit;
                this.privateLimit = privateLimit;
            } else {
                error(res.msg || IntlFormatMessage('task.common.quantityLimited'));
            }
        },
        //根因-训练
        * runRootCauseAsync(params, callback = {}) {
            const {cb, err} = callback;
            const res = yield call(runRootCauseService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        //根因-获取拓扑图
        * getNodeRelationsAsync(id) {
            const res = yield call(getNodeRelationsService, id);
            if (res && res.code === 100000) {
                this.groupTopoData = res.data;
            } else {
                error(res.msg || IntlFormatMessage('task.common.topologyFails'));
            }
        },
        //根因-获取入口节点数据
        * getGroupNodelistAsync(id) {
            this.groupNodelis = [];
            const res = yield call(getGroupNodelistService, id);
            if (res && res.code === 100000) {
                this.groupNodelist = res.data;
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //根因-获取入口指标数据
        * getGroupMetriclistAsync(params, callBack) {
            const res = yield call(getGroupMetriclistService, params);
            if (res && res.code === 100000) {
                const {content = []} = res.data;
                this.groupMetriclist = content;
                this.groupMetricDetaillist = res.data;
                callBack && callBack(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //根因-获取训练结果
        * getRootCauseAnalysisResultAsync(params, {cb}) {
            const res = yield call(getRootCauseAnalysisResultService, params);
            if (res && res.code === 100000) {
                const {data = {}, feedback = {}} = res.data || {};
                cb && cb(Object.assign({}, data, {feedback: feedback}));
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //根因-手动选择
        * rootCauseFeedBackAddAsync(params, {cb}) {
            const res = yield call(rootCauseFeedBackAddService, params);
            if (res && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //根因-算法图数据
        * rootCauseGenericDataAsync(params, {cb, err}) {
            const res = yield call(rootCauseGenericDataService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        //根因-计算
        * rootCauseCalculatAsync(params, callback) {
            const {cb, err} = callback;
            const res = yield call(rootCauseCalculatService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                err && err();
                if (res.status === 'warning') {
                    warning(res.msg || IntlFormatMessage('task.common.calculationFailed'));
                } else {
                    error(res.msg || IntlFormatMessage('task.common.calculationFailed'));
                }
            }
        },
        //根因-重置
        * rootCauseResetAsync(cb) {
            const res = yield call(rootCauseResetService);
            cb && cb(res);
        },
        //日志模式识别，获取饼图数据
        * queryLogpatternreAsync(id, {cb, err}) {
            const res = yield call(queryLogpatternreService, id);
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
                err && err();
            }
        },
        //日志模式识别，计算
        * getlogPatternCalculateAsync(params = {}, callBack = {}) {
            const {taskId, genericId} = params;
            const {cb, err,} = callBack;
            const res = yield call(getlogPatternCalculateService, taskId, genericId);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                const {data = {}} = res;
                error(data.message || IntlFormatMessage('task.common.calculationFailed'));
                err && err();
            }
        },

        //原始日志趋势图
        * logOriginTren(params, {cb}) {
            const res = yield call(logOriginTrenService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.calculationFailed'));
            }
        },
        //模式识别
        * patternResults(params, {cb}) {
            const res = yield call(patternResultsService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.calculationFailed'));
            }
        },
        //原始日志
        * checkOriginLogs(params, {cb}) {
            const res = yield call(checkOriginLogsService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.calculationFailed'));
            }
        },
        //指定日志模式 查询结果
        * patternLogs(params, {cb}) {
            const res = yield call(patternLogsService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.calculationFailed'));
            }
        },
        //指定日志模式 查询结果
        * patternTrends(params, {cb}) {
            const res = yield call(patternTrendsService, params);
            if (res && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.calculationFailed'));
            }
        },
    },

    reducers: {
        formatData(params, searchValue, type) {
            const {metricValue = [], modelValue = [], targetValue = []} = params;
            let filters = {
                metricFilter: {},
                modelFilter: {},
                targetFilter: {}
            };
            const renderModelFilter = () => {
                if (modelValue.length) {
                    filters.modelFilter = {
                        compare: modelValue.length > 1 ? 'IN' : 'E',
                        value: modelValue.length > 1 ? modelValue : modelValue[0]
                    };
                }
            };
            const renderMetricFilter = () => {
                if (metricValue.length) {
                    filters.metricFilter = {
                        compare: metricValue.length > 1 ? 'IN' : 'E',
                        value: metricValue.length > 1 ? metricValue : metricValue[0]
                    };
                }
            };
            const renderTargetFilter = () => {
                if (targetValue.length) {
                    filters.targetFilter = {
                        compare: targetValue.length > 1 ? 'IN' : 'E',
                        value: targetValue.length > 1 ? targetValue : targetValue[0]
                    };
                }
            };
            if (searchValue || searchValue === '') {
                if (type === 'model') {
                    renderMetricFilter();
                    renderTargetFilter();
                    filters.modelFilter = {
                        compare: "LIKE",
                        value: searchValue
                    };
                }
                if (type === 'target') {
                    renderModelFilter();
                    renderMetricFilter();
                    filters.targetFilter = {
                        compare: "LIKE",
                        value: searchValue
                    };
                }
                if (type === 'metric') {
                    renderModelFilter();
                    renderTargetFilter();
                    filters.metricFilter = {
                        compare: "LIKE",
                        value: searchValue
                    };
                }
            } else {
                renderModelFilter();
                renderMetricFilter();
                renderTargetFilter();
            }
            return filters;

        },
        //新建泛型
        addGenericityList(value) {
            this.genericityList = toJS(this.genericityList).concat(value).map((item, index) => {
                return Object.assign({}, item, {
                    eid: index + 1
                });
            });
        },
        //编辑泛型
        modifyGenericityList(id, value, checked = false) {
            this.genericityList = toJS(this.genericityList).map(item => {
                if (item.eid === id) {
                    return {
                        eid: id,
                        ...value,
                        checked: checked,
                    };
                }
                return item;
            });
        },
        //删除泛型
        delGenericityList(id) {
            this.genericityList = toJS(this.genericityList).filter(item => id !== item.eid);
        },
        //清空泛型
        clearGenericityList() {
            this.genericityList = [];
        },
        //新增指标保存信息
        adddimensionalList(value) {
            this.dimensionalList = toJS(this.dimensionalList).concat({
                id: this.dimensionalList.length + 1,
                ...value
            });
        },
        //清空指标
        emptyDimensionalList() {

            this.dimensionalList = [];
            this.tagsList = [];
            this.tagsValueList = [];
        },
        //编辑指标
        modifyDimensionallist(value, id) {
            this.dimensionalList = toJS(this.dimensionalList).map(item => {
                if (item.id === id) {
                    return {
                        id,
                        ...value
                    };
                }
                return item;
            });
        },
        //删除某个指标
        delDimensionalList(id) {
            this.dimensionalList = toJS(this.dimensionalList).filter(item => id !== item.id);
        },
        //算法选择页面点击参数设定修改对应的值
        changeArguInfo(id, info, {cb}) {
            this.genericityList = this.genericityList.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        value: info.genericity,
                        desc: info
                    };
                }
                return item;
            });
            cb && cb();
        },
        //更新算法选择页面
        setGenericityList(data = []) {
            this.genericityList = data;
        },
        //获取维度
        getDimension(value) {
            if (this.dataSetInfo.dataSourceType === 'FILE') {
                this.getTagsList(this.dataSetInfo.datasourceId.value, this.dataSetInfo.model, this.dataSetInfo.obj, value);
            } else {
                this.getLabTagsAsync({
                    metricValue: value,
                    modelValue: this.dataSetInfo.model,
                    targetValue: this.dataSetInfo.obj
                });
            }
        },
        //获取维度
        getDimensionRoot(params) {
            const {dataSourceType, dataSourceId, model, obj, value} = params;
            if (dataSourceType === 'FILE') {
                this.getTagsList(dataSourceId, model, obj, value);
            } else {
                this.getTaskTagsAsync({
                    dataSourceId,
                    metricValue: value,
                    modelValue: model,
                    targetValue: obj
                });
            }
        },
        //更新数据设定信息
        updateDataSetInfo(type, value) {
            let newDataSetInfo = {
                ...this.dataSetInfo,
                [type]: value
            };
            if (['datasourceId-model'].includes(type)) {
                this.dataSourceList = [];
                this.modelList = [];
                this.objList = [];
                this.metricList = [];
                this.tagsList = [];
                this.tagsValueList = [];
            }
            if (['datasourceId'].includes(type)) {
                this.modelList = [];
                this.objList = [];
                this.metricList = [];
            }
            if (type === 'model') {
                this.objList = [];
                this.metricList = [];
            }
            if (type === 'obj') {
                this.metricList = [];
            }
            if (type === 'dataSourceType') {
                this.dataSourceList = [];
                this.setDataSourcePage({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0
                });
                this.setObjPage({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0
                });
                this.setModelPage({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0
                });
                this.setMetricPage({
                    pageNum: 1,
                    pageSize: 100,
                    total: 0
                });
            }
            if (type === 'scene') {
                this.genericityList = [];
            }
            if (type !== 'datasourceId') {
                this.dataSetInfo = newDataSetInfo;
            } else {
                this.dataSetInfo = {
                    ...this.dataSetInfo,
                    [type]: (!!value && Object.keys(value).length) ? {
                        value: value.value,
                        label: value.label.props.title
                    } : undefined
                };
            }

        },
        updataSelectRow(key) {
            this.dataSetInfo = {
                ...this.dataSetInfo,
                selectRowKey: key
            };
        },
        //根据数据源获取模型对象指标等信息
        getList(type, value, page, callBack) {
            if (this.dataSetInfo.dataSourceType === 'FILE') {
                if (type === 'datasourceId') {
                    if (value && value.value) {
                        this.getModel(value.value, page, callBack);
                    }
                }
                // if (type === 'model') {
                //     this.getObjList(this.dataSetInfo.datasourceId.value, value, page, callBack);
                //     this.getMetricList(this.dataSetInfo.datasourceId.value, this.dataSetInfo.model, [], page, callBack);
                // }
                // if (type === 'obj') {
                //     this.getMetricList(this.dataSetInfo.datasourceId.value, this.dataSetInfo.model, value, page, callBack);
                // }
            } else {
                if (type === 'datasourceId') {
                    this.getLabModelAsync({
                        metricValue: [],
                        modelValue: [],
                        targetValue: []
                    }, page, callBack);
                }
                if (type === 'model') {
                    this.getLabModelAsync({
                        metricValue: [],
                        modelValue: value,
                        targetValue: []
                    }, page, callBack);
                    // this.getLabMetricAsync({
                    //     targetValue: [],
                    //     modelValue: this.dataSetInfo.model,
                    //     metricValue: []
                    // }, page, callBack);
                }
                // if (type === 'obj') {
                //     this.getLabMetricAsync({
                //         targetValue: value,
                //         modelValue: this.dataSetInfo.model,
                //         metricValue: []
                //     }, page, callBack);
                // }
            }
        },
        getListRoot(type, params, page, callBack) {
            const {dataSourceType, dataSourceId, value} = params;
            if (dataSourceType === 'FILE') {
                if (type === 'datasourceId') {
                    if (value && value.value) {
                        this.getModel(value.value, page, callBack);
                    }
                }
                if (type === 'model') {
                    this.getObjList(dataSourceId, value, page, callBack);
                    this.getMetricList(dataSourceId, this.dataSetInfo.model, [], page, callBack);
                }
                if (type === 'obj') {
                    this.getMetricList(dataSourceId, this.dataSetInfo.model, value, page, callBack);
                }
            } else {
                if (type === 'datasourceId') {
                    this.getTaskModelAsync({
                        dataSourceId,
                        metricValue: [],
                        modelValue: [],
                        targetValue: []
                    }, page, callBack);
                }
                if (type === 'model') {
                    this.getTaskTargetAsync({
                        dataSourceId,
                        metricValue: [],
                        modelValue: value,
                        targetValue: []
                    }, page, callBack);
                    this.getTaskMetricAsync({
                        dataSourceId,
                        targetValue: [],
                        modelValue: this.dataSetInfo.model,
                        metricValue: []
                    }, page, callBack);
                }
                if (type === 'obj') {
                    this.getTaskMetricAsync({
                        dataSourceId,
                        targetValue: value,
                        modelValue: this.dataSetInfo.model,
                        metricValue: []
                    }, page, callBack);
                }
            }
        },
        //清空数据设定信息
        deleteDataSetInfo() {
            this.dataSetInfo = {
                taskName: undefined,
                scene: 'anomaly_detection',
                dataSourceType: undefined,
                datasourceId: undefined,
                model: [],
                obj: [],
                method: undefined,
                aggTimeUnit: undefined,
                time: undefined,
                number: undefined,
                description: undefined,
                forecastTimeNumber: undefined,
                forecastTimeUnit: undefined,
                upperThreshold: undefined,
                lowerThreshold: undefined,
                mode: [],
                selectRowKey: [],
                nowDate: 0
            };
            this.dimensionalList = [];
            this.genericityList = [];
            this.dataSourceList = [];
            this.modelList = [];
            this.objList = [];
            this.metricList = [];
            this.tagsList = [];
            this.tagsValueList = [];
        },

        delArithmetic() {
            this.dataSourceList = [];
            this.modelList = [];
            this.objList = [];
            this.metricList = [];
            this.tagsList = [];
            this.tagsValueList = [];
        },
        updateCurrent(current) {
            this.currentPage = current;
        },
        //点击复制拿到当前列表项的数据
        updataCurrentList(list) {
            this.currentList = list;
        },
        setDataSetInfo(params) {
            this.dataSetInfo = {
                ...this.dataSetInfo,
                ...params
            };
        },
        setDimensionalList(params) {
            this.dimensionalList = params;
        },
        delBlurModelList() {
            this.modelList = [];
        },
        delBlurObjList() {
            this.objList = [];
        },
        delMetricList() {
            this.metricList = [];
        },
        setDataSourcePage(param) {
            this.dataSourcePage = {...param};
        },
        setObjPage(param) {
            this.objPage = {...param};
        },
        setModelPage(param) {
            this.modelPage = {...param};
        },
        setMetricPage(param) {
            this.metricPage = {...param};
        },
        updateRootAnalysisList(data, id) {
            const result = [].concat(toJS(this.rootAnalysisList)).map(item => {
                if (item.id === id) {
                    return data;
                }
                return item;
            });
            this.rootAnalysisList = result;
        },
        clearGroupTopoData() {
            this.groupTopoData = [];
        },
        setLaboratoryRecord(data) {
            this.laboratoryRecord = data;
        },
        setSearchHeaderData(data) {
            this.searchHeader = data;
        },
        //标记坐标轴
        setDataZoomCharts(data) {
            this.dataZoomCharts = data;
        },
        setTuningbenchModelObj(data) {
            this.tuningbenchModelObj = {
                pageNum: 0,
                pageSize: 10,
                total: 0,
                content: [],
            };
        },
        setTuningbenchMetricObj(data) {
            this.tuningbenchMetricObj = {
                pageNum: 0,
                pageSize: 10,
                total: 0,
                content: [],
            };
        }
    }
};

export default toMobx(laboratory);