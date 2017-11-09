<template>
<div class="userImport">
    <div class="nav-wrapper">
                    <!-- 面包屑导航路径 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
                <router-link to="/userManage">用户管理</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>导入数据</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="importInput">
        <div>下载导入模板：</div>
        <el-button @click="template">点击下载模板</el-button>
        <br/>
        <div>上传填写后的文件：</div>
        <el-input type="file" name="fileField" style="width:200px;"></el-input>
        <br/>
        <el-button @click="addImport" type="primary">添加</el-button>
        <router-link to="/userManage">
            <el-button>取消</el-button>
        </router-link>
    </div>
</div>
</template>
<script>
    
    import axios from 'axios'
    export default {
        data() {
            return {
            }
        },
    mounted(){
    },
    methods:{
         loading(param) {
				
				param = Object.assign({
							target: ".userImport",
							text: "数据导入中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
			},
			// 关闭数据加载提示
			closeLoading() {
				this.$nextTick(() => {
					this.Loading.close();
				});				
			},
            //下载模板
            template(){
                 var self = this;
                 let url = self.$iHomed("api", "user_import");
                        self.$http({
                                url: url,
                                type: "get",
                                data:{}
                            })
                            .then((res) => {
                                // self.closeLoading();
                                var tmplate = res.data.homedhomeaccount.url;
                                if(res.ret){
                                    window.location = tmplate;
                                    self.$alert("末班下载完成请查收！");
                                }
                                console.log(res);
                            })
            },
            //上传文件
        addImport(){
            var self = this;
            var files = $('input[name="fileField"]').prop('files');//获取到文件列表
            console.log(files);
            if (files.length == 0) {
                self.$message("请选择文件");
                return;
            } else {
                // this.loading();
                var reader = new FileReader();//新建一个FileReader
                reader.readAsText(files[0], "UTF-8");//读取文件
                reader.onload = function (evt) { //读取完文件之后会回来这里
                    var fileString = evt.target.result;
                    //post方式上传图片到后台
                    var date = {"file": fileString};
                    console.log(date);
                    //提交表格的url
                   
                }
            }
        }
    }
  }
</script>
<style scoped>
    .importInput{
        margin-top:20px;
        width:400px;
    }
    .importInput div{
        margin-top:10px;
    }
    .el-button{
        margin-top:10px;
    }
</style>