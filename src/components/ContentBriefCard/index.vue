<template>
  <div class='content-brief-card'>
    <div class='content-brief-card--cover' :style="{ backgroundImage: 'url(contentBrief.cover_url), backgroundPosition: 50% 50%'}" />
    <div class='content-brief-card--brief'>
      <p class='content-brief-card--subtitle'>{{subtitle}}</p>
      <div class='content-brief-card--title'>{{contentBrief.title}}</div>
      <!-- <div class='content-brief-card--user'>
        <div class='avatar-block'>
          <img src='//cdn-images-1.medium.com/fit/c/64/64/0*ti5WHj3RjXeMBKCT.' />
        </div>
        <div class='info-block'>
          <p class='name'>梁王</p>
          <p class='caption'>blabla</p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as SundogDataTypes from '@/types/api.d.ts'

@Component({
  name: 'ContentBriefCard'
})
export default class ContentBriefCard extends Vue {
  @Prop({ type: Object, required: true })
  public contentBrief!: SundogDataTypes.ContentBrief

  @Prop({ type: String, required: false })
  public subtitle?: string
}
</script>

<style lang='less' scoped>
.content-brief-card {
  width: 33.33333333%!important;
  height: 220px;
  margin: 8px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.04);
  color: rgba(0,0,0,.84);
  box-shadow: 0 1px 7px rgba(0,0,0,.05);
  &--cover {
    cursor: pointer;
    height: 100px;
    width: 100%;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    border-bottom: 1px solid rgba(0,0,0,.0785);
    background-position: center!important;
    background-origin: border-box!important;
    background-size: cover!important;
    background-color: #f0f0f0!important;
  }
  &--subtitle {
    color: rgba(0,0,0,.54)!important;
    fill: rgba(0,0,0,.54)!important;
    margin-bottom: 7px!important;
  }
  &--title {
    cursor: pointer;
    font-weight: 600!important;
    font-family: medium-content-sans-serif-font,'Lucida Grande','Lucida Sans Unicode','Lucida Sans',Geneva,Arial,sans-serif!important;

    overflow: hidden!important;
    height: 48px!important;
    text-overflow: ellipsis!important;
    display: -webkit-box!important;
    -webkit-line-clamp: 2!important;
    margin-bottom: 20px;
  }
  &--brief {
    height: 120px;
    line-height: 20px;
    font-size: 16px;
    padding: 15px;
  }
}
</style>
