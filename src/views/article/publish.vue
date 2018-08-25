<template>
  <div class="publish-container">
    <div class="editor-wrapper">
      <!-- <input id="title" type="text" name="title" placeholder="title" v-model="title"> -->
      <div class="editor-topbar">
        <el-input v-model="title" placeholder="请输入标题"></el-input>
        <el-dropdown split-button type="primary" @click="submitBlog">
          发布
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>草稿</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div id="editor">
        <textarea class="editor-part" :value="contentMD" @input="updateContent" placeholder="输入markdown语法"></textarea>
        <div class="editor-part" v-html="compiledMarkdown"></div>
      </div>
      <el-input v-model="publishToken" placeholder="token" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import marked from 'marked';
import { mapGetters } from 'vuex';
import { postArticles } from 'api/article';
export default {
  name: 'publish',
  data() {
    return {
      publishToken: '',
      title: '',
      contentMD: ''
    };
  },
  computed: {
    compiledMarkdown() {
      return marked(this.contentMD, { sanitize: true });
    },
    ...mapGetters(['user'])
  },
  methods: {
    updateContent: _.debounce(function(e) {
      // debugger
      this.contentMD = e.target.value;
    }, 300),
    changeText(event) {
      this.contentMD = event.target.innerText;
    },
    async submitBlog() {
      if (this.publishToken !== '443474713') {
        this.$notify.error({
          title: '错误',
          message: 'token错误'
        });
        return
      }
      try {
        const article = await postArticles({
          title: this.title,
          contentMD: this.contentMD
        });
        this.$router.push({ path: `/article/${article.id}` });
      } catch (e) {
        this.$notify.error({
          title: '错误',
          message: '发布错误'
        });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.publish-container {
  height: 100%;
  flex: 1;
  justify-content: space-between;
  align-items: stretch;

  .editor-topbar {
    display: flex;
    justify-content: space-between;
    .el-input {
      flex: 1;
    }
  }
  .editor-wrapper {
    /* height: 100%; */
    min-height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    width: auto;
    right: 0;
    box-sizing: border-box;
    left: 0;
    display: flex;
    flex-direction: column;

    .textinput {
      height: 60px;
      line-height: 20px;
      padding: 3px 8px 5px;
      border: 1px solid #e6e6e6;
      background: #fff;

      font-size: 14px;
      overflow-y: auto;
      &:focus {
        outline: none;
      }
    }
    footer {
      border: 1px solid #e6e6e6;
      padding: 3px 10px;
      background: #fff;
      button {
        padding: 2px 10px;
        line-height: 28px;
        border-radius: 2px;
        font-size: 14px;
      }
    }
  }
}

#editor {
  margin: 0;
  height: 100%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
  display: flex;
  flex-grow: 1;

  .editor-part {
    align-items: stretch;
  }
}

textarea,
#editor div {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px;
}

textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
  background: rgba(110, 141, 144, 0.5);
}

code {
  color: #f66;
}
</style>
