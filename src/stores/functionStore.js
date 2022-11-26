import { toMobx } from '@chaoswise/cw-mobx';
import { call } from '@/utils/effects';

import {
    listFunctionService
} from '@/services/function';

const functionStore = {

  namespace: 'functionStore',

  state: {
    list:[]
  },

  effects: {
    /**
     * 获取function列表请求
     */
    * listFunctionAsync(params){
        const response = yield call(listFunctionService,params);
        if(response.status == "success"){
            this.list = response.data || [];
        }
    }
  },

  reducers: {},
};

export default toMobx(functionStore);
