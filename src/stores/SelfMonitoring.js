import {toMobx} from '@chaoswise/cw-mobx';
import {call} from '@/utils/effects';
import {getWorkerListService} from '@/services/SelfMonitoring';


const selfMonitoring = {

    namespace: 'selfMonitoringStore',

    state: {
        workerList: [], //数据存数Worker列表
        workerPage: {} //数据存数Worker列表 分页
    },

    effects: {
        //获取数据存数Worker列表
        * getWorkerListAsync(params = {}) {
            const response = yield call(getWorkerListService, params);
            if (response.status == "success") {
                const {pageSize = 10, totalCount, totalPageCount, currentPageNum = 1, list} = response.data;
                this.workerPage = {
                    pageSize,
                    totalCount,
                    totalPageCount,
                    currentPageNum
                };
            }
        }
    },

    reducers: {},
};

export default toMobx(selfMonitoring);