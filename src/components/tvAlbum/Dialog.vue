<template>
<div  v-show="dialog" v-if="multipleSelection">
    <div class="mask"></div>
    <div class='pop'>
        <div class="title">扩容</div>
        <p><b>开户账户:</b>{{multipleSelection.home_name}}</p>
        <p><b>原总空间:</b>{{multipleSelection.family_total_size}}</p>
        <p><b>已用空间:</b>{{multipleSelection.family_total_used_size}}</p>
        <p style='margin-bottom:0;'><b>扩容后空间:</b><input type='text' class='input' height='20' v-model="totalSpace"/>G</p>
        <div class="tips" v-if="totalSpace <= parseInt(multipleSelection.family_total_size)">不能低于已用空间！</div>
        <div class="button">
            <el-button class='dialogBtn' @click='updateUser'>确定</el-button>
            <el-button type="primary" class='dialogBtn' @click="cancel">取消</el-button>
        </div>              
    </div>
    </div>
</template>
<script>
    import axios from 'axios'

    export default{
        props:["multipleSelection","dialog"],
        data(){
            return {
                _dialog : this.dialog,
                totalSpace:"",
                Loading: null,
            }
        },
        mounted(){
        },
        methods:{
            loading(param) {
				param = Object.assign({
							target: ".userManage",
							text: "玩命扩容中，请稍候..."
						}, param || {});
				
				this.Loading = this.$loading(param);
			},
			// 关闭数据加载提示
			closeLoading() {
				this.$nextTick(() => {
					this.Loading.close();
				});				
			},
             updateUser(){
                 if(this.totalSpace <= parseFloat(this.multipleSelection.family_total_size)){
                     this.$alert('扩容空间低于原来空间！', '提示', {
                        confirmButtonText: '确定'
                        });
                     return false;
                 }
                var self = this;
                self._dialog = false;
                 self.$emit("dialog",this._dialog);
                self.loading();
                $.ajax({
                    url: this.$iHomed("api", "space_dilatation"),
                    type: 'POST',
                    data: {
							home_id: self.multipleSelection.home_id,
							family_total_size:self.totalSpace*1073741824
						},
                    success: function(data) {
                        self.closeLoading();
                        //0未激活，1使用，2欠费，3暂停使用，4注销，9删除
                        if(self.multipleSelection.f_status == "使用"){
                            console.log(data);                              
                             if(data.ret){
                                self.$alert("扩容成功");
                                self.$emit("ret",data.ret);
                                self.totalSpace = 0;
                            }
                            else{
                                self.$alert(data.ret_msg);
                                self.totalSpace = 0;
                            }
                        }
                        
                        else{
                           console.log(self.multipleSelection.f_status);
                            self.closeLoading();
							self.$alert(data.ret_msg);
                            self.totalSpace = 0;
                        }
                    },
                    fail: function() {
                        console.log(123)	
                    }
                });

            //     axios({
            // method: 'post',
            // url: this.$iHomed("api", "space_dilatation"),
            // data: {
            //    home_id: this.multipleSelection.home_id,
			// 				family_total_size:this.totalSpace*1073741824
            // }
            // })
					// .then((res) => {
                    //     console.log(res);
					// 	if(res.ret ==true) {
					// 		//成功操作
                    //         alert("成功");
					// 	}
					// 	else {
					// 		self.closeLoading();
					// 		self.$alert(ret.retmsg);
					// 	}
					// })
					// .catch((error) => {
					// 	self.closeLoading();
					// 	self.$alert("接口调用失败");
					// });
				},
            cancel(){
                this._dialog = false;
                this.$emit("dialog",this._dialog);
                this.$message('已取消操作');
            }                   
        }
    }
</script>
<style scoped>
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
    .pop{
        width:400px;
        height:210px;
        position:absolute;
        top:100px;
        left:500px;
        color:#000;
        z-index:100;
        background:#fff;
    }
    .pop p{
        margin-top:5px;
         margin-left:140px;

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
    .tips{
        width:150px;
        height:20px;
        margin-left:180px;
        color:red;
        font-size:10px;
    }
    .button{
        position:absolute;
        bottom:10px;
        left:140px;
    }
    .input{
        width:40px;
    }
</style>