/*
 * @Author: @zhangweicalm 
 * @Date: 2021-04-12 22:47:14 
 * @Last Modified by: @zhangweicalm
 * @Last Modified time: 2021-05-10 21:33:25
 */

<template>
  <div style="height: 100%" class="fullSize">
    <div class="full-container" :style="viewStyle" id="cesiumContainer"></div>
    <div id="loadingOverlay">
      <h1>Loading...</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "CesiumContainer",
  viewerProperty: {},
  props: {
    viewStyle: {},
    viewerProperty: {},
    dropBackground: {
      default: false,
    },
  },
  components: {},
  data() {
    return {
      viewer: null,
    };
  },
  computed: {},
  mounted() {
    const Cesium = window.Cesium;
    const _this = this;

    var cesiumAsset =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDhmOGU1Mi1kYTU4LTQ1ZGUtOWQxZS0yMGJiYWMyNjhhOTMiLCJpZCI6MzUyNDUsImlhdCI6MTYwMTU5MTMwMX0.Y0vt0Lnp7En8YK3HqUz8ac-JDnZyAR79qnyh4tKssdE";
    // var tiandituTk = "612ae65756225e3affda8a30ac248fb6";
    // var subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];

    Cesium.Ion.defaultAccessToken = cesiumAsset;
    _this.viewerDefaultProperty = {
      animation: false, //动画
      homeButton: true, //home键
      geocoder: false, //地址编码
      baseLayerPicker: false, //图层选择控件
      timeline: false, //时间轴
      fullscreenButton: true, //全屏显示
      infoBox: false, //点击要素之后浮窗
      sceneModePicker: false, //投影方式  三维/二维
      navigationInstructionsInitiallyVisible: false, //导航指令
      navigationHelpButton: false, //帮助信息
      selectionIndicator: true, // 选择
      //terrainProvider: Cesium.createWorldTerrain(),
    };

    for (let property in _this.viewerProperty) {
      _this.viewerDefaultProperty[property] = _this.viewerProperty[property];
    }
    const viewer = new Cesium.Viewer("cesiumContainer", {
      animation: false, //动画
      homeButton: true, //home键
      geocoder: false, //地址编码
      baseLayerPicker: false, //图层选择控件
      timeline: false, //时间轴
      fullscreenButton: true, //全屏显示
      infoBox: false, //点击要素之后浮窗
      sceneModePicker: false, //投影方式  三维/二维
      navigationInstructionsInitiallyVisible: false, //导航指令
      navigationHelpButton: false, //帮助信息
      selectionIndicator: true, // 选择
      imageryProvider: false,
      // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      //   //影像底图
      //   url:
      //     "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" +
      //     tiandituTk,
      //   subdomains: subdomains,
      //   layer: "tdtImgLayer",
      //   style: "default",
      //   format: "image/jpeg",
      //   tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
      //   show: true,
      // })
      // terrainProvider: Cesium.createWorldTerrain(),
    });
    window.cesiumViewer = viewer;

    //支持丢入文件
    viewer.extend(Cesium.viewerDragDropMixin);
    viewer.dropError.addEventListener(function (dropHandler, name, error) {
      console.log(error);
      window.alert(error);
    });
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000; //相机的高度的最小值
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000; //相机高度的最大值
    viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
    viewer.scene.screenSpaceCameraController._maximumZoomRate = 5906376272000; //设置相机放大时的速率

    //天地图文字标注
    // viewer.imageryLayers.addImageryProvider(
    //   new Cesium.WebMapTileServiceImageryProvider({
    //     url:
    //       "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
    //       tiandituTk,
    //     layer: "tdtAnnoLayer",
    //     style: "default",
    //     format: "image/jpeg",
    //     tileMatrixSetID: "GoogleMapsCompatible",
    //   })
    // );
    //viewer._cesiumWidget._creditContainer.style.display = "none";  // 隐藏cesium ion

    var options = {
      camera: viewer.scene.camera,
      canvas: viewer.scene.canvas,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(-90),
        0
      ),
      //offset: new Cesium.HeadingPitchRange(0, 90, 0),
      clampToGround: true, //开启贴地
    };
    window.options = options;

    //清除cesium-widget-credits
    const credits = document.getElementsByClassName("cesium-widget-credits");
    credits[0].parentElement.removeChild(credits[0]);

    //禁止双击zoom
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    viewer.scene.postProcessStages.fxaa.enabled = false;

    //加载后飞到中国上空
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 7000000),
      orientation: {
        heading: Cesium.Math.toRadians(348.4202942851978),
        pitch: Cesium.Math.toRadians(-89.74026687972041),
        roll: Cesium.Math.toRadians(0),
      },
    });

    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
      function (e) {
        e.cancel = true;
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 7000000),
          orientation: {
            heading: Cesium.Math.toRadians(348.4202942851978),
            pitch: Cesium.Math.toRadians(-89.74026687972041),
            roll: Cesium.Math.toRadians(0),
          },
          complete: function callback() {
            // 定位完成之后的回调函数
          },
        });
      }
    );

    // viewer.scene.camera.setView({
    //   destination: new Cesium.Cartesian3(
    //     277096.634865404,
    //     5647834.481964232,
    //     2985563.7039122293
    //   ),
    //   orientation: {
    //     heading: 4.731089976107251,
    //     pitch: -0.32003481981370063
    //   }
    // });
  },
  methods: {},
};
</script>

<style>
.fullSize,
.full-container {
  position: absolute;
  /*top: 0;*/
  /*left: 0;*/
  border: none;
  height: 100%;
  width: 100%;
  margin: 0px;
  display: inherit;
}
.fullSize {
  left: 0;
  right: 0;
  width: auto;
}
.doubleViewer {
  width: 50%;
}
/*#cesiumContainer {*/
/*overflow: hidden;*/
/*position: fixed;*/
/*background: url('../../static/images/sky.jpg') no-repeat;*/
/*margin: 0px;*/
/*background-size: cover;*/
/*}*/

#loadingOverlay {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  display: none;
}

#loadingOverlay h1 {
  text-align: center;
  position: relative;
  top: 50%;
  margin-top: -0.5em;
}

#mousePositionId {
  position: absolute;
  right: 30px;
  bottom: 50px;
  z-index: 100;
  font-size: 20px;
}
.layer-picker-class {
  float: right;
}

html {
  overflow-x: hidden;
  overflow-y: hidden;
}

.cesium-viewer-toolbar {
  top: auto;
  bottom: 0;
  right: 29px;
  width: 29px;
  height: 29px;
}
.cesium-home-button {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0;
}
</style>
