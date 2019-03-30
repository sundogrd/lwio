<template>
  <keep-alive>
    <div id="yuefu-player" class="yuefu-player"></div>
  </keep-alive>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Yuefu from "yuefu";
import 'yuefu/dist/yuefu.core.css';
@Component({
  name: "YuefuPlayer"
})
export default class YuefuPlayer extends Vue {
  yuefu: any;
  mounted() {
    this.yuefu = new Yuefu({
      element: document.getElementById("yuefu-player")
    });
    this.yuefu.addModule(Yuefu.import("progress"), {
      // timeFormat: 'MM:ss'
    });
    this.yuefu.addModule(Yuefu.import("list"), {
      audios: [
        {
          name: "Counting Stars",
          artist: "OneRepublic",
          type: "normal",
          url: "http://music.163.com/song/media/outer/url?id=26060065.mp3",
          cover: "",
          lrc: "http://cdn.lwio.me/yuefu/lrc/demo.lrc"
        },
        {
          name: "胖子非野子",
          artist: "JAKI",
          type: "normal",
          url: "http://music.163.com/song/media/outer/url?id=401723037.mp3",
          cover: "",
          lrc: "http://cdn.lwio.me/yuefu/lrc/demo2.lrc"
        }
      ]
    });

    this.yuefu.addModule(Yuefu.import("controller"), {
      controllers: [
        {
          name: "play",
          tag: "button",
          innerHTML: "播放",
          handler: (player: any) => {
            player.play();
          }
        },
        {
          name: "pause",
          tag: "button",
          innerHTML: "暂停",
          handler: (player: any) => {
            player.pause();
          }
        }
      ]
    });

    this.yuefu.addModule(Yuefu.import("lrc"), {});
  }
}
</script>

<style lang="less">
.yuefu-player {
}
</style>