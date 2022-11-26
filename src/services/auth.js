import {
  fetchGet,
  fetchPost
} from '@/utils/request.js';
import { isDev } from '@/globalConstants';

// 获取多租户列表
export const getDemoApi = () => {
  return fetchGet('/get/list');
};

//访问gateway获取权限
export const getAuthApi = () => {
  let url = '';
  if (isDev) { //如果是开发环境，不走网关和douc，走mock接口
    url = '/get/auth';
  } else {
    //解决ie兼容性问题
    const apiDomain = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    url = `${apiDomain}/gateway/api/v1/auth?module=${window.DOIA_CONFIG.gateWayModule}`;
  }
  return fetchGet(url);

};

//获取nacos配置
export const getNacosConfig = () => {
  let url = `${window.location.origin}${window.DOIA_CONFIG.nacosApi}`;
  return fetchGet(url);
};

//从douc获取标签页icon信息
export const getDoucIcon = () => {
  let url = `${window.location.origin}${window.DOIA_CONFIG.doucApi}`;
  return fetchPost(url, {
    body: {
      type: "3",
      version: ""
    }
  });
};