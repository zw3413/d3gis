/*
 * @Author: @zhangweicalm 
 * @Date: 2021-04-12 22:28:00 
 * @Last Modified by: @zhangweicalm
 * @Last Modified time: 2021-05-11 22:43:43
 */

<template>
  <div>
    <!-- cesium container -->
    <cesiumContainer ref="cesium_container"></cesiumContainer>

    <!-- file manager button and dialog -->
    <fileManagerButton ref="fileManagerButton"></fileManagerButton>

    <!-- left container -->
    <left-container ref="left_container"></left-container>

 
  </div>
</template>

<script>
/* eslint-disable */
import cesiumContainer from "../components/mapViewer/cesiumContainer";
import leftContainer from "../components/mapViewer/leftContainer/leftContainer"

import fileManagerButton from "@/components/mapViewer/bottomControlContainer/fileManagerButton";

const Cesium = window.Cesium;
export default {
  data() {
    return {
      drawHelper: "",
      viewerMounted: false,
      drawviewerShow: true,
     
      model: [
        { id: "model0", name: "木塔", url: "static/model/Wood_Tower.gltf" },
        { id: "model1", name: "人", url: "static/model/Cesium_Man.gltf" },
      ],
    };
  },
  components: {
    cesiumContainer,
    leftContainer,
   
    fileManagerButton,
  },
  props: {},
  computed: {},
  beforeMount() {},
  mounted() {
    const viewer = window.cesiumViewer;
    const tileset = new Cesium.Cesium3DTileset({
      url: "static/Photogrammetry/tileset.json",
    });
  
    tileset.readyPromise.then((t) => {
      viewer.scene.primitives.add(t);
      // viewer.camera.viewBoundingSphere(t.boundingSphere)
    });
  },
  methods: {},
  watch: {},
};
</script>

<style>
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #e0e0e0;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px; /*滚动条的背景区域的圆角*/
  background-color: #a1a1a1; /*滚动条的背景颜色*/
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 5px; /*滚动条的圆角*/
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #e0e0e0; /*滚动条的背景颜色*/
}
#toolbar {
  width: 100px;
  height: 200px;
  position: fixed;
  top: 10px;
  left: 10px;
  background-color: whitesmoke;
}
.toolbar {
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 100;
}
.toolbar .el-button {
  background-color: #ffffff00;
  border: 0px;
  margin-left: 0px;
}

/* fileManagerButton{
  position:absolute;
  right:58px;
  bottom:0;
  height: 29px;
  width:29px;
} */
</style>
