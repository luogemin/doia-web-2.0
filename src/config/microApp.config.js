import { registerMicroApps } from 'qiankun';

// fixed ie10下 部署非根路径下 子应用路由匹配失败
const getActiveRule = hash => location => location.hash.startsWith(hash);

registerMicroApps(window.MICRO_CONFIG.map(item => ({...item, activeRule: getActiveRule(item.activeRule)})));
