import globalStore from './globalStore';
import dashboardStore from './dashboard'; //概览页
import genericsStore from './AlgorithmicGenerics'; //算法泛型管理
import dataSourceStore from './dataSource'; //数据源管理
import laboratoryStore from './Laboratory'; //算法实验室
import multiTenancyStore from './MultiTenancy';
import selfMonitoringStore from './SelfMonitoring'; //自监控
import taskManagementStore from './TaskManagement';
import settingStore from './Setting';
import functionStore from './functionStore';
import store from './store';
import tagStore from './tagStore'; //标签
import TopoStore from './Topo'; //链路拓扑

const stores = [
    globalStore,
    dashboardStore,
    genericsStore,
    dataSourceStore,
    laboratoryStore,
    multiTenancyStore,
    selfMonitoringStore,
    taskManagementStore,
    settingStore,
    functionStore,
    store,
    tagStore,
    TopoStore,
];

export default stores;
