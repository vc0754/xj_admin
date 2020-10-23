<template>
  <nav>
    <header class="nav-header">
      <router-link to="/" class="brand">
        <img alt="" src="../../assets/logo.png">
        <span>嘻街后台管理系统</span>
      </router-link>
    </header>

    <el-menu default-active="1" router class="p-t-20">
      <template v-if="menus.length">
        <template v-for="(item, index) in menus">
          <el-submenu :index="`sub_${index}`" :key="index" v-if="item.children.length">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>{{ item.meta.title }}</span>
            </template>
            <template v-if="item.children.length">
              <el-menu-item style="padding-left:50px;" :index="subitem.path" v-for="(subitem, index2) in item.children" :key="index2">{{ subitem.meta.title }}</el-menu-item>
            </template>
          </el-submenu>

          <el-menu-item :index="item.path" :key="index" v-else>
            <i class="el-icon-location"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>

      <template v-else>
        <!-- <el-menu-item index="/">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>APP 管理</span>
          </template> 
          <el-menu-item style="padding-left:50px;" index="/setting">APP 设置</el-menu-item>
        </el-submenu>

        <el-submenu index="3">
          <template slot="title">
          <i class="el-icon-setting"></i>
            <span>数据统计</span>
          </template> 
          <el-menu-item style="padding-left:50px;" index="/statistics">数据账单</el-menu-item>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title">
          <i class="el-icon-setting"></i>
            <span>用户管理</span>
          </template> 
          <el-menu-item style="padding-left:50px;" index="/users">普通用户</el-menu-item>
        </el-submenu>

        <el-submenu index="5">
          <template slot="title">
          <i class="el-icon-setting"></i>
            <span>订单管理</span>
          </template> 
          <el-menu-item style="padding-left:50px;" index="/orders?channel_id=1">淘宝订单</el-menu-item>
          <el-menu-item style="padding-left:50px;" index="/orders?channel_id=3">拼多多订单</el-menu-item>
          <el-menu-item style="padding-left:50px;" index="/orders?channel_id=2">京东订单</el-menu-item>
        </el-submenu>

        <el-submenu index="6">
          <template slot="title">
          <i class="el-icon-setting"></i>
            <span>账号管理</span>
          </template> 
          <el-menu-item style="padding-left:50px;" index="/account">淘宝账号</el-menu-item>
          <el-menu-item style="padding-left:50px;" index="/auth">更新授权</el-menu-item>
          <el-menu-item style="padding-left:50px;" index="/channel">开启渠道模式</el-menu-item>
        </el-submenu>

        <el-submenu index="7">
          <template slot="title">
          <i class="el-icon-setting"></i>
            <span>提现管理</span>
          </template> 
          <el-menu-item style="padding-left:50px;" index="/withdrawal/setting">提现设置</el-menu-item>
          <el-menu-item style="padding-left:50px;" index="/withdrawal">提现列表</el-menu-item>
        </el-submenu> -->

      </template>
    </el-menu>
  </nav>
</template>

<script>
export default {
  name: 'AdminMenu',
  data () {
    return {
      menus: []
    }
  },
  computed: {
  },
  methods: {
    query () {
      this.$http.post('/api/Authority/Menu').then(res => {
        // this.menus = res.data
        
        let new_routes = []
        res.data.map(item => {
          let children = []
          if (item.children.length) {
            item.children.map(item2 => {
              children.push({
                path: `/page${item2.id}`,
                meta: item2.meta,
                component: resolve => require([`@/views/page${item2.id}.vue`], resolve),
                children: []
              })
            })
          }

          new_routes.push({
            path:'/',
            meta: item.meta,
            component: resolve => require(['@/layout/Layout.vue'], resolve),
            children: children
          })
        })
        // console.log(new_routes)

        let routes = new_routes.concat(this.$router.options.routes)
        this.$router.addRoutes(routes)
        this.menus = new_routes
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="less" scoped>
.line {
  color: #fff;
  border-bottom: solid 1px rgba(0,0,0,0.24); margin: 15px 0;
  display: flex; flex-direction: column; align-items: center;
}
</style>