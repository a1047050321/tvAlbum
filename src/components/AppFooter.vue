<template>
	<div>
		<el-popover ref="nav-exit" placement="top" title="" trigger="hover">
		  <ul class="exit-list">
		    <li @click="$iHomed('logout')">退出</li>
		    <li @click="toIndexPage">首页</li>
		  </ul>
		</el-popover>    

		<el-row class="app-footer">
		  <el-col :span="4">
		    <div class="nav-exit" v-popover:nav-exit>
		      <i class="icon icon-single"></i>
		      <span>{{ footerParam.username }}</span>          
		    </div>        
		  </el-col>
		  <el-col :span="20">
		    <p>版权所有 © 1999-{{ nowYear }} 深圳市茁壮网络股份有限公司　粤ICP备12069260</p>
		    <p>Copyright © 1999-{{ nowYear }} iPanel.TV Inc.,All Rights Reserved</p>
		  </el-col>
		</el-row>
	</div>	
</template>

<script>
	export default {
		props: ["footerParam"],
		data () {
		  return {
		  };
		},
		computed: {
			nowYear() {
			  return new Date().getFullYear();
			}
		},
		methods: {
		  toIndexPage() {
		    window.location.href = this.$iHomed("config", "globalDnsConfigVar").homePageAddr + "/index.html";
		  }
		}
	}
</script>

<style>
	
</style>