window.DOIA_CONFIG = (function () {
    return {
        basename: '/doia', // 路由统一前缀，注册为微服务后必须有唯一值
        IP: '', // 后端服务IP地址
        gateWayModule: "/gateway/doia",  //对接gateway，认证接口可配置项
        // gateWayModule: "",  //对接gateway，认证接口可配置项
        nacosDomain: '/gateway/portal/api/v1/webConfig?productNo=doia',   //访问nacos的接口
        doucApi: '/gateway/douc/api/v1/logo/getLogo',   //访问douc的接口
        dataSceneTypeList: [],
        timeRangeOffset: 24,
        logAnalysisSameNum: '5',
        ifCheckNacos: false, //是否检测nacos
    }
})();
