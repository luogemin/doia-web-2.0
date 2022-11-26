import {query, queryRange} from './prometheus';
import localStorageUtils from '@/utils/storageUtils/localStorageUtils';
import {fetchGet, fetchPost} from "@/utils/request.js";
import API from "@/services/api";
import {IntlFormatMessage} from "@/utils/util";

const DTAPI = API.ALGORITHM_API; //   /api/v1/datastores
const SINGLEAPI = API.PATH_V1 + '/datastore'; //  /api/v1/datastore
const currentUser = localStorageUtils.getUserData() || {};
const accountId = currentUser.accountId || null;

function checkAccountId() {
    if (!accountId) {
        return {
            status: "fail",
            msg: IntlFormatMessage('task.common.invalidAccount'),
            repStatus: 400
        };
    }
    return true;
}

function convertParams(params) {
    //请求数据
    params.account_id = accountId;

    let paramsArray = [];
    Object.keys(params).forEach(p => {
        paramsArray.push(`${p}='${params[p]}'`);
    });

    return paramsArray;
}

export function getAlgorithmListService(params = {}) {

    //检测当前账号
    // checkAccountId();

    return fetchPost(DTAPI, {
        body: params
    });
}
