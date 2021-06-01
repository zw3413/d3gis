<template>
  <div>
    <v-row align="center" no-gutters>
      <v-col cols="4">
        <v-subheader> 底图</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-select
          :items="baseLayers"
          v-model="baseLayer_selected"
          label="影像底图"
          single-line
          hide-details
          menu-props
          
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-show="showBingTypeSelector" no-gutters>
      <v-col cols="4">
        <v-subheader>类型</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-select
          :items="bingTypes"
          v-model="bingType_selected"
          label="底图类型"
          single-line
          hide-details
          menu-props
          dense
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-show="showAnnoLayerSelector" no-gutters>
      <v-col cols="4">
        <v-subheader>文字</v-subheader>
      </v-col>
      <v-col cols="8">
        <v-select
          :items="annoLayers"
          v-model="annoLayer_selected"
          label="文字标记"
          single-line
          hide-details
          menu-props
          
          dense
        ></v-select>
      </v-col>
    </v-row>
    <!-- <v-row no-gutters>
      <v-treeview v-model="item_selected" dense dark selectable :items="items">
      </v-treeview>
    </v-row> -->
  </div>
</template>
<script>
// import { SERVER } from "../../../js/utils";
// import { CesiumPolyline, CesiumPolygon } from "../../../core/Graphic";
//import WebGLGlobeDataSource from '../core/WebGLGlobeDataSource';
// import utils from "@/js/utils";
import { layers, baseLayers, annoLayers } from "@/assets/js/imageryLayerConfig";
// const cvt = utils.CVT;
// const host = SERVER.host;
console.log(layers);
console.log(baseLayers);
console.log(annoLayers);
export default {
  data: function () {
    return {
      item_selected: [],
      items: layers,
      baseLayers:baseLayers,
      annoLayers:annoLayers,
      showBingTypeSelector: false,
      showAnnoLayerSelector: true,
      baseLayer_selected: "",
      bingType_selected: "",
      annoLayer_selected: "",
      bingTypes: [
        {
          text: "影像",
          value: "Cesium.BingMapsStyle.AERIAL",
        },
        {
          text: "影像+道路",
          value: "Cesium.BingMapsStyle.AERIAL_WITH_LABELS_ON_DEMAND",
        },
        {
          text: "道路(dark)",
          value: "Cesium.BingMapsStyle.CANVAS_DARK",
        },
        {
          text: "道路(gray)",
          value: "Cesium.BingMapsStyle.CANVAS_GRAY",
        },
        {
          text: "道路(light)",
          value: "Cesium.BingMapsStyle.CANVAS_LIGHT",
        },
        // {
        //   text: "柯林斯-巴尔",
        //   value: "Cesium.BingMapsStyle.COLLINS_BART",
        // },
        {
          text: "道路",
          value: "Cesium.BingMapsStyle.ROAD_ON_DEMAND",
        },
      ],
    };
  },
  methods: {
    removeAllLayers: function () {
      window.cesiumViewer.imageryLayers.removeAll();
      this.$store.commit("base_imageryLayer", {
        base_imageryLayer: null,
      });
      this.$store.commit("anno_imageryLayer", {
        anno_imageryLayer: null,
      });
    },

    changeBaseLayerViaImageryProvider(imageryProvider) {
      var currentBaseLayer = this.$store.state.base_imageryLayer;
      if (currentBaseLayer)
        window.cesiumViewer.imageryLayers.remove(currentBaseLayer, true);
      var imageryLayer = new window.Cesium.ImageryLayer(imageryProvider);
      window.cesiumViewer.imageryLayers.add(imageryLayer);
      window.cesiumViewer.imageryLayers.lowerToBottom(imageryLayer);
      this.$store.commit("base_imageryLayer", {
        base_imageryLayer: imageryLayer,
      });
    },
    changeAnnoLayerViaImageryProvider(imageryProvider) {
        var currentAnnoLayer = this.$store.state.anno_imageryLayer;
        if(currentAnnoLayer)
      window.cesiumViewer.imageryLayers.remove(currentAnnoLayer, true);
      var imageryLayer = new window.Cesium.ImageryLayer(imageryProvider);
      window.cesiumViewer.imageryLayers.add(imageryLayer);
      window.cesiumViewer.imageryLayers.raiseToTop(imageryLayer);
        this.$store.commit("anno_imageryLayer", {
        anno_imageryLayer: imageryLayer,
      });
    },
    removeLayer(index) {
      var baseLayer = window.cesiumViewer.imageryLayers.get(index);
      if (baseLayer) {
        window.cesiumViewer.imageryLayers.remove(baseLayer, true);
      }
    },
    getLayerConfigByLayerId(id) {
      var layerIndex;
      for (var i in this.items) {
        var layerGroup = layers[i];
        switch (layerGroup.id) {
          case "imageryLayers":
            layerIndex = this.baseLayerIndex++;
            break;
          case "annotationLayers":
            layerIndex = this.annoLayerIndex++;
            break;
        }
        for (var j in layerGroup.children) {
          var layer = layerGroup.children[j];
          if (layer.id === id) {
            for (var k in this.item_selected) {
              var item = this.item_selected[k];
              if (item.id === id) {
                item.layerIndex = layerIndex;
              }
            }
            layer.layerIndex = layerIndex;
            return layer;
          }
        }
      }
      return null;
    },
  },
  watch: {
    annoLayer_selected: function (nv, ov) {
      var Cesium = window.Cesium;
      if (nv === ov) return;
      var layerId = nv;
      var layerConfig = this.getLayerConfigByLayerId(layerId);
      if (layerConfig) {
        var provider = layerConfig.provider;
        var imageryProvider;
        switch (provider) {
          case "WebMapTileServiceImageryProvider":
            imageryProvider = new Cesium.WebMapTileServiceImageryProvider(
              layerConfig
            );
            break;
          //   case "OpenStreetMapImageryProvider":
          //     imageryProvider = new Cesium.OpenStreetMapImageryProvider();
          //     break;
          //   case "BingMapsImageryProvider":
          //     this.showBingTypeSelector = true;
          //     this.showAnnoLayerSelector = false;
          //     layerConfig.mapStyle = eval(this.bingType_selected);
          //     imageryProvider = new Cesium.BingMapsImageryProvider(layerConfig);
          //     break;
          default:
            return;
        }
        this.changeAnnoLayerViaImageryProvider(imageryProvider);
      }
    },
    baseLayer_selected: function (nv, ov) {
      var Cesium = window.Cesium;
      if (nv === ov) return;
      var layerId = nv;
      var layerConfig = this.getLayerConfigByLayerId(layerId);
      if (layerConfig) {
        var provider = layerConfig.provider;
        var imageryProvider;
        this.showBingTypeSelector = false;
        this.showAnnoLayerSelector = false;
        switch (provider) {
          case "WebMapTileServiceImageryProvider":
            this.showAnnoLayerSelector = true;
            imageryProvider = new Cesium.WebMapTileServiceImageryProvider(
              layerConfig
            );
            break;
          case "OpenStreetMapImageryProvider":
            window.cesiumViewer.imageryLayers.remove(
              this.anno_imageryLayer,
              true
            );
            imageryProvider = new Cesium.OpenStreetMapImageryProvider();
            break;
          case "BingMapsImageryProvider":
            this.showBingTypeSelector = true;
            window.cesiumViewer.imageryLayers.remove(
              this.anno_imageryLayer,
              true
            );
            layerConfig.mapStyle = eval(this.bingType_selected);
            imageryProvider = new Cesium.BingMapsImageryProvider(layerConfig);
            break;
          default:
            return;
        }
        this.changeBaseLayerViaImageryProvider(imageryProvider);
      }
    },
    bingType_selected: function (nv, ov) {
      //console.log("bingType_selected.nv=" + nv);
      if (nv === ov) return;
      this.bingType_selected = nv;
      var Cesium = window.Cesium;
      console.log("baseLayer_selected = " + this.baseLayer_selected);
      var layerConfig = this.getLayerConfigByLayerId(this.baseLayer_selected);
      layerConfig.mapStyle = eval(this.bingType_selected);
      var imageryProvider = new Cesium.BingMapsImageryProvider(layerConfig);

      this.changeBaseLayerViaImageryProvider(imageryProvider);
    },
    //根据选择的节点，cesium上面响应式加载相应的图层
    // item_selected: function (v) {
    //   var Cesium = window.Cesium;
    //   var viewer = window.cesiumViewer;
    //   this.removeAllLayers();
    //   for (var i in v) {
    //     var layerId = v[i];
    //     var layerConfig = this.getLayerConfigByLayerId(layerId);
    //     var layerIndex = layerConfig.layerIndex;
    //     if (layerConfig) {
    //       var provider = layerConfig.provider;
    //       var imageryProvider;
    //       this.showBingTypeSeletor = false;
    //       this.showAnnoLayerSelector = true;
    //       switch (provider) {
    //         case "WebMapTileServiceImageryProvider":
    //           imageryProvider = new Cesium.WebMapTileServiceImageryProvider(
    //             layerConfig
    //           );
    //           break;
    //         case "OpenStreetMapImageryProvider":
    //           imageryProvider = new Cesium.OpenStreetMapImageryProvider();
    //           break;
    //         case "BingMapsImageryProvider":
    //           this.showBingTypeSeletor = true;
    //           this.showAnnoLayerSelector = false;
    //           layerConfig.mapStyle = eval(this.selectedBingType);
    //           imageryProvider = new Cesium.BingMapsImageryProvider(layerConfig);
    //           break;
    //         default:
    //           return;
    //       }
    //       if (imageryProvider) {
    //         var imageryLayer = new Cesium.ImageryLayer(imageryProvider);
    //         viewer.imageryLayers.add(imageryLayer, layerIndex);
    //       }
    //     }
    //   }
    // },
  },
  mounted() {
    this.baseLayer_selected = "Bing Map";
  },
};
</script>
<style scoped>
</style>

