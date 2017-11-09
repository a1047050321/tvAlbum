import Vue from 'vue'
import Router from 'vue-router'
import DataAccount from '@/components/tvAlbum/DataAccount'
import UserManage from '@/components/tvAlbum/UserManage'
import AddUser from '@/components/tvAlbum/AddUser'
import UserImport from '@/components/tvAlbum/UserImport'
import Operate from '@/components/tvAlbum/Operate'

import Upload from '@/components/publicAlbum/Upload'
import Audit from '@/components/publicAlbum/Audit'
import Released from '@/components/publicAlbum/Released'
import Releasing from '@/components/publicAlbum/Releasing'
import Rejected from '@/components/publicAlbum/Rejected'
import Laid from '@/components/publicAlbum/Laid'
import RightManage from '@/components/RightManage'
import OperateLog from '@/components/OperateLog'
// import SystemSetting from '@/components/SystemSetting'
// import Login from "@/components/Login"
import Home from "@/components/Home"
Vue.use(Router)

const router = new Router({
    // mode: 'history',	
    routes: [{ // 首页，也是数据统计
            path: '/',
            name: 'Index',
            redirect: { name: 'Home' }
        },
        // {
        //     path: '/login',
        //     name: 'Login',
        //     component: Login,
        //     meta: {
        //         requireAuth: true
        //     }
        // },
        { // 首页，也是Home
            path: '/home',
            name: 'Home',
            component: Home,
            redirect: {
                name: 'DataAccount'
            },
            children: [{ // 数据管理
                    path: '/dataAccount',
                    name: 'DataAccount',
                    component: DataAccount,
                },
                { // 用户管理
                    path: '/userManage',
                    name: 'UserManage',
                    component: UserManage,
                },
                { // 用户上传
                    path: '/upload',
                    name: 'Upload',
                    component: Upload,
                },
                { // 照片审核
                    path: '/audit',
                    name: 'Audit',
                    component: Audit,
                },
                { // 照片待发布
                    path: '/releasing',
                    name: 'Releasing',
                    component: Releasing,
                },
                { // 照片已发布
                    path: '/released',
                    name: 'Released',
                    component: Released,
                    Releasing
                },
                { // 照片已驳回
                    path: '/rejected',
                    name: 'Rejected',
                    component: Rejected,
                    Releasing
                },
                { // 照片已发布
                    path: '/laid',
                    name: 'Laid',
                    component: Laid,
                    Releasing
                },
                { // 用户新增
                    path: '/userManage/addUser',
                    name: 'AddUser',
                    component: AddUser,
                },
                //导入数据
                {
                    path: '/userManage/userImport',
                    name: 'UserImport',
                    component: UserImport,
                },
                { // 权限管理
                    path: '/rightManage',
                    name: 'RightManage',
                    component: RightManage
                },
                { // 操作记录
                    path: '/operate',
                    name: 'Operate',
                    component: Operate
                },
                { // 操作记录
                    path: '/operateLog',
                    name: 'OperateLog',
                    component: OperateLog
                },
                // { // 系统设置
                //     path: '/systemSetting',
                //     name: 'SystemSetting',
                //     component: SystemSetting
                // },
            ]
        },

    ]
})

export default router