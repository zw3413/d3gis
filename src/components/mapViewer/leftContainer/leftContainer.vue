<template>
  <!-- <v-container class="left"> -->
  <v-expansion-panels
    class="left"
    multiple
    active-class="left_panel_content_active"
    flat
    dark
    hover

    tile
    :value = "openedPanels"
  >
    <v-expansion-panel @click="initHeightOfLeftPanel">
      <v-expansion-panel-header> 文件导入 </v-expansion-panel-header>
      <v-expansion-panel-content>
        <left-tree-file></left-tree-file>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel @click="initHeightOfLeftPanel">
      <v-expansion-panel-header> 多源图层 </v-expansion-panel-header>
      <v-expansion-panel-content>
        <left-tree-layer ref="left_tree_layer"></left-tree-layer>
      </v-expansion-panel-content>
    </v-expansion-panel>

    
    <v-expansion-panel @click="initHeightOfLeftPanel">
      <v-expansion-panel-header> 位置标绘 </v-expansion-panel-header>
      <v-expansion-panel-content>
        <left-tree-place></left-tree-place>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
  <!-- </v-container> -->
</template>
<script>
import leftTreeFile from "./leftTreeFile";
import leftTreePlace from "./leftTreePlace";
import leftTreeLayer from "./leftTreeLayer";

export default {
  data: () => ({
    openedPanels:[1],
    date: null,
    trip: {
      name: "",
      location: null,
      start: null,
      end: null,
    },
    locations: [
      "Australia",
      "Barbados",
      "Chile",
      "Denmark",
      "Ecuador",
      "France",
    ],
    left_panel_content_height: "300px",
  }),
  computed: {},
  methods: {
    initHeightOfLeftPanel: function () {
      var that = this;
      setTimeout(function () {
        that.resizeHeightOfLeftPanel();
      }, 500);
    },
    resizeHeightOfLeftPanel: function () {
      console.log("resizeHeightOfLeftPanel");
      // var windowHeight = window.innerHeight;
      // var panelHeaderHeight = 48;
      // var panelHeaderHeight_expanded = 64;
      // var panelContentHeight =
      //   windowHeight - panelHeaderHeight * 2 - panelHeaderHeight_expanded - 48;
      // var activePanel = document.getElementsByClassName(
      //   "left_panel_content_active"
      // );
      // if (activePanel && activePanel.length > 0) {
      //   activePanel[0].getElementsByClassName(
      //     "v-expansion-panel-content"
      //   )[0].style.height = panelContentHeight + "px";
      // }
    },
  },
  watch: {},
  mounted() {
    var that = this;
    window.onresize = function () {
      that.resizeHeightOfLeftPanel();
    };
    this.resizeHeightOfLeftPanel();
  },
  components: {
    leftTreeFile,
    leftTreePlace,
    leftTreeLayer
  
  },
};
</script>
<style>
.left {
  position: absolute;
  padding: 0;
  margin: 0;
  width: 20% !important;
  min-width:200px;
  left: 0;
  top: 0;
  height: auto;
}
.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color:rgba(30,30,30,0.6)!important
}

.left * {
  color: #3a89dd !important;
}
</style>