import API from '@/services/api';
import {fetchGet} from '@/utils/request.js';
import { moduleName } from '@/globalConstants';

/**
 * 获取token
 * @param {*} params 
 */
export function getTokenService(withoutToken){
  return fetchGet(API.TOKEN,{
    withoutToken
  });
}

/**
 * 刷新token
 * @param {*} params 
 */
export function refreshTokenService(){
  return fetchGet(API.TOKEN + "/refresh");
}

/**
 * 获取版本
 * @param {*} params 
 */
export function getVersionService(withoutToken){
  return fetchGet("/gateway/doia/api/v1/version/" + moduleName,{
    withoutToken,
    globalDomain:true
  });
}