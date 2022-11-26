import {toMobx} from '@chaoswise/cw-mobx';
import {call, all,} from '@/utils/effects';
import {error, success} from "@/utils/tip";
import {resetAlgorithmService} from "@/services/Setting";

const multiTenancy = {

    namespace: 'TopoStore',

    state: {
        selectedNode: [],
        selectedCallChainId: '',
        lineType: 'polyline', //line,polyline,cubic,arc
    },

    effects: {
        * resetAlgorithmAsync(params, callback) {
            const response = yield call(resetAlgorithmService, params);
            callback && callback(response);
        },

    },

    reducers: {
        setSelectedNode(data, callback) {
            this.selectedNode = data;
            callback && callback();
        },
        setSelectedCallChainId(data, callback) {
            this.selectedCallChainId = data;
            callback && callback();
        },
        setLineTypeReducer(data = 'polyline') {
            this.lineType = data;
        },
    },
};

export default toMobx(multiTenancy);
