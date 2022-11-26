import * as request from '@chaoswise/request';
import {isDev} from '@/globalConstants';
import localStorageUtils from '@/utils/storageUtils/localStorageUtils';
import {error} from '@/utils/tip';

const language = localStorage.getItem('language') || 'zh';

const {
    initRequest,
    fetchGet,
    fetchPut,
    fetchDelete,
    fetchPost,
    upload,
    downloadFile,
    formateResponse,
    source,
    axiosInstance, //
} = request;

// 初始化mock数据
const getMockData = () => {
    const mockData = [];
    const mockPaths = require.context('@/_MOCK_', true, /\.js$/);
    mockPaths.keys().forEach(mockPath => {
        const mockRes = require(`@/_MOCK_/${mockPath.replace(/\.\//, '')}`).default;

        Object.entries(mockRes).forEach(([mockKey, mockValue]) => {
            const [_mockKey, mockUrl] = mockKey.split(' ');
            const method = `on${_mockKey.charAt(0).toUpperCase()}${_mockKey.slice(1).toLocaleLowerCase()}`;
            mockData.push({
                method,
                url: mockUrl,
                res: mockValue
            });
        });

    });
    return mockData;
};

//用户鉴权，拦截器挂起请求，拿到userdata，改变userId和accountId
axiosInstance.interceptors.request.use(config => {
    const currentUser = localStorageUtils.getUserData() || {};
    const accountId = currentUser.accountId || null;
    const userId = currentUser.id || null;
    config.headers.accountId = accountId;
    config.headers.userId = userId;
    return config;
});

initRequest({
    config: {
        // 请求错误码回调
        statusCallback: {
            // '401': () => {
            // },
            // '403': () => {

            // },
            // '500': (err) => {
            //   const {response: {data}} = err;
            //   error(data.msg);
            // }
        },
        // 是否启用mock数据 false 关闭 true 开启
        useMock: true,
        // mock延迟mm
        delayResponse: 1000,
        // 统一处理请求
        // eslint-disable-next-line no-unused-vars
        handleResponse: (res, err) => {
            if (err) {
                // 错误处理
                const {response = {}} = err;
                const {data = {}} = response;
                if (data.code == '100106') {
                    // 100106 : 模型查询异常 ;不通过message提示，直接将错误信息打印在页面上
                } else {
                    error(data.msg);
                }
            } else {
                // 响应处理
            }
        },
        // 是否开启登陆验证 false 关闭 true 开启(统一处理401登出逻辑)
        checkLogin: isDev ? false : true,
        // restapi: sso登出校验地址
        restapi: '', // 默认为 error.response.config.url 设置后以设置为准
        cancelRepeat: true,
    },
    // 请求头的配置文件
    defaults: {
        // 请求的基础域名
        baseURL: "",
        timeout: 1000 * 60 * 10,
        headers: {
            language: language === 'zh' ? 'zh_CN' : 'en_US',
            CWAccessToken: 'FnQGiEXrYr6n8diKuY6cc61Zw3MMyLW9icwiUlHjyoAkBsBKCDIqmDZbfzLpRQ8HMuuxBnsl2tRDGnaz9votYR/u5WTbRTGO6rSI9VbaC13fWCFJFkfSM5/SH6dGGrNfRnHlOQhJUlQJtjXWR7X4lBRen+Bddl5c38ASXdKCmJx+0Sq5fGsnu9qyX+UbdaHG7/8YxjX01YFJ+HlwNh5H/A==\n'
        }
    },
    // mock模拟请求接口数组
    mock: getMockData()
});

export default request;

export {
    fetchGet,
    fetchPut,
    fetchDelete,
    fetchPost,
    upload,
    downloadFile,
    formateResponse,
    source
};
