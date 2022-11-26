/**
 * 事件管理
 *
 * ------使用方式------
 * 1、添加事件监听：
 *  eventManager.on('timeChange',function(){
 *      alert('Time is change!');
 *  });
 *
 * 2、触发指定事件监听：
 *  eventManager.emit('timeChange',...args);
 *
 * 3、game over!!!!!
 * @type {{events: {}, on: Function, emit: Function, off: Function}}
 */
export const eventManager = {
    /**
     * 存储事件监听信息
     */
    events: {},
    /**
     * 添加监听
     * @param name
     * @param fn
     */
    on: function (name, fn) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(fn);

        return this;
    },
    /**
     * 触发事件
     * @param name
     * @returns {Event}
     */
    emit: function (name) {
        if (name) {
            let fns = this.events[name] || [];
            let params = [].slice.call(arguments, 1);
            for (let i = 0, l = fns.length; i < l; i++) {
                fns[i].apply(this, params);
            }
        }
        return this;
    },
    /**
     * 移除事件监听
     * @param name
     * @returns {eventManager}
     */
    off: function (name, fn) {
        let events = this.events[name];
        if (name && events) {
            if (fn) {
                for (let i = 0, l = events.length; i < l; i++) {
                    if (events[i] == fn) {
                        events.splice(i, 1);
                        break;
                    }
                }
            } else {
                delete this.events[name];
            }
        }
        return this;
    },
};

/***
 * 将params转为 a=b&c=d 格式
 * @param params
 */
export function parseParamsToUrl(params) {
    let queryParam = null;
    if (params) {
        let keys = Object.keys(params);

        keys.forEach(function (key) {
            let _value =
                typeof params[key] == 'object'
                    ? JSON.stringify(params[key])
                    : params[key];
            queryParam = queryParam
                ? queryParam + '&' + key + '=' + _value
                : key + '=' + _value;
        });
    }
    return queryParam;
}

/**
 * 获取地址栏中url后面拼接的参数
 * eg:
 *   浏览器地址栏中的地址：http://1.1.1.1/test.html?owner=2db08226-e2fa-426c-91a1-66e26f62c13f&view=pc
 *   let param=location.search;//?owner=2db08226-e2fa-426c-91a1-66e26f62c13f&view=pc
 *   let ownerId = getUrlParam("owner",param);
 *   let view = getUrlParam("view",param);
 */
export function getUrlParam(name, param) {
    if (!param) {
        return null;
    }
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = param.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 下载动态文件方法
 * @param {*buffer} content 返回的文件内容（二进制流）
 * @param {*string} filename 文件名
 * @param {*string} type 文件类型
 */
export const funDownload = (content, filename, type = 'word') => {
    const docType = {
        excel: 'application/zip', // excel默认都是返回zip格式文件
        word:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    // 创建隐藏的可下载链接
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    const blob = new Blob([content], {type: docType[type]});
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

//取值共用方法
export const commValue = (value) => {
    let unit = '';
    if (value >= 1000) {
        value = value / 1000; //千
        if (value >= 1000000) {
            value = value / 1000000;
            value = value.toFixed(2);
            unit = 'B';
        } else if (value >= 1000) {
            value = value / 1000;
            value = value.toFixed(2);
            unit = 'M';
        } else if (value >= 10) {
            value = value / 10;
            value = value.toFixed(2);
            unit = 'W';
        } else {
            value = value.toFixed(2);
            unit = 'K';
        }
    } else {
        value = value.toFixed(2);
    }
    return {
        value,
        unit,
    };
};

//生成唯一id
export const guid = () => {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0;
        let v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// 获取ie版本
export function IEVersion() {
    // 取得浏览器的userAgent字符串
    let userAgent = navigator.userAgent;
    // 判断是否为Safari浏览器
    let isSafari =
        /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    // 判断是否为小于IE11的浏览器
    let isLessIE11 =
        userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
    // 判断是否为IE的Edge浏览器
    let isEdge = userAgent.indexOf('Edge') > -1 && !isLessIE11;
    // 判断是否为IE11浏览器
    let isIE11 =
        userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isLessIE11) {
        let IEReg = new RegExp('MSIE (\\d+\\.\\d+);');
        // 正则表达式匹配浏览器的userAgent字符串中MSIE后的数字部分，，这一步不可省略！！！
        let IERegex = IEReg.test(userAgent);
        // 取正则表达式中第一个小括号里匹配到的值
        let IEVersionNum = parseFloat(RegExp['$1']);
        if (IEVersionNum === 7) {
            // IE7
            return 7;
        } else if (IEVersionNum === 8) {
            // IE8
            return 8;
        } else if (IEVersionNum === 9) {
            // IE9
            return 9;
        } else if (IEVersionNum === 10) {
            // IE10
            return 10;
        } else {
            // IE版本<7
            return 6;
        }
    } else if (isEdge) {
        // edge
        return 'edge';
    } else if (isIE11) {
        // IE11
        return 11;
    } else if (isSafari) {
        return 'safari';
    } else {
        // 不是ie浏览器
        return -1;
    }
}

export function formatDate(date, fmt) {
    let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            );
        }
    }
    return fmt;
}

/**
 * 获取字符串中某个字符出现的次数
 * @param scrstr  源字符串
 * @param armstr  特殊字符
 * @returns {number}
 */
export function getStrCount(scrstr, armstr) {
    let count = 0;
    if (scrstr) {
        while (scrstr.indexOf(armstr) !== -1) {
            scrstr = scrstr.replace(armstr, "");
            count++;
        }
        return count;
    }
}

/**
 * 判断当前浏览类型
 * @return {string}
 */
export function BrowserType() {
    let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    let isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
    let isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
        let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        let IERegex = reIE.test(userAgent);
        let fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "IE7";
        } else if (fIEVersion == 8) {
            return "IE8";
        } else if (fIEVersion == 9) {
            return "IE9";
        } else if (fIEVersion == 10) {
            return "IE10";
        } else if (fIEVersion == 11) {
            return "IE11";
        } else {
            return "0";
        }//IE版本过低
    }//isIE end

    if (isFF) {
        return "FF";
    }
    if (isOpera) {
        return "Opera";
    }
    if (isSafari) {
        return "Safari";
    }
    if (isChrome) {
        return "Chrome";
    }
    if (isEdge) {
        return "Edge";
    }
}

export function formatTimeToDate(date = 0) {
    let newDate = date / 1000;
    if (newDate < 60) {
        return newDate + '秒';
    } else if (newDate >= 60 && newDate < (60 * 60)) {
        return newDate / 60 + '分钟';
    } else if (newDate >= (60 * 60) && newDate < (60 * 60 * 24)) {
        return newDate / (60 * 60) + '小时';
    } else {
        return newDate / (60 * 60 * 24) + '天';
    }
}

/**
 * 数字转汉字
 * @param num
 * @returns {string}
 */
export function numberParseChina(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (let i = 0; i < strArr.length; i++) {
            newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
    };
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) {
        noWan = "0" + noWan;
    }
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

/**
 * 数组去重
 * @param arr
 * @returns {unknown[]}
 */
export function unique(arr) {
    return Array.from(new Set(arr));
}

/**
 * 英文1个字符长度，中文2个字符长度
 * @param str
 * @returns {number}
 */
export function strlen(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
}

/**
 * 是否国际化英文
 * @return {string}
 */
export function IntlFormatMessage(id = '') {
    return !!window._intl_ && window._intl_.formatMessage({id: id});
}

/**
 * 是否国际化英文
 * @return {boolean}
 */
export function IsInternationalization() {
    return localStorage.getItem('language') === 'en';
}

export function ClearSomLocalStorage(key = 'dataZoomCharts_') {
    const len = localStorage.length; // 获取长度
    const arr = []; // 定义数据集
    for (let i = 0; i < len; i++) {
        // 获取key 索引从0开始
        const getKey = localStorage.key(i);
        if (getKey.indexOf(key) < 0) {
            // 获取key对应的值
            const getVal = localStorage.getItem(getKey);
            // 放进数组
            arr.push({
                'key': getKey,
                'val': getVal,
            });
        }
    }
    localStorage.clear();
    arr.forEach(item => {
        localStorage.setItem(item.key, item.val);
    });
}