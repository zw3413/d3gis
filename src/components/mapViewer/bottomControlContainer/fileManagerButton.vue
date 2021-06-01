<template>
  <div class="fileManagerButton">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <svg
          style="width: 24px; height: 24px; margin: 5px 5px 0px 8px"
          viewBox="0 0 24 24"
          v-bind="attrs"
          v-on="on"
        >
          <path
            fill="currentColor"
            d="M17,14H19V17H22V19H19V22H17V19H14V17H17V14M11,16L2,9L11,2L20,9L11,16M11,18.54L12,17.75V18C12,18.71 12.12,19.39 12.35,20L11,21.07L2,14.07L3.62,12.81L11,18.54Z"
          />
        </svg>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>文件管理</v-toolbar-title>
          <v-spacer></v-spacer>
          <!--                        <v-toolbar-items>-->
          <!--                            <v-btn-->
          <!--                                    dark-->
          <!--                                    text-->
          <!--                                    @click="dialog = false"-->
          <!--                            >-->
          <!--                                保存-->
          <!--                            </v-btn>-->
          <!--                        </v-toolbar-items>-->
        </v-toolbar>

        <v-form style="margin-top: 20px">
          <v-container>
            <v-row justify="start">
              <v-col>
                <v-file-input
                  v-model="file"
                  required
                  show-size
                  v-bind:accept="accept"
                  v-bind:label="label"
                ></v-file-input>
              </v-col>
              <v-spacer></v-spacer>
              <v-col>
                <v-btn @click="uploadFile">上传</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>

        <v-divider></v-divider>

        <v-form>
          <v-container>
            <v-btn small @click="delFile"> 删除 </v-btn>
          </v-container>
        </v-form>

        <v-data-table
          v-model="file_selected"
          dense
          show-select
          :items="files"
          :headers="headers"
          :items-per-page="5"
        >
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { SERVER } from "../../../js/utils";
const host = SERVER.host;
export default {
  name: "fileManagerButton",
  data: function () {
    return {
      file_selected: [],
      dialog: false,
      accept:".kml,.geojson,.shp",

      headers: [
        {
          text: "文件名称",
          align: "start",
          sortable: false,
          value: "filename",
        },
        { text: "文件类型", value: "filetype" },
        { text: "文件路径", value: "filepath" },
        { text: "上传时间", value: "createtime" },
      ],
      files: [],
      file: null,
    };
  },
  computed:{
          label:function(){
              return "接收的文件格式："+this.accept
          }
  },
  methods: {
    delFile: function () {
      if (this.file_selected && this.file_selected.length > 0) {
        let ids = [];
        for (var i in this.file_selected) {
          if (this.file_selected[i] && this.file_selected[i].id) {
            ids = ids.concat(this.file_selected[i].id);
          }
        }
        let that = this;
        this.$axios.post(host + "/d3/del", ids).then((resp) => {
          if (resp && resp.data) {
            let result = resp.data;
            if (result.state == "1") {
              that.list();
              return;
            }
          }
          alert("删除失败");
        });
      }
    },
    uploadFile: function () {
      let formData = new FormData();
      let that = this;
      let onUploadProgress = () => {
        that.list();
        that.file = null;
      };
      formData.append("file", this.file);
      return this.$axios.post(host + "/d3/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
    },

    list: function () {
      this.$axios.get(host + "/d3/list").then((resp) => {
        if (resp && resp.data) {
          let result = resp.data;
          if (result.code == "200") {
            let data = result.data;
            this.files = data;
          } else {
            alert("获取文件列表出错:" + result.message);
          }
        }
      });
      this.$axios.get(host + "/d3/group").then((resp) => {
        if (resp && resp.data) {
          let result = resp.data;
          if (result.code == "200") {
            let data = result.data;
            this.$store.commit('fileList',{fileList:data})
          } else {
            alert("获取树形列表出错:" + result.message);
          }
        }
      });
    },
  },
  watch: {
    dialog: function (v) {
      console.log(v);
    },
  },
  mounted: function () {
    this.viewer = window.cesiumViewer;
    this.list();
  },
};
</script>
<style scoped>
.fileManagerButton {
  z-index: 1000;
  position: absolute;
  left: auto;
  top: auto;
  right: 58px;
  bottom: 0;
  height: 29px;
  width: 29px;
}
svg {
  padding: 0;
  margin: 2.5px !important;
}
.v-dialog__container {
  display: block !important;
}
</style>