/*
 * @Author: @zhangweicalm 
 * @Date: 2021-04-12 21:35:40 
 * @Last Modified by: @zhangweicalm
 * @Last Modified time: 2021-05-11 20:13:34
 */
// import * as Cesium from 'cesium';
// window.Cesium = Cesium

// import './plugins/cesiumTdt'

/* eslint-disable */
import Vue from 'vue'

//element-ui
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

//vuetify
import Vuetify from 'vuetify/lib/framework';
Vue.use(Vuetify);
let vuetify = new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
      }
});

//font
import "@/assets/css/iconfont.css";

//main container
import App from './App'

//context
import { SERVER } from "./js/utils";
const host = SERVER.host;

//vuex-store
import store from './store/index'

// axios
import axios from 'axios';
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;


Vue.config.productionTip = false

const vueApp = new Vue({
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')

//global vue instance
window.vue = vueApp

//global show container content
window.showElements = function () {
    let markers = window.vue.$children[0].$refs.mapViewer.$refs.marker.$refs.markerManager.markerManager.manager;
    let graphics = window.graphicManager.manager;
    let layers = window.vue.$children[0].$refs.mapViewer.$refs.marker.$refs.layerManager.json;
    console.log({ 'layers': layers, 'graphics': graphics, 'markers': markers })
    //window.markers = markers;
    //window.graphics = graphics;
}