<template>
  <div>
       <!-- draw viewer -->
    <cesiumDrawViewer
      :extendMarkerImage="imags"
      ref="marker"
    ></cesiumDrawViewer>
    <v-treeview v-model="item_selected"  dense  dark selectable :items="items">
      <!-- <template v-slot:label="{item, open, selected}">         -->
      <template v-slot:label="{ item }">
        <span
          text
          @contextmenu="showContextMenu"
          :id="item.id"
          :type="item.type"
        >
          <!--button icon-->
          <!-- <v-icon v-if="!item.file">
                      {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                      {{ files[item.file] }}
                    </v-icon> -->
          <!--button text-->
          {{ item.name || "未命名" }}
        </span>
      </template>
    </v-treeview>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      fixed
      :close-on-content-click="contextMenuCloseOnContentClick"
    >
      <v-list dense>
        <v-list-item @click="contextMenuClickAction">
          <v-list-item-content>
            <v-list-item-title id="rename"> 重命名 </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="contextMenuClickAction">
          <v-list-item-content>
            <v-list-item-title id="showGroups"> 移动到 </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="contextMenuClickAction">
          <v-list-item-content>
            <v-list-item-title id="del"> 删除 </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu
      v-model="showSubMenuGroup"
      :position-x="sub1_x"
      :position-y="sub1_y"
      fixed
    >
      <v-list dense>
        <v-list-item
          v-for="item in groups"
          :key="item"
          @click="moveToGroup"
          :id="item"
        >
          <v-list-item-title v-text="item"></v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="moveToGroup" id="newGroup">
          <v-list-item-title> 新分组 </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- </v-row> -->

    <!-- 修改名称 -->
    <v-dialog :v-model="editMode" id="editDialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          style="display: none"
          id="editModeSwith"
        >
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">修改</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              label="名称"
              required
              v-model="editedName"
            ></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="onCloseEditDialog">
            关闭
          </v-btn>
          <v-btn color="blue darken-1" text @click="onSaveEditDialog">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 新增分组 -->
    <v-dialog v-model="showNewGroupDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">新分组</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              label="名称"
              required
              v-model="newGroupName"
            ></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="onCloseNewGroupDialog">
            关闭
          </v-btn>
          <v-btn color="blue darken-1" text @click="onSaveNewGroupDialog">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 确认删除 -->
    <v-dialog v-model="showConfirmDelDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">提示</span>
        </v-card-title>
        <v-card-text>
          <v-container> 确认删除吗？ </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="onCloseDelDialog">
            关闭
          </v-btn>
          <v-btn color="blue darken-1" text @click="onConfirmDelDialog">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { SERVER } from "../../../js/utils";
import { CesiumPolyline, CesiumPolygon } from "../../../core/Graphic";
import cesiumDrawViewer from "@/components/mapViewer/drawerControlContainer/cesiumDrawViewer";

//import WebGLGlobeDataSource from '../core/WebGLGlobeDataSource';
import utils from "@/js/utils";
const cvt = utils.CVT;
const host = SERVER.host;
export default {
  name: "leftTreePlace",
  components:{
   cesiumDrawViewer
  },
  data: function () {
    return {
       imags: [
        "./static/images/markers/1.png",
        "./static/images/markers/2.png",
        "./static/images/markers/3.png",
        "./static/images/markers/4.png",
        "./static/images/markers/5.png",
        "./static/images/markers/6.png",
        "./static/images/markers/7.png",
        "./static/images/markers/8.png",
        "./static/images/markers/5.png",
        "./static/images/markers/6.png",
      ],
      viewer: null,
      item_current: [],
      item_selected: [],
      ds: {},
      widgets: false,
      showMenu: false,
      x: 0,
      y: 0,
      sub1_x: 0,
      sub1_y: 0,
      editMode: false,
      editedName: "",
      rightClickId: "",
      showSubMenuGroup: false,
      groups: [],
      opItemId: null,
      contextMenuCloseOnContentClick: false,
      showNewGroupDialog: false,
      newGroupName: "",
      showConfirmDelDialog: false,
    };
  },
  computed: {
    items: {
      get: function () {
        return this.$store.state.elementList;
      },
      set: function (nv) {
        //console.log(nv)
        this.$store.commit("elementList", { elementList: nv });
      },
    },
  },
  methods: {
    onCloseDelDialog() {
      this.showConfirmDelDialog = false;
    },
    onConfirmDelDialog() {
      if (this.opItemId) {
        if (this.opItemId.startsWith("group-")) {
          //删除分组中的元素
          let groupId = this.opItemId;

          //删除分组
          this.$store.commit("dropGroup", {
            group: { id: groupId },
          });
        } else {
          //删除元素
          this.$store.commit("dropElement", {
            ele: { id: this.opItemId, type: "marker" },
          });
        }
      }
      this.onCloseDelDialog();
    },
    onSaveNewGroupDialog() {
      if (this.rightClickId && this.newGroupName) {
        this.$store.commit("updateElement", {
          ele: { id: this.rightClickId, group: this.newGroupName },
        });
      }
      this.onCloseNewGroupDialog();
    },
    onCloseNewGroupDialog() {
      this.showNewGroupDialog = false;
    },

    moveToGroup(e) {
      let groupName =
        e.target.id ||
        e.target.parentNode.id ||
        e.target.parentNode.parentNode.id;
      //如果找到了分组名称
      if (groupName) {
        if (groupName == "newGroup") {
          //分组名称是newGroup的话，显示新建分组对话框
          this.showNewGroupDialog = true;
        } else {
          //不是新增的分组
          if (this.rightClickId) {
            this.$store.commit("updateElement", {
              ele: { id: this.rightClickId, group: groupName },
            });
          }
        }
      }
    },
    contextDel() {
      this.showConfirmDelDialog = true;
    },
    contextRename() {
      //把当前节点编程编辑状态
      this.editMode = true;
      this.editedName = this.rightClickName;
      document.getElementById("editModeSwith").click();
    },
    contextShowGroups() {
      let ele = document.getElementById("showGroups").parentNode.parentNode;
      let width = ele.offsetWidth;
      let height = ele.offsetHeight;
      this.sub1_x = this.x + width;
      this.sub1_y = this.y + height;
      this.showSubMenuGroup = true;
    },
    onCloseEditDialog() {
      document.getElementById("editModeSwith").click();
      this.rightClickId = null;
      this.editedName = null;
      this.rightClickName = null;
    },
    //修改位置名称对话框
    onSaveEditDialog() {
      let id = this.rightClickId;
      let name = this.editedName;
      this.$store.commit("updateElement", { ele: { id: id, name: name } });
      this.onCloseEditDialog();
    },
    //点击了菜单的响应函数
    contextMenuClickAction(e) {
      let type = e.target.id;
      switch (type) {
        case "del":
          this.contextDel();
          this.showMenu = false;
          break;
        case "rename":
          this.contextRename();
          this.showMenu = false;
          break;
        case "showGroups":
          this.contextShowGroups();
      }
    },
    showContextMenu: function (e) {
      e.preventDefault();
      this.rightClickId = e.target.id;
      if (this.rightClickId === null || this.rightClickId.length === 0) {
        this.rightClickId = e.target.parentNode.id;
      }
      this.rightClickName = e.target.textContent.trim();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.opItemId = e.target.id || e.target.parentElement.id;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    showPoint: function (jsonData, id, name, desp, style) {
      const Cesium = window.Cesium;
      let type = 0;
      let x = jsonData.coordinates[0];
      let y = jsonData.coordinates[1];
      let z = jsonData.coordinates[2];
      //let cartesian = new Cesium.Cartesian2(x, y);
      let cartesian = Cesium.Cartesian3.fromDegrees(x, y, z);

      let markerManager = top.markerManager;
      let marker = markerManager.createMarker(cartesian, style);
      top.markers.set(id, marker);
      marker.gvid = id;
      marker.gvname = name;
      markerManager.selectedMarker = marker;
      markerManager.activeMarker = marker;
      let _n = name;
      const evt = new CustomEvent("marker-add", {
        detail: {
          id: marker.gvid,
          name: _n || "未命名",
          description: desp,
          type: type,
          position: cvt.toDegrees(cartesian, window.cesiumViewer),
        },
      });
      window.dispatchEvent(evt);
      window.drawViewer.locateGraphic(id);
      marker = null;
    },
    showPolyline: function (jsonData, id, name, desp, style) {
      let Cesium = window.Cesium;
      if (style) {
        style = JSON.parse(style);
        let m = style.material;
        style.material = new Cesium.Color(m.red, m.green, m.blue, m.alpha);
      }
      let options = { positions: [], ...style };
      /*
      {"clampToGround":true,
      "material":{"red":0.9686274509803922,"green":0.8784313725490196,"blue":0.12549019607843137,"alpha":1},
      "width":3}
      */
      if (jsonData && jsonData.coordinates && jsonData.coordinates.length > 0) {
        for (let coo of jsonData.coordinates) {
          let x = coo[0];
          let y = coo[1];
          let z = coo[2];
          let cartesian = Cesium.Cartesian3.fromDegrees(x, y, z);
          options.positions.push(cartesian);
        }
        if (/.*GROUND.*/.test(window.graphicManager._heightReference)) {
          options.clampToGround = true;
        } else {
          options.clampToGround = false;
        }
        options.material = window.graphicManager.material || options.material;
        options.width = window.graphicManager.style.width || options.width;
        const graphic = new CesiumPolyline(window.cesiumViewer, options);
        window.graphics.set(id, graphic);
        graphic.gvid = id;
        graphic.id = id;
        graphic.gvname = name;
        graphic.gvtype = "polyline";
        graphic.gvdesp = desp;
        graphic.heightReference = window.graphicManager.heightReference;
        const evt = new CustomEvent("addEvent", {
          detail: {
            gvid: graphic.gvid,
            gvtype: 1,
            gvname: graphic.gvname,
            gvdesp: graphic.gvdesp,
          },
        });
        document.dispatchEvent(evt);
        window.drawViewer.locateGraphic(id);
      }
    },
    showPolygon: function (jsonData, id, name, desp, style) {
      let Cesium = window.Cesium;
      if (style) {
        style = JSON.parse(style);
        let m = style.material;
        style.material = new Cesium.Color(m.red, m.green, m.blue, m.alpha);
        let o = style.outlineColor;
        style.outlineColor = new Cesium.Color(o.red, m.green, m.blue, m.alpha);
      }
      let options = { positions: [], ...style };
      if (jsonData && jsonData.coordinates && jsonData.coordinates.length > 0) {
        for (let coo of jsonData.coordinates[0]) {
          let x = coo[0];
          let y = coo[1];
          let z = coo[2];
          let cartesian = Cesium.Cartesian3.fromDegrees(x, y, z);
          options.positions.push(cartesian);
        }
        // if (/.*GROUND.*/.test(window.graphicManager._heightReference)) {
        //   options.clampToGround = true;
        // } else {
        //   options.clampToGround = false;
        // }
        // options.material = window.graphicManager.material || options.material;
        // options.width = window.graphicManager.style.width || options.width;
        const graphic = new CesiumPolygon(window.cesiumViewer, options);
        window.graphics.set(id, graphic);
        graphic.gvid = id;
        graphic.id = id;
        graphic.gvname = name;
        graphic.gvtype = "polygon";
        graphic.gvdesp = desp;
        graphic.heightReference = window.graphicManager.heightReference;
        const evt = new CustomEvent("addEvent", {
          detail: {
            gvid: graphic.gvid,
            gvtype: 2,
            gvname: graphic.gvname,
            gvdesp: graphic.gvdesp,
          },
        });
        document.dispatchEvent(evt);
        window.drawViewer.locateGraphic(id);
      }
    },
    addGeoJSON: function (id) {
      let that = this;
      fetch(host + "/d3/data/element/" + id, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then(function (result) {
          // eslint-disable-next-line
          debugger;
          //{type: "Point", coordinates: Array(3)}
          if (result.state != 1) return;
          let data = result.data;
          let id = data.id;
          let name = data.name;
          let desp = data.desp;
          let style = data.style;

          //先检查要加载的元素是否已经在地图上
          if (top.markers.has(id) || top.graphics.has(id)) {
            return;
          }

          let jsonData = JSON.parse(data.geoJson);

          switch (jsonData.type) {
            case "Point":
              that.showPoint(jsonData, id, name, desp, style);
              break;
            case "LineString":
              //type = 1;
              that.showPolyline(jsonData, id, name, desp, style);
              break;
            case "Polygon":
              //type = 2;
              that.showPolygon(jsonData, id, name, desp, style);
              break;
            case "Label":
              //type = 3;
              break;
          }

          // for (var i = 0; i <= jsonData.features.length; i++) {
          //   var ifeature = jsonData.features[i];
          //   window.cesiumViewer.entities.add({
          //     position: Cesium.Cartesian3.fromDegrees(
          //       ifeature.geometry.coordinates[0],
          //       ifeature.geometry.coordinates[1]
          //     ),
          //     point: {
          //       pixelSize: 10,
          //       color: Cesium.Color.RED,
          //     },
          //   });
          // }
        });
      // eslint-disable-next-line
      // debugger;
      // Cesium.GeoJsonDataSource.load(host + "/d3/data/element/" + id, {
      //   image:
      //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAA…QYsxj4rH8/3OaaAf+CDAAVvn1VEy/MOwAAAAASUVORK5CYII=",
      //   verticalOrigin: 2,
      //   markerSymbol: "marker-stroked-15.svg",
      // }).then(function (dataSource) {
      //   // eslint-disable-next-line
      //   debugger;
      //   this.viewer.dataSources.add(dataSource);
      //   this.viewer.flyTo(dataSource, options);
      //   var that = this;
      //   Cesium.when(dataSource, function (ds) {
      //     that.ds[id] = ds;
      //   });
      // });
    },
    remGeoJSON: function (id) {
      var ds = this.ds[id];
      this.viewer.dataSources.remove(ds);

      let layerManager =
        window.vue.$children[0].$refs.mapViewer.$refs.marker.$refs.layerManager;
      layerManager.drop({ id: id });
      // if(layerManager && layerManager.json){
      //     let json = layerManager.json;
      //     for(let eleType of json){
      //       if(eleType && eleType.children){
      //         for(var i=0; i< eleType.children.length; i++){
      //           let ele = eleType.children[i];
      //           if(ele && ele.id === id){
      //             delete eleType.children[i];
      //           }
      //         }
      //       }
      //     }

      // }

      delete this.ds[id];
    },
    loadGeoJSON: function (item_selected) {
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
        this.addGeoJSON(v);
      });
      del.forEach((v) => {
        this.remGeoJSON(v);
      });
    },
    list: async function () {
      let resp = await this.$axios.get(host + "/d3/data/element/tree");
      if (resp && resp.data) {
        let result = resp.data;
        if (result.code == "200") {
          let data = result.data;
          this.$store.commit("elementList", { elementList: data });
        } else {
          alert("出错:" + result.message);
        }
      }
    },
    getGroups: async function () {
      let resp = await this.$axios.get(host + "/d3/data/element/group");
      if (resp && resp.data) {
        let result = resp.data;
        if (result.code == "200") {
          let data = result.data;
          this.groups = data;
        } else {
          alert("出错:" + result.message);
        }
      }
    },
  },
  watch: {
    item_selected: function (nv) {
      this.loadGeoJSON(nv);
    },
  },
  mounted: function () {
    this.viewer = window.cesiumViewer;
     this.$refs.marker.init(this.viewer);
    this.list();
    this.getGroups();
  },
};
</script>
<style scoped>
.editDialog {
  position: absolute;
}
[v-cloak] {
  display: none;
}
.v-menu__content {
  position: fixed !important;
}

</style>