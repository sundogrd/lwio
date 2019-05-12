<template>
  <div class='sundog-comment'>
    <div class='sundog-comment--cover' :style="{ backgroundImage: `url(${comment.creator.img_url})`}" />
    <div class='sundog-comment--card'>
      <p class='sundog-comment--creator'>{{comment.creator.nick}}</p>
      <div class='sundog-comment--content'>{{comment.content}}</div>
      <div class="sundog-comment--extra">
          <span class="floor">{{comment.floor}}</span>
          <span class="platform">{{comment.extra.platform}}</span>
          <span class="time">{{comment.create_time | formatTime}}</span>
          <span class="like"><i></i><span>{{comment.like}}</span></span>
          <span class="hate"><i></i><span>{{comment.hate}}</span></span>
          <span class="reply btn-hover"></span>
          <span class="operations" style="display: none">
              <div class="splot"></div>
              <div class="operation">
                  <ul>
                      <li>加入黑名单</li>
                      <li>举报</li>
                  </ul>
              </div>
          </span>
      </div>
      <div class="sundog-comment--subcomments" v-if="comment.subcomments && comment.subcomments.length" >
          <div class="subcomment-item" v-for="(subComment, index) in comment.subcomments" :key="index">
              <a href=""><img :src="subComment.creator.img_url" alt="image"></a>
              <div class="subcomment-item--wrapper">
                  <span class="subcomment-item--name"></span>
                  <span class="subcomment-item--content"></span>
              </div>
              <div class="subcomment-item--info">
                    <span class="time">{{subComment.create_time}}</span>
                    <span class="like">{{subComment.like}}</span>
                    <span class="reply btn-hover">回复</span>
                    <span class="operations" style="display: none">
                        <div class="splot"></div>
                        <div class="operation">
                            <ul>
                                <li>加入黑名单</li>
                                <li>举报</li>
                            </ul>
                        </div>
                    </span>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as SundogDataTypes from '@/types/api.d.ts'

@Component({
  name: 'Comment'
})
export default class ContentBriefCard extends Vue {
  @Prop({ type: Number, required: false, default: 3 })
  public maxCount!: number

  @Prop({ type: Number, required: false, default: 5 })
  public pageSize!: number

  @Prop({type: Object, required: true})
  public comment!: SundogDataTypes.Comment

}
</script>

<style lang='less' scoped>
.sundog-comment{
    // background: red;
    // min-width: 300px;
    // min-height: 300px;
    .sundog-comment--cover{
        cursor: pointer;
        float: left;
        margin: 24px 0 0 5px;
        position: relative;
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: cover;
        width: 48px;
        border: none;
        vertical-align: middle;
        height: 48px;
        border-radius: 50%;
    }

    .sundog-comment--card{
        position: relative;
        margin-left: 85px;
        padding: 22px 0 14px;
        border-top: 1px solid #e5e9ef;
        .sundog-comment--creator{
            font-size: 12px;
            font-weight: 700;
            line-height: 18px;
            padding-bottom: 4px;
            display: block;
            word-wrap: break-word;
            color: #6d757a;
            cursor: pointer;
        }
        .sundog-comment--content{
            line-height: 20px;
            padding: 2px 0;
            font-size: 14px;
            text-shadow: none;
            overflow: hidden;
            word-wrap: break-word;
            word-break: break-word;
        }

        .sundog-comment--extra{
            color: #99a2aa;
            line-height: 26px;
            font-size: 12px;
            & > span{
                margin-right: 20px;
            }
        }

        .floor{

        }

        .platform{

        }

        .time{
        }

        .like{
            cursor: pointer;
        }

        .hate{
            margin-right: 15px;
            cursor: pointer;
        }

        .operation{
            position: relative;
            width: 18px;
            float: right;
            margin-top: 5px;
            margin-right: 0;
        }

        .reply{

        }

        .btn-hover{
            padding: 0 5px;
            border-radius: 4px;
            margin-right: 15px;
            cursor: pointer;
            display: inline-block;  
        }
    }
}

</style>