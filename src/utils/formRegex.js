/**
 * 表单名称校验
 * @returns {{pattern: string, message: string}}
 */
import {IntlFormatMessage} from "@/utils/util";

export function formNameReg() {
    return {
        pattern: '^[a-zA-Z][a-zA-Z0-9-_/.]*$',//'^[a-zA-Z_]{1,}$',
        message: IntlFormatMessage('task.common.lettersOnly')
    };
}



/**
 * 校验ip端口号
 * @returns {{}}
 */
export function formIpPortReg() {
    return {
        // pattern: '^((2[0-4]\\d|25[0-5]|[1]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[1]?\\d\\d?)\\:([1-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1-6][0-5][0-5][0-3][0-5])$',
        // message: '请输入正确的IP端口地址(xxx.xxx.xxx.xxx:xxxx)'
    };
}

/**
 * 校验表达式中的小括号
 * @returns {{}}
 */
export function formExpressionReg() {
    return {
        pattern: /^[\a-zA-Z0-9\\_\\.\\=\\+\-*\\/\\<\\>\\[\\]\\(\\)\\]+$/,
        message: IntlFormatMessage('task.common.signsOnly')
    };
}