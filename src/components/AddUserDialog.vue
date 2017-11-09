<template>
	<!-- 编辑用户对话框 -->
	<el-dialog title="添加用户" :close-on-click-modal="false" :visible.sync="addUserParam.dialogVisible">
		<div class="search-input-wrapper">
			<div class="selected-tags">
				已选用户：<el-tag :key="tag" v-for="tag in selectedUser" :closable="true" :close-transition="false" @close="handleCloseUserTag(tag)">{{ tag.username }}</el-tag>
			</div>			
			<el-autocomplete v-model="state" :fetch-suggestions="querySearchUser" placeholder="请输入用户中文名或英文名搜索" @select="handleSelectUser" size="small" style="width: 240px;"></el-autocomplete>
		</div>
		
		<div class="user-right-list">
			<fieldset>
				<legend>
					<el-checkbox v-model="checkAll"  @change="handleCheckAllChange">系统子权限</el-checkbox>
				</legend>

				<el-checkbox-group v-model="hasRightIds"  @change="handleCheckedRightsChange" class="right-list-group">
					<el-checkbox v-for="right in addUserParam.systemRightList" :label="right.rightid" :key="right.rightid">{{right.rightname}}</el-checkbox>
				</el-checkbox-group>
			</fieldset>
		</div>		
		
		<div slot="footer" class="dialog-footer">
			<el-button @click="addUserParam.dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleAddUser">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props: ["addUserParam"],		
		data() {
			return {
				// loading加载提示
				Loading: null,
				// 添加用户数据
				addUserData: {},
				// 职位
				jobList: "",
				// 该用户已有系统子权限
				hasRightIds: [],
				// 是否全选
				checkAll: false,
				// 已搜索选中的用户标签
				userTags: [],
				// 输入搜索框
				state: "",

				// 已选中的用户
				selectedUser: []
			}
		},
		watch: {
			addUserParam() {
				this.state = "";				
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
				let systemRightList = this.addUserParam.systemRightList,
					allRightIds = this.$iHomed.jsonValue(systemRightList, "rightid");

		        this.hasRightIds = event.target.checked ? allRightIds : [];
		    },

		    /**
		     * [handleCheckedRightsChange 勾选系统子权限]
		     * @param  {[Array]} value [已勾选]
		     */
			handleCheckedRightsChange(value) {
				let checkedCount = value.length,
					systemRightList = this.addUserParam.systemRightList;
					
		        this.checkAll = checkedCount === systemRightList.length;
			},

			/**
			 * [handleAddUser 添加用户子权限]
			 */
			handleAddUser() {
					
				let _this = this,
					SYSTEMID = this.$iHomed("config", "systemid"),
					selectedUser = this.selectedUser,
					len = selectedUser.length,
					hasRightIds = this.hasRightIds,
					num =  0;

				if(!hasRightIds.length) {
					this.$alert("请至少勾选一个系统子权限");
					return false;
				}

				this.loading({text: "正在处理中，请稍候..."});

				addSingleUser.call(this);

				function addSingleUser() {

					let userid = selectedUser[num].userid;

					this.$http({
						url: this.$iHomed("api", "right_assign"),
						type: "post",
						data: {
							systemid: SYSTEMID,
							userid: userid,
							rightids: hasRightIds.join("|")
						}
					})
					.then((res) => {
						if(res.ret == 0) {
							num++;
							if(num < len) {
								addSingleUser.call(this);
							}
							else {
								this.selectedUser = [];
								this.$message("添加系统普通用户成功~");
								this.closeLoading();
								this.addUserParam.dialogVisible = false;

								this.$emit("add-user-callback");
							}
						}
						else {
							this.closeLoading();
							this.$alert(res.retmsg);
						}
					})
					.catch((error) => {
						this.closeLoading();
						this.$alert("添加系统普通用户失败！");
					});
				}			
				
			},

			/**
			 * [handleSelectUser 选中搜索提示用户]
			 * @param  {[Object]} value [当前被选中用户信息]
			 */
			handleSelectUser(value) {
				// 选中后清空
				this.state = "";

				let selectedUser = this.selectedUser;

				// 是否存在已选
				let isExit = selectedUser.some((item) => {
					return item.userid === value.userid;
				});

				if(isExit) {
					this.$message("选中的用户已存在~");
				}
				else {
					this.selectedUser.push(value);
				}				
			},

			/**
			 * [handleCloseUserTag 删除标签]
			 * @param  {[Object]} value [当前被删除用户信息]
			 */
			handleCloseUserTag(value) {

				let selectedUser = this.selectedUser,
					ids = this.$iHomed.jsonValue(selectedUser, "userid");

				// 检索到位置，并删除
				selectedUser.splice(ids.indexOf(value.userid), 1);
			},
			/**
			 * [querySearchUser 根据输入关键字搜索用户]
			 * @param  {[String]}   queryString [搜索关键字字符串]
			 * @param  {Function} cb          [回调函数]
			 */
			querySearchUser(queryString, cb) {

				if(queryString == "") {
					cb([]);
				}
				else {
					this.$http({
						url: this.$iHomed("api", "manager_user_search"),
						type: "GET",
						data: {
							keyword: queryString
						}
					})
					.then((res) => {
						if(res.ret == 0) {
							let list = res.list,
								formatList = [];

							if(!list.length) {
								cb([]);
							}
							else {
								list.forEach((val) => {
									formatList.push({
										value: val.username + " " + val.departmentname, 
										userid: val.userid,
										username: val.username
									});
								});

								cb(formatList);
							}
						}
						else {
							this.$message(res.retmsg);
						}
					})
					.catch((error) => {
						this.$alert("搜索用户失败！");
					});					
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

	.selected-tags {
		margin-bottom: 10px;
	}

	.selected-tags .el-tag {
		margin-right: 4px;
	}
</style>