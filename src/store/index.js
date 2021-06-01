/*
 * @Author: @zhangweicalm 
 * @Date: 2021-04-12 22:19:15 
 * @Last Modified by: @zhangweicalm
 * @Last Modified time: 2021-05-10 22:25:39
 */

/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex';
import 'es6-promise/auto';
Vue.use(Vuex);
import {SERVER} from '../js/utils'
const host = SERVER.host

const store = new Vuex.Store({
    state: {
        fileList: [],
        elementList: [
            // {id: '',
            // name: '',
            // type: '',
            // checked: false,
            // group: '',
            //}
        ],
        imageryLayers:{
            base_imageryLayer:null,
            anno_imageryLayer:null
        }
    },
    mutations: {
        base_imageryLayer:function(state,playload){
            state.imageryLayers.base_imageryLayer = playload.base_imageryLayer
        },
        anno_imageryLayer:function(state,playload){
            state.imageryLayers.anno_imageryLayer = playload.anno_imageryLayer
        },
        fileList: function (state, playload) {
            console.log("fileList mutation")
            state.fileList = playload.fileList;
        },
        elementList: function (state, playload) {
            console.log("elementList mutation")
            state.elementList = playload.elementList;
        },
        createNewGroup: function (state, playload) {
            let id = 'group-' + playload.newGroup.name;
            let name = playload.newGroup.name;
            let checked = playload.newGroup.checked;
            let open = playload.newGroup.open;
            let order = playload.newGroup.order;

            let tailGroups = null
            //如果没有给order或者order位于最后一个
            if (!order || order >= state.elementList.length - 1) {
                //先把最后一个group拿出来
                tailGroups = state.elementList.splice(state.elementList.length - 1, 1);
            } else {
                tailGroups = state.elementList.splice(order, 1)
            }
            //装进新建的group
            let newGroup = playload.newGroup
            state.elementList.push(
                newGroup
            )
            //将尾部group装回
            for (let group of tailGroups) {
                state.elementList.push(group)
            }

            //保存新的group信息
            //插入数据库
            fetch(host + '/d3/data/element/group', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    checked: checked,
                    open: open,
                    order: order
                })
            }).then(resp => {
                return resp.json()
            }).then(json => {
                if (json.state) {

                } else {
                    console.log('保存分组:' + json.message)
                }
            })



        },
        addElement: function (state, playload) {
            debugger
            let id = playload.ele.id;
            let name = playload.ele.name;
            let type = playload.ele.type;
            let group = playload.ele.group;
            let style = playload.ele.style;
            //TODO: 应该先检查ID
            function checkIfExist(array, id) {
                let found = array.find(function (e) { if (e.id == id) { return true; } else { return false; } })
                if (found) {
                    return true;
                } else {
                    return false;
                }
            }
            for(let group of state.elementList){
                if (checkIfExist(group.children, id)) return;
            }
            
            let groupName = '其他'//默认分组名称
            if (group) groupName = group;
            let currentGroup = state.elementList.find(function (e) { if (e.name == groupName) { return true; } else { return false } })
            if (!currentGroup) {
                //如果还没有默认分组的话，先插入默认分组
                currentGroup = {
                    name: groupName,
                    checked: 0,
                    open: 0,
                    order: 1000000,
                    children: []
                }
                window.vue.$store.commit('createNewGroup', { newGroup: currentGroup });
            }
            let ele = {
                id: id, name: name, type: type, checked: true
            }
           
            currentGroup.children.push(ele)

            // }else{
            //     //如果类型不为空，按照类型添加进去


            // }
            // state.elementList.push({
            //     id: id, name: name, type: type, checked: true
            // })
            switch (type) {
                case 'marker':
                case 'label':

                case 'polyline':
                case 'polygon':
                    //从window.makers中获取相应元素的geojson
                    let cesiumObj = top.markers.get(id);
                    let geojson = null;
                    if (cesiumObj != null && cesiumObj.toGeoJson()) {
                        geojson = JSON.stringify(top.markers.get(id).toGeoJson().geometry);
                        //geojson = JSON.stringify(top.markers.get(id).toGeoJson());
                    }
                    //插入数据库
                    fetch(host + '/d3/data/element', {
                        method: 'put',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id,
                            name: name,
                            type: type,
                            geojson: geojson,
                            style:JSON.stringify(style)
                        })
                    }).then(resp => {
                        return resp.json()
                    }).then(json => {
                        if (json.state) {

                        } else {
                            alert('操作失败:' + json.message)
                        }
                    })
                    break;
                case 'model':
                    alert('暂不支持model类型的操作')

            }
        },
        updateElement: function (state, playload) {
            // eslint-disable-next-line
            debugger
            let id = playload.ele.id;
            let name = playload.ele.name;
            let type = playload.ele.type;
            let groupName = playload.ele.group;
            let geojson = playload.ele.geojson;
            let style = playload.ele.style;
            let found = false
            let newGroupName = null;
            for (let group of state.elementList) {
                if (group && group.children) {
                    for (let ele of group.children) {
                        if (ele && ele.id && ele.id === id) {
                            found = true;
                            //将前台的名称更新
                            if (name != null)
                                ele.name = name;

                            //TODO 如果group有变化，将元素移入对应的group
                            if (groupName != null && groupName.length > 0 && groupName != group.id) {
                                //查找当前有没有提交的groupName
                                newGroupName = groupName
                                let targetGroup = state.elementList.find(function (e) { if (e.name == groupName) { return true; } else { return false } })
                                //如果还没有其他分组的话，先插入其他分组
                                let order = state.elementList.length;
                                if (!targetGroup) {
                                    let newGroup = {
                                        name: groupName,
                                        checked: 0,
                                        open: 0,
                                        order: order,
                                        children: []
                                    }
                                    window.vue.$store.commit('createNewGroup', { newGroup: newGroup });
                                    targetGroup = state.elementList.find(function (e) { if (e.name == groupName) { return true; } else { return false } })
                                }
                                //添加到目标分组
                                targetGroup.children.push(ele)
                                //从当前分组删除
                                let i = group.children.indexOf(ele);
                                group.children.splice(i, 1)
                            }

                            switch (type) {
                                case 'marker':
                                case 'label':
                                case 'polyline':
                                case 'polygon':
                                default:
                                    //更新数据库中的元素信息
                                    fetch(host + '/d3/data/element', {
                                        method: 'post',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            id: id,
                                            name: name,
                                            type: type,
                                            geojson: geojson,
                                            group: newGroupName,
                                            style: JSON.stringify(style)
                                        })
                                    }).then(resp => {
                                        return resp.json()
                                    }).then(json => {
                                        if (json.state) {

                                        } else {
                                            console.log('更新操作失败:' + json.message)
                                        }
                                    })

                                    break;

                            }
                        }
                    }
                }
            };
            if (!found) {
                this.commit('addElement', ele)
            }
        },
        dropElement: function (state, playload) {
            let id = playload.ele.id;
            for (let eleType of state.elementList) {
                if (eleType && eleType.children) {
                    for (let e of eleType.children) {
                        console.log(e)
                        if (e && e.id && e.id === id) {
                            let i = eleType.children.indexOf(e)
                            eleType.children.splice(i, 1);
                            //从数据库中删除这个元素
                            fetch(host + '/d3/data/element', {
                                method: 'delete',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id: id
                                })
                            }).then(resp => {
                                return resp.json()
                            }).then(json => {
                                if (json.state) {

                                } else {
                                    alert('操作失败:' + json.message)
                                }
                            })

                        }
                    }
                }
            }
        },
        dropGroup: function (state, playload) {
            let groupId = playload.group.id;
            let group = state.elementList.find(
                function (e) { if (e.id == groupId) { return true; } else { return false } }
            )

            for (let ele of group.children) {
                this.commit('dropElement', {
                    ele: { id: ele.id },
                })
            }
            let i = state.elementList.indexOf(group);
            state.elementList.splice(i, 1);

            //从数据库中删除这个元素
            fetch(host + '/d3/data/element/group', {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: groupId
                })
            }).then(resp => {
                return resp.json()
            }).then(json => {
                if (json.state) {

                } else {
                    alert('操作失败:' + json.message)
                }
            })
        }
    },
    getters: {
        getFileList: function (state) {
            return state.fileList;
        },
        base_imageryLayer:function(state){
            return state.imageryLayers.base_imageryLayer;
        },
        anno_imageryLayer:function(state){
            return state.imageryLayers.anno_imageryLayer;
        }
    }
});
export default store;