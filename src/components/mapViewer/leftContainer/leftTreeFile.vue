<template>
 <div>
      <v-treeview 
      v-model="item_selected" 
      dense 
      selectable 
      :items="items">
      </v-treeview>
  </div>
</template>
<script>
import { SERVER } from "../../../js/utils";
const host = SERVER.host;
export default {
  name: "leftTreeFile",
  data: function () {
    return {
      viewer: null,
      item_current: [],
      item_selected: [],
      ds: {},
    };
  },
  computed: {
    items: {
      get: function () {
        return this.$store.state.fileList;
      },
      set: function (nv) {
        this.$store.commit("setFileList", { fileList: nv });
      },
    },
  },
  methods: {
    addKML: function (id) {
      const Cesium = window.Cesium;
      const options = window.options;
      //options.offset = new Cesium.HeadingPitchRange(Cesium.Math.toRadians(0), Cesium.Math.toRadians(45), 2500);
      var promise = Cesium.KmlDataSource.load(
        host + "/d3/data/kml/" + id,
        options
      );
      this.viewer.dataSources.add(promise);
      this.viewer.flyTo(promise, options);

      var that = this;
      Cesium.when(promise, function (dataSource) {
        that.ds[id] = dataSource;
      });
    },
    remKML: function (id) {
      var ds = this.ds[id];
      this.viewer.dataSources.remove(ds);
      delete this.ds[id];
    },
    loadKML: function (item_selected) {
      //对比出来当前加载的和重新选择的变化的是哪个
      var add = [];
      var del = [];
      //遍历当前选中，如果哪个不在current中，认为其为新增
      for (let i in item_selected) {
        var sId = item_selected[i];
        if (sId) {
          if (!this.item_current.includes(sId)) {
            add.push(sId);
          }
        }
      }
      //遍历当前显示，如果哪个不在select中，认为其为删除
      for (let i in this.item_current) {
        var cId = this.item_current[i];
        if (cId) {
          if (!item_selected.includes(cId)) {
            del.push(cId);
          }
        }
      }
      this.item_current = this.item_selected;
      add.forEach((v) => {
        this.addKML(v);
      });
      del.forEach((v) => {
        this.remKML(v);
      });
    },
    list: async function () {
      let resp = await this.$axios.get(host + "/d3/group");
      if (resp && resp.data) {
        let result = resp.data;
        if (result.code == "200") {
          let data = result.data;
          this.$store.commit("fileList", { fileList: data });
        } else {
          alert("获取树形列表出错:" + result.message);
        }
      }
    },
  },
  watch: {
    item_selected: function (nv) {
      this.loadKML(nv);
    },
  },
  mounted: function () {
    this.viewer = window.cesiumViewer;
    this.list();
  },
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}

</style>