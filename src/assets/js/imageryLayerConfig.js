const layers = [
    {
        id: "imageryLayers",
        name: "影像图层",
        children: [

            {
                provider: "WebMapTileServiceImageryProvider",
                id: "tdtImgLayer",
                name: "天地图-影像",
                //影像底图
                url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=612ae65756225e3affda8a30ac248fb6",
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                layer: "tdtImgLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
            },
            {
                provider: "WebMapTileServiceImageryProvider",
                id: "tdtVecLayer",
                name: "天地图-矢量",
                //影像底图
                url: "http://t{s}.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=612ae65756225e3affda8a30ac248fb6",
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                layer: "tdtImgLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
            },
            {
                id: "OSM",
                name: "Open Street Map",
                provider: "OpenStreetMapImageryProvider"
            },
            {
                id: "Bing Map",
                name: "Bing Map",
                provider: "BingMapsImageryProvider",
                url: 'https://dev.virtualearth.net',
                key: 'Al05W-Q7Ai9X5gAIhf_51NbtOiPzJtf6VZCB2qukc97TYlOrlzxJcjlKJgi8X97W',
                //key: 'AmXdbd8UeUJtaRSn7yVwyXgQlBBUqliLbHpgn2c76DfuHwAXfRrgS5qwfHU6Rhm8'
                // mapStyle : Cesium.BingMapsStyle.AERIAL
            }
        ]
    }, {
        id: "annotationLayers",
        name: "文字标注",
        children: [
            {
                provider: "WebMapTileServiceImageryProvider",
                id: "tdtAnnoLayer",
                name: "天地图-文字标注",
                url:
                    "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=612ae65756225e3affda8a30ac248fb6",
                layer: "tdtAnnoLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",
            }
        ]
    }
]
const baseLayers = [
    {
        value: "tdtImgLayer",
        text: "天地图"
    }, 
    {
        value: "tdtVecLayer",
        text: "天地图-矢量",
    },
    {
        value: "Bing Map",
        text: "Bing Map"
    }, {
        value: "OSM",
        text: "Open Street Map",
    }

]

const annoLayers = [
    {
        value: "tdtAnnoLayer",
        text: "天地图"
    }
]
export {
    layers,
    baseLayers,
    annoLayers
}
export default {
    layers,
    baseLayers,
    annoLayers
}