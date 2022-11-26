import API from '@/services/api';
import fetch from '@/utils/request.js';
const {
  fetchGet,
  fetchPut,
  fetchDelete,
  fetchPost,
} = fetch;

// 获取列表
export const searchMultiTenancyService = (params = {}) => {
  return fetchPost(API.MULTITENANCY_API, {
    body: params
  });
};

// 添加列表
export const addMultiTenancyService = (params = {}) => {
  return fetchPost(API.MULTITENANCY_ADD_API, {
    body: params
  });
};

// 编辑列表
export const modifyMultiTenancyService = (params = {}) => {
  return fetchPost(API.MULTITENANCY_MODIFY_API, {
    body: params
  });
};

//删除
export function deleteMultiTenancyService(params = {}) {
  let {id, force = false} = params;

  let url = API.MULTITENANCY_DELETE_API + "/" + id;
  //是否强制删除
  if (force) {
    url = url + "?force=true";
  }
  return fetchGet(url);
}

//获取详情
export function getMultiTenancyDetailService(id) {
  return fetchGet(API.MULTITENANCY_DETAIL_API + '/' + id);
}

// 按场景获取算法列表
export const searchGroupBySceneService = (params = {}) => {
  return fetchPost(API.MULTITENANCY_GROUPBYSCENE_API, {
    body: params
  });
};