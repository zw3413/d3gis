/*
 * @Author: zhangbo
 * @E-mail: xtfge_0915@163.com
 * @Date: 2019-12-17 18:35:25
 * @LastEditors: zhangbo
 * @LastEditTime: 2020-02-18 18:47:08
 * @Desc: 定义几何图形类型
 */
const GraphicType=(function(){
    function _(){

    }
    _.MARKER=0 //点
    _.POINT=5//点
    _.POLYLINE=1 //线
    _.POLYGON=2//面
    _.LABEL=3//标签
    _.MODEL=4//模型
    return _
})()
export default GraphicType