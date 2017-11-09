<template>
    <div id="main">
    <div class="nav-wrapper">
			<!-- 面包屑导航路径 -->
			<el-breadcrumb separator=">">
			  <el-breadcrumb-item>操作记录</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
        <div class="search-bar">
            <p class="search-tip">查找条件：</p>
            <div class="search-box">
                        操作人：
                <el-select v-model="user_name" placeholder="选择管理员">
                    <el-option
                    v-for="item in guest"
                    :key="item.user_name"
                    :label="item.user_name"
                    :value="item.user_name">
                    </el-option>
                    </el-select>     
                        <el-date-picker
                        v-model="value1"
                        style="margin-left:200px;"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                        -
                        <el-date-picker
                        v-model="value2"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    <el-button type="primary" @click="search" style="margin-left:20px;">查找</el-button>
                    <el-button @click="reset">重置</el-button>
            </div>
        </div>
         <el-table ref="multipleTable" class="tablePos" height="40px;" :data="tableData" style="width:1100px;" @selection-change="handleSelectionChange">
            <el-table-column label="序号" width="80" type="index">
            </el-table-column>
            </el-table-column>
            <el-table-column prop="home_id" label="homeid" width="120">
            </el-table-column>
            <el-table-column prop="field_name" label="操作属性" width="200">
            </el-table-column>
            <el-table-column prop="user_name" label="操作人" width="200">
            </el-table-column>
            <el-table-column prop="add_time" label="操作时间" width="250">
            </el-table-column>   
            <el-table-column prop="result" label="操作结果">
            </el-table-column>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
            style="margin-left:100px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20,50,100, 200, 300]"
            :page-size="pagenum"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>    
</div>
</template>
<script>
    import axios from 'axios'

    export default{
        data(){
            return {
                alert: true,
                input: '',
                total:1,
                pageidx:1,
                currentPage: 1,
                pagenum:20,
                tableData: [],
                multipleSelection: [],
                value1:"",
                value2:"",
                guest:[],
                user_name:"",
                flag:1,
                startTime:"",
                endTime:""
            }
        },
        mounted(){
            this.getData();
            this.getUser();
        },
        methods:{
            //获取数据
            getData(){
                var self = this;
                self.flag= 1;
                var url = this.$iHomed("api", "operator_history");
                var table= {};
                self.tableData = [];
                axios.get(url,{
                    params:{
                         accesstoken: this.$iHomed("config", "token"),
                         page:this.pageidx,
                         page_size:this.pagenum
                    }
                }).then(function(res){
                    var datalist = res.data.data;
                    console.log(datalist);
                        self.total = Number(datalist.data_total_number);
                        for(let i = 0;i<datalist.data.length;i++){
                            //扩容数据处理
                            var old_value = datalist.data[i].old_value/1073741824;
                            var new_value = datalist.data[i].new_value/1073741824;
                            new_value = new_value.toFixed(1);
                            old_value = old_value.toFixed(1);
                            table = {
                                home_id:datalist.data[i].home_id,
                                field_name:datalist.field_name.family_total_size,
                                user_name:datalist.data[i].user_name,
                                add_time:datalist.data[i].add_time,
                                result:datalist.field_name.family_total_size+"从"+ old_value +"G"
                                         +"变到"+ new_value +"G"
                            }
                            self.tableData.push(table);
                        }
                })
            },
            getUser(){
                var self = this;
                var url = this.$iHomed("api", "operator_user");
                var table= {};
                self.tableData = [];
                axios.get(url).then(function(res){
                    console.log(res.data.data);
                    self.guest = res.data.data;
                })
            },
             //选择显示数量
             handleSizeChange(val) {
                 //看接口最大能获取多少
                console.log(`每页 ${val} 条`);
                this.pagenum = val;
                if(this.flag == 1){
                    this.getData();
                }
                else if(this.flag == 2){
                    this.search();
                }
            },
            //点击第几页
            handleCurrentChange(val) {
                this.pageidx = val;
                if(this.flag == 1){
                    this.getData();
                }
                else if(this.flag == 2){
                    this.search();
                }            },
            //多选框
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //进行筛选
            search(){
                var self = this;
                self.flag= 2;
                var table= {};
                self.tableData = [];
                if(self.value1 && self.value1){
                self.startTime = self.dateTranslate(self.value1.getFullYear())+"-"+self.dateTranslate(self.value1.getMonth()+1)+"-"+self.dateTranslate(self.value1.getDate())+" "+self.dateTranslate(self.value1.getHours())
                +":"+self.dateTranslate(self.value1.getMinutes());
                self.endTime =self.dateTranslate(self.value2.getFullYear())+"-"+self.dateTranslate(self.value2.getMonth()+1)+"-"+self.dateTranslate(self.value2.getDate())+" "+self.dateTranslate(self.value2.getHours())
                +":"+self.dateTranslate(self.value2.getMinutes());
                }
                self.$http({
                    type:"get",
                    url:self.$iHomed("api", "operator_search"),
                    data:{
                         page:self.pageidx,
                         page_size:self.pagenum,
                         user_name:self.user_name,
                         start_time:self.startTime,
                         end_time:self.endTime
                    }
                }).then((res)=>{
                    console.log(res);
                    var datalist = res.data;
                    console.log(datalist);
                        self.total = Number(datalist.datatotalnumber);
                        for(let i = 0;i< datalist.data.length;i++){
                            //扩容数据处理
                            var old_value = datalist.data[i].oldvalue/1073741824;
                            var new_value = datalist.data[i].newvalue/1073741824;
                            new_value = new_value.toFixed(1);
                            old_value = old_value.toFixed(1);
                            table = {
                                home_id:datalist.data[i].homeid,
                                field_name:datalist.fieldname.familytotalsize,
                                user_name:datalist.data[i].username,
                                add_time:datalist.data[i].addtime,
                                result:datalist.fieldname.familytotalsize+"从"+ old_value +"G"
                                         +"变到"+ new_value +"G"
                            }
                            self.tableData.push(table);
                        }
                })
            },
            reset(){
                this.user_name="";
                this.value1 = "";
                this.value2 = "";
                this.getData();
            }
        }
    }
</script>
<style lang="" scoped>
    #main{
        font-size:14px;
    }
    .el-input,.el-select{
        width:200px;
    }
    .el-picker-panel .el-input{
        width:150px;
    }
    .search-box{
        margin:10px 0;
    }
    .tablePos.el-table{
        position:absolute;
        top:100px;
        bottom:35px;
        font-size: 12px;
        overflow-y:scroll;
    }
    .el-table__body-wrapper{
        overflow-x:hidden;
    }
    table {
        width:1100px;
        background-color: #f0f0f0;
        font-size: 12px;
        
    }
    .search .el-input__inner{
        height:24px;
        font-size:12px;
    }
    .el-table.position{
        position:absolute;
        top:90px;
        bottom:35px;
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
        height: 18px;
    }
    .tablePos.el-table[data-v-c3bcc478] {
    position: absolute;
    top: 110px;
    bottom: 35px;
    overflow-y: scroll;
}
    .block{
        position:absolute;
        bottom:2px;
        left:300px;
        height:30px;
    }
</style>