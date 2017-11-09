var util = {
    /**
     * 数字加前导0
     * @param  {int}    num    要加前导0的数值
     * @param  {int}    digit  位数，默认为2
     * @return {string}        返回具有前导零的数字
     */
    addZero: function(num, digit) {
        digit = digit || 2;

        var n = ("" + num).split("");
        var zero = new Array(Math.abs(digit - n.length + 1)).join("0");
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
            var d = new Date(timestamp);
            return d.getFullYear() + "-" + util.addZero(d.getMonth() + 1) + "-" + util.addZero(d.getDate()) + " " +
                util.addZero(d.getHours()) + ":" + util.addZero(d.getMinutes()) + ":" + util.addZero(d.getSeconds());
        }
    },
    /**
     * 将时间戳转换为时长字符串 
     * @param  {Int} timestamp 时间戳，单位秒
     * @return {String}        时长字符串 如 30:05:30
     */
    durationFormat: function(timestamp) {
        var h = this.addZero(Math.floor(timestamp / 3600)),
            m = this.addZero(Math.floor((timestamp % 3600) / 60)),
            s = this.addZero(timestamp % 60);

        return h + ":" + m + ":" + s;
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
     * 转换日期的格式，将格式如"2016/9/6"等的统一连接符为"-"并对位数不足的位置进行补零，返回格式如"2016-09-06"
     * @param  {string} str 日期字符串
     * @return {string}     转换后的日期字符串
     */
    convertDate: function(str) {
        str = str || "";
        str = this.trimStr(str).split(/[\/\ \-]/g);

        if (str.length == 3) {
            for (var i = 1; i < 3; ++i) {
                if (str[i].length < 2) {
                    str[i] = util.addZero(str[i], 2);
                }
            }
        }

        return str.join("-");
    },
    /**
     * 日期字符串转时间戳，将如"2016-09-06"、"2016/09/06 10:00:00"等格式的日期转换为时间戳，如果字符串不包含时间时默认为日期当天0时
     * @param  {string} str 日期（包含具体时分）的字符串
     * @return {int}        时间戳
     */
    date2utc: function(str) {
        str = str || "";
        str = this.trimStr(str).split(/[\/\ \-\:]/g);

        var time = new Date();

        time.setDate(1); // 防止日期溢出导致月份自增
        time.setFullYear(str[0]);
        time.setMonth(parseInt(str[1]) - 1);
        time.setDate(str[2]);

        time.setHours(str[3] || 0);
        time.setMinutes(str[4] || 0);
        time.setSeconds(str[5] || 0);

        return time.getTime();
    },
    /**
     * 去掉字符串前后空格
     * @param  {string} str 需要处理的字符串
     * @return {string}     去掉前后空格的字符串
     */
    trimStr: function(str) {
        return (str || "").replace(/(^\s*)|(\s*$)/g, "");
    }
}
import Vue from 'vue'
import $ from 'jquery'
Vue.use($);
export default {
    install(Vue, option = {}) {
        Vue.prototype.utilTools = util;
    }
}