import {toMobx} from '@chaoswise/cw-mobx';
import {call, all,} from '@/utils/effects';
import {error, success} from "@/utils/tip";
import {resetAlgorithmService} from "@/services/Setting";

const multiTenancy = {

    namespace: 'settingStore',

    state: {
        activeTab: '0',
    },

    effects: {
        * resetAlgorithmAsync(params, callback) {
            const response = yield call(resetAlgorithmService, params);
            callback && callback(response);
        },

    },

    reducers: {
        setActiveTabsReducer(data, callback) {
            this.activeTab = data;
            callback && callback();
        },
    },
};

export default toMobx(multiTenancy);
