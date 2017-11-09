var slaveAddr = globalDnsConfigVar.slaveAddr,
    accessAddr = globalDnsConfigVar.accessAddr,
    dtvAddr = globalDnsConfigVar.dtvAddr;

// 系统配置文件
var CONFIG = {
    // boss 首页地址
    homepage: "",
    // Homed 后台登录地址
    loginurl: "http://boss.homed.me/login.html",
    // 系统 id，需要设置为自身系统的 id 号
    systemid: 40,
    // 系统名称
    systemname: "相册管理系统",
    // 是否为开发模式，默认为 true ; true 为不用登录即可进入系统，否则必须登录
    dev: false,
    // 开发模式下的默认账户 ID 1000025 1000103 1000056 3120
    userid: "3120",
    // 开发模式下的默认用户名
    username: "熊黎",
    // 开发模式下的默认令牌 
    token: "TOKEN3120",
    // 开发模式下的默认用户角色: 1.超级管理员，2.系统管理员，3.普通用户
    role: 2,
    // 将公共配置放到CONFIG中暴露出去    
    globalDnsConfigVar: window.globalDnsConfigVar,
    // 提供商对象
    ProviderObject: new window.ProviderObject(1),
    // 所有提供商
    providers: [],
    // 内容类型
    contentType: window.contentType,

    PAGE_SIZES: [20, 30, 50, 100],

    // 菜单模块配置
    menuList: [{
            name: "相册管理",
            iconClass: "icon-manage",
            children: [{
                    name: "数据统计",
                    to: "/dataAccount"
                },
                {
                    name: "用户管理",
                    to: "/userManage"
                }
            ]
        },
        // {
        //     name: "公共相册",
        //     iconClass: "icon-manage",
        //     children: [{
        //             name: "上传",
        //             to: "/upload"
        //         },
        //         {
        //             name: "审核中",
        //             to: "/audit"
        //         },
        //         {
        //             name: "已驳回",
        //             to: "/rejected"
        //         },
        //         {
        //             name: "待发布",
        //             to: "/releasing"
        //         },
        //         {
        //             name: "已发布",
        //             to: "/released"
        //         },
        //         {
        //             name: "已下架",
        //             to: "/laid"
        //         }
        //     ]
        // }
        // {
        //     name: "系统设置",
        //     iconClass: "icon-setting",
        //     to: "/SystemSetting"
        // }
    ]
};


/**
 * 扩展系统接口
 * 
 * 形如：{method}_apiname : "http://***" 
 *      {method} 代表了请求接口的类型：get | post
 *      -> "user_get_info" : "http://access.homed.me/usermanager/user/get_info"
 * 
 * 使用方式：
 *     iHomed( "setData 或 getData", { // 这里面的参数传入类似于 jQuery.ajax
 *         url: "{method}_apiname"
 *     } );
 */
var API = {
    // 海报上传接口, POST
    "post_channelposter": slaveAddr + "/httpdocsup/poster",

    // 获取homed用户列表
    "user_list": accessAddr + "/homed/system/get_user_list",
    // 取消homed用户权限
    "right_cancel_assign": accessAddr + "/usermanager/right/cancel_assign",
    // 分配homed用户权限
    "right_assign": accessAddr + "/usermanager/right/assign",

    // 获取系统用户权限列表
    "manager_right_list": accessAddr + "/usermanager/right/get_list",
    // 获取系统用户取消详情
    "manager_right_info": accessAddr + "/usermanager/right/get_info",
    // 获取用户详情
    "user_info": accessAddr + "/usermanager/user/get_info",

    // 上传图片
    "upload_picture": slaveAddr + "/httpdocsup/poster",

    //添加用户
    "user_add": "http://192.168.21.79/tv_album/manage/manage_image/add_homed_user",
    //导入用户
    "user_import": "http://192.168.21.79/tv_album/manage/manage_image/homed_home_account_model",
    // 搜索homed用户
    "user_search": "http://192.168.21.79/tv_album/manage/manage_image/search_home_user_info",
    //扩容接口
    "space_dilatation": "http://192.168.21.79/tv_album/manage/manage_image/set_family_total_size",
    //折线图统计数据
    "account_data": "http://192.168.21.79/tv_album/manage/manage_image/get_total_data",
    //所有用户数据
    "album_user": "http://192.168.21.79/tv_album/manage/manage_image/get_user_home_info",
    //搜索记录接口
    "operator_history": "http://192.168.21.79/tv_album/manage/manage_image/get_home_config_history",
    //获取操作记录管理员
    "operator_user": "http://192.168.21.79/tv_album/manage/manage_image/get_config_user_list",
    //筛选操作记录
    "operator_search": "http://192.168.21.79/tv_album/manage/manage_image/get_home_config_history",
    //导出全部数据
    "export_all": "http://192.168.21.79/tv_album/manage/manage_image/export_home_info?DA=all_home_info",
};

export {
    API,
    CONFIG
};