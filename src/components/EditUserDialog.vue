<template>
	<!-- 编辑用户对话框 -->
	<el-dialog title="编辑用户" :close-on-click-modal="false" :visible.sync="editUserParam.dialogVisible">
		<div class="user-info">
			<div class="user-avatar">
				<img :src="getAvatarSrc()">
			</div>
			<ul>
				<li><h3>{{ editUserData.username }}</h3></li>
				<li>性别：{{ editUserData.gender === 1 ? "男" : "女" }}</li>
				<li>部门：{{ editUserData.departmentname }}</li>
				<li>职务：{{ jobList }}</li>
				<li>地址：{{ editUserData.address }}</li>
			</ul>
		</div>
		<div class="user-right-list">
			<fieldset>
				<legend>
					<el-checkbox v-model="checkAll"  @change="handleCheckAllChange">系统子权限</el-checkbox>
				</legend>

				<el-checkbox-group v-model="hasRightIds"  @change="handleCheckedRightsChange" class="right-list-group">
					<el-checkbox v-for="right in editUserParam.systemRightList" :label="right.rightid" :key="right.rightid">{{right.rightname}}</el-checkbox>
				</el-checkbox-group>
			</fieldset>
		</div>		
		
		<div slot="footer" class="dialog-footer">
			<el-button @click="editUserParam.dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleEditUser">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props: ["editUserParam"],		
		data() {
			return {
				// loading加载提示
				Loading: null,
				// 编辑用户数据
				editUserData: {},
				// 职位
				jobList: "",
				// 记录初始用户的子权限id
				preHasRightIds: [],
				// 该用户已有系统子权限
				hasRightIds: [],
				// 是否全选
				checkAll: false
			}
		},
		watch: {
			editUserParam() {
				this.loading();

				this.$http({
					url: this.$iHomed("api", "user_info"),
					type: "GET",
					data: {						
						targetuserid: this.editUserParam.userid
					}
				})
				.then((res) => {
					if(res.ret == 0) {
						
						this.editUserData = res;
						this.jobList = this.$iHomed.jsonValue(res.joblist, "jobname").join("|");

						let rightList = this.$iHomed.jsonValue( res.rightlist, "list", "systemid", this.$iHomed("config", "systemid") )[0];
						
						// 已有子权限
						this.preHasRightIds = this.hasRightIds = rightList ? this.$iHomed.jsonValue(rightList, "rightid") : [];
						// 已有子权限是否等于系统子权限判断全选
						this.checkAll = this.hasRightIds.length === this.editUserParam.systemRightList.length;

						this.closeLoading();
											
					}
					else {
						this.closeLoading();
						this.$alert(res.retmsg);
					}
				})
				.catch((error) => {
					this.closeLoading();
					this.$alert("获取用户详细信息失败！");
				});				
			}
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
			 * [getAvatarSrc 获取用户头像地址]
			 * @return {[type]}      [description]
			 */
			getAvatarSrc() {
				let data = this.editUserData,
					iconurl = data.iconurl;

				// 用户有传头像
				if(iconurl) {
					return iconurl["100x100"];
				}
				else {

					return this.$iHomed("config", "globalDnsConfigVar").homePageAddr + "/pubFile/img/avatar" + (data.gender === 1 ? "1" : "0") + ".jpg";					
				}
			},

			/**
			 * [handleCheckAllChange 勾选全选]
			 * @param  {[Object]} event [全选按钮勾选框事件]
			 */
			handleCheckAllChange(event) {
				let systemRightList = this.editUserParam.systemRightList,
					allRightIds = this.$iHomed.jsonValue(systemRightList, "rightid");

		        this.hasRightIds = event.target.checked ? allRightIds : [];
		    },

		    /**
		     * [handleCheckedRightsChange 勾选系统子权限]
		     * @param  {[Array]} value [已勾选]
		     */
			handleCheckedRightsChange(value) {
				let checkedCount = value.length,
					systemRightList = this.editUserParam.systemRightList;
					
		        this.checkAll = checkedCount === systemRightList.length;
			},

			/**
			 * [handleEditUser 编辑修改用户子权限]
			 */
			handleEditUser() {
					
				let SYSTEMID = this.$iHomed("config", "systemid"),
					userid = this.editUserParam.userid,
					// 当前已勾选的子权限id
					hasRightIds = this.hasRightIds,
					// 初始用户的子权限id
					preHasRightIds = this.preHasRightIds,
					// 比较两个数据的差异，提取出不同
					diffIds = this.$iHomed.filtArrDiffer(hasRightIds, preHasRightIds);

				this.loading({text: "正在处理中，请稍候..."});

				function assignRight() {
					this.$http({
						url: this.$iHomed("api", "right_assign"),
						type: "post",
						data: {
							systemid: SYSTEMID,
							userid: userid,
							rightids: diffIds[0].join("|")
						}
					})
					.then((res) => {
						if(res.ret == 0) {
							this.$message("分配用户权限成功~");
							this.closeLoading();
							this.editUserParam.dialogVisible = false;
						}
						else {
							this.closeLoading();
							this.$alert(res.retmsg);
						}
					})
					.catch((error) => {
						this.closeLoading();
						this.$alert("分配用户权限失败！");
					});
				}

				// 有取消用户取消
				if(diffIds[1].length) {
					this.$http({
						url: this.$iHomed("api", "right_cancel_assign"),
						type: "post",
						data: {
							systemid: SYSTEMID,
							userid: userid,
							rightids: diffIds[1].join("|")
						}
					})
					.then((res) => {
						if(res.ret == 0) {
							if(diffIds[0].length) {
								assignRight.call(this);
							}
							else {
								this.$message("分配用户权限成功~");
								this.closeLoading();
								this.editUserParam.dialogVisible = false;
							}								
						}
						else {
							this.closeLoading();
							this.$alert(res.retmsg);
						}
					})
					.catch((error) => {
						this.closeLoading();
						this.$alert(res.retmsg);
					});
				}
				// 有添加用户权限
				else if(diffIds[0].length) {
					assignRight.call(this);
				}
				// 都没有则直接关闭窗口
				else {
					this.closeLoading();
					this.editUserParam.dialogVisible = false;
				}
				
			}
		}
	}
</script>

<style scoped>
	.user-info {
		position: relative;
	}

	.user-avatar {
		width: 100px;
		height: 100px;
		position: absolute;

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

	.user-info > ul {
		margin-left: 110px;
		line-height: 20px;
	}

	.right-list-group > label {
		min-width: 120px;
		margin-left: 0;
	}
</style>