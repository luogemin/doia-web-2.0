import localStorageUtils from '@/utils/storageUtils/localStorageUtils';
import API from '@/services/api';
import { get, post } from '@/utils/request.js';
import { getAuthType, getApiDomain } from "@/utils/common";

export const checkLogin = () => {
    const authType = getAuthType() || "sso";
    let url = '';
    if (authType == 'basic') {  //basic登录
        url = API.CHECK_LOGIN;
    } else {  //连接gateway
        url = `${getApiDomain()}/gateway/api/v1/auth?module=${window.DOIA_CONFIG.gateWayModule}`;
    }
    return get(url)
}

//获取nacos配置
export function getNacosConfig() {
    let url = `${window.location.origin}${window.DOIA_CONFIG.nacosApi}`
    return get(url);
}

//从douc获取标签页icon信息
export function getDoucIcon() {
    let url = `${window.location.origin}/gateway/douc/api/v1/logo/getLogo`
    return post(url, {
        body: {
            type: "3",
            version: ""
        }
    });
}

// export function checkLogin() {
//     // const user = localStorageUtils.getUserData();
//     // //如果有用户信息，则直接登录
//     // if(user && user.userId){
//     //     return true;
//     // }
//     //
//     // return false;
// }
