import {toMobx} from '@chaoswise/cw-mobx';
import {call, all,} from '@/utils/effects';
import {
    addAlgorithmService,
    deleteAlgorithmService,
    getAlgorithmDetailService,
    getRootAlgorithmDetailService,
    publishAlgorithmService,
    searchAlgorithmService,
} from '@/services/AlgorithmicGenerics';
import {message} from "@chaoswise/ui";
import {error} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const algorithmicGenerics = {

    namespace: 'genericsStore',

    state: {
        list: [],
        current: {},
        pageInfo: {},
        activeTab: 1
    },

    effects: {
        /**
         * 检索数据表列表请求
         */* searchAlgorithmAsync(params = {}) {
            if (params.tags) {
                params.tags = JSON.stringify(params.tags);
            }
            const response = yield call(searchAlgorithmService, params);
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
                    this.searchAlgorithmAsync(Object.assign({}, params, {
                        pageNum: pageNum - 1
                    }));
                }
            }
        },

        * addAlgorithmAsync(params, callback) {
            const response = yield call(addAlgorithmService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('laboratory.anomaly.genericityWinFail'));
            }
        },

        * publishAlgorithmAsync(params, callback,err) {
            const response = yield call(publishAlgorithmService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                if(err){
                    return err();
                }
                error(response.msg || IntlFormatMessage('task.common.publishFailed'));
            }
        },

        * deleteAlgorithmAsync(params, callback) {
            const response = yield call(deleteAlgorithmService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.genericityFailed'));
            }
        },

        * getAlgorithmDetailAsync(params, callback) {
            const response = yield call(getAlgorithmDetailService, params);
            if (response && response.status == "success") {
                this.current = response.data || {};
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.genericityFails'));
            }
        },
        //实验室-根因-获取泛型列表
        * getRootAlgorithmDetailAsync(params, callback) {
            const response = yield call(getRootAlgorithmDetailService, params);
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
                    this.searchAlgorithmAsync(Object.assign({}, params, {
                        pageNum: pageNum - 1
                    }));
                }
            }
        },

    },

    reducers: {
        /**
         * 设置tabs页
         */
        setActiveTabsReducer(data, callback) {
            this.activeTab = data;
            this.list = [];
            callback && callback();
        },
    },
};

export default toMobx(algorithmicGenerics);
