module.exports = {
    loadingComponent: '@/components/Loading', // 路由按需加载 loading组件
    noAuthShow: '@/components/NoAuth', // 无权限展示效果
    routes: [
        {
            path: '/404', // 路径
            name: '404错误页面',
            exact: true, // 是否精确匹配
            dynamic: false, // 是否懒加载
            component: '@/pages/Error',
        },
        {
            path: '/',
            component: '@/layouts/BasicLayout',
            dynamic: false,
            routes: [
                {
                    userDefinedIcon: 'dashboard',
                    name: '概览',
                    path: '/dashboard',
                    component: '@/pages/Dashboard',
                    intlId: 'dashboard.name',
                },
                {
                    userDefinedIcon: 'generics',
                    name: '算法泛型管理',
                    path: '/generics',
                    component: '@/pages/AlgorithmicGenerics',
                    intlId: 'generics.name',
                },
                {
                    userDefinedIcon: 'datasource',
                    name: '数据源管理',
                    path: '/datasource',
                    component: '@/pages/DataSource',
                    intlId: 'datasource.name',
                },
                {
                    userDefinedIcon: 'laboratory',
                    name: '算法实验室',
                    path: '/laboratory',
                    component: '@/pages/Laboratory',
                    intlId: 'laboratory.name',
                },
                {
                    userDefinedIcon: 'task',
                    name: '任务管理',
                    path: '/task',
                    component: '@/pages/TaskManagement',
                    intlId: 'task.name',
                    routes: [
                        {
                            hideInMenu: false,
                            userDefinedIcon: 'single',
                            name: '单指标异常检测',
                            path: '/task/anomaly_detection',
                            component: '@/pages/TaskManagement',
                            intlId: 'task.anomaly.name',
                        },
                        {
                            userDefinedIcon: 'capacity',
                            name: '单指标预测',
                            path: '/task/forecasting',
                            component: '@/pages/TaskManagement',
                            intlId: 'task.single.name',
                        }
                    ]
                },
                {
                    userDefinedIcon: 'multitenancy',
                    name: '场景管理',
                    path: '/multitenancy',
                    component: '@/pages/MultiTenancy',
                    intlId: 'multitenancy.name',
                },
                {
                    userDefinedIcon: 'setting',
                    name: '设置',
                    path: '/setting',
                    component: '@/pages/Setting',
                    intlId: 'setting.name',
                },
                {from: '/', to: '/dashboard'}
            ]
        }
    ]
};
