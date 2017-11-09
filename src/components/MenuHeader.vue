<template>
	<el-menu mode="horizontal">
	   <!-- <el-submenu index="1">
	        <template slot="title">{{ headerParam.systemname }}</template>
	        <template v-for="id in headerParam.systemids">               
	          	<el-menu-item index="id" >
	          	</el-menu-item>                
	        </template>               
	     </el-submenu> !-->
		 <el-menu-item index="1" class="headerBar" style="width:100%;font-size:20px;font-weight:900;
		color: #fff;text-align: center;">{{ headerParam.systemname }}</el-menu-item>
	  </el-menu>
	</div>
</template>

<script>	
	export default {
		props: ["headerParam"],
		data () {
		  return {
		  };
		},
	}
</script>

<style>
	.headerBar{
		width:100%;
		font-size:20px;
		font-weight:900;
		color: #fff;	
		text-align: center;
	}
	.el-menu-item.headerBar.is-active{
		color:#fff;
	}
	.menu-wrapper .menu-header,
	.menu-wrapper .el-menu--horizontal .el-submenu__title:hover {
		background-color: #20A0FF;
	}

	.menu-header .el-submenu__title {
		width: 100%;
		font-size: 20px;
		color: #fff;	
	}

	.menu-header > .el-submenu {
		width: 100%;
		text-align: center;
	}

	.menu-header > .el-submenu > .el-menu {
		text-align: left;
		max-height: 400px;
		overflow-y: auto;
	}

	.menu-header > .el-submenu > .el-menu img {
		vertical-align: middle;
	}

	.menu-header > .el-submenu > .el-menu a {
		text-decoration: none;
		font-size: 16px;
	}
</style>