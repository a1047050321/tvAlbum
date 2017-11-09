<template>
  <div id="app">
    <el-row class="app-content">
      <el-col :span="4" class="menu-wrapper">
        <!-- 菜单导航头部 -->
        <menu-header :header-param="headerParam" class="menu-header"></menu-header>
        <!-- 菜单列表 -->
        <menu-content :content-param="contentParam" class="menu-content"></menu-content>
      </el-col>
      <el-col :span="20" class="content-wrapper">
        <div>
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>

    <app-footer :footer-param="footerParam"></app-footer>        
    
  </div>
</template>

<script>
import MenuHeader from "@/components/MenuHeader";
import MenuContent from "@/components/MenuContent";
import AppFooter from "@/components/AppFooter";

export default {
  components: {
    MenuHeader,
    MenuContent,
    AppFooter
  },
  name: "app",
  data() {
    return {
      headerParam: {
        systemname: "",
        systemids: [],
        sysList: sysList
      },
      contentParam: {
        role: ""
      },
      footerParam: {
        username: ""
      }
    }
  },
  created() {
    let iHomed = this.$iHomed,
        systemname = iHomed("config", "systemname"), // 系统名称
        systemid = iHomed("config", "systemid");     
    // 上线模式
    if( !iHomed("config", "dev") ) {
      // 没有登陆痕迹，则登出
      if( iHomed.cookie( "userid" ) == null || iHomed.cookie( "accesstoken" ) == null ) {

        iHomed("logout");
      }
      else {
        let token = iHomed.cookie( "accesstoken" );
        alert(token);
        // 保存令牌、用户id
        iHomed("config", {
          token: iHomed.cookie( "accesstoken" ),
          userid: iHomed.cookie( "userid" )
        });

        this.userInfo({
          accesstoken: token,
          systemid: systemid,
          systemname: systemname
        });
      }
    }
    // 开发者模式
    else {
      this.userInfo({
        accesstoken: iHomed("config", "token"),
        systemid: systemid,
        systemname: systemname
      });
    }
    window.document.title = systemname;
  },

  methods: {
    /**
     * [userInfo 获取用户详细信息]
     * @param  {[Object]} data [用户相关数据]
     */
    userInfo(data) {
      let iHomed = this.$iHomed,
          systemid = data.systemid;

      this.$http({
        url: iHomed("api", "user_info"),
        type: "GET",
        data: {
          accesstoken: data.accesstoken,
          systemid: systemid
        }
      })
      .then((res) => {
        if(res.ret == 0) {
          var self = this;
            let role = iHomed.jsonValue(res.rolelist, "role", "systemid", systemid);
            // 筛选出该用户的除去本系统所有系统权限id
            let systemids = iHomed.jsonValue(res.rightlist, "systemid", "systemid", systemid, false);
            let username = res.username;

            // 保存用户名称、用户角色
            iHomed("config", {
                username: username,                       
                role: role
            });

            this.headerParam = {
              systemname: data.systemname,
              systemids: systemids,
              sysList: sysList
            };

            this.contentParam = {
              role: role
            }

            this.footerParam = {
              username: username
            };    
        }
        else {
          this.$alert(res.retmsg, "温馨提示", {
            confirmButtonText: '确定',
            callback: () => {
              iHomed("logout");
            }
          });                  
        }
      })
      .catch((error) => {
        this.$alert("获取用户详细信息失败！");
      });
    }    
  }
}
</script>

<style>
</style>
