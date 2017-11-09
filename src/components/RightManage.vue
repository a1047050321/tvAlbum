<template>
	<div :style="{height: cHeight}" class="content">
		<!-- 头部导航路径区 -->
		<div class="nav-wrapper">
			<el-breadcrumb separator=">">
			  <el-breadcrumb-item>电视相册系统管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>

		<fieldset>
			<legend>系统权限</legend>
			<div class="system-right-list">
				<a v-for="right in systemRightList" @click="handleShowRightDesc(right.rightid)">{{ right.rightname }}</a>
			</div>
		</fieldset>

		<fieldset>
			<legend>系统管理员</legend>
			<div class="admin-user-list user-list">
				<div v-for="item in systemAdminList" :edit-user-data="editUserParam" @click="handleEditUserDialog(item.id)">
					<img :src="getAvatarSrc(item)"><br>
					<span>{{ item.name }}</span>
				</div>				
			</div>
		</fieldset>

		<div class="box">
			<h2>
				<div>针对用户分配权限</div>
				<div class="operate-normal-user">
					<el-button size="mini" type="primary" icon="edit" @click="handleEditNormalUser" :disabled="isEditting">编辑</el-button>
					<el-button size="mini" type="primary" icon="plus" @click="handleAddNormalUser" >添加</el-button>
				</div>
			</h2>
			<fieldset>
				<legend>普通用户</legend>
				<div class="normal-user-list user-list">
					<div v-for="item in normalUserList" :class="{editting: isEditting}" @click="handleEditUserDialog(item.userid)">
						<img :src="getAvatarSrc(item)"><br>
						<span>{{ item.username }}</span>
						<i class="el-icon-circle-close" v-show="isEditting" @click.stop="handleRemoveUser(item.userid)"></i>
					</div>				
				</div>
			</fieldset>

			<div class="operate-footer" v-show="isEditting">
				<el-button type="primary" size="small" @click="handleDeleteNormalUser">确定</el-button>
				<el-button size="small" @click="handleCancelEdit">取消</el-button>
			</div>
		</div>
		<!-- 编辑用户 -->
		<edit-user-dialog :edit-user-param="editUserParam"></edit-user-dialog>
		<!-- 添加用户 -->
		<add-user-dialog :add-user-param="addUserParam" @add-user-callback="handleAddCb"></add-user-dialog>
		
		<!-- 分页展示区 -->
		<!-- <div class="pager-wrapper">
			<el-pagination				
			     @size-change="handleSizeChange"
			     @current-change="handleCurrentChange"
			     :current-page="pData.currentPage"
			     :page-sizes="pData.pageSizes"
			     :page-size="pData.pageSize"
			     layout="total, sizes, prev, pager, next, jumper"
			     :total="pData.total">
			</el-pagination>
		</div> -->	
		
	</div>
	
</template>

<script>
	import EditUserDialog from "@/components/EditUserDialog";
	import AddUserDialog from "@/components/AddUserDialog"

	export default {
		components: {
			EditUserDialog,
			AddUserDialog
		},
		data(){
			return {
				// loading加载提示
				Loading: null,
				cHeight: 0,
				// 导航数据
				nData: {
				},
				// 系统权限列表
				systemRightList: null,
				// 系统管理员
				systemAdminList: [],
				// 系统普通用户
				normalUserList: [],
				// 是否在编辑状态
				isEditting: false,
				// 待删除普通用户列表
				removeUserList: [],

				editUserParam: {
					dialogVisible: false
				},

				addUserParam: {
					dialogVisible: false
				},
				
				// 分页数据
				pData: {
					total: 0,
					currentPage: 1,
					pageSize: 30,
					pageSizes: null
				}
			}
		},

		created() {
			this.initList();			
		},

		computed: {

		},

		mounted() {
			let _this = this;

			autoResize();

			window.onresize = autoResize;

			function autoResize() {
				let wh = +window.innerHeight;
			
				_this.cHeight = (wh - 40) + "px";						

			};
		},

		methods: {
			// 数据加载提示
			loading(param) {
				
				param = Object.assign({
							target: ".content-wrapper",
							text: "玩命加载中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
			},

			// 关闭数据加载提示
			closeLoading() {
				this.$nextTick(() => {
					this.Loading.close();
				});				
			},
			/**
			 * [initList 初始化普通用户和系统用户]
			 */
			initList() {
				this.loading();
				
				// 首先获取系统用户
				let manageUser = this.$http({
					url: this.$iHomed("api", "manager_right_list"),
					type: "GET",
					data: {
						systemid: this.$iHomed("config", "systemid"),
						pageidx: 1,
						pagenum: 100
					}
				})
				.then((res) => {
					if(res.ret == 0) {
						let rightlist = res.rightlist;

						// 遍历出有权限的列表作为系统权限
						for(let i = 0, len = rightlist.length; i < len; i++) {
							let list = rightlist[i].list;

							if(list) {
								this.systemRightList = list;
								break;
							}
						}

						this.systemAdminList = res.systemadminlist;

					}
					else {
						this.closeLoading();

						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.closeLoading();
					throw new Error("获取系统普通用户列表失败！");
				});

				// 获取普通用户
				let normalUser = this.$http({
					url: this.$iHomed("api", "user_list"),
					type: "GET",
					data: {
						systemid: this.$iHomed("config", "systemid"),
						pageidx: 1,
						pagenum: 100
					}
				})
				.then((res) => {
					if(res.ret == 0) {
						let list = res.list ? res.list : [];

						this.normalUserList = list;

						this.closeLoading();
					}
					else {
						this.closeLoading();

						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.closeLoading();
					throw new Error("获取系统普通用户列表失败！");
				});

				// 统一处理错误
				Promise.all([manageUser, normalUser])
				.catch((error) => {
					this.$alert(error.toString());
				});				
			},

			/**
			 * [handleShowRightDesc 获取系统权限描述]
			 * @param  {[Int]} rightid [权限id]
			 */
			handleShowRightDesc(rightid) {
				this.loading();

				this.$http({
					url: this.$iHomed("api", "manager_right_info"),
					type: "GET",
					data: {
						rightid: rightid
					}
				})
				.then((res) => {
					if(res.ret == 0) {
						this.closeLoading();
						this.$alert(res.desc, "系统权限描述")
					}
					else {
						this.closeLoading();
						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.closeLoading();
					this.$alert("获取系统用户权限描述失败！");
				});
			},
			/**
			 * [getAvatarSrc 获取用户头像地址]
			 * @param  {[Object]} data [用户相关数据]
			 * @return {[type]}      [description]
			 */
			getAvatarSrc(data) {
				let iconurl = data.iconurl;

				// 用户有传头像
				if(iconurl) {
					return iconurl["100x100"];
				}
				else {

					return this.$iHomed("config", "globalDnsConfigVar").homePageAddr + "/pubFile/img/avatar" + (data.gender === 1 ? "1" : "0") + ".jpg";					
				}
			},

			/**
			 * [handleEditNormalUser 编辑普通用户]
			 */
			handleEditNormalUser() {
				this.isEditting = true;
			},

			/**
			 * [handleEditNormalUser 添加普通用户]
			 */
			handleAddNormalUser() {
				this.isEditting = false;
				this.addUserParam = {
					systemRightList: this.systemRightList,
					dialogVisible: true
				}
			},

			/**
			 * [handleAddCb 添加用户完毕后回调]
			 */
			handleAddCb() {
				this.initList();
			},

			/**
			 * [handleCancelEdit 取消编辑]
			 */
			handleCancelEdit() {
				this.isEditting = false;
			},

			/**
			 * [handleRemoveUser 移除普通用户，待删除用户]
			 * @param  {[Int]} userid [用户id]
			 */
			handleRemoveUser(userid) {
				// 找到该用户位置，并删除，更新视图
				let systemUserIds = this.$iHomed.jsonValue(this.normalUserList, "userid");

				let curRemoveUser = this.normalUserList.splice(systemUserIds.indexOf(userid), 1);

				// 记录所有待删除的用户
				this.removeUserList.push(curRemoveUser[0]);
			},

			/**
			 * [handleDeleteNormalUser 删除普通用户]
			 */
			handleDeleteNormalUser() {
				let removeUserList = this.removeUserList,
					len = removeUserList.length,
					num = 0;

				this.loading({text: "正在处理中，请稍候..."});

				if(len) {
					cancelAssign.call(this);
				}
				else {
					this.closeLoading();
					this.isEditting = false;
				}

				function cancelAssign() {

					let list = removeUserList[num],
						rightids = this.$iHomed.jsonValue(list.rightlist, "rightid").join("|");

					this.$http({
						url: this.$iHomed("api", "right_cancel_assign"),
						type: "POST",
						data: {
							systemid: this.$iHomed("config", "systemid"),
							rightids: rightids,
							userid: list.userid
						}
					})
					.then((res) => {
						if(res.ret == 0) {
							num++;

							if(num < len) {
								cancelAssign.call(this);
							}
							else {
								this.closeLoading();
								this.isEditting = false;
								this.removeUserList = [];
								this.$message("删除普通用户成功~");
							}								
						}
						else {
							this.closeLoading();
							this.$alert(res.retmsg);
						}
					})
					.catch((error) => {
						this.closeLoading();
						this.$alert("删除普通用户失败！");
					});					
				}
			},
			
			/**
			 * [handleDeleteDialog 删除播单对话框]
			 */
			handleDeleteDialog() {
				
				this.$confirm("是否删除所选播单?", "温馨提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.loading();
					this.handleDelete();
				}).catch(() => {
					
				});
			},

			/**
			 * [handleEditUserDialog 编辑用户对话框]
			 * @param  {[Int]} userid [用户id]
			 */
			handleEditUserDialog(userid) {
				this.editUserParam = {
					systemRightList: this.systemRightList,
					dialogVisible: true,
					userid: userid
				};
			}
		}
	}
</script>

<style scoped>
	.content {
		padding-right: 40px;
		overflow-y: auto;
	}

	fieldset {
	    border: 1px solid #dcdcdc;
	    padding: 8px 16px;
	    margin: 10px 0;
	    font-size: 13px;
	}

	fieldset > legend {
	    font-weight: bold;
	    font-size: 14px;
	    padding: 0px 6px;
	}

	.system-right-list a {
	    display: inline-block;
	    line-height: 22px;
	    margin-right: 10px;
	    min-width: 120px;
	    font-size: 13px;
	}

	.system-right-list a:hover {
	    color: #008fd0;
	    cursor: pointer;
	}

	.user-list > div {
		margin: 0px 10px 10px 10px;
	    width: 60px;
	    height: 70px;
	    text-align: center;
	    float: left;
	    position: relative;
	}
	
	.user-list > div:hover {
		color: #008fd0;
	    cursor: pointer;
	}

	.user-list img {
		width: 50px;
		height: 50px;
	}

	.user-list > div.editting{
		animation: shake .2s ease-in 0s infinite;
		-webkit-animation: shake .2s ease-in 0s infinite;
	}

	@keyframes shake {
		0% { transform: rotate(0deg); -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); }
		25% { transform: rotate(4deg); -webkit-transform: rotate(4deg); -ms-transform: rotate(4deg); }
		50% { transform: rotate(0deg); -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); }
		75% { transform: rotate(-4deg); -webkit-transform: rotate(-4deg); -ms-transform: rotate(-4deg); }
		100% { transform: rotate(0deg); -webkit-transform: rotate(0deg); -ms-transform: rotate(0deg); }
	}

	.user-list i {
		width: 16px;
	    height: 16px;
	    position: absolute;
	    top: -6px;
	    right: -2px;
	    color: #8492a6;
	}

	.user-list i:hover {
		color: #ff4949;
	}

	.box {
		margin-top: 30px;
	}

	.box h2 {
		height: 18px;
	    font-size: 14px;
	    position: relative;
	    border-top: 1px solid #dcdcdc;
	}

	.box h2 > div {
	    display: inline-block;
	    position: absolute;
	    padding: 0px 6px;
	    background-color: #ffffff;
	    top: -10px;
	}

	.operate-normal-user {
		right: 0px;
	    font-weight: normal;
	    font-size: 12px;
	}
</style>

<style>
</style>