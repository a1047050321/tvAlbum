<template>
	<!-- 添加或编辑播单对话框 -->
	<el-dialog :title="aditData.title" :close-on-click-modal="false" :visible.sync="aditParam.dialogVisible">
		<el-form :model="aditData" :inline="true" :rules="rules">
			<el-form-item label="名称" prop="name">
				<el-input v-model="aditData.name" auto-complete="off" size="small"></el-input>
			</el-form-item>			
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="aditParam.dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleAditList(aditParam.flag)">确 定</el-button>
		</div>
	</el-dialog>

</template>

<script>	
	export default {
		props: ["aditParam"],
		data() {
			return {
				// loading加载提示
				Loading: null,
				aditData: {
					title: "",
					name: ""
				},
				rules: {
					name: [
						{ required: true, message: "请输入播单名称", trigger: "blur" },
						{ min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "blur" }
						]
				}
			}
		},
		watch: {
			aditParam() {
				let aditParam = this.aditParam,
					flag = aditParam.flag;

				this.loading({text: "正在处理中，请稍候.."});

				if(flag) {

					this.aditData.title = "编辑";

					// 接下来去请求数据填充初始表单				
					

					this.closeLoading();		
				}
				// 添加
				else {
					this.aditData = {
						title: "添加",
						name: ""	
					};

					this.closeLoading();
				}
			}
		},
		created() {
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
			 * [handleAditList 添加或编辑播单]
			 * @param  {[Int]} flag [0: 添加，1: 编辑]
			 */
			handleAditList(flag) {
				
				let name = this.aditData.name,
					param = {};				

				if(name === "") {
					this.$message("名称不能为空！");
					return false;
				}

				this.loading();

				// 编辑需要传id
				if(flag) {
					Object.assign(param, {id: this.aditParam.playlistid});
				}
				
				// 接下来去提交请求...
				
				this.aditParam.dialogVisible = false;
				
				this.closeLoading();
			}
		}
	}
</script>

<style scoped>
	
</style>