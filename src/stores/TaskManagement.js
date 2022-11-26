import {toJS, toMobx} from '@chaoswise/cw-mobx';
import {call} from '@/utils/effects';
import {omit} from "lodash-es";
import {
    addTaskService,
    deleteTaskService,
    getTaskDetailService,
    stopTaskService,
    searchTaskService,
    startTaskService,
    postTaskNameService,
    getTaskSceneService,
    modifyTaskService,
    getTaskDetailGenericsService,
    modifyTaskGenericsService,
    searchTaskDetailListService,
    searchTaskInfoDetailService,
    searchTaskInfoDetailTimeListService,
    searchTaskInfoChartsListService,
    searchChartsInfoService,
    addContrastChartService,
    heartBeatingService,
    getTaskModelService,
    getTaskTargetService,
    getTaskMetricService,
    getTaskTagsService,
    searchTaskInfoDetailAnotherTimeListService,
    searchChartsRawDataInfoService,
    searchModelListService, getTaskParamsService
    ,getTagsValueService,getTagsKeysService
} from "@/services/TaskManagement";
import {error} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const taskManagement = {

    namespace: 'taskManagementStore',

    state: {
        list: [],
        sceneList: [],
        listParams: {
            modelListParam: {},
            targetListParam: {},
            metricListParam: {},
        },
        modelList: {pageNum: 1, content: []},
        targetList: {pageNum: 1, content: []},
        metricList: {pageNum: 1, content: []},
        tagsList: [],
        tagsValueList:[],
        current: {},
        pageInfo: {},
        taskList: [],
        taskModelList: {},
        taskInfoList: [],
        taskTimeList: {
            content: []
        },
        taskChartsList: [],
        ifCanEdit: true,
        currentDetailInfo: {},
        ifEditTaskName: false,
    },

    effects: {
        /**
         * 检索数据表列表请求
         */* searchTaskAsync(params = {}) {
            if (params.tags) {
                params.tags = JSON.stringify(params.tags);
            }
            const response = yield call(searchTaskService, params);
            if (response && response.status === "success") {
                const {pageSize = 10, totalSize = 0, totalPages = 0, pageNum = 1, content = []} = response.data || {};
                // const sourceList = dataStoreMapper.mapDataStoreList(response.data.content);
                this.list = content;
                this.pageInfo = {
                    pageSize,
                    totalSize,
                    totalPages,
                    pageNum
                };

                if (!content.length && pageNum > 1) {
                    this.searchTaskAsync(Object.assign({}, params, {
                        pageNum: pageNum - 1
                    }));
                }
            } else {
                this.list = [];
            }
        },
        // 新建
        * addTaskAsync(params, callback) {
            const response = yield call(addTaskService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.creationCopyFailed'));
            }
        },
        // 编辑基本信息
        * modifyTaskAsync(params, callback) {
            const response = yield call(modifyTaskService, params);
            if (response && response.status == "success") {
                this.current = Object.assign({}, this.current, response.data || {});
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('laboratory.anomaly.taskFailsEdited'));
            }
        },
        // 编辑算法选择
        * modifyTaskGenericsAsync(params, callback) {
            const response = yield call(modifyTaskGenericsService, params);
            if (response && response.status == "success") {
                this.current = Object.assign({}, this.current, response.data || {});
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('laboratory.anomaly.taskFailsEdited'));
            }
        },
        // 启动停止
        * startAndStopTaskAsync(params, callback) {
            let response = {};
            if (params.target) {
                response = yield call(stopTaskService, omit(params, 'target'));
            } else {
                response = yield call(startTaskService, omit(params, 'target'));
            }
            // if (response && response.status == "success") {
            callback && callback(response);
            // } else {
            //     error(response.msg);
            // }
        },
        // 删除任务
        * deleteTaskAsync(params, callback) {
            const response = yield call(deleteTaskService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('laboratory.anomaly.taskDeletedFails'));
            }
        },
        // 获取基本信息详情
        * getTaskDetailAsync(params, callback, ifGetTaskDetailGenerics = true) {
            const response = yield call(getTaskDetailService, params);
            if (response && response.status == "success") {
                this.current = response.data || {};
                ifGetTaskDetailGenerics && this.getTaskDetailGenericsAsync(params);
                callback && callback(response.data);
            } else {
                error(response.msg || IntlFormatMessage('task.common.detailsFails'));
            }
        },
        // 获取算法选择详情
        * getTaskDetailGenericsAsync(params, callback) {
            const response = yield call(getTaskDetailGenericsService, params);
            if (response && response.status == "success") {
                this.current = Object.assign({}, this.current, {taskAlgorithms: response.data || []});
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.detailsFails'));
            }
        },
        // 检测重名
        * postTaskNameAsync(params, callback) {
            const response = yield call(postTaskNameService, params);
            if (response && !!response.data) {
                error(IntlFormatMessage('laboratory.anomaly.taskDuplicated'));
                callback && callback(response);
            }
        },
        // 获取任务场景
        * getTaskSceneAsync(params, callback) {
            const response = yield call(getTaskSceneService, params);
            if (response && response.status == "success") {
                this.sceneList = response.data || [];
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.scenarioFails'));
                this.sceneList = [];
            }
        },
        // 获取任务模型
        * getTaskModelAsync(params = {}, callback) {
            const {query = {}} = params;
            if (query.dataSourceId) {
                const response = yield call(getTaskModelService, params);
                if (response && response.status == "success") {
                    if (response.data.existenceMapping) {
                        const {modelFilter = {}} = params;
                        const {result = {},} = response.data;
                        const {pageNum = 1} = result;
                        let list = (pageNum === 1 || Object.keys(modelFilter).length > 0) ? [] : (this.modelList.content || []);
                        list = list.concat(result.content).filter(i => !!i);
                        this.modelList = Object.assign({}, Object.assign({}, result, {
                            pageNum: pageNum + 1,
                        }), {
                            content: list
                        });
                    } else {
                        this.modelList = {pageNum: 1, content: []};
                    }
                    callback && callback(response);
                } else {
                    error(response.msg || IntlFormatMessage('task.common.typeFails'));
                    this.modelList = {pageNum: 1, content: []};
                }
            }
        },
        // 获取任务对象
        * getTaskTargetAsync(params = {}, callback) {
            const {query = {}} = params;
            if (query.dataSourceId) {
                const response = yield call(getTaskTargetService, params);
                if (response && response.status == "success") {
                    if (response.data.existenceMapping) {
                        const {targetFilter = {}} = params;
                        const {result = {},} = response.data;
                        const {pageNum = 1} = result;
                        let list = (pageNum === 1 || Object.keys(targetFilter).length > 0) ? [] : (this.targetList.content || []);
                        list = list.concat(result.content).filter(i => !!i);
                        this.targetList = Object.assign({}, Object.assign({}, result, {
                            pageNum: pageNum + 1,
                        }), {
                            content: list
                        });
                    } else {
                        this.targetList = {pageNum: 1, content: []};
                    }
                    callback && callback(response);
                } else {
                    error(response.msg || IntlFormatMessage('task.common.objectFails'));
                    this.targetList = {pageNum: 1, content: []};
                }
            }
        },
        // 获取任务指标
        * getTaskMetricAsync(params = {}, callback) {
            const {query = {}} = params;
            if (query.dataSourceId) {
                const response = yield call(getTaskMetricService, params);
                if (response && response.status == "success") {
                    if (response.data.existenceMapping) {
                        const {metricFilter = {}} = params;
                        const {result = {},} = response.data;
                        const {pageNum = 1} = result;
                        let list = (pageNum === 1 || Object.keys(metricFilter).length > 0) ? [] : (this.metricList.content || []);
                        list = list.concat(result.content).filter(i => !!i);
                        this.metricList = Object.assign({}, Object.assign({}, result, {
                            pageNum: pageNum + 1,
                        }), {
                            content: list
                        });
                    } else {
                        this.metricList = {pageNum: 1, content: []};
                    }
                    callback && callback(response);
                } else {
                    error(response.msg || "获取任务指标失败!");
                    this.metricList = {pageNum: 1, content: []};
                }
            }
        },
        // 获取任务维度
        * getTaskTagsAsync(params, callback) {
            const response = yield call(getTaskTagsService, params);
            if (response && response.status === "success") {
                if (response?.data?.existenceMapping) {
                    this.tagsList = (response?.data?.result?.content || {}).reduce((prev, cent) => {
                        return Object.assign({}, prev, cent);
                    }, {});
                } else {
                    this.tagsList = [];
                }
                callback && callback(response);
            } else {
                error(response.msg || "获取任务指标失败!");
                this.tagsList = [];
                callback && callback(response);
            }
        },
        // 详情页-列表
        * searchTaskDetailListAsync(params, callback) {
            const response = yield call(searchTaskDetailListService, params);
            if (response && response.status === "success") {
                const {content = null} = response.data;
                if (content) {
                    this.taskList = content;
                } else {
                    this.taskList = [];
                }
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.detailsFails'));
                this.taskList = [];
            }
        },
        // 详情页-筛选模型指标下拉
        * searchModelListAsync(params, callback) {
            const response = yield call(searchModelListService, params);
            if (response && response.status == "success") {
                this.taskModelList = response.data || {};
                callback && callback(response);
            } else {
                this.taskModelList = {};
                error(response.msg || IntlFormatMessage('task.common.queriedFailed'));
                callback && callback(response);
            }
        },
        // 详情页-信息
        * searchTaskInfoDetailAsync(params, callback) {
            const response = yield call(searchTaskInfoDetailService, params);
            if (response && response.status == "success") {
                this.taskInfoList = response.data || [];
            } else {
                error(response.msg || IntlFormatMessage('task.common.detailsFails'));
                this.taskInfoList = [];
            }
            callback && callback(response);
        },
        // 详情页-时间段列表
        * searchTaskInfoDetailTimeListAsync(params, callback) {
            const response = yield call(searchTaskInfoDetailTimeListService, params);
            if (response && response.status == "success") {
                const {content = []} = response.data;
                if (content.length) {
                    const {pageNum = 1} = response.data;
                    let list = pageNum === 1 ? [] : (this.taskTimeList.content || []);
                    list = list.concat(content).filter(i => !!i);
                    this.taskTimeList = Object.assign({}, Object.assign({}, response.data, {
                        pageNum: pageNum + 1,
                    }), {
                        content: list
                    });
                    callback && callback(content);
                } else {
                    this.searchTaskInfoDetailAnotherTimeListAsync(params.query.taskId, callback);
                }
            } else {
                error(response.msg || IntlFormatMessage('task.common.trainingTimeFails'));
                this.searchTaskInfoDetailAnotherTimeListAsync({
                    taskId: params.query.taskId,
                }, callback);
            }
        },
        // 详情页-时间段列表没有时，拉取另一个时间段
        * searchTaskInfoDetailAnotherTimeListAsync(taskId, callback) {
            const response = yield call(searchTaskInfoDetailAnotherTimeListService, taskId);
            if (response && response.status == "success") {
                this.taskTimeList = {
                    content: [Object.assign({}, {
                        taskTriggerTime: 'undefined'
                    }, response.data)] || [],
                    pageNum: 1,
                    pageSize: 100,
                    totalPages: 1,
                    totalSize: 1,
                };

                callback && callback([Object.assign({}, {
                    taskTriggerTime: 'undefined'
                }, response.data)] || []);
            } else {
                error(response.msg || IntlFormatMessage('task.common.trainingTimeFails'));
                this.taskTimeList = {pageNum: 1, content: []};
                callback && callback();
            }
        },
        // 详情页-图表列表
        * searchTaskInfoChartsListAsync(params, callback) {
            const response = yield call(searchTaskInfoChartsListService, params);
            if (response && response.status == "success") {
                callback && callback(response.data);
            } else {
                error(response.msg || IntlFormatMessage('task.common.objectTypeList'));
            }
        },

        // 详情页-算法数据
        * searchChartsInfoAsync(params, callback) {
            const {content = [], ...rest} = params;
            const response = yield call(searchChartsInfoService, rest);
            if (response && response.status == "success") {
                const {taskSeriesResult = [], seriesData = []} = response.data;
                let result = [].concat(toJS(this.taskChartsList));
                if (taskSeriesResult.length) {
                    result = result.concat(taskSeriesResult.map((item, index) => {
                        const {tuningBenchResult = {}} = item;
                        const {status = '', message = ''} = tuningBenchResult || {};
                        const obj2 = (tuningBenchResult.data && Object.keys(tuningBenchResult.data).length) ?
                            tuningBenchResult
                            : {
                                data: (!!seriesData && seriesData.length) ? {seriesData: seriesData} : {},
                                status: status ? status : '',
                                message: message ? message : '',
                            };
                        return Object.assign({}, obj2, {
                            ...content[index]
                        });
                    }));
                } else {
                    result = params.genericIndexs.map(item => {
                        return {
                            data: seriesData.length ? {seriesData: seriesData} : {},
                            status: (!!seriesData && seriesData.length) ? '' : 'nodata',
                            message: '',
                        };
                    });
                }
                this.taskChartsList = result || [];
                callback && callback(result.length);
            } else {
                error(response.msg || "获取数据失败!");
                // this.taskChartsList = [];
                callback && callback(0);
            }
        },

        // 详情页-原始数据
        * searchChartsRawDataInfoAsync(params, callback) {
            const response = yield call(searchChartsRawDataInfoService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.rawDataFails'));
            }
        },

        // 详情页-算法数据-心跳监听
        * heartBeatingAsync(params, callback) {
            const response = yield call(heartBeatingService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.heartbeat'));
            }
        },

        // 详情页-新建对比模型
        * addContrastChartAsync(params, callback) {
            const response = yield call(addContrastChartService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.contrastiveFails'));
                callback && callback(response);
            }
        },

        //新建对比模型时，获取任务级别参数
        * getTaskParamsAsync(id, callback) {
            const res = yield call(getTaskParamsService, id);
            if (res && res.code === 100000) {
                callback && callback(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.timeFails'));
            }
        },
        //根据模型对象,指标获取维度
        * getTagsKeysAsync(params, callBack) {
            // const time = toJS(this.dataSetInfo.time);
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
        * getTagsValueAsync(params,callBack) {
            // const time = toJS(this.dataSetInfo.time);
            const res = yield call(getTagsValueService,params);
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

    },

    reducers: {
        /**
         * 清空current
         */
        clearCurrentReducer(data, callback) {
            this.current = {};
            callback && callback();
        },
        /**
         * 设置list
         */
        setListReducer(data = [], callback) {
            this.list = data;
            callback && callback();
        },
        /**
         * 设置current
         */
        setCurrentReducer(data = {}, callback) {
            this.current = data;
            callback && callback();
        },
        /**
         * 设置是否能编辑
         */
        setIfCanEditReducer(data, callback) {
            this.ifCanEdit = data;
            callback && callback();
        },
        /**
         * 设置详情列表参数
         */
        setCurrentDetailInfoReducer(data, callback) {
            this.currentDetailInfo = data;
            callback && callback();
        },
        /**
         * 设置指标列表
         */
        setTaskListReducer(data = [], callback) {
            this.taskList = data;
            callback && callback();
        },
        /**
         * 设置详情-模型指标列表
         */
        setTaskInfoListReducer(data = [], callback) {
            this.taskInfoList = data;
            callback && callback();
        },
        /**
         * 设置详情-模型指标-时间段列表
         */
        setTaskTimeListReducer(data = [], callback) {
            this.taskTimeList = data;
            callback && callback();
        },
        /**
         * 设置详情-模型指标-时间段列表
         */
        setTaskChartsListReducer(data = [], callback) {
            this.taskChartsList = data;
            callback && callback();
        },
        /**
         * 设置详情-模型指标-时间段列表
         */
        setFilterListReducer() {
            this.modelList = {pageNum: 1, content: []};
            this.targetList = {pageNum: 1, content: []};
            this.metricList = {pageNum: 1, content: []};
            this.tagsList = [];
        },
        /**
         * 复制任务-名称是否已修改
         */
        setIfEditTaskName(bool) {
            this.ifEditTaskName = bool;
        },
        /**
         * 统一设置模型对象指标的参数
         */
        setListParams(value) {
            this.listParams = Object.assign({}, this.listParams, value);
        },
        setTaskModelList(data) {
            this.taskModelList = data;
        }
    },
};

export default toMobx(taskManagement);
