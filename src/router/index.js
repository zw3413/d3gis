/*
 * @Author: zhangbo
 * @E-mail: xtfge_0915@163.com
 * @Date: 2019-10-09 19:47:35
 * @LastEditors: zhangbo
 * @LastEditTime: 2020-02-28 11:24:39
 * @Desc: 
 */
import Router from 'vue-router'

const router= new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component:  resolve => require(['@/Apps/mapViewer/mapViewer'],resolve)
    }
  ]
})
export default router
