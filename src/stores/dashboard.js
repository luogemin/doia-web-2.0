import {toMobx} from '@chaoswise/cw-mobx';
import {call, all} from '@/utils/effects';
import {
    getAlgorithmListService
} from '@/services/dashboard';
import {searchGroupBySceneService} from "@/services/MultiTenancy";

const dashboardStore = {

    namespace: 'dashboardStore',

    state: {
        dashboard: [],
        list: [],
        page: {},
        currentScene: undefined,
        currentAlgorithm: undefined,
        currentAlgorithmVersion: undefined,
        currentDisplayName: undefined,
        algorithmInfo: {},
    },

    effects: {
        //获取概览算法数量
        * getGroupBySceneAsync(params) {
            const response = yield call(searchGroupBySceneService, params);
            if (response && response.status === "success" && response.data) {
                const result = Object.entries(response.data).map(item => {
                    const {displayNames} = item[1];
                    return Object.assign({}, item[1], {
                        title: displayNames,
                        type: item[1].name,
                    });
                });
                this.dashboard = result;
                window.DOIA_CONFIG.dataSceneTypeList = result;
            }
        },
        //获取场景内的算法列表
        * getListAsync(params) {
            const response = yield call(getAlgorithmListService, params);
            if (response && response.status === "success") {
                this.list = response.data;
            }
        },

    },

    reducers: {
        /**
         * 清空列表
         */
        clearListData(callback) {
            this.list = [];
            callback && callback();
        },
        /**
         * 当前点击的场景和算法
         */
        setCurrentScene(data, callback) {
            const {scene, algorithm, version, displayName} = data;
            this.currentScene = scene;
            this.currentAlgorithm = algorithm;
            this.currentAlgorithmVersion = version;
            this.currentDisplayName = displayName;
            callback && callback();
        },
        /**
         * 算法详情
         */
        setCurrentAlgorithm(data = {}) {
            this.algorithmInfo = data;
        }
    },
};

export default toMobx(dashboardStore);