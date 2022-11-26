import {toMobx} from '@chaoswise/cw-mobx';
import {call, all,} from '@/utils/effects';
import {error} from "@/utils/tip";
import {connect, toJS} from '@chaoswise/cw-mobx';
import {debounce, isEmpty, omit} from "lodash-es";
import {
    datasourceAdd,
    addTAg,
    getTagList,
    getDodbDataList,
    getDataSourceList,
    delDataSourceList,
    getDataSourceDetail,
    addFileDataSource,
    modifyDataSourceBasic,
    modifyDataSourceData,
    getSchemList,
    getSchemListByTableTypeService,
    getCsvHeaderService
} from '@/services/dataSource';
import {IntlFormatMessage} from "@/utils/util";


const dataSource = {

    namespace: 'dataSourceStore',

    state: {
        basicData: {
            dataSourceName: undefined,
            dataSourceTags: [],
            dataSourceDes: undefined
        }, //kafka基本信息
        linkData: {
            dataSourceServer: undefined,
            topicName: undefined,
            infoInit: 'a',
            pollRecords: undefined
        }, //kafka链接信息
        filedSetData: {
            model: undefined,
            objName: undefined,
            targetName: undefined,
            time: undefined,
            targetValue: undefined,
            dimension: undefined
        }, //kafka字段设置
        offBasicData: {
            type: 'DODB',
            dataType: 'TIME_SERIES',
            dataSourceName: undefined,
            dataSourceTags: [],
            dataSourceDes: undefined
        }, //离线基本信息
        offFiledSetData: {
            pageInfo: {
                pageNum: 1,
                pageSize: 100,
                total: 0
            },
            type: 'TIME_SERIES',
            chart: undefined,
            model: undefined,
            objName: undefined,
            targetName: undefined,
            time: undefined,
            targetValue: undefined,
            dimension: undefined,
            fromModel: undefined,
            fromTarget: undefined,
            toModel: undefined,
            toTarget: undefined,
            relationship: undefined,
        },//离线字段设置
        tags: [],
        type: "DODB",
        mapperType: {},
        dodbList: [],
        totalCount: 0,
        dataSourceList: [],
        pageInfo: {},
        sourceSchemaConf: {},
        searchHeaderObj: {
            type: null,
            state: null,
            name: null,
        },
        addList: [],
    },

    effects: {
        //获取数据源列表
        * getDataSourceList(params) {
            const res = yield call(getDataSourceList, params);
            if (res.code && res.code === 100000) {
                const resp = res.data;
                const {
                    pageNum = 1,
                    pageSize = 10,
                    totalPages = 0,
                    totalSize = 0
                } = res.data || {};
                this.dataSourceList = resp.content.map(item => {
                    return {
                        ...item,
                        name: item.name,
                        source: item.type,
                        chart: item.dataType,
                        tags: item.dataTags,
                        description: item.description,
                    };
                });
                this.totalCount = resp.totalSize;
                this.pageInfo = {
                    pageNum,
                    pageSize,
                    totalPages,
                    totalSize
                };
                if (!resp.content.length && pageNum > 1) {
                    this.getDataSourceList(Object.assign({}, params, {
                        pageNum: pageNum - 1
                    }));
                }
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //数据源基本信息页面新建标签
        * basicInfoAddTage(params, {cb}) {
            const res = yield call(addTAg, {
                name: params
            });
            if (res.code && res.code === 100000) {
                const resp = res.data;
                this.tags = this.tags.concat({
                    id: resp.id,
                    name: resp.name
                });
                cb && cb(resp.id);
            } else {
                error(res.msg || IntlFormatMessage('task.common.createFailed'));
            }
        },
        //新建数据源
        * addDataSource({cb, err}) {
            const {
                type, chart = {}, model, metric,
                target, tags, time, value, fromModel, fromTarget, toModel, toTarget, relationship,
                originLog, message, grok, host, loglevel, source,
            } = this.offFiledSetData;

            const params = {
                name: this.offBasicData.dataSourceName,
                description: this.offBasicData.dataSourceDes || null,
                dataTags: (this.offBasicData.dataSourceTags || []).map(item => {
                    return {
                        id: item
                    };
                }),
                type: this.offBasicData.type,
                dataType: type,
                sourceConfig: {
                    type: this.offBasicData.type,
                    dataStoreId: chart.value || null,
                },
            };
            const res = yield call(datasourceAdd, Object.assign({}, params, {
                fieldConfig: type === 'TIME_SERIES' ?
                    {
                        type,
                        model,
                        metric,
                        target,
                        tags,
                        time,
                        value,
                    } : type === 'LOG' ? {
                        type, time, originLog, message, grok, host, loglevel, source,
                        extendFields: toJS(this.addList)
                    } : {
                        type, fromModel, fromTarget, toModel, toTarget, relationship,
                    }
            }));
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                err && err();
                error(res.msg || IntlFormatMessage('task.common.createTwoFailed'));
            }
        },
        //数据源信息页面请求标签下拉框信息
        * getTagsInfo() {
            const res = yield call(getTagList, {
                pageNum: 0,
                pageSize: 0
            });
            if (res.code && res.code === 100000) {
                const resp = res.data;
                this.tags = (resp.content || []).map(item => {
                    return {
                        id: item.id,
                        name: item.name
                    };
                });
            } else {
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        //获取dodb数据表
        * getDodbDataList(params, callBack, searchValue) {
            let newParams = {...params};
            if (searchValue || searchValue === '') {
                newParams = {
                    ...newParams,
                    query: {
                        dataStoreName: searchValue
                    }
                };
            }
            const {pageNum} = newParams;
            const res = yield call(getDodbDataList, newParams);
            if (res.code && res.code === 100000) {
                if (pageNum && pageNum === 1) {
                    this.dodbList = [];
                }
                const resp = res.data;
                this.dodbList = this.dodbList.concat(resp.list || []);
                this.offFiledSetData = {
                    ...this.offFiledSetData,
                    pageInfo: {
                        pageNum: resp.currentPageNo + 1,
                        pageSize: resp.pageSize,
                        total: resp.totalCount
                    }
                };
                callBack && callBack(resp);
            } else {
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        //根据数据表获取schem列表
        * getSchemList(id, {cb}) {
            const res = yield call(getSchemList, id);
            if (res.code && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //根据数据表类型获取schem列表
        * getSchemListByTableType(id, {cb}) {
            const res = yield call(getSchemListByTableTypeService, id);
            if (res.code && res.code === 100000) {
                cb && cb(res);
            } else {
                error(res.msg || IntlFormatMessage('task.common.obtainedFailed'));
            }
        },
        //删除数据表
        * delDataSourceList(id, {cb}) {
            const res = yield call(delDataSourceList, id);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.deletionFailed'));
            }
        },
        //获取数据源详情
        * getDataSourceDetail(id, {cb}) {
            const res = yield call(getDataSourceDetail, id);
            if (res.code && res.code === 100000) {
                const {id, type, name, dataTags = [], description, ...rest} = res.data;
                this.offBasicData = Object.assign({}, this.offBasicData, {
                    dataSourceName: name,
                    dataSourceTags: dataTags,
                    dataSourceDes: description,
                    id, type,
                    dataType: rest.dataType,
                    ...rest.sourceConfig,
                    ...((!!rest.fieldConfigDisplay && Object.keys(rest.fieldConfigDisplay).length) ? omit(rest.fieldConfigDisplay, 'type') : omit(rest.fieldConfig, 'type')),
                });
                this.offFiledSetData = Object.assign({}, this.offFiledSetData, {
                    chart: {
                        value: ((!!rest.sourceConfig.dataStoreId || rest.sourceConfig.dataStoreId === 0) ?
                            rest.sourceConfig.dataStoreId : rest.sourceConfig.dataSourceId),
                        label: (rest.sourceConfig.dataStoreName || rest.sourceConfig.tableName)
                    },
                    ...((!!rest.fieldConfigDisplay && Object.keys(rest.fieldConfigDisplay).length) ? rest.fieldConfigDisplay : rest.fieldConfig),
                });
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.dataFails'));
            }
        },
        //创建文件数据源
        * addFileDataSource({
                                params = {}, file, cb, err = () => {
            }
                            }) {
            const res = yield call(addFileDataSource, {
                params,
                file
            });
            if (res.code && res.code === 100000) {
                cb && cb(res.data);
            } else {
                error(res.msg || IntlFormatMessage('task.common.creationFailed'));
                err && err();
            }
        },
        //编辑数据源基本信息
        * modifyDataSourceBasic(id, params, {cb}) {
            const res = yield call(modifyDataSourceBasic, id, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.editFailed'));
            }
        },
        //编辑数据源字段信息
        * modifyDataSourceData(id, params, {cb}) {
            const res = yield call(modifyDataSourceData, id, params);
            if (res.code && res.code === 100000) {
                cb && cb();
            } else {
                error(res.msg || IntlFormatMessage('task.common.editFailed'));
            }
        }
    },

    reducers: {
        //更新kafka数据源的基本信息
        updateBasicInfo(type, info) {
            let newBasicInfo = {
                ...this.basicData,
                [type]: info
            };
            this.basicData = newBasicInfo;
        },
        //更新kafka数据源的链接信息
        updateLinkInfo(type, info) {
            let newLinkInfo = {
                ...this.linkData,
                [type]: info
            };
            this.linkData = newLinkInfo;
        },
        //更新kafka数据源的字段设置
        updateFiledSetInfo(type, info) {
            let newFiledSetInfo = {
                ...this.filedSetData,
                [type]: info
            };
            this.filedSetData = newFiledSetInfo;
        },
        //清除新建kafka数据源的信息
        deleteDataSourceInfo() {
            this.basicData = {
                dataSourceName: undefined,
                dataSourceTags: [],
                dataSourceDes: undefined
            };
            this.linkData = {
                dataSourceServer: undefined,
                topicName: undefined,
                infoInit: 'a',
                pollRecords: undefined
            };
            this.filedSetData = {
                model: undefined,
                objName: undefined,
                targetName: undefined,
                time: undefined,
                targetValue: undefined,
                dimension: undefined
            };
            this.mapperType = {};
        },
        //更新离线数据源的基本信息
        updateOffBasicInfo(type, info) {
            let newOffBasicData = {
                ...this.offBasicData,
                [type]: info
            };
            this.offBasicData = newOffBasicData;
        },
        //更新离线数据源的字段设置
        updateOffFiledInfo(type, info, item) {
            let newOffFiledData = {
                ...this.offFiledSetData,
                [type]: (type === 'chart' && !!info && !!Object.keys(info).length) ? {
                    value: info.value,
                    label: info.label.props.title
                } : info
            };
            this.offFiledSetData = newOffFiledData;
            if (type === 'chart') {
                this.offFiledSetData = {
                    ...this.offFiledSetData,
                    model: undefined,
                    objName: undefined,
                    targetName: undefined,
                    time: undefined,
                    targetValue: undefined,
                    dimension: undefined,
                };
            }

        },
        //清空离线数据源的信息
        deleteDataSourceOffInfo() {
            this.offBasicData = {
                dataSourceName: undefined,
                dataSourceTags: [],
                dataSourceDes: undefined
            };
            this.offFiledSetData = {
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100,
                    total: 0
                },
                type: 'TIME_SERIES',
                chart: undefined,
                model: undefined,
                objName: undefined,
                targetName: undefined,
                time: undefined,
                targetValue: undefined,
                dimension: undefined
            };
            this.sourceSchemaConf = {};
            this.dodbList = [];
        },
        //更新点击数据源名称进入编辑页面的数据源类型，是kafka还是离线
        updateType(type) {
            this.type = type;
        },
        changeMapperType(id, name) {
            this.mapperType[id] = name;
        },
        updateSourceSchemaConf(res) {
            this.sourceSchemaConf = {...res};
        },
        updateAddList(data) {
            this.addList = data;
        },
        setSearchHeaderObj(data) {
            this.searchHeaderObj = data;
        }
    },
};

export default toMobx(dataSource);
