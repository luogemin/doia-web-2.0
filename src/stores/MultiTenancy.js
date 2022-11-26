import {toMobx} from '@chaoswise/cw-mobx';
import {call, all,} from '@/utils/effects';
import {
    addMultiTenancyService,
    modifyMultiTenancyService,
    deleteMultiTenancyService,
    getMultiTenancyDetailService,
    searchMultiTenancyService, searchGroupBySceneService
} from "@/services/MultiTenancy";
import {error, success} from "@/utils/tip";
import {IntlFormatMessage} from "@/utils/util";

const multiTenancy = {

    namespace: 'multiTenancyStore',

    state: {
        algorithmList: {},
        list: [],
        current: {},
        pageInfo: {},
        activeTab: '0',
        currentName: null,
    },

    effects: {
        /**
         * 检索数据表列表请求
         */* searchMultiTenancyAsync(params = {}) {
            if (params.tags) {
                params.tags = JSON.stringify(params.tags);
            }
            const response = yield call(searchMultiTenancyService, params);
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
                    this.searchMultiTenancyAsync(Object.assign({}, params, {
                        pageNum: pageNum - 1
                    }));
                }
            }
        },

        * addMultiTenancyAsync(params, callback) {
            const response = yield call(addMultiTenancyService, params);
            callback && callback(response);
        },

        * modifyMultiTenancyAsync(params, callback) {
            const response = yield call(modifyMultiTenancyService, params);
            callback && callback(response);
        },

        * deleteMultiTenancyAsync(params, callback) {
            const response = yield call(deleteMultiTenancyService, params);
            if (response && response.status == "success") {
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.genericityFailed'));
            }
        },

        * getMultiTenancyDetailAsync(params, callback) {
            const response = yield call(getMultiTenancyDetailService, params);
            if (response && response.status == "success") {
                this.current = response.data || {};
                callback && callback(response);
            } else {
                error(response.msg || IntlFormatMessage('task.common.failObtained'));
            }
        },

        * searchGroupBySceneAsync(params, callback) {
            const response = yield call(searchGroupBySceneService, params);
            if (response && response.status == "success") {
                this.algorithmList = Object.assign({}, this.algorithmList, response.data);
                callback && callback(this.algorithmList);
            } else {
                error(response.msg || IntlFormatMessage('task.common.algorithmList'));
            }
        },

    },

    reducers: {
        setActiveTabsReducer(data, callback) {
            this.activeTab = data;
            this.list = [];
            callback && callback();
        },
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
        setListReducer(data, callback) {
            this.list = data;
            callback && callback();
        },
        /**
         * 当前点击的场景和算法
         */
        setCurrentSearchBar(data, callback) {
            const {displayNames = null} = data;
            this.currentName = displayNames;
            callback && callback();
        },
    },
};

export default toMobx(multiTenancy);
