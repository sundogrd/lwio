<template>
  <div class="publish-container">
    <div class="editor-wrapper">
      <input id="title" type="text" name="title" placeholder="title" v-model="title">
      <div class="textinput" contenteditable="true" @keyup="changeText($event)"></div>
      <footer>
        <button class="lwio-btn" @click="submitBlog">Publish</button>
        <label for="publishToken">
          Publish Token
          <input id="publishToken" type="password" name="publishToken" v-model="publishToken">
        </label>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { postArticles } from 'api/article'
export default {
  name: 'publish',
  data() {
    return {
      publishToken: '',
      title: '',
      content: ''
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    changeText(event) {
      this.content = event.target.innerText;
    },
    async submitBlog() {
      if (this.publishToken !== '443474713') {
        this.$notify.error({
          title: '错误',
          message: 'token错误'
        });
      }
      try {
        const article = await postArticles({ title: this.title, content: this.content })
        this.$router.push({ path: `/article/${article.id}` })
      } catch (e) {
        this.$notify.error({
          title: '错误',
          message: '发布错误'
        });
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .editor-wrapper {
    margin: 100px;

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
  
</style>
