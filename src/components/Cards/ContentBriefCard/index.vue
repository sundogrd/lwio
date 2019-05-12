<template>
  <module-card class='content-brief-card'>
    <div class="title">
      <router-link :to="{ name: 'articleDetailPage', params: {articleId: content.content_id} }" target="_blank">
        {{content.title}}
      </router-link>
    </div>
    <div class="rich-content" v-html="content.body">
    </div>
    <div class="actions">
      <span>
        <button aria-label="鼓掌" type="button" class="clap-button"><icon-svg iconClass="clap_filled"/>鼓掌 {{clapCount | nFormatter}}</button>
      </span>
      <button type="button" class="action-button"><icon-svg iconClass="comment"/>{{commentCount | nFormatter}} 条评论</button>
    </div>
  </module-card>
</template>

<script>
module.exports = {
  data: function () {
    return {
      greeting: 'Hello'
    }
  },
  props: {
    content: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.content-brief-card {
  padding: 20px;
  border-bottom: 1px solid #f0f2f7;

  .title {
    font-size: 18px;
    font-weight: 600;
    font-synthesis: style;
    line-height: 1.6;
    color: #1a1a1a;
    margin-top: -4px;
    margin-bottom: 10px;

    &:hover {
      color: #175199;
    }
  }

  .rich-content {
    margin-bottom: 10px;
  }

  .actions {
    .clap-button {
      line-height: 30px;
      padding: 0 12px;
      color: #0084ff;
      background: rgba(0, 132, 255, 0.1);
      text-align: center;
      cursor: pointer;
      border: 1px solid transparent;
      border-radius: 3px;

      &:hover {
        background-color: rgba(0, 132, 255, 0.15);
      }
    }

    .action-button {
      margin-left: 24px;
      font-size: 14px;
      height: auto;
      padding: 0;
      line-height: inherit;
      background-color: transparent;
      border: none;
      color: #8590a6;
      text-align: center;
      cursor: pointer;
      border-radius: 0;
    }
  }
}
</style>
