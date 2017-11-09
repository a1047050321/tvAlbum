import Qs from "qs";
import Axios from "axios";
import { API, CONFIG } from "./config";
import Vue from 'vue'
import $ from 'jquery'
Vue.use($);

// 公共工具函数
var util = {
    /**
     * 获取变量的类型
     * @param  {各类型} variable 变量
     * @return {String}          返回变量的类型, 如：number, array, function, object等
     */
    typeOf: function(variable) {
        var type = Object.prototype.toString.call(variable);
        return ((/\[object\s+(.*)\]/ig).exec(type)[1]).toLowerCase();
    },

    /**
     * 判断元素是否存在数组中
     * @param  {各种类型} item 要判断的元素
     * @param  {array}    arr  被判断的数组
     * @return {boolean}       返回布尔值
     */
    inArray: function(item, arr) {
        for (var i = arr.length - 1; i > -1; i--) {
            if (arr[i] == item) {
                return i;
            }
        }
        return -1;
    },

    /**
     * 移除arr数组中index下标对应元素
     * @param  {Int}    index   要移除的元素的下标
     * @param  {Array}  arr     数组
     * @return 返回被移除的元素
     */
    removeAt: function(index, arr) {

        var len = arr.length;
        if (index == 0) {
            return arr.shift();
        } else if (index == (len - 1)) {
            return arr.pop();
        } else {
            var value = arr[index];
            var newArr = [].concat(arr.slice(0, index), arr.slice((index + 1), len)),
                newLen = newArr.length;
            for (var i = 0; i < newLen; i++) {
                arr[i] = newArr[i];
            }
            arr.length = newLen;
            return value;
        }
    },

    /**
     * 移除数组中的元素
     * @param  {多类型} value 要移除的元素
     * @param  {Array}  arr   数组
     * @return {多类型}       返回被移除的元素
     */
    removeOf: function(value, arr) {
        var index = this.inArray(value, arr);

        if (index > -1) {
            return util.removeAt(index, arr);
        }

        return false;
    },

    /**
     * 判断fn是否存在并且是一个函数
     * @param  {Function}  fn 函数名
     * @return {Boolean}       返回布尔值
     */
    isFunction: function(fn) {
        return this.typeof(fn) === "function";
    },
    /**
     * 处理时间函数
     * @param  {Function}  fn 函数名
     * @return {Boolean}       返回布尔值
     */
    dateTranslate: function(str) {
        if (str < 10) {
            str = "0" + str;
        }
        return str;
    },

    /**
     * 如果fn为函数则运行该函数
     * @param  {Function}  fn       函数名
     * @param  {Object}    thisObj  函数的当前对象
     * @param  {Array}     args     函数参数
     * @return 无返回
     */
    runFunction: function(fn, thisObj, args) {
        if (this.isFunction(fn)) {
            var argus = arguments,
                argsl = argus.length;

            //如果函数的参数列表存在1个参数
            if (argsl == 1) {
                return fn.apply(window);
            }

            //如果函数的参数列表存在2个参数
            if (argsl == 2) {
                if (this.typeOf(thisObj) == "array") {
                    return fn.apply(window, thisObj);
                } else {
                    return fn.apply(thisObj);
                }
            }

            //如果函数的参数列表存在3个参数
            if (argsl == 3) {
                return fn.apply(thisObj || window, args);
            }
        }
    },

    /**
     * [isNumeric 是否为数字]
     * @param  {[多类型]}  obj [多类型数据]
     * @return {Boolean}     [是 否]
     */
    isNumeric: function(obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    /**
     * [isEmptyObject 是否为空对象]
     * @param  {[Object]}  obj [待判断对象]
     * @return {Boolean}     [是 否]
     */
    isEmptyObject: function(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },

    /**
     * [parseJSON 转化为JSON类型]
     * @param  {[String]} data [待转化字符串]
     * @return {[Object]}      [转化后的json]
     */
    parseJSON: function(data) {
        if (!data || typeof data !== "string") {
            return null;
        }

        return window.JSON.parse(data);
    },

    /**
     * 数字加前导0
     * @param  {int}    num    要加前导0的数值
     * @param  {int}    digit  位数，默认为2
     * @return {string}        返回具有前导零的数字
     */
    addZero: function(num, digit) {
        digit = digit || 2;

        // 非整数
        if (!this.isNumeric(num) || parseInt(num) != num) {
            return num;
        }

        var n = ("" + num).split(""),
            len = n.length,
            zero = "";

        if (digit > len) {
            zero = new Array(digit - n.length + 1).join("0");
        }

        return zero + num;
    },

    /**
     * 转换时间戳为格式时间 如 2014-09-10 12:33:33
     * @param  {Int}    timestamp 时间戳
     * @return {String}           格式时间 如 2014-09-10 12:33:33
     */
    timeFormat: function(timestamp) {
        if (/[^\d]/ig.test(timestamp)) {
            return timestamp;
        } else {
            var d = new Date(timestamp * 1000);
            return d.getFullYear() + "-" + util.addZero(d.getMonth() + 1) + "-" + util.addZero(d.getDate()) + " " +
                util.addZero(d.getHours()) + ":" + util.addZero(d.getMinutes()) + ":" + util.addZero(d.getSeconds());
        }
    },

    /**
     * 转换空格为 &nbsp;
     * @param  {String} str 需要转换的字符串
     * @return {String}     返回转换后的字符串
     */
    space2nbsp: function(str) {
        return str.replace(/\s/ig, "&nbsp;");
    },

    /**
     * 转换&nbsp;为 空格;
     * @param  {String} str 需要转换的字符串
     * @return {String}     返回转换后的字符串
     */
    nbsp2space: function(str) {
        return str.replace(/&nbsp;/ig, " ");
    },

    /**
     * 转换json对象成字符串，并去掉所有key中的下划线_
     * @param  {Object} json json对象
     * @return {String}      返回json字符串
     */
    json2StringWAU: function(json) {

        if (!json) {
            return json;
        }

        return JSON.stringify(json).replace(/"(\w*?)":/ig, function(m, p1) {
            return '"' + p1.replace(/_/g, "") + '":';
        });
    },

    /**
     * 转换json对象成字符串，并去掉一级key中的下划线_
     * @param  {Object} json json对象
     * @return {String}      返回json字符串
     */
    json2StringWU: function(json) {

        if (!json) {
            return json;
        }

        return JSON.stringify(json).replace(/"([A-Za-z0-9]*)_([A-Za-z0-9]*)":/ig, '"$1$2":');
    },

    /**
     * 删除所有的 key 中的下划线，并返回 json 对象
     * @param  {Object} json json 对象
     * @return {Object}      新的 json 对象
     */
    rmUnderline: function(json) {

        if (!json) {
            return json;
        }

        return this.parseJSON(util.json2StringWAU(json));
    },

    /**
     * [setCookie 设置/删除cookie]
     * @param {[String]} name    [名]
     * @param {[String]} value   [值]
     * @param {[Object]} options [参数 过期时间、路径、域和安全]
     */
    setCookie: function(name, value, options) {

        var cookieName = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        options = options ? options : {};

        // 删除cookie 直接过期处理
        if (value === null) {
            options.expires = -1;
        }

        if (options.expires) {
            var expires = this.setCookieDate(options.expires);

            if (expires instanceof Date) {
                cookieName += ";expires=" + expires;
            }
        }

        if (options.path) {
            cookieName += ";path=" + options.path;
        }

        if (options.domain) {
            cookieName += ";domain=" + options.domain;
        }

        if (options.secure) {
            cookieName += ";secure=" + options.secure;
        }

        document.cookie = cookieName;
    },

    /**
     * [getCookie 获取cookie]
     * @param  {[String]} name [名]
     * @return {[String]}      [值]
     */
    getCookie: function(name) {

        var dc = document.cookie,
            cookieName = encodeURIComponent(name) + "=",
            cookieStart = dc.indexOf(cookieName),
            cookieValue = "";

        if (cookieStart > -1) {
            var cookieEnd = dc.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = dc.length;
            }

            cookieValue = dc.substring(cookieStart + cookieName.length, cookieEnd);

            return decodeURIComponent(cookieValue);
        }
    },

    /**
     * [setCookieDate 转化过期时间]
     * @param {[type]} day [天数]
     * @return {[Object]}      [时间对象]
     */
    setCookieDate: function(day) {
        var date = null;
        if (typeof day == "number") {
            date = new Date();
            date.setDate(date.getDate() + day);
        } else {
            throw new Error("传递的天数不合法！");
        }

        return date;
    },

    /**
     * [cookie 获取、删除和设置cookie 对外提供方法]
     * @param  {[String]} name    [名称]
     * @param  {[String]} value   [值]
     * @param  {[Object]} options [其他参数对象]
     * @return {[String]}         [获取到的cookie信息]
     */
    cookie: function(name, value, options) {
        // 获取
        if (name && value === undefined) {
            return this.getCookie(name);
        }

        // 删除
        if (name && value === null) {
            this.setCookie(name, null, options);
        }

        // 设置
        if (name && value) {
            this.setCookie(name, value, options);
        }
    },

    /**
     * 计算文件的容量大小(KB,MB,GB)
     * @param  {int}    size    字节数
     * @param  {int}    fixed   取小数点后的fixed位
     * @return {string}   返回带上了(KB,MB,GB)的容量大小的字符串
     */
    computeFileSize: function(size, fixed) {
        fixed = fixed || 2;
        if (size > 1024 * 1024 * 1024 * 1024) {
            size = size / (1024 * 1024 * 1024 * 1024);
            size = ("" + size).indexOf(".") > -1 ? size.toFixed(fixed) : size;
            return size + 'TB';
        } else if (size > 1024 * 1024 * 1024) {
            size = size / (1024 * 1024 * 1024);
            size = ("" + size).indexOf(".") > -1 ? size.toFixed(fixed) : size;
            return size + 'GB';
        } else if (size > 1024 * 1024) {
            size = size / (1024 * 1024);
            size = ("" + size).indexOf(".") > -1 ? size.toFixed(fixed) : size;
            return size + 'MB';
        } else if (size > 1024) {
            return (Math.round(size / 1024)) + 'KB';
        } else {
            return Math.round(size) + 'Byte';
        }
    },

    /**
     * 将毫秒数转换为(时:分:秒,毫秒)(00:00:00,000)
     * @param  {int} mSeconds 时间毫秒数
     * @return {string} 返回时分秒
     */
    m2t: function(ms) {
        var msec = this.addZero(ms % 1000, 3);

        ms = Math.floor(ms / 1000);

        var hours = this.addZero(Math.floor(ms / 3600)),
            min = this.addZero(Math.floor((ms % 3600) / 60)),
            sec = this.addZero(Math.floor((ms % 3600) % 60));

        return hours + ":" + min + ":" + sec + "," + msec;
    },

    /**
     * 将形如 00:00:00,000 的(时:分:秒,毫秒)转换成毫秒数
     * @param  {string} time 00:00:00,000 的(时:分:秒,毫秒)
     * @return {int} 毫秒数
     */
    t2m: function(time) {
        time = time.split(/[:,]/ig);

        if (time.length > 0) {
            var sum = 0;

            var sum = (parseInt(time[0], 10) * 3600) +
                (parseInt(time[1], 10) * 60) +
                (parseInt(time[2], 10));

            sum = (sum * 1000) + parseInt(time[3], 10);

            return +sum;
        } else {
            return -1;
        }
    },

    /**
     * 获取请求 api
     * @param  {String} myApi 要获取的 Api 接口
     * @return {String}       Api 接口
     */
    api: function(myApi) {

        return methods.api(myApi);

    },

    /**
     * [validIp 正则匹配ip地址]
     * @param  {[string]} str [ip地址]
     * @return {[boolean]}     [是 否]
     */
    validIp: function(str) {
        return (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/).test(str);
    },

    /**
     * [subStr 截取字节长度个数的字符串]
     * @param  {[type]} str [要截取的字符串]
     * @param  {[type]} len [截取的字节长度]
     * @return {[type]}     [截取后的字符串]
     */
    subStr: function(str, len) {

        var strLen = str.length,
            byteLen = 0;
        for (var i = 0; i < strLen; i++) {
            if (str[i].match(/[^\x00-\xff]/ig) != null) { //是中文记2个字符
                byteLen += 2;
            } else { //是英文记1个字符
                byteLen += 1;
            }

            if (byteLen >= len) {
                return str.substring(0, i + 1);
                break;
            }
        }
    },

    /**
     * [jsonValue 将json数组的值以数组形式返回]
     * @param  {[object]} arr [json数组]
     * @param  {[string]} key [目标键]
     * @param  {[string]} filterKey [过滤键，筛选出包含(不包含)这个特定键的json，要筛选传具体字段，不筛选传false]
     * @param  {[string]} filterValue [过滤值，筛选出包含（不包含）这个特定值的json，要筛选传具体字段，不筛选传false]
     * @param  {[boolean]} isEqual [是否筛选出值相等的json true：相等，false：不等 默认相等]
     * @return {[string]}     [拼接返回的数组]
     */
    jsonValue: function(arr, destKey, filterKey, filterValue, isEqual) {

        var len = arr.length,
            json = {},
            jarr = [];

        if (filterKey == false || filterKey == undefined) {
            for (var i = 0; i < len; i++) {
                json = arr[i];

                if (json[destKey] != undefined) {
                    jarr.push(json[destKey]);
                }
            }
        } else {
            for (var i = 0; i < len; i++) {
                json = arr[i];

                // 筛选出特定键值的json
                if (isEqual || isEqual === undefined) {
                    if (json[filterKey] === filterValue && json[destKey] != undefined) {
                        jarr.push(json[destKey]);
                    }
                } else {
                    if (json[filterKey] !== filterValue && json[destKey] != undefined) {
                        jarr.push(json[destKey]);
                    }
                }
            }
        }

        return jarr;
    },

    /**
     * [filtArrDiffer 两个数组对比，提取出不同的元素，并返回。如[1, 2, 3] [2, 3, 4, 5] --> [1] [4, 5]]
     * @param  {[Array]} arr1 [数组1]
     * @param  {[Array]} arr2 [数组2]
     * @return {[Array]}      [提取后的数组]
     */
    filtArrDiffer: function(arr1, arr2) {

        var arr1Len = arr1.length,
            arr2Len = arr2.length,
            farr1 = [], // arr1中独有的元素数组
            farr2 = [], // arr2中独有的元素数组
            item = null;

        if (this.typeof(arr1) != "array" || this.typeof(arr2) != "array") {
            return ["", ""];
        }

        // arr1中有的元素在arr2中没有
        for (var i = 0; i < arr1Len; i++) {

            item = arr1[i];

            if (this.inArray(item, arr2) == -1) {
                farr1.push(item);
            }
        }

        // arr2中有的元素在arr1中没有
        for (var j = 0; j < arr2Len; j++) {

            item = arr2[j];

            if (this.inArray(item, arr1) == -1) {
                farr2.push(item);
            }
        }

        return [farr1, farr2];
    }
};

