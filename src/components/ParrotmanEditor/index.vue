<template>
  <div class='parrotman-editor'>
    <div id="waveform"></div>
    <Button @click="handleStartRecord">start record</Button>
    <Button @click="handleStopRecord">stop record</Button>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import WaveSurfer from 'wavesurfer.js';
import Parrotman from '@sundogrd/parrotman';
@Component({
  name: 'ParrotmanEditor'
})
export default class ParrotmanEditor extends Vue {
  parrotman: Parrotman = new Parrotman();
  wavesurfer: any;
  public mounted() {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple'
    });
  }
  public handleStartRecord() {
    this.parrotman.startRecording();
  }
  public handleStopRecord() {
    this.parrotman.stopRecording('wav', 'wavFile', (_, blob: Blob) => {
      this.wavesurfer.load(window.URL.createObjectURL(blob))
      debugger
    });
  }
}
</script>

<style lang='scss'>
.module-card {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>

