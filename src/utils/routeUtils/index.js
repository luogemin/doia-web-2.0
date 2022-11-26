import cloneDeep from 'lodash-es/cloneDeep';
import navData from '../../routes';

/**
 * 多级路由转为路由数组
 * @param {*} nodeList 
 * @param {*} parentPath 
 */
function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach((node) => {
      const item = node;
      item.path = `${parentPath}/${item.path || ''}`;
      item.path = item.path.replace(/\/+/g, '/');
      item.exact = true;
      if (item.children && !item.component) {
        arr.push(...getPlainNode(item.children, item.path));
      } else {
        if (item.children && item.component) {
          item.exact = false;
        }
        arr.push(item);
      }
    });
    return arr;
}

/**
 * 根据布局获取此布局的路由信息
 * @param {*} path 
 */
export function getRouteData(path) {
    if (!navData.some(item => item.layout === path) ||
        !(navData.filter(item => item.layout === path)[0].children)) {
      return null;
    }
    const dataList = cloneDeep(navData.filter(item => item.layout === path)[0]);
    const nodeList = getPlainNode(dataList.children);
    return nodeList;
}