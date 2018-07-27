import Vue from 'vue'
import Router from 'vue-router'
import ElementUi from '@/components/element-ui/element-ui'
import axios from 'axios'
import Home from '@/components/home/home'
import SourceManage from '@/components/source-manage/source-manage'
import ProgramProduction from '@/components/program-production/program-production'
import DraftBox from '@/components/draft-box/draft-box'
import Terminal from '@/components/terminal/terminal'
import Login from '@/components/login/login'
import Reset from '@/components/reset/reset'
import Store from '@/components/store/store'
import Help from '@/components/help/help'
import WorkTime from '@/components/work-time/work-time'
import ProgramControl from '@/components/program-control/program-control'
import NoworkTime from '@/components/nowork-time/nowork-time'
import FullScreen from '@/components/full-screen/full-screen'
import SelectFile from '@/components/select-file/select-file'
import DragFile from '@/components/drag-file/drag-file'
import ProgramEdit from '@/components/program-edit/program-edit'
import PC from '@/components/pc/pc'
import DeviceManage from '@/components/device-manage/device-manage'

import ListView from '@/base/list-view/list-view'
import ItemView from '@/base/item-view/item-view'
import Histogram from '@/base/histogram/histogram'
import On from '@/base/on/on'
import Off from '@/base/off/off'
import Full from '@/base/full/full'
import TimeList from '@/base/time-list/time-list'
import TemplateList from '@/base/template-list/template-list'
import SourceSelect from '@/base/source-select/source-select'
import TimeChart from '@/base/time-chart/time-chart'
import IB from '@/base/interactive-box/interactive-box'
import IS from '@/base/interactive-select/interactive-select'
import TF from '@/base/transform/transform'

import store from '../store/index'
import * as types from '../store/mutation-types'

Vue.use(Router)

const router =  new Router({
    routes: [
    {
        path: '/',
        component:ElementUi,
        redirect: '/home',
        children: [
        {
          path: 'home',
          component: Home,
          meta: { 
            requireAuth: true,
            keepAlive: false // 需要被缓存
          }
        },
        {
          path: 'pc',
          component: PC,
          meta: { 
            requireAuth: true,
            keepAlive: false // 需要被缓存
          },
          redirect: '/pc/program-control',
          children: [
          {
            path: 'program-control',
            component: ProgramControl,
            meta: { 
              requireAuth: true,
              keepAlive: false // 需要被缓存
            }
          },
          {
            path: 'pe',
            component: ProgramEdit,
            meta: { 
              requireAuth: true,
              keepAlive: false // 需要被缓存
            }
          },
          {
            path: 'select',
            component: SelectFile,
            meta: { 
              requireAuth: true,
              keepAlive: false
            }
          },
          {
            path: 'order',
            component: DragFile,
            meta: { 
              requireAuth: true,
              keepAlive: false 
            }
          }]
        },
        {
          path: 'program-production',
          component: ProgramProduction,
          redirect: '/program-production/work-time',
          meta: { 
            requireAuth: true,
            keepAlive: false
          },
          children:[
             {
              path:'work-time',
              component: WorkTime,
              meta: { 
                requireAuth: true,
                keepAlive: false
              },
              redirect: '/program-production/work-time/on',
              children: [
                {
                  path:'on',
                  component: On,
                  keepAlive: false
                },
                {
                  path:'off',
                  component: Off,
                  keepAlive: false
                },
                {
                  path:'full',
                  component: Full,
                  keepAlive: false
                }
              ]
            },
            {
              path: 'select',
              component: SelectFile,
              meta: { 
                requireAuth: true,
                keepAlive: false
              }
            },
            {
              path: 'order',
              component: DragFile,
              meta: { 
                requireAuth: true,
                keepAlive: false
              } 
            }]
        },
        {
          path: 'source-manage',
          component: SourceManage,
          meta: { 
            requireAuth: true,
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'terminal',
          component: Terminal,
          meta: { 
            requireAuth: true,
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'help',
          component: Help,
          meta: { 
            requireAuth: true,
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'store',
          component: Store,
          meta: { 
            requireAuth: true,
            keepAlive: true // 需要被缓存
          }
        },
        {
          path: 'draft-box',
          component: DraftBox,
          meta: { 
            requireAuth: true,
            keepAlive: false 
          }
        },
        {
          path: 'device-manage',
          component: DeviceManage,
          meta:{
            requireAuth: true,
            keepAlive: false 
          }
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      keepAlive: false 
     },
    {
      path: '/tf',
      component: TF,
      keepAlive: false 
     }//,
    // {
    //   path: '/reset',
    //   component: Reset,
    //   keepAlive: false 
    // },
    // {
    //   path: '/tl',
    //   component: TimeList,
    //   keepAlive: false 
    // },
    // {
    //   path: '/tel',
    //   component: TemplateList,
    //   keepAlive: false 
    // },
    // {
    //   path: '/ss',
    //   component: SourceSelect,
    //   keepAlive: false 
    // },
    // {
    //   path: '/tc',
    //   component: TimeChart,
    //   keepAlive: false 
    // },
    // {
    //   path: '/ib',
    //   component: IB,
    //   keepAlive: false 
    // },
    // {
    //   path: '/is',
    //   component: IS,
    //   keepAlive: false 
    // }
  ],
  linkActiveClass: 'menuActive'
})

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.LOGIN, window.localStorage.getItem('token'))
}

// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限

    //console.log(from,to);

    //判断是不是直接进入 如果直接进入验证token是否合法
    if(from.path === '/' && to.path === '/home'){
      if(localStorage.getItem('token')){
        var token = localStorage.getItem('token');
        //验证token是否合法
        axios.post('http://developsky.skylandertech.cn/api/user').then(res=>{
          //console.log(res);
          if(res.data.status.substr(0,1) == '4'){
            next({
              path: '/login'
            });
          }else{
            next();
          }
        });
      }
    }else{
      if (localStorage.getItem('token')) { // 判断是否登录
        next()
      } else { // 没登录则跳转到登录界面
        next({
          path: '/login'
        })
      }
    }

  } else {
    next()
  }
})

export default router
