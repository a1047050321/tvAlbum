<template>
<div>        
<div class="userManage">
        <div class="nav-wrapper">
                <!-- 面包屑导航路径 -->
                <el-breadcrumb separator=">">
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                </el-breadcrumb>
        </div>
		<div id="buttonAll">
			<el-button size="mini" class="button" @click="add">添加</el-button>
			<el-button size="mini" class="button" @click="importData">导入</el-button>
            <el-button size="mini" class="button" @click="exportAll">导出全部</el-button>
			<el-button size="mini" class="button" @click="export2Excel" :disabled="length">导出</el-button>

            <span class="conconent"></span>
			<el-button size="mini" class="button" @click="dilatation" :disabled="multi" style="margin-left:10px;">扩容</el-button>
			<el-input placeholder="请输入" icon="search" 
			v-model="input"  class="search"  @click="search">
			</el-input>		
		</div>
        <el-table height="40px" class="position" ref="multipleTable" :data="tableData" style="width:1140px;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" label="全选" width="60" scope="scope">
            </el-table-column>
            <el-table-column prop="home_name" label="开户人" width="140" style="">
            </el-table-column>
            <el-table-column prop="DA" label="帐号ID" width="100">
            </el-table-column>
            <el-table-column prop="nick_name" label="用户昵称" width="170">
            </el-table-column>
            <el-table-column prop="gander" label="性别" width="120">
            </el-table-column>
            <el-table-column prop="create_time" label="开户时间" width="200">
            </el-table-column>
            <el-table-column prop="family_total_size" label="总空间" width="120">
            </el-table-column>
            <el-table-column prop="family_total_used_size" label="已用空间" width="100" >
            </el-table-column>
            <el-table-column prop="f_status" label="状态">
            </el-table-column>
        </el-table>
    </div>
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      style="margin-left:100px;"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20,50,100, 200]"
      :page-size="pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
    <!--组件注册 /-->
    <add-user :addUser="addUser"  v-show="addUser" @addUser="changeAdd"></add-user>
    <v-dialog @dialog="change" @ret="spaceUp" :multipleSelection = "multipleSelection[0]" :dialog="dialog"></v-dialog>
    <!-- 导入-->
    <div style="width:100%;height:100%;" v-show="importDialog">
            <div class="mask"></div>
            <div class="import">
            <div class="title">导入用户信息</div>
                <div class="button">
                    <el-button type="primary" @click="template">下载模版</el-button>
                    <br/>
                    <input type="file" name="fileField" style="opacity:0;z-index:999;position:absolute;top:120px;">
                    <el-button type="primary" style="position:absolute;top:110px;">点击上传</el-button>
                    <div style="width:100%;height:50px;"></div>
                </div>
                <div style="font-size:12px;margin-left:55px;">只能上传由模版填写的excel文件</div>
                <div class="button" style="margin-left:80px;">
                    <el-button type="primary" @click="importConfirm">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
    </div>
</div>
</template>
<script>
    import axios from 'axios'
    import AddUser from '@/components/tvAlbum/AddUser'
    import Dialog from '@/components/tvAlbum/Dialog'
    var rows = [];
    export default {
        data() {
            return {
                row: {},
                alert: true,
                input: '',
                multi:false,
                dialog:false,
                total:1,
                pageidx:1,
                currentPage: 1,
                pagenum:20,
                tableData: [],
                searchData:[],
                multipleSelection: [],
                ret:"",
                flag:1,
                length:true,
                importDialog:false,
                addUser:false,
                createTime:null,
            }
        },
        mounted(){
            this.getData();  
            if(this.multipleSelection.length == 0 ){
                    this.multi = true;              
                }
                if(!this.input){
                    this.getData();
                }
                 //开发模式下
                console.log(this.$iHomed("config","userid"));  
                //后台登陆下  this.$iHomed.cookie("userid");
        },
        watch:{
            input:function(newIpt){
                if(!newIpt){
                    this.getData();
                }
            }
        },
        methods: {
            change(a){
                this.dialog = a;
            },
            //扩容成功与否操作
            spaceUp(a){
                var self = this;
                if(a){
                    if(self.flag == 1){
                        self.getData();
                    }
                    else{
                        self.search();
                    }
                }
            },
             getData(){
                 var arr = [];
                 var self = this;
                //  console.log(this.$iHomed("api", "album_user"));
                var url = this.$iHomed("api", "album_user");
                axios.get(url,{
                    params:{
                         accesstoken: this.$iHomed("config", "token"),
                         page:this.pageidx,
                         page_size:this.pagenum
                    }
                }).then(function(res){
                    self.total = Number(res.data.data.data_total_number);
                        var datalist = res.data.data.data;
                        self.tableData = [];
                        for(let p in datalist){
                            var family_total_size = datalist[p].family_total_size/1073741824;
                            var family_total_used_size = datalist[p].family_total_used_size/1073741824;
                            family_total_size = family_total_size.toFixed(1);
                            family_total_used_size = family_total_used_size.toFixed(1);
                            //0未激活，1使用，2欠费，3暂停使用，4注销，9删除
                            var status = datalist[p].f_status;
                               if(status == 0){
                                  status = "未激活";
                               } else if(status ==1){
                                    status = "使用";
                               }
                               else if(status ==2){
                                     status = "欠费";
                               }
                               else if(status ==3){
                                status = "暂停使用";
                               }
                               else if(status ==4){
                                status = "注销";
                               }
                               //未说明
                                else if(status ==6){
                                status = "失效";
                               }
                               else if(status ==9){
                                status = "删除";
                               }
                            var table = {
                                "home_name":datalist[p].home_name,
                                "DA":datalist[p].DA,
                                "gander":datalist[p].gander==1?"男":"女",
                                "create_time":datalist[p].create_time,
                                "nick_name":datalist[p].nick_name,
                                "family_total_size":family_total_size +"G",
                                "family_total_used_size":family_total_used_size +"G",
                                "home_id":datalist[p].home_id,
                                "f_status":status

                            };
                              self.tableData.push(table);
                              self.flag =1;
                        }
                    })
            },
            //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少 200
                this.pagenum = val;
                if(this.flag == 1){
                    this.getData();
                }
                else{
                    this.search();
                }
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageidx = val;
                if(this.flag == 1){
                    this.getData();
                }
                else{
                    this.search();
                }            
            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
                //扩容显示的条件
                 if(this.multipleSelection.length >1 || this.multipleSelection.length ==0){
                    this.multi = true;              
                }
                else{
                    this.multi = false;              
                }
                //设置导出显示的条件
                if(this.multipleSelection.length <1){
                    this.length = true;
                }
                else{
                   this.length = false;
                }
            },
            //搜索框 搜索用户输入
            search(){
                var self = this;
				let	url = self.$iHomed("api", "user_search"),
                params = {
                    key:self.input,
                    page:self.pageidx,
                    page_size:self.pagenum
                };
               self.tableData=[];
               this.$http({
					url: url,
					type: "get",
					data: params
				})
				.then((res) => {
                    if(res.ret){
                        var searchData = res.data,
                        datalist = searchData.data;
                        console.log(datalist);
                         for(let p in datalist){
                              var family_total_size = datalist[p].familytotalsize/1073741824;
                            var family_total_used_size = datalist[p].familytotalusedsize/1073741824;
                            family_total_size = family_total_size.toFixed(1);
                            family_total_used_size = family_total_used_size.toFixed(1);
                            var table = {
                                "home_name":datalist[p].homename,
                                "DA":datalist[p].DA,
                                "gander":datalist[p].gander==1?"男":"女",
                                "create_time":datalist[p].createtime,
                                "nick_name":datalist[p].nickname,
                                "family_total_size":family_total_size +"G",
                                "family_total_used_size":family_total_used_size +"G",
                                "home_id":datalist[p].homeid,
                                "f_status":datalist[p].fstatus
                            };
                              self.tableData.push(table);
                        }
                            self.total = Number(searchData.datatotalnumber);
                            self.flag = 2;
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
            },
            //新增
            add(){
                this.addUser = true;
            },
            //prop 传回
            changeAdd(a,b){
                var self = this;
                this.addUser =a;
                 
                if(b){
                    b.create_time = self.dateTranslate(b.create_time.getFullYear())+"-"+self.dateTranslate(b.create_time.getMonth()+1)+"-"+self.dateTranslate(b.create_time.getDate())+" "+self.dateTranslate(b.create_time.getHours())
                +":"+self.dateTranslate(b.create_time.getMinutes());
                    console.log(b);
                    let url = this.$iHomed("api", "user_add");
                     this.$http({
                        url: url,
                        type: "post",
                        data: b
				})
				.then((res) => {
                    console.log(res);
                    if(res.ret){
                        self.$alert("添加成功");
                        self.getData();
                    }
                    else{
                        self.$alert(res.retmsg);
                    }
                })
                }
            },
            // 扩容
            dilatation() {
               if($(".is-checked").length ==1){
                 this.dialog = true;
               }
            },
            //导出全部数据
            exportAll(){
                var self = this;
                window.location =self.$iHomed("api","export_all");
            },
            //导出表格 只能获取当前页的全部数据
            export2Excel(){
                    var dataList = [];
                    var self = this;
                    setTimeout(function() {
                        var dataHeader = ['名字', 'ID', '性别','开户时间','昵称','总空间','已用空间','homeid','状态'];
                        dataList = self.multipleSelection;
                        console.log(dataList);
                        $('.conconent').tableExport({ type: 'excel', escape: 'false', dataList: dataList, dataHeader: dataHeader });
                }, 600);
            },
            importData(){
                this.importDialog = true;
            },
            //导入
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
                                    self.$alert("模板下载完成请查收！");
                                }
                                console.log(res);
                            })
            },
            //显示上传框
                importData(){
                    this.importDialog = true;
                },
                //确定导入
                importConfirm(){
                     var self = this;
                        var files = $('input[name="fileField"]').prop('files');//获取到文件列表
                        console.log(files);
                        if (files.length == 0) {
                            self.$message("请选择文件");
                            return;
                        } else {
                            var reader = new FileReader();//新建一个FileReader
                            reader.readAsText(files[0], "UTF-8");//读取文件
                            reader.onload = function (evt) { //读取完文件之后会回来这里
                                var fileString = evt.target.result;
                                //post方式上传图片到后台
                                var date = {"file": fileString};
                                console.log(date);
                                //提交表格的url
                                 let url = self.$iHomed("api", "user_add");
                                 self.$http({
                                    url: url,
                                    type: "post",
                                    data: date
                                })
                                .then((res) => {
                                    console.log(res);
                                    if(res.ret){
                                        self.$alert("添加成功");
                                        self.getData();
                                    }
                                    else{
                                        self.$alert(res.retmsg);
                                    }
                                })
                            
                            }
                        }
                },
                //导入取消
                cancel(){
                    this.importDialog = false;
                    $(".baseInfo").css("opacity","1");
                     this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });       
                }
        },
        components:{
            "add-user":AddUser,
            "v-dialog":Dialog
        }
    }
</script>
<style lang="" scoped>
.nav-wrapper{
    height:30px;
}
.content-wrapper.el-col.el-col-20{
    position:fixed;
    top:0;
    bottom:40px;
    left:240px;
    overflow:hidden;
}
    #buttonAll {
        width: 1000px;
        height: 35px;
        line-height: 35px;
        background: #fff;
    }

    .button:first-child{
        margin-left: 10px;
    }

    .button.el-button {
        border-radius: 0;
        margin-top:0;
    }
    
    .search.el-input {
        width: 200px;
        position: absolute;
        top: 30px;
        right: 240px;
    }
    .search .el-input__inner{
        height:24px;
        font-size:12px;
    }
    .el-input__inner {
        height: 35px;
    }
    .el-table__body-wrapper{
        overflow-x:hidden;
    }
    table {
        width:1100px;
        background-color: #f0f0f0;
        font-size: 12px;
    }
    .el-table.position{
        position:absolute;
        top:70px;
        bottom:35px;
        font-size: 12px;
        overflow-y:scroll;
        overflow-x:hidden;
    }
    .el-table--enable-row-transition .el-table__body td{
        height:30px;
    }
    .el-table div.cell {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
}
    .el-table__row {
        height: 30px;
    }
    
    .input {
        width: 36px;
    }
    .block{
        position:absolute;
        bottom:2px;
        left:300px;
        height:30px;
    }
    .dialogBtn {
        width: 40%;
        height: 35px;
        border: 1px solid #000;
    }
    ul li{
        list-style:none;
    }
    a{
        color:#000;
    }
    .import{
        position:fixed;
        top:200px;
        left:600px;
        width:300px;
        height:240px;
        background:#fff;
        z-index:100;
    }
    .import div:not(.title){
        margin-top:10px;
        margin-left:100px;
    }
    .title{
         width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
    }
    .mask{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.1;
        z-index:98;
    }
</style>