<template>
    <div id="app">
    <div id="sidebar">
      <label v-for="option in options" :key="option.value">
        <input type="checkbox" :name="option.name" :value="option.value" @change="checkboxChanged">
        {{ option.text }}
      </label>
      <button @click="dynamicShow">动态图</button>
      <button @click="normalShow">静态展示</button>
    </div>
    <div id="cesiumContainer" >
      <div id="centered-element">{{center_text}}</div>
      <div id="centered-element2">西藏各地级市海拔排名【从低到高】</div>
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
    "city": "拉萨市",
    "elevation": 4829.326862937678
  },
  {
    "city": "日喀则市",
    "elevation": 4653.370598856456
  },
  {
    "city": "日喀则市",
    "elevation": 4986.839707493134
  },
  {
    "city": "昌都市",
    "elevation": 4465.859283655986
  },
  {
    "city": "林芝市",
    "elevation": 3655.7720525250083
  },
  {
    "city": "山南市",
    "elevation": 3675.178550973965
  },
  {
    "city": "那曲市",
    "elevation": 4779.762119164864
  },
  {
    "city": "那曲市",
    "elevation": 4960.6970110920975
  },
  {
    "city": "阿里地区",
    "elevation": 5048.134229933453
  }
]

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
            let sql_str=`SELECT json_agg(row_to_json(t))
            FROM (SELECT province,city,ST_Area(ST_Transform(geom, 4527)) / 1000000 AS area_km,ST_AsGeoJSON(geom) AS location_geojson, ST_X(ST_Centroid(geom)) AS longitude, ST_Y(ST_Centroid(geom)) AS latitude
                FROM "citySingle" where province='西藏自治区')t`
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
                var linepoints=[];
                var coordinates=JSON.parse(item.location_geojson)['coordinates'][0][0];
                var i=0;
                // console.log('coordinates',coordinates);
                
                coordinates.forEach(function(item){
                i=i+10;
                linepoints.push(item[0],item[1]);//item[0],item[1],0
                });
                city_item.coordinates=linepoints;
                city_item.elevation= featuresHeight.find(fitem => fitem.city === city_item.name).elevation;

                coordinatesList.push(city_item);
            });

            return coordinatesList;
            });
            console.log('city',city);
            // console.log('coordinatesList',coordinatesList);
            this.options.sort((a, b) => b.elevation - a.elevation);
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
            FROM (SELECT province,ST_AsGeoJSON(geom) AS location_geojson, ST_X(ST_Centroid(geom)) AS longitude, ST_Y(ST_Centroid(geom)) AS latitude
                FROM "province" where province='西藏自治区')t`
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
            var linepoints=[];
            var coordinates=JSON.parse(item.location_geojson)['coordinates'][0][0];
            var i=0;
            console.log('coordinates',coordinates);
            
            coordinates.forEach(function(item){
            i=i+10;
            linepoints.push(item[0],item[1]);//item[0],item[1],0
            });
            city_item.coordinates=linepoints
            // coordinatesList.push(linepoints);
        });
        

        return city_item;
        });

        this.allCoordinates=city_item.coordinates;
        this.center_longtitude=city_item.center_longtitude;
        this.center_latitude=city_item.center_latitude;

    // this.allCoordinates=coordinatesList;
       
      
    },
    normalShow(){
      var allCoordinates=this.allCoordinates;

      var positions = Cesium.Cartesian3.fromDegreesArray(allCoordinates);

      this.viewer.entities.add({
        name:'border',
      polyline: {  
      positions: positions, // 设置线条的坐标点  
      width: 5, // 设置线条宽度  
        material: Cesium.Color.YELLOW,  
        clampToGround: true,// 贴地  
      }  
      });
      var flytoPosition = Cesium.Cartesian3.fromDegrees(this.center_longtitude,this.center_latitude,3000000);
      this.viewer.camera.flyTo({
        destination: flytoPosition,
        orientation: {
          heading: Cesium.Math.toRadians(0), // 朝向北方
          pitch: Cesium.Math.toRadians(-90), // 45度向下倾角
          roll: 0 // 水平旋转角度，通常保持为0
        },
        duration: 3, // 飞行持续5秒
        easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN_OUT,
        // clampToGround: true,// 贴地  
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
    dynamicShow(){
      var allCoordinates=this.allCoordinates;

      // console.log('var allCoordinates',allCoordinates.length);

      var positions = Cesium.Cartesian3.fromDegreesArray(allCoordinates);

      var polylineEntity=this.viewer.entities.add({
    polyline: {  
    positions: positions, // 设置线条的坐标点  
    width: 10, // 设置线条宽度  
        material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 1, // 发光强度
            color: Cesium.Color.WHITE  // 发光颜色
        }), // 设置线条颜色和透明度
        clampToGround: true,// 贴地   
        
    }  
    });



    var n=0;
    var positionsProperty = new Cesium.CallbackProperty(function () {
        // 根据当前时间计算端点的位置
        
        n=n+10000;
        var remainder1 =  (n)% positions.length;
        return positions.slice(0,remainder1);
    }, false);
    polylineEntity.polyline.positions = positionsProperty;
    var flytoPosition = Cesium.Cartesian3.fromDegrees(this.center_longtitude,this.center_latitude-12,3000000);
      this.viewer.camera.flyTo({
        destination: flytoPosition,
        orientation: {
          heading: Cesium.Math.toRadians(0), // 朝向北方
          pitch: Cesium.Math.toRadians(-70), // 45度向下倾角
          roll: 0 // 水平旋转角度，通常保持为0
        },
        duration: 1, // 飞行持续5秒
        easingFunction: Cesium.EasingFunction.SINUSOIDAL_IN_OUT
});

    
      this.viewer.clock.shouldAnimate = true;

      // this.viewer.timeline.makeLabel();
    },
    dynamicBar(barEntity,elevation){
      var currentHeight = 0; // 初始高度
      var targetHeight = elevation; // 目标高度
      var duration = 10; // 变化持续的时间（秒）
      var startTime = Cesium.JulianDate.now(); // 记录开始时间

      // 创建一个CallbackProperty，用于动态更新extrudedHeight
      var extrudedHeightProperty = new Cesium.CallbackProperty(function () {
        var currentTime = Cesium.JulianDate.now();
        var elapsedTime = Cesium.JulianDate.secondsDifference(currentTime, startTime);

        // 计算当前高度，根据时间线性插值
        var extrudedHeight = Cesium.Math.lerp(currentHeight, targetHeight, elapsedTime / duration);

        // 如果已经达到目标高度或超过时间，停止增加高度
        if (elapsedTime >= duration) {
          extrudedHeight = targetHeight;
        }

        return extrudedHeight-1000;
      }, false);
      barEntity.polygon.extrudedHeight=extrudedHeightProperty;

    },
    dynamiclabel(labelEntity,item,elevation){
      var currentHeight = 0; // 初始高度
      var targetHeight = elevation; // 目标高度
      var duration = 10; // 变化持续的时间（秒）
      var startTime = Cesium.JulianDate.now(); // 记录开始时间
      // 创建一个CallbackProperty，用于动态更新extrudedHeight
      var extrudedHeightProperty = new Cesium.CallbackProperty(function () {
        var currentTime = Cesium.JulianDate.now();
        var elapsedTime = Cesium.JulianDate.secondsDifference(currentTime, startTime);
        // 计算当前高度，根据时间线性插值
        var extrudedHeight = Cesium.Math.lerp(currentHeight, targetHeight, elapsedTime / duration);
        // 如果已经达到目标高度或超过时间，停止增加高度
        if (elapsedTime >= duration) {
          extrudedHeight =targetHeight; //Math.floor(targetHeight)+'m';
        }

        return Math.floor(extrudedHeight)+'m'//extrudedHeight;
      }, false);
      labelEntity.label.text=extrudedHeightProperty;
      // var textposition=
      var positionProperty = new Cesium.CallbackProperty(function () {
        var currentTime = Cesium.JulianDate.now();
        var elapsedTime = Cesium.JulianDate.secondsDifference(currentTime, startTime);
        // 计算当前高度，根据时间线性插值
        var extrudedHeight = Cesium.Math.lerp(currentHeight, targetHeight, elapsedTime / duration);
        // 如果已经达到目标高度或超过时间，停止增加高度
        if (elapsedTime >= duration) {
          // extrudedHeight = Mat.floor(targetHeight)+'m';
          extrudedHeight =targetHeight; 
          // var textposition = Cesium.Cartesian3.fromDegrees(item.longtitude,item.latitude, 10*targetHeight+3000);
        }

        return Cesium.Cartesian3.fromDegrees(item.longtitude,item.latitude, 10*extrudedHeight+6000);//extrudedHeight;
      }, false);

      labelEntity.position=positionProperty;

    },

    checkboxChanged(event) {
      console.log('Checkbox changed:', event.target.checked, event.target.value, event.target.name);
    //   console.log(this.options);
      var options=this.options;
      var viewer=this.viewer;
      // viewer.entities.removeAll();
      // 首先获取当前所有实体
      // var entities = this.viewer.entities.values;

      // 然后遍历所有实体
      // for (var i = entities.length - 1; i >= 0; i--) {
      //   var entity = entities[i];
        
      //   // 如果实体的名称不是 'border'，则删除它
      //   if (entity.name !== 'border') {
      //     this.viewer.entities.remove(entity);
      //   }
      // }

      // 注意：保留名为 'border' 的实体，不需要进行任何操作
      var featuresHeight=this.featuresHeight;
      var that=this;
      var rank=0;
      // console.log('this.featuresHeight',this.featuresHeight);
      options.forEach(function(item){
        rank++;
    // console.log('this.featuresHeight',this.featuresHeight);
        if (item.name==event.target.name){
          that.center_text=`第${rank}名:${item.name}`;

          const targetelevation = featuresHeight.find(fitem => fitem.city === item.name).elevation;
        var allCoordinates = Cesium.Cartesian3.fromDegreesArray(item.coordinates);
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        
        var barentity=viewer.entities.add({
    polygon: {
        hierarchy: allCoordinates,
        // material: Cesium.Color.RED.withAlpha(0.5), // 初始填充颜色和透明度
        material: Cesium.Color.fromBytes(r, g, b, 255),  // 设置中间为完全透明
        // extrudedHeight: 10*targetelevation,
        extrudedHeight: new Cesium.CallbackProperty(function () {
      return 10*targetelevation; // 返回固定的高度值
    }, true) // true 表示这个属性是固定的，只调用一次
    }
    });


    viewer.entities.add({
  name: "Green extruded polygon",
  polygon: {
    hierarchy: allCoordinates,
    extrudedHeight: 10*targetelevation,
    material: Cesium.Color.WHITE.withAlpha(0.3),
    closeTop: false,
    closeBottom: false,
  },
});


    

    // var flytoPosition = Cesium.Cartesian3.fromDegrees(item.longtitude,item.latitude-3.5,300000);
    var textposition = Cesium.Cartesian3.fromDegrees(item.longtitude,item.latitude, 10*targetelevation+3000);


var labelEntity=viewer.entities.add({
        position: textposition,
        label: {
            // text: name,
            text: Math.floor(targetelevation)+'m',//+'\n面积'+Math.floor(item.area_km)+'km²',item.name+'\n'+'平均海拔'+
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


    viewer.zoomTo(barentity).then(function(){
      that.dynamicBar(barentity,10*targetelevation);
      that.dynamiclabel(labelEntity,item,targetelevation);
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