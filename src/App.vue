<template>
  <div id="app">
    <router-link to="/home">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/AdministrativeRegion">行政区带高程切换</router-link>
    <router-link to="/AdministrativeRegion_province">市县带高程切换</router-link>
    <router-view></router-view> <!-- 路由视图占位符 -->
  </div>
</template>

<script>
// import AboutPage from './components/AboutPage.vue'
// import HomePage from './components/HomePage.vue'
export default {
  name: 'App',
  // components: {
  //   AboutPage,
  //   HomePage
  // }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: -11px; 
}
a{
  display: inline-block;
  padding: 8px 15px;
  margin: 0px 10px 10px 0; /* 调整顶部间距 */
  text-decoration: none;
  color: #2c3e50;
}
</style>
