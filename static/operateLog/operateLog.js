var queryObj = iHomed.query(location.search);
/**
 * 姣忎釜绯荤粺閮介渶瑕佸崟鐙厤缃� log_conf 鍙橀噺
 */
var log_conf = {

    systemid: queryObj.systemid.split("|"), //绯荤粺ID,姣忎釜绯荤粺蹇呮敼椤�,鍙兘涓€涓郴缁熸湁澶氫釜绯荤粺id

    token: queryObj.token, //token,蹇呮敼,鐢ㄤ簬鍒ゆ柇鐢ㄦ埛鏉冮檺

    cluster: 'DEV', //闆嗙兢锛欴EV鏄紑鍙戯紝DEB鏄皟璇曪紝OPR鏄繍钀�

    //鐢ㄦ埛鏉冮檺鎺ュ彛
    rightURL: (top.accessAddr || 'http://access.homed.me:12690') + '/usermanager/user/get_info',

    pagesize: 20, //姣忛〉璁板綍鏉℃暟

    es_server: top.elasticAttr || 'http://elastic.homed.me:9200/', //澶ф暟鎹湇鍔″櫒,榛樿,涓嶇敤鍔�

    index: 'gm-*', //绱㈠紩,榛樿,涓嶇敤鍔�

    type: 'gm' //type,榛樿,涓嶇敤鍔�


};
$.ajax({
    url: "http://elastic.homed.me:9200/gm-*/gm/_search",
    type: "post",
    data: { accesstoken: "TOKEN3120" },
    success: function(data) {
        console.log(data);
    }
})

//澶ц繛澶у皬缃戠殑鎿嶄綔璁板綍
if (top.globalDnsConfigVar.operator == 'dalian') {

    log_conf.cluster = 'DBG'; //澶ц繛灏忕綉锛欴BG锛屽ぇ缃戯細OPR

}