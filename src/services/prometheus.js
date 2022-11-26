import API from '@/services/api';
import fetch from '@/utils/request.js';

const {
  fetchGet, 
} = fetch;

/**
 * 将请求参数转为prometheus的label条件
 * @param {*} params 
 */
function convertParamsToUrl(params={}){
  let queryParams = [];
  if(params){
    Object.keys(params).forEach((param,index)=>{
      if(/^query(\[\])*$/.test(param)){
        queryParams.push(`${param}=${encodeURIComponent(params[param])}`);
      }else if(/^[start|end|time]$/.test(param)){
        if(typeof params[param] == "number" && params[param].toString().length == 13 ){
          queryParams.push(`${param}=${params[param]}`);
        }
      }else{
        queryParams.push(`${param}=${params[param]}`);
      }
    });
  }

  return queryParams.length ? ("?" + queryParams.join("&")) : "";
}

/**
 * query请求
 * @param {*} params 
 */
export function query(params){
    return fetchGet(API.METRICS + "/query" + convertParamsToUrl(params));
}

/**
 * query_range请求
 * @param {*} params 
 */
export function queryRange(params){
  return fetchGet(API.METRICS + "/query_range" + convertParamsToUrl(params));
}
