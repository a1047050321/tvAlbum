<template>
<div>
<div class="mask"></div>
    <div class="editalInfo">
        <div class="title">添加管理员</div>
        <div class="content-box">
            <div><span class="icon-must"></span>开户人</div>
            <el-input v-model="form.user_name"></el-input>
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>账户ID</div>
            <el-input v-model="form.DA"></el-input>
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>home-id</div>
            <el-input v-model="form.home_id"></el-input>
        </div>
        <div class="content-box">
            <div>昵称</div>
            <el-input v-model="form.nick_name"></el-input>
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>家庭名称</div>
            <el-input v-model="form.homename"></el-input>
        </div>
        <div class="content-box">
            <div>用户中文名</div>
            <el-input v-model="form.person_name"></el-input>
        </div>
        <div class="content-box">
            <div>性别</div>
            <el-select v-model="form.gander"  placeholder="选择性别" style="width:75%;">
                <el-option
                    v-for="item in ganger"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>     
        </div>
        <div class="content-box">
            <div>手机号</div>
            <el-input v-model="form.mobile_no"></el-input>
        </div>
        <div class="content-box">
            <div><span class="icon-must"></span>开户时间</div>
            <el-date-picker
                        v-model="form.create_time"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
        </div>
        <div class="content-box">
            <div>身份证号</div>
            <el-input v-model="form.identity_card"></el-input>
        </div>
        <div class="content-box">
            <div>头像id</div>
            <el-input v-model="form.icon_id"></el-input>
        </div>
         <div class="content-box">
            <div>头像url</div>
            <el-input v-model="form.icon_url"></el-input>
        </div>
         <div class="content-box">
            <div>头像size</div>
            <el-input v-model="form.icon_size"></el-input>
        </div>
            <div class="content-box">
            <div><span class="icon-must"></span>状态</div>
            <el-select v-model="form.f_status" placeholder="选择状态" style="width:75%;">
                <el-option
                    v-for="item in guests"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>  
        </div>
          <div class="confirm" style="text-align:center;margin-top:10px;">
         <el-button type="primary" @click="submit">确定</el-button>
         <el-button type="primary" @click="cancel">取消</el-button>
     </div>
        </div>
    </div>
</div>
</template>
<script>
    export default{
        props:["addUser"],
        data(){
            return {
            form: {
                    user_name:'',
                    DA: '',
                    nick_name: '',
                    gander:'',
                    mobile_no:'',
                    create_time:'',
                    home_id:"",   
                    f_status:"",
                    person_name:"",
                    identity_card:"",
                    icon_id:"",
                    icon_url:"",
                    icon_size:"",
                    homename:"",
                },   
                    ganger:[{
                        value:1,
                    label:"男"
                    },{
                        value:2,
                    label:"女"
                    }],  
                    guests:[{
                    value:0,
                    label:"未激活"
                    },
                {
                    value:1,
                    label:"使用"
                },    
                {
                    value:2,
                    label:"欠费"
                },
                {
                    value:3,
                    label:"暂停使用"
                },
                 {
                    value:4,
                    label:"注销"
                },
                 {
                    value:9,
                    label:"删除"
                }],
            }
        },
       
        methods:{
            //表单提交
        submit(){
            let form = this.form;
                    if(!form.user_name ||!form.DA ||!form.f_status ||!form.create_time ||!form.homename ||!form.home_id){
                        this.$message('信息没有补全哦');
                        return false;
                    }
                    this.$emit("addUser",false,this.form);
        },
        reset(){
            let form = this.form;
            for(let p in form){
                form[p] = "";
            }
        },
            cancel(){
                 this.$message("已取消操作！");
                 this.$emit("addUser",false);
                
            }
        }
    }
</script>
<style scoped>
.title{
     width:100%;
        height:40px;
        margin-bottom:10px;
        line-height:40px;
        text-align:center;
        background:#20A0FF;
        color:#fff;
}
    .editalInfo{
        position:fixed;
        top:100px;
        left:500px;
        width:480px;
        height:520px;
        background:#fff;
        z-index:99;
        opacity:1;
    }
    .table_cell{
        float:left;
    }
    .table_cell div{
        width:280px;
        height:30px;
        line-height:30px;
        margin:0 0 10px 20px;
        font-size:14px;
    }
    .mask{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:#000;
        opacity:0.3;
        z-index:98;
    }
    .content-box{
        width:240px;
        height:60px;
        float:left;
    }
    .content-box .el-input{
        width:180px;
    }
    .content-box div:not(.title){
        margin-left:20px;
    }
    .content-box1 div{
        margin-left:20px;
    }
    .el-input{
        margin-top:0;
        width:420px;
    }
    
</style>