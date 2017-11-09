<template>
<div>
<div class="nav-wrapper">
			<!-- 面包屑导航路径 -->
			<el-breadcrumb separator=">">
			  <el-breadcrumb-item>数据统计</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
    <div class="disk-chart-wrapper">

        <el-button-group>
              <el-button type="primary" v-bind:class="getDateChart" @click="curSelectType='date'">日线图</el-button>
              <el-button type="primary" v-bind:class="getMonthChart" @click="curSelectType='month'">月线图</el-button>
              <el-button type="primary" v-bind:class="getYearChart" @click="curSelectType='year'">年线图</el-button>
        </el-button-group>

        <!-- 日期选择框 -->
        <el-date-picker
            v-show="curSelectType == 'date'"
            v-model="curDate"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions"
            type="date">
        </el-date-picker>

        <!-- 月份选择框 -->
        <el-date-picker
            v-show="curSelectType == 'month'"
            v-model="curDate"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions"
            type="month">
        </el-date-picker>
        <!-- 年份选择框 -->
        <el-date-picker
            v-show="curSelectType == 'year'"
            v-model="curDate"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions"
            type="year">
        </el-date-picker>

        <!-- 磁盘图表 -->
        <div id="diskChart"></div>
        
    </div>
    </div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios'

export default {
    // props:["did", "date"],
    data() {
        var self = this;
        return {
            did:0,
            date:new Date(),
            chart: null,
            curSelectType: "date",
            timer: 0,
            curDate: new Date(),
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > self.date.getTime();
                }
            },
        }
    },
    methods: {
        /**
         * 初始化图表
         * @return {Object} 图表对象
         */
        initChart: function () {
            var self = this,
                container = document.getElementById("diskChart"),
                myChart = echarts.init(container);

            myChart.setOption({
                title: {
                    text: container.getAttribute('title'),
                    textStyle: {
                        color: "#d7f1ff",
                        fontSize: 14,
                        fontWeight: "normal"
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return params[0].name + '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params[0].color+'"></span>' + params[0].seriesName + "：" + params[0].data + (!params[1] ? "" : '<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params[1].color+'"></span>' + params[1].seriesName + "：" + params[1].data);
                    },
                    axisPointer: {
                        // lineStyle: {
                        //     width: 2,
                        //     color: "#CCEFF6"
                        // }
                    }

                },
                legend: {
                    top: 5,
                    right: 70,
                    itemHeight: 7,
                    itemWidth: 7,
                    // padding: [5, 70, 5, 5],
                    // itemGap: 70,
                    data: [{
                        name: "总空间",
                        icon: 'roundRect'
                    },
                    {
                        name: "用户数量",
                        icon: 'roundRect'
                    }],
                    textStyle: {
                        color: '#5f6a7e'
                    },
                    // formatter: '{name}速度'
                },
                color: ["#2fbb58","#457dda"],
                textStyle: {
                    color: '#5f6a7e'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    },
                    right: 20
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    boundaryGap: false,
                    axisLabel: {
                        formatter: function ( time, index ) {
                            var timeArr = time.split(/[\-\ ]/);

                            return timeArr[timeArr.length - 1];
                        }
                    }
                },
                yAxis: [{
                    type: 'value',
                },
                 {
                    type : 'value',
                    axisLabel : {
                        formatter: '{value}'
                    },
                    splitLine:{show: false},
                }],
                dataZoom: [
                    {
                        type: 'inside',
                    }
                ],
                series: [
                    {
                        name: "总空间",
                        type:'line',
                        showSymbol: true,
                        itemStyle: {normal:{
                            color: "#2fbb58",
                            opacity: 0.5
                        }},
                        lineStyle: {normal:{
                            color: "#2fbb58"
                        }},
                        data:[],
                    },
                    {
                        name: "用户数量",
                        type:'line',
                        showSymbol: true,
                        itemStyle: {normal:{
                            color: "#20A0FF",
                            opacity: 0.5
                        }},
                        lineStyle: {normal:{
                            color: "#20A0FF"
                        }},
                        data:[],
                        yAxisIndex:'1', 
                    }
                ]
            });

            return myChart;
        },
        /**
         * 获取图表数据
         * @param  {String} url    请求地址
         * @param  {Object} config 请求配置
         * @return 无
         */
        getChartData: function ( url, config ) {
            var self = this,
                xData= [],
                yData = [],
                yData1 = [],
                pa="",
                date = "",
                unit = "",
                value = "",
                params = config.params || {};
                for(let p in params){
                    if(typeof params[p] == "number"){
                        params[p] = params[p]+"";
                    }
                    switch(params[p].split("-").length){
                        case 1:
                        pa = "year";
                        break;
                         case 2:
                        pa = "month";
                        break;
                         case 3:
                        pa = "day";
                        break;
                }
                value = params[p];
            }
            axios.get(url, config)
                .then(function ( response ) {
                    var data = response.data.data;
                    // console.log(data.file[pa][value]);
                    var eData = data.file[pa][value];
                    var eData1 = data.user[pa][value];
                    console.log(eData1);
                    for(let p in eData.data){
                            xData.push(p);
                            var y = eData.data[p]/1073741824;
                            y = y.toFixed(3);
                            yData.push(y);
                    }
                    for(let p in eData1.data){
                        yData1.push(eData1.data[p]);
                    }
                    var max = null;
                    switch(pa){
                        case "year":
                            unit = "月";
                            max = 50;
                            break;
                        case "month":
                            unit = "日";
                            max = 10;
                            break;
                        case "day":
                            unit = "点";
                            max = 10;
                            break;
                    }
                    var maxNum = ((eData.maximum+ eData.maximum*0.2)/1073741824).toFixed(3),
                        interval = (eData.interval*2 /1073741824).toFixed(3);
                     self.chart.setOption({
                        xAxis: {
                            data: xData,
                            axisLabel: {
                                formatter: function ( value, index ) {
                                    return value ? value + unit : 0;
                                }
                            }
                        },
                        yAxis: [{
                            min: eData.minimum,
                            max: maxNum,
                            interval:interval ,
                            axisLabel: {
                                formatter: function ( value, index ) {
                                    return value ? value +"G": 0;
                                }
                            }
                        },
                        {
                            min: eData1.minimum,
                            max: eData1.maximum + eData1.maximum,
                            interval:eData1.interval
                        }],
                        series: [{
                            data: yData
                        },
                        {
                            data: yData1
                        }]
                    });
                })
                .catch(function ( response ) {
                    console.log(response);
                });
        },
    },
    computed: {
        getDateChart: function () {
            var that = this;
            if ( that.curSelectType != "date" ) return [];
            var d = that.curDate;
            console.log(d);
            var month = d.getMonth() +1,
                date = d.getDate();
            if(month < 10){
                month = "0"+month;
            }
            if(date <  10){
                date = "0"+date;
            }
            var day = d.getFullYear()+ "-" + month + "-" + date;
            console.log(day);
            that.getChartData(this.$iHomed("api","account_data"),{
                params: {
                    date:day
                }
            });
            return ["active"];
        },
        getMonthChart: function () {
            var that = this;
            if ( that.curSelectType != "month" ) return [];
            var d = that.curDate;
             var month = d.getMonth() +1;
            if(month <10){
                month = "0"+month;
            }
            var date = d.getFullYear() +"-"+month;
            console.log(date);
            that.getChartData(this.$iHomed("api","account_data"),{
                params: {
                    date:date
                }
            });
            return ["active"];
        },
        getYearChart: function () {
            var that = this;
            if ( this.curSelectType != "year" ) return [];
            var d = this.curDate;
            that.getChartData(this.$iHomed("api","account_data"),{
                params: {
                    date:d.getFullYear()
                }
            });
            return ["active"];
        },
        checkDate: function (date) {
            return true;
        }
    },
    mounted() {
        this.chart = this.initChart();
    }
}
</script>

<style>
.disk-chart-wrapper {
    display: inline-block;
    width: 80%;
    vertical-align: top;
    margin-top:20px;
}

#diskChart {
    width: 100%;
    height: 450px;
}

.disk-chart-wrapper .el-button-group {
    margin-left: 40px;
}

.disk-chart-wrapper .el-input {
    width: 120px;
    vertical-align: bottom;
}

.disk-chart-wrapper .el-input input {
    border-color: #1b4573!important;
    border-radius: 4px!important;
}

.disk-chart-wrapper .el-button {
    background-color: transparent!important;
    border-color: #1B4573!important;
    color: #9fabc6!important;
}

.disk-chart-wrapper .el-button.active {
    background-color: #20A0FF!important;
    color: #fff!important;
}
</style>