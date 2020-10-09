<template>
  <div id="app">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu class="el-menu-vertical-demo" default-active="2" @open="handleOpen" @close="handleClose">
            <el-submenu index="1">
              <template slot="title">
                <!-- <i class="el-icon-location"></i> -->
                <span>首页</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>

            <el-menu-item index="2">
              <!-- <i class="el-icon-menu"></i> -->
              <span slot="title">APP 管理</span>
            </el-menu-item>

            <el-menu-item index="3">
              <!-- <i class="el-icon-document"></i> -->
              <span slot="title">分销管理</span>
            </el-menu-item>

            <el-menu-item index="4">
              <!-- <i class="el-icon-setting"></i> -->
              <span slot="title">用户管理</span>
            </el-menu-item>

            <el-menu-item index="5" disabled>
              <!-- <i class="el-icon-document"></i> -->
              <span slot="title">营销管理</span>
            </el-menu-item>
          </el-menu>
          <!-- menu end -->
        </el-aside>
        <el-container>
          <el-main>
            <el-page-header @back="goBack" content="详情页面"></el-page-header>
            <!-- main end -->
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  }
}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
  
body > .el-container {
  margin-bottom: 40px;
}
</style>
