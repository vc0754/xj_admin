<template>
  <nav>
    <header class="nav-header">
      <router-link to="/" class="brand">
        <img alt="" src="../../assets/logo.png">
        <span>嘻街后台管理系统</span>
      </router-link>
    </header>

    <el-menu default-active="1" @open="handleOpen" @close="handleClose" class="p-t-20">

      <el-menu-item index="1">
        <i class="el-icon-location"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>APP 管理</span>
        </template> 
        <el-menu-item index="1-1" style="padding-left:50px;">APP 设置</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
        <i class="el-icon-setting"></i>
          <span>数据统计</span>
        </template> 
        <el-menu-item index="3-1" style="padding-left:50px;">数据账单</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
        <i class="el-icon-setting"></i>
          <span>用户管理</span>
        </template> 
        <el-menu-item index="4-1" style="padding-left:50px;">普通用户</el-menu-item>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">
        <i class="el-icon-setting"></i>
          <span>订单管理</span>
        </template> 
        <el-menu-item index="5-1" style="padding-left:50px;">淘宝订单</el-menu-item>
        <el-menu-item index="5-2" style="padding-left:50px;">拼多多订单</el-menu-item>
        <el-menu-item index="5-3" style="padding-left:50px;">京东订单</el-menu-item>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
        <i class="el-icon-setting"></i>
          <span>账号管理</span>
        </template> 
        <el-menu-item index="6-1" style="padding-left:50px;">淘宝账号</el-menu-item>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title">
        <i class="el-icon-setting"></i>
          <span>提现管理</span>
        </template> 
        <el-menu-item index="7-1" style="padding-left:50px;">提现设置</el-menu-item>
        <el-menu-item index="7-2" style="padding-left:50px;">提现列表</el-menu-item>
      </el-submenu>
    </el-menu>
  </nav>
</template>

<script>
export default {
  name: 'AdminMenu',
  data () {
    return {
      menus: [
        {
          "path": "string",
          "id": 0,
          "meta": {
            "title": "string",
            "show": true
          },
          "children": [
            null
          ]
        },
        
      ]
    }
  },
  computed: {
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>