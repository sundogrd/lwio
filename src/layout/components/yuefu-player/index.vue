<template>
  <keep-alive>
    <div id="yuefu-player" class="yuefu-player">
      <div class="yuefu-player-radio" :class="playing ? 'playing' : ''" @click="handleClick">
        <img :src="require(`./disc.png`)" />
        <div class="yuefu-player-radio-play"><icon-svg iconClass="play" /></div>
      </div>
    </div>
  </keep-alive>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg/index.vue'
import Yuefu from 'yuefu'
@Component({
  name: 'YuefuPlayer',
  components: {
    IconSvg
  }
})
export default class YuefuPlayer extends Vue {
  yuefu: Yuefu | undefined;
  playing: boolean = false;

  public mounted () {
    this.yuefu = new Yuefu({
      container: document.getElementById('yuefu-player') as Element
    })

    this.yuefu.install(Yuefu.imports['progress'], {
      // timeFormat: 'MM:ss'
    })
    this.yuefu.install(Yuefu.imports['list'], {
      audios: [
        {
          name: 'Counting Stars',
          artist: 'OneRepublic',
          type: 'normal',
          url: 'http://music.163.com/song/media/outer/url?id=26060065.mp3',
          cover: '',
          lrc: 'http://cdn.lwio.me/yuefu/lrc/demo.lrc'
        },
        {
          name: '胖子非野子',
          artist: 'JAKI',
          type: 'normal',
          url: 'http://music.163.com/song/media/outer/url?id=401723037.mp3',
          cover: '',
          lrc: 'http://cdn.lwio.me/yuefu/lrc/demo2.lrc'
        }
      ]
    })

    this.yuefu.install(Yuefu.imports['lrc'], {})
  }

  handleClick () {
    if (!this.yuefu) {
      return
    }
    this.playing = true
    console.log(this.yuefu.modules)

    // @ts-ignore
    this.yuefu.modules['list'].switch(0)
    this.yuefu.play()
  }
}
</script>

<style lang="less">
.yuefu-player {
  position: fixed;
  bottom: 0;
  .yuefu-player-radio {
    display: inline-block;
    position: relative;
    background-color: rgb(70, 113, 139);
    cursor: pointer;
    img {
      transition: 0.3s all ease-in-out;
      height: 80px;
      width: 80px;
      opacity: 0.5;
    }
    .yuefu-player-radio-play {
      position: absolute;
      color: #fff;
      transition: 0.3s all ease-in-out;
      opacity: 0.1;
      top: 50%;
      left: 50%;
      font-size: 25px;
      transform: translate(-50%, -50%);
    }
    &:hover {
      img {
        opacity: 0.1;
      }
      .yuefu-player-radio-play {
        opacity: 1;
        color: #fff;
      }
    }
    &.playing {
      img {
        animation-name: spin;
        animation-duration: 3000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
}
</style>
