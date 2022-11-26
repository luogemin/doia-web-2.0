import { toMobx } from '@chaoswise/cw-mobx';
import { call } from '@/utils/effects';

import {
  addTag,
  searchTags,

} from '@/services/tag';

const tagStore = {

  namespace: 'tagStore',

  state: {
    tagList: [], //标签列表
    page: {}
  },

  effects: {
    //获取标签列表
    * searchTagAsync(params = {}) {
      const response = yield call(searchTags, params);
      if (response && response.status == "success") {
        const { pageSize = 10, totalCount, totalPageCount, currentPageNum = 1, list = [] } = response.data;
        this.tagList = list;
        this.page = {
          pageSize,
          totalCount,
          totalPageCount,
          currentPageNum
        };
      }
    },

    //新建标签
    * addTagAsync(params = {}, callback) {
      const response = yield call(addTag, params);
      if (response && response.status == "success") {
        const tag = response.data;
        if (tag) {
          this.searchTagAsync({
            pageSize: 50
          });
        }
        callback && callback(response.data);
      }
    }
  },

  reducers: {},
};

export default toMobx(tagStore);
