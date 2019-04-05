<template>
  <header>
    <div class="header-left"><i class="logo"><img @click="$router.push('/')" src="/favicon.ico" alt="Nav_Logo"></i></div>
    <div class="header-nav">
      <ul class="nav navbar-nav">
        <li class="tab index active">
          <router-link to="/">
            <span class="menu-text">首页</span>
            <i class="iconfont"></i>
          </router-link>
        </li>
        <li class="tab search">
            <el-input
              placeholder="请输入内容"
              class="search-input"
              :class="{focus: searchFocus}"
              @focus="searchFocus = true"
              @blur="searchFocus = false"
              v-model="searchValue">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div id="navbar-search-tips" v-show="searchFocus">
              <div class="search-trending">
                <div class="search-trending-header">
                  <span>热门搜索</span>
                </div>
                <ul class="search-trending-tag-wrapper">
                  <li><a href="">test</a></li>
                  <li><a href="">test</a></li>
                  <li><a href="">test</a></li>
                  <li><a href="">test</a></li>
                </ul>
              </div>
            </div>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <!-- <el-button class="login header-btn" type="primary">登录</el-button> -->
      <a href="/api/oauth2/github/login" class="login header-btn">登录</a>
      <el-button @click="$router.push({name: 'articlePublishPage'})" class="publish header-btn" type="primary" icon="el-icon-search">写文章</el-button>
    </div>
    </header>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "AppHeader",
})
export default class AppHeader extends Vue {
  searchValue:string = ''
  searchFocus: boolean = false
}
</script>

<style lang="less" scoped>
header{
  height: 60px;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  // max-width: 1440px;
  min-width: 960px;
  margin: 0 auto;
  background: white;
  z-index: 99999;
  border-bottom: 1px solid #f0f0f0;
  .header-left{
    position: absolute;
    left: 15px;

    img{
      cursor: pointer;
      display: inline-block;
      width: 30px;
      height: 30px;
    }
  }
  .header-nav {
    position: relative;
    margin: 0 auto;
    width: 960px;
    .tab.index{
      padding: 15px;
      font-size: 18px;
    }
    .nav{
      display: flex;
      align-items: center;
    }
    .search {
      position: relative;
      .search-input{
        width: 240px;
        transition: width .5s ease-in-out;
        &.focus{
          width: 320px;
        }
        & /deep/ .el-input__inner{
          border-radius: 20px;
        }
      }
    }

    #navbar-search-tips{
      // display: none;
      position: absolute;
      padding: 20px 20px 10px;
      border-bottom: 1px solid #f0f0f0;
      background: white;
      box-shadow: 0 0 8px rgba(0, 0, 0, .2);
      top: 50px;
      &::before{
        content: '';
        left: 27px;
        width: 10px;
        height: 10px;
        top: -5px;
        z-index: -1;
        background: white;
        transform: rotate(45deg);
        position: absolute;
        box-shadow: 0 0 8px rgba(0, 0, 0, .2);
      }
      .search-trending-header{
        height: 20px;
        margin-bottom: 10px;
        span{
          float: left;
          font-size: 14px;
          color: #969696;
        }
      }

      .search-trending-tag-wrapper{
        font-size: 0;

        li{
          margin-right: 10px;
          display: inline-block;
          line-height: 28px;

          a{
            padding: 2px 6px;
            font-size: 12px;
            color: #787878;
            border: 1px solid #ddd;
            border-radius: 3px;
            &:hover{
              color: #333;
              border-color: #b4b4b4;
            }
          }
        }
      }
    }
  }

  .header-right{
    position: absolute;
    right: 15px;

    .header-btn{
      border-radius: 20px;
      cursor: pointer;
    }
    .login{
      color: blue;
      background: white;
      line-height: 40px;
      height:40px;
      width: 80px;
      vertical-align: middle;
      font-size: 15px;
      display: inline-block;
      text-align: center;
      border: 1px solid blue;
    }
    .publish{
      margin-left: 30px;
    }
  }
}
</style>
