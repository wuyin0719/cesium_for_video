<template>
    <div id="app">
    <div id="sidebar">
      <label v-for="option in options" :key="option.value">
        <input type="checkbox" :name="option.name" :value="option.value" @change="checkboxChanged">
        {{ option.text }}
      </label>
      <button @click="dynamicShow">动态图</button>
      <button @click="normalShow">静态展示</button>
      <button @click="camera">当前相机状态</button>
    </div>
    <div id="cesiumContainer" >
      <div id="centered-element">{{center_text}}</div>
      <div id="centered-element2">全国34个行政区海拔排名【从高到低】</div>
    </div>
    </div>
</template>
<script>

import * as Cesium from 'cesium/Cesium.js';
import 'cesium/Widgets/widgets.css';
// import * as Cesium from 'cesium/Build/Cesium/Cesium';
// import 'cesium/Widgets/widgets.css';
export default {
  name: 'CesiumMap',
  async mounted(){
    await this.initCesium();
    await this.fetchData();
  },
//   updated () {
//     // this.data1=0;
    
//     this.viewer.clock.startTime = Cesium.JulianDate.now();
//     this.viewer.clock.shouldAnimate = true;
//     this.viewer.timeline.makeLabel();
    
//   },
  data() {
    return {
      options: [
        { name: 'option1', value: 'Option 1', text: 'Option 1',longtitude:null, latitude:null,coordinates:null,area_km:null},
      ],
      viewer:null,
      n:0,
      allCoordinates:null,
      center_longtitude:null,
      center_latitude:null,
      center_text:null,
      featuresHeight:[
  {
    "elevation": 122.89253185843295,
    "province": "香港特别行政区"
  },
  {
    "elevation": 15.62462590850791,
    "province": "澳门特别行政区"
  },
  {
    "elevation": 732.5698852469915,
    "province": "重庆市"
  },
  {
    "elevation": 17.43010731915629,
    "province": "天津市"
  },
  {
    "elevation": 369.3854732174632,
    "province": "北京市"
  },
  {
    "elevation": 4.2627776586394095,
    "province": "上海市"
  },
  {
    "elevation": 776.6479857080659,
    "province": "台湾省"
  },
  {
    "elevation": 1890.1431131296786,
    "province": "云南省"
  },
  {
    "elevation": 297.49166124980684,
    "province": "浙江省"
  },
  {
    "elevation": 478.8307020159146,
    "province": "福建省"
  },
  {
    "elevation": 4049.8761976755613,
    "province": "青海省"
  },
  {
    "elevation": 187.0978202009861,
    "province": "海南省"
  },
  {
    "elevation": 247.97125683678814,
    "province": "河南省"
  },
  {
    "elevation": 552.9638458578689,
    "province": "河北省"
  },
  {
    "elevation": 91.20176107112911,
    "province": "山东省"
  },
  {
    "elevation": 218.01408847907607,
    "province": "广东省"
  },
  {
    "elevation": 357.69483463720695,
    "province": "湖南省"
  },
  {
    "elevation": 119.9289004792046,
    "province": "安徽省"
  },
  {
    "elevation": 248.85114971404934,
    "province": "江西省"
  },
  {
    "elevation": 1109.920664408415,
    "province": "贵州省"
  },
  {
    "elevation": 431.76689490875356,
    "province": "湖北省"
  },
  {
    "elevation": 13.291365911588771,
    "province": "江苏省"
  },
  {
    "elevation": 1160.9716826376773,
    "province": "山西省"
  },
  {
    "elevation": 1129.9177232937568,
    "province": "陕西省"
  },
  {
    "elevation": 234.41963332898186,
    "province": "辽宁省"
  },
  {
    "elevation": 2152.6304191813106,
    "province": "甘肃省"
  },
  {
    "elevation": 317.35766367591725,
    "province": "黑龙江省"
  },
  {
    "elevation": 405.952895105649,
    "province": "吉林省"
  },
  {
    "elevation": 2598.6745310415613,
    "province": "四川省"
  },
  {
    "elevation": 4738.181290809337,
    "province": "西藏自治区"
  },
  {
    "elevation": 395.9995491412706,
    "province": "广西壮族自治区"
  },
  {
    "elevation": 999.5382770309263,
    "province": "内蒙古自治区"
  },
  {
    "elevation": 1565.2244099241336,
    "province": "宁夏回族自治区"
  },
  {
    "elevation": 1903.3372586092266,
    "province": "新疆维吾尔自治区"
  }
],
      pickname:null

    };
    
  },
  methods: {
    async fetchData() {
            // 进行异步数据获取
            var city=null;
            // let result = `'${str1} ${str2}'`;
            var longtitude=null;
            var latitude=null;
            var featuresHeight=this.featuresHeight;
            let sql_str=`SELECT json_agg(row_to_json(t)) FROM (SELECT province as city,ST_Area(ST_Transform(geom, 4527)) / 1000000 AS area_km,ST_AsGeoJSON(geom) AS location_geojson, ST_X(ST_Centroid(geom)) AS longitude, ST_Y(ST_Centroid(geom)) AS latitude
       FROM "province" order by longitude )t`
                // fetch('/api/querysql')
            this.options= await fetch('/api/querysql/?sql='+sql_str)
            .then(response => response.text())
            .then(data => {
                var coordinatesList=[];    
                var res_list=JSON.parse(data)['results'][0][0];
                console.log('res_list',res_list);
                
                res_list.forEach(function(item) {
                // 访问 'person' 字段
                // var person = item.person
                var city_item={value:false,};
                city_item.name=item.city;
                city_item.text=item.city;
                city_item.area_km=item.area_km;
                // city=item.city;
                city_item.longtitude=item.longitude;
                city_item.latitude=item.latitude;
                
                var coordinates=JSON.parse(item.location_geojson)['coordinates'];
                var i=0;
                // console.log('coordinates',coordinates);
                city_item.coordinates=[]
                coordinates.forEach(function(lines){
                  var linepoints=[];
                i=i+10;
                lines[0].forEach(function(item){
                  linepoints.push(item[0],item[1]);//item[0],item[1],0
                })
                city_item.coordinates.push(linepoints);
                });
                city_item.elevation= featuresHeight.find(fitem => fitem.province === city_item.name).elevation;
                
                // city_item.coordinates=linepoints
                coordinatesList.push(city_item);
            });

            return coordinatesList;
            });

            
            this.options.sort((a, b) => b.elevation - a.elevation);
            console.log('city',city);
            // console.log('coordinatesList',coordinatesList);
            console.log('longtitude',longtitude);
            console.log('latitude',latitude);
        },
    async initCesium() {
      // 替换为你的Cesium访问令牌
    //   this.data1=0;
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZTdiNDkzZi05MTBmLTQ3MWYtOGE1Ny1iNmI1MjllZGEyNDMiLCJpZCI6NTc5MDYsImlhdCI6MTcxMzc2Njk5NX0.sALSZ21qi9jXbazm5TRDwLL_mKGGokDUjj8f2VHsgpw';

      this.viewer = new Cesium.Viewer("cesiumContainer", {
      // baseLayer: Cesium.ImageryLayer.fromProviderAsync(osm),
    // terrain: Cesium.Terrain.fromWorldTerrain(),
    shouldAnimate: true,
    // timeline: true,
    });
    // var viewer=this.viewer;
  //   viewer.clock = new Cesium.Clock({
  //   shouldAnimate: true, // 根据需要设置
  //   currentTime: Cesium.JulianDate.now() // 可以设置为特定的时间
  // });
    let sql_str=`SELECT json_agg(row_to_json(t))
            FROM (SELECT cntry_name,ST_AsGeoJSON(geom) AS location_geojson, ST_X(ST_Centroid(geom)) AS longitude, ST_Y(ST_Centroid(geom)) AS latitude
                FROM "nationalboundaries" where cntry_name='China')t`
                // fetch('/api/querysql')
   
   var city_item=await fetch('/api/querysql/?sql='+sql_str).then(response => response.text())
        .then(data => {
            // var coordinatesList=[];    
            var res_list=JSON.parse(data)['results'][0][0];
            // console.log('res_list',res_list);
            var city_item={};
            res_list.forEach(function(item) {
            city_item.center_longtitude=item.longitude;
            city_item.center_latitude=item.latitude;
            
            var coordinates=JSON.parse(item.location_geojson)['coordinates'];
            var i=0;
            console.log('coordinates',coordinates);
            city_item.coordinates=[]
            coordinates.forEach(function(lines){
              var linepoints=[];
            i=i+10;
            lines[0].forEach(function(item){
              linepoints.push(item[0],item[1]);//item[0],item[1],0

            })
            city_item.coordinates.push(linepoints)
            });
            
            console.log('city_item',city_item);
        });
        

        return city_item;
        });

        this.allCoordinates=city_item.coordinates;
        this.center_longtitude=city_item.center_longtitude;
        this.center_latitude=city_item.center_latitude;

    // this.allCoordinates=coordinatesList;
      var scene=this.viewer.scene;
      var that=this;
      let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);//处理用户输入事件
  handler.setInputAction(function (event) {       // 设置左键点击事件
    let pick = scene.pick(event.position); // 获取 pick 拾取对象
    console.log('pick',pick); 
    if (Cesium.defined(pick)) {                   // 判断是否获取到了 pick
      that.pickname=pick.id.name;
      // console.log('pick',pick.id.name); 
      // pick.id.billboard.image = "......"          // 修改拾取到的entity的样式
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      
    },
    normalShow(){
      var allCoordinates=this.allCoordinates;

      for (var i=0;i<allCoordinates.length;i++){
        var positions = Cesium.Cartesian3.fromDegreesArray(allCoordinates[i]);

        this.viewer.entities.add({
        polyline: {  
        positions: positions, // 设置线条的坐标点  
        width: 5, // 设置线条宽度  
          material: Cesium.Color.YELLOW,  
          // clampToGround: true,// 贴地  
        }  
        });
      }

      var flytoPosition = Cesium.Cartesian3.fromDegrees(this.center_longtitude,this.center_latitude,8000000);
      this.viewer.camera.flyTo({
        destination: flytoPosition,
        orientation: {
          heading: Cesium.Math.toRadians(0), // 朝向北方
          pitch: Cesium.Math.toRadians(-90), // 45度向下倾角
          roll: 0 // 水平旋转角度，通常保持为0
        },
        duration: 5, // 飞行持续5秒
        easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN_OUT
});

//     this.viewer.camera.flyTo({
//         destination: flytoPosition,
//         orientation: {
//           heading: Cesium.Math.toRadians(0), // 朝向北方
//           pitch: Cesium.Math.toRadians(-35), // 45度向下倾角
//           roll: 0 // 水平旋转角度，通常保持为0
//         },
//         duration: 5, // 飞行持续5秒
//         easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN_OUT
// });
    },
    dynamicLine(positionsArr){
      var positions = Cesium.Cartesian3.fromDegreesArray(positionsArr);
        var polylineEntity=this.viewer.entities.add({
      polyline: {  
      positions: positions, // 设置线条的坐标点  
      width: 12, // 设置线条宽度  
          material: new Cesium.PolylineGlowMaterialProperty({
              glowPower: 1, // 发光强度
              color: Cesium.Color.WHITE  // 发光颜色
          }), // 设置线条颜色和透明度  
      }  
      });
      var n=0;
      var positionsProperty = new Cesium.CallbackProperty(function () {
          // 根据当前时间计算端点的位置
          
          n=n+20;
          var remainder1 =  (n)% positions.length;
          return positions.slice(0,remainder1);
      }, false);
      polylineEntity.polyline.positions = positionsProperty;
    },
    dynamicShow(){
      var allCoordinates=this.allCoordinates;

      // console.log('var allCoordinates',allCoordinates.length);
      for (var i=0;i<allCoordinates.length;i++){
        this.dynamicLine(allCoordinates[i]);
      }

    var flytoPosition = Cesium.Cartesian3.fromDegrees(this.center_longtitude,this.center_latitude-30,8000000);
      this.viewer.camera.flyTo({
        destination: flytoPosition,
        orientation: {
          heading: Cesium.Math.toRadians(0), // 朝向北方
          pitch: Cesium.Math.toRadians(-70), // 45度向下倾角
          roll: 0 // 水平旋转角度，通常保持为0
        },
        duration: 5, // 飞行持续5秒
        easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN_OUT
});

   
      this.viewer.clock.shouldAnimate = true;

      // this.viewer.timeline.makeLabel();
    },

    checkboxChanged(event) {
      console.log('Checkbox changed:', event.target.checked, event.target.value, event.target.name);
    //   console.log(this.options);
      var options=this.options;
      var viewer=this.viewer;
      viewer.entities.removeAll();
      var featuresHeight=this.featuresHeight;
      var multiple=30;
      console.log('options',options);
      var that=this;
      // var center_text=this.center_text;
      var rank=0;
      options.forEach(function(item){
        rank++;
    // console.log('this.featuresHeight',this.featuresHeight);
        if (item.name==event.target.name){
          
          
          const targetelevation = featuresHeight.find(fitem => fitem.province === item.name).elevation;
          // const targetelevation=0;
          that.center_text=`第${rank}名`;//(${item.name}):海拔高度：${Math.floor(targetelevation)}`;
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        for(var i=0;i<item.coordinates.length;i++){
          var Coordinates = Cesium.Cartesian3.fromDegreesArray(item.coordinates[i]);
            viewer.entities.add({
              name: item.name,
            polygon: {
                hierarchy: Coordinates,
                // material: Cesium.Color.RED.withAlpha(0.5), // 初始填充颜色和透明度
                material: Cesium.Color.fromBytes(r, g, b, 150),  // 设置中间为完全透明
                // outline: true,
                // outlineColor: Cesium.Color.YELLOW,
                // outlineWidth: 2,
                // perPositionHeight: true,
                extrudedHeight: multiple*targetelevation,
                // closeTop: false,
                // closeBottom: false,
                // outline: true,
                // outlineColor: Cesium.Color.YELLOW.withAlpha(0.3),
                // arcType: Cesium.ArcType.RHUMB,
                // clampToGround: true,// 贴地  
            }
            });
            viewer.entities.add({
            name: "Green extruded polygon",
            polygon: {
              hierarchy: Coordinates,
              extrudedHeight: multiple*targetelevation,
              material: Cesium.Color.fromBytes(r, g, b, 250),
              closeTop: false,
              closeBottom: false,
            },
          });

  }



    console.log('targetelevation',targetelevation);
    var minus_lati=1.5;
    var viewHeight=300000;
    if (item.area_km>100000){
      minus_lati=7;
      viewHeight=1600000;
    }
    else if (item.area_km<2000){
      minus_lati=0.32;
      viewHeight=80000;
    }
    console.log('viewHeight',viewHeight);

    var flytoPosition = Cesium.Cartesian3.fromDegrees(item.longtitude,item.latitude-minus_lati,viewHeight);
    var textposition = Cesium.Cartesian3.fromDegrees(item.longtitude,item.latitude, multiple*targetelevation+4000);
            // 添加旋转文字
    viewer.camera.flyTo({
        destination: flytoPosition,
        orientation: {
          heading: Cesium.Math.toRadians(0), // 朝向北方
          pitch: Cesium.Math.toRadians(-65), // 45度向下倾角
          roll: 0 // 水平旋转角度，通常保持为0
        }
});

viewer.entities.add({
        position: textposition,
        label: {
            // text: name,
            text: Math.floor(targetelevation)+'米'+'\n'+item.name,//+'\n'+Math.floor(item.area_km)+'平方公里',//
            font: '20pt Source Han Sans CN',
            fillColor: Cesium.Color.BLACK,
            backgroundColor: Cesium.Color.AQUA,
            showBackground: true,
            outline: true,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: Cesium.Color.BLACK,
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 100), // 将文字向上偏移
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 10)
        }
    });
  //viewer.clock.shouldAnimate = true;
      //viewer.timeline.makeLabel();

        }
        
    //   i=i+10;
    //   linepoints.push(item[0],item[1]);//item[0],item[1],0
    });

//     this.viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2024-06-16T00:00:00Z");
// this.viewer.clock.stopTime = Cesium.JulianDate.addSeconds(this.viewer.clock.startTime, 3600, new Cesium.JulianDate());
// this.viewer.clock.currentTime = this.viewer.clock.startTime;

  // var timeline = new Cesium.Timeline(document.getElementById('cesiumContainer'));
  // viewer.timeline = timeline;

  // viewer.clock = new Cesium.Clock({
  //   shouldAnimate: true, // 根据需要设置
  //   currentTime: Cesium.JulianDate.now() // 可以设置为特定的时间
  // });
  //   viewer.clock.shouldAnimate = true;
  //   viewer.timeline.makeLabel();

   },
   camera(){
    var scene=this.viewer.scene;
    // 假设你已经有一个初始化好的 Cesium 场景对象 `scene`

// 获取当前相机的位置（目的地）
var destination = scene.camera.position;
var cartographic = Cesium.Cartographic.fromCartesian(destination);

// 获取经度、纬度和高度
var longitude = Cesium.Math.toDegrees(cartographic.longitude);
var latitude = Cesium.Math.toDegrees(cartographic.latitude);
var height = cartographic.height; // 高度，单位是米

// 打印经纬度和高度
console.log("Longitude: ", longitude);
console.log("Latitude: ", latitude);
console.log("Height: ", height);

// 获取当前相机的方向（方向向量）
var orientation = scene.camera.direction;

// 获取当前相机的航向（绕 Y 轴的旋转角度）
var heading = Cesium.Math.toDegrees(scene.camera.heading);

// 获取当前相机的俯仰角（绕 X 轴的旋转角度）
var pitch = Cesium.Math.toDegrees(scene.camera.pitch);

// 获取当前相机的横滚角（绕 Z 轴的旋转角度）
var roll = Cesium.Math.toDegrees(scene.camera.roll);

// 打印这些值
// console.log("Destination: ", destination);
console.log("Orientation: ", orientation);
console.log("Heading: ", heading);
console.log("Pitch: ", pitch);
console.log("Roll: ", roll);
console.log("this.pickname: ", this.pickname);

const select_latitude = this.options.find(fitem => fitem.name === this.pickname).latitude;
var showparams={
  "Pitch":pitch,
  "latitude_minus":latitude-select_latitude,
  'height':height
}
console.log('showparams',showparams);


// scene.screenSpaceEventHandler.setInputAction(function (movement) {
//     var feature = scene.pick(movement.position);
//     console.log('Selected feature Name:', feature);
//     if (feature && feature.id instanceof Cesium.Entity) {
//         // 选中实体并进行提示
//         // highlightAndShowInfo(feature.id);
//         console.log('Selected Entity Name:', feature.id.name);
//         console.log('Selected Entity Name:', feature.id.name);
//     }
// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
// viewer=this.viewer;


   }
      // 这里可以添加更多的逻辑处理
    }
  }
// };
</script>

<style scoped>
#sidebar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 从顶部开始堆叠 */
  width: 100px; /* 侧边栏的宽度 */
  position: fixed; /* 固定位置 */
  right: 0; /* 靠页面最右边 */
  top: 0;
  bottom: 0;
  background-color: #f4f4f4; /* 背景颜色 */
  padding: 10px; /* 内边距 */
  box-shadow: -2px 0 5px rgba(0,0,0,0.1); /* 阴影在左侧，因为侧边栏靠右 */
}
#cesiumContainer {
  margin-right: 110px;
  z-index: 1;
}
#centered-element {
  position: absolute; /* 绝对定位相对于cesiumContainer */
  top: 25%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 将文本元素向左和向上移动50%，实现真正的居中 */
  white-space: nowrap; /* 防止文本换行  */
  font-size: 50px;
  z-index: 2;
  background-color: #fe5a07;
  }

  #centered-element2 {
  position: absolute; /* 绝对定位相对于cesiumContainer */
  top: 15%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 将文本元素向左和向上移动50%，实现真正的居中 */
  white-space: nowrap; /* 防止文本换行  */
  font-size: 50px;
  z-index: 2;
  background-color: #e3ee0c;
  }
/* 你可以根据需要添加更多的CSS样式 */
</style>