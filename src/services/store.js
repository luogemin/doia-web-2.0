/*
 * @Author: authur.wang 
 * @Date: 2018-07-18 11:48:53 
 * @Last Modified by: authur.wang
 * @Last Modified time: 2019-03-13 09:45:24
 * @Desc 存储的service层
 */

import API from '@/services/api';
import { fetchGet } from '@/utils/request.js';
import {IntlFormatMessage} from "@/utils/util";

export function getCKClustersService() {
    let url = API.CLICKHOUSE + "/info";
    return fetchGet(url);
}
/* export function getCKClustersService() {
    let url = API.CLICKHOUSE + "/clusters";
    return get(url);
} */

export function getCKNodesService() {
  let url = API.CLICKHOUSE + "/nodes";
  return fetchGet(url);
}

export function getCKNodesByClusterService(clusterName) {
  if(!clusterName){
    return {
      status:"fail",
      msg:IntlFormatMessage('task.common.clusterName')
    };
  }

  let url = API.CLICKHOUSE + "/clusters/" + clusterName;
  return fetchGet(url);
}