import {toMobx} from '@chaoswise/cw-mobx';
import {call, all,} from '@/utils/effects';
import {IntlFormatMessage} from "@/utils/util";

import {
    getCKClustersService,
    getCKNodesService,
    getCKNodesByClusterService,
} from '@/services/store';

const store = {

    namespace: 'store',

    state: {
        backTitle: IntlFormatMessage('datasource.create.back'),
    },

    effects: {},

    reducers: {
        setBackTitle(title) {
            this.backTitle = title;
        },
    },
};

export default toMobx(store);