/**
 * window下的方法
 */
var methods = {

    /**
     * 扩展请求 api
     * @param  {Object} myAPI 需要扩展的 API 接口
     * @return                无返回值
     */
    api: function(myAPI) {

        if (util.typeOf(myAPI) === "object") {

            Object.assign(API, myAPI);

        } else if (util.typeOf(myAPI) === "string") {

            return API[myAPI];

        }

    },
    /**
     * 用于配置系统 CONFIG 设置信息，该方法仅能调用一次即被清理掉
     * @param  {Object|String} cfg cfg对象时为设置 CONFIG 信息，为字符串时则为获取某个配置属性的值
     * @return 无返回值
     */
    config: function(cfg) {

        // 获取 cfg 的类型
        var type = util.typeOf(cfg);

        if (type == "object") {

            Object.assign(CONFIG, cfg);
        } else if (type == "string") {

            return CONFIG[cfg] || undefined;

        } else {

            return Object.assign({}, CONFIG);
        }

    },
    /**
     * [getProvider 获取内容提供商]
     * @param  {Function} fn [回调函数]
     */
    getProvider: function(fn) {

        // 获取全部内容提供商，提供全局数据
        CONFIG.ProviderObject.getListByType(0, 1, function(provider) {
            fn && fn(provider);
        });
    },

    /**
     * [getContentType 延时获取内容类型]
     * @param  {Function} fn [回调函数]
     */
    getContentType: function(fn) {
        var contentType = CONFIG.contentType;

        // 尝试去获取配置中的内容类型，如果为null，则定时获取，直到获取到为止
        if (util.isEmptyObject(contentType)) {
            var timer = setInterval(function() {
                contentType = CONFIG.contentType;

                if (!util.isEmptyObject(contentType)) {
                    clearInterval(timer);
                    fn && fn(contentType);
                }
            }, 100);
        } else {
            fn && fn(contentType);
        }

    },

    /**
     * [logout 登出]
     */
    logout: function() {

        var cookies = ["userid", "accesstoken", "role"];

        for (var i = cookies.length; i > 0; i--) {

            util.cookie(cookies[i - 1], null, { path: "/", domain: CONFIG.globalDnsConfigVar.uCookieDomain });

        }

        window.location.href = CONFIG.loginurl;
    },

    /**
     * 身份验证
     * @param  {Int}    code    状态码
     * @return {多类型} 通过true，不通过返回错误字符串
     */
    verify: function(code) {
        var _this = this;

        /**
         * 错误状态码
         */
        var Error = {
            9021: "身份令牌不合法，请重新登录",
            9022: "身份令牌已过期，请重新登陆"
        };

        var tip = Error[code] || "",
            result = Error[code] === undefined ? true : false;

        if (result !== true) {

            setTimeout(() => {
                // 无论成功失败都退到登录界面
                window.location.href = CONFIG.loginurl;
            }, 2000);

            return tip;

        }

        return result;
    },

    /**
     * [http 封装axios ajax请求]
     * @param  {[Object]} options [请求相关参数]
     */
    http: function(options) {

        // 取消请求令牌
        var source = Axios.CancelToken.source();

        //转换小写
        var type = options.type;

        type = options.type = type ? type.toLowerCase() : "get";

        if (!options.url) {
            throw new Error("不存在该请求地址，请检查！");
        }

        var axiosSettings = {
            url: options.url,
            //如果'url'不是绝对地址，那么'baseURL'将会加到'url'的前面
            baseURL: "",
            timeout: options.timeout ? options.timeout : 20000,
            //返回数据的格式,其可选项是arraybuffer,blob,document,json,text,stream
            responseType: options.dataType ? options.dataType : "json",

            // 设置请求文件头
            // headers: { "X-Requested-With": "XMLHttpRequest" },

            // 转化请求参数 在数据传送到'then/catch'方法之前对数据进行改动
            /*transformRequest: [function (data) {
                return Qs.stringify(data);
            }],*/

            // 转化返回值 在IE下返回数据异常
            /*transformResponse: [function (res) {                

                //身份验证不通过
                if ( !methods.verify( res.ret ) ) { return false; }

                return util.rmUnderline(res);
                
            }],*/

            // 对返回状态判断操作
            /*validateStatus(status) {
                console.log(status);
            }*/

            cancelToken: source.token
        };

        Object.assign(axiosSettings, {
            method: type
        });

        //设置请求数据中的accesstoken
        if (!options.data.accesstoken) {
            options.data.accesstoken = CONFIG.token;
        }

        // get
        if (type === "get") {
            Object.assign(axiosSettings, {
                params: options.data,
                paramsSerializer: function(params) {
                    return Qs.stringify(params)
                }
            });
        }

        // put/post/patch
        if (type === "post" || type === "put" || type === "patch") {
            Object.assign(axiosSettings, {
                data: options.data,
                headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
            });
        }

        // 响应拦截器 实验不是很理想 一次请求被检查多次拦截
        /*Axios.interceptors.response.use((response) => {
            console.log("拦截啦:", response)
            return response;
        });*/
        return Axios(axiosSettings).then((response) => {
            // 只返回data，其他不返回
            var res = response.data;
            //身份验证不通过，传递提示，两秒后自动返回到登录页
            var vf = methods.verify(res.ret);

            if (vf !== true) {
                res.ret_msg = methods.verify(res.ret);
            }

            return util.rmUnderline(res);
        });
    }

};

var iHomed = function(method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
        throw new Error("不存在" + method + "方法！");
    }
};

// 生成开发模式token
if (CONFIG.dev) {
    util.cookie("accesstoken", CONFIG.token);
}

Object.assign(iHomed, util);

export default {

    install: function(vm) {

        vm.prototype.$iHomed = iHomed;

        vm.prototype.$http = methods.http;

        Vue.prototype.Util = util;
        Vue.prototype.dateTranslate = util.dateTranslate;
    }
}