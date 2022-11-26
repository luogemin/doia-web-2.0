import API from '@/services/api';
import fetch from '@/utils/request.js';
const {
  fetchGet,
  fetchPut,
  fetchDelete,
  fetchPost,
} = fetch;

// 获取列表
export const resetAlgorithmService = (params = {}) => {
  return fetchPost(API.RESETALGORITHM_API, {
    body: params
  });
};