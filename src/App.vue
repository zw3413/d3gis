/*
 * @Author: @zhangweicalm 
 * @Date: 2021-04-12 22:26:29 
 * @Last Modified by: @zhangweicalm
 * @Last Modified time: 2021-05-07 23:38:09
 */

<template>
  <v-app>
    <map-viewer ref="mapViewer"></map-viewer >
  </v-app>
</template>

<script>
import mapViewer from "@/Apps/mapViewer";
export default {
  name: "app",
  components: { mapViewer },
};
</script>
<style lang="scss">
html,
body,
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
