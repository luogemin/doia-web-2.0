import isString from 'lodash-es/isString';
import isArray from 'lodash-es/isArray';

/*
    获取系统启动配置信息
*/
function getGlobalConf() {
    if (window.GlobalConf && window.GlobalConf instanceof Object) {
        return window.GlobalConf;
    } else {
        return null;
    }
}

export function getApiDomain() {
    let config = getGlobalConf();
    if (config) {
        return config.apiDomain || "";
    } else {
        return window.location.origin || "";
    }
}

export function getAuthType() {
    let config = getGlobalConf();
    if (config) {
        return config.authType || 'sso'; //默认永远返回sso
    }
    return null;
}

//更换浏览器标签页icon
export function changeBrowserLogo(url = '') {
    const domLink = document.getElementById('doia-icon');
    if (domLink) {
        domLink.href = url.replace('data:image/ico', 'data:image/jpeg');
    }
}

/**
 * 时间戳格式化输出
 * @param {*} timestamp
 * @param {*} fmt
 */
export function dateFormat(timestamp, fmt) {
    if (timestamp) {
        const date = new Date(timestamp);
        if (date) {
            let o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        } else {
            return "";
        }
    } else {
        return "";
    }
}

export function emptyFormat(str) {
    return (str && str.length > 0) ? str : "--";
}

/**
 * 获取元素的样式计算结果
 * @param {*} element
 */
export function getComputedStyle(element) {
    return (window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle);
}

/**
 * 格式化存储计量单位
 * @param {*} str
 */
export function formatDataSize(value) {
    if (null == value || value === '') {
        return {};
    }
    const unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    let index = 0,
        srcsize = parseFloat(value);

    let size = "0";

    if (srcsize) {
        index = Math.floor(Math.log(srcsize) / Math.log(1024));
        size = srcsize / Math.pow(1024, index);
        size = size.toFixed(2);
    }

    return {
        value: size,
        unit: unitArr[index],
        powerBy: Math.pow(1024, index)
    };
}

/**
 * 格式化数字单位
 * @param {*} str
 */
export function formatNumberSize(value) {
    if (null == value || value === '') {
        return {};
    }

    let size = value, unit = "", powerBy = 1;
    if (value >= 10000 * 10000) {
        powerBy = 10000 * 10000;
        size = (size / (10000 * 10000)).toFixed(2);
        unit = "亿";
    } else if (value >= 10000) {
        powerBy = 10000;
        size = (size / (10000)).toFixed(2);
        unit = "万";
    }

    return {
        value: size,
        unit: unit || "",
        powerBy
    };
}


/**
 * 16进制颜色转为RGB格式
 * @param {*} color
 * @param {*} type   1-字符串，2-数字
 */
export function colorRgb(color = "#000000", type = 1) {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/i;
    color = color.toLowerCase();

    if (color && reg.test(color)) {
        if (color.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var j = 1; j < 7; j += 2) {
            sColorChange.push(parseInt("0x" + color.slice(j, j + 2)));
        }

        if (type == 1) {
            return "RGB(" + sColorChange.join(",") + ")";
        } else {
            return sColorChange;
        }
    } else {
        return color;
    }
}

/**
 * 对象相等判断
 * @param {*} obj1
 * @param {*} obj2
 */
export function diff(obj1, obj2) {
    const o1 = obj1 instanceof Object;
    const o2 = obj2 instanceof Object;
    if (!o1 || !o2) {/*  判断不是对象  */
        return obj1 === obj2;
    }

    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }

    for (let attr in obj1) {
        const t1 = obj1[attr] instanceof Object;
        const t2 = obj2[attr] instanceof Object;
        if (t1 && t2) {
            return diff(obj1[attr], obj2[attr]);
        } else if (obj1[attr] !== obj2[attr]) {
            return false;
        }
    }
    return true;
}

/**
 * 数值按位自动补零
 * @param num   数值
 * @param n     位数
 * @returns {*}
 * @constructor
 */
export function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

/**
 * 函数:将拉平数据转为树
 * input: [{id,pid,name},{}....]
 * extra : 如果生成树节点需要带有其他属性,则放到这里
 * output:[{...,children:[...]}]
 */
export function treeMenu(array, options, extra) {
    this.tree = array || [];

    this.id = options.id || 'id';
    this.pid = options.pid || 'pid';
    this.name = options.name || 'name';
    //确保extra为数组类型
    this.extra = extra || [];
    if (isString(this.extra)) {
        this.extra = [this.extra];
    }

    this.groups = {};
}

treeMenu.prototype = {
    init: function (rootId) {
        this.group();
        return this.getDom(this.groups[rootId]);
    },
    //数组按照pID分组
    group: function () {
        for (var i = 0; i < this.tree.length; i++) {
            if (this.groups[this.tree[i][this.pid]]) {
                this.groups[this.tree[i][this.pid]].push(this.tree[i]);
            } else {
                this.groups[this.tree[i][this.pid]] = [];
                this.groups[this.tree[i][this.pid]].push(this.tree[i]);
            }
        }
    },

    getDom: function (nodelist) {
        if (!nodelist || nodelist.length <= 0) {
            return [];
        }
        var tree = [];
        for (var i = 0; i < nodelist.length; i++) {

            var nodeid = nodelist[i][this.id];
            var tmpnode = {};
            tmpnode[this.id] = nodeid;
            tmpnode.key = tmpnode.value = '' + nodeid;
            tmpnode.title = tmpnode[this.name] = nodelist[i][this.name];
            tmpnode[this.pid] = nodelist[i][this.pid];
            if (isArray(this.extra)) {
                this.extra.map(function (prop) {
                    tmpnode[prop] = nodelist[i][prop];
                });
            }

            tmpnode.children = this.getDom(this.groups[nodeid]);

            tree.push(tmpnode);
        }
        return tree;
    }
};


/**
 * 生成带千分位的数字字符串
 * @param {*} n
 */
export function comdify(n) {
    if (typeof n == "number") {
        n = "" + n;
        let re = /\d{1,3}(?=(\d{3})+$)/g;
        let n1 = n.replace(/^(-)?(\d+)((\.\d+)?)$/, function (s, s1, s2, s3) {
            return (s1 ? s1 : "") + s2.replace(re, "$&,") + s3;
        });
        return n1;
    } else {
        return n;
    }
}

export function uuid() {
    return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }));
}


//====全屏处理逻辑=========
//1.返回当前处于全屏模式的元素
export function fullscreenElement() {
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

//2.返回全屏模式是否可用
export function fullscreenEnable() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
}

//3.启动全屏展示
export function lanchFullscreen(element) {
    console.log(element,"----element");
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
}

//4.退出全屏
export function exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExiFullscreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}

//5.全屏事件监听处理--增加监听
export function fullScreenChangeHandler(callback) {
    document.addEventListener('fullscreenchange', callback);
    document.addEventListener('webkitfullscreenchange', callback);
    document.addEventListener('mozfullscreenchange', callback);
    document.addEventListener('MSFullscreenChange', callback);
}

//6.全屏事件监听处理--取消监听
export function cancelFullScreenChangeHandler(callback) {
    document.removeEventListener('fullscreenchange', callback);
    document.removeEventListener('webkitfullscreenchange', callback);
    document.removeEventListener('mozfullscreenchange', callback);
    document.removeEventListener('MSFullscreenChange', callback);
}

export function hasValue(value) {
    if (value != null && value != undefined) {
        return true;
    }
    return false;
}

/* 浏览器相关 */

// 获取IE版本
export function getIEVersion() {
    let userAgent = navigator.userAgent;
    let isLessIE11 = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1;
    let isEdge = userAgent.indexOf('Edge') > -1 && !isLessIE11;
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isLessIE11) {
        let IEReg = new RegExp('MSIE (\\d+\\.\\d+);');
        let IERegex = IEReg.test(userAgent);
        var IEVersionNum = parseFloat(RegExp['$1']);
        if (IEVersionNum === 7) {
            return 7;
        } else if (IEVersionNum === 8) {
            return 8;
        } else if (IEVersionNum === 9) {
            return 9;
        } else if (IEVersionNum === 10) {
            return 10;
        } else {
            return 6;
        }
    } else if (isEdge) {
        return 'edge';
    } else if (isIE11) {
        return 11;
    } else {
        return -1;
    }
}

/**
 * 判断是否是IE 11及以下或者其他(其他里包括IE edge)
 */
export function isIEFun() {
    return !!window.ActiveXObject || "ActiveXObject" in window;
}

/**
 * 公共下载方法，支持ie10
 * @param data
 * @param name
 */
export function downFileFun(data, name) {
    const blob = new Blob([data], { type: 'application/x-sql;charset=UTF-8' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, name);
    } else {
        let a = document.createElement('a');
        a.download = name;
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}