<template>
  <div v-bind:class='className'>
    <div class='real amber'>
      <div class='amber-content' style='z-index: 1;'>
        <editable
          v-if="initialDoc"
          :initialDoc='initialDoc'
          :hasMenuBar='hasMenuBar'
          @change='handleEditableChange'
          @share-url='emitShareUrl'
          @share-file='emitShareFile'
          @commands-changed='emitCommandsChanged'
          @drop-files='emitDropFiles'
          :widgetPath='widgetPath'
          :coverPrefs='coverPrefs'
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  Component,
  Vue,
  Prop,
  Watch,
  Provide,
  Emit
} from 'vue-property-decorator'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { UploaderBuilder, Uploader } from 'qiniu4js'
// import FilePortal from '@sundogrd/fileportal'
// import {
//   schema,
//   defaultMarkdownParser,
//   defaultMarkdownSerializer
// } from 'prosemirror-markdown';
import defaultMarkdownSerializer from './parsers/markdown/to-markdown/defaultMarkdownSerializer'
import defaultMarkdownParser from './parsers/markdown/from-markdown/defaultMarkdownParser'
import Editable from './views-components/Editable/index.vue'
// import WidgetEdit from './views-components/WidgetEdit/index.vue'
// import Modal from './views-components/Modal/index.vue'
import AmberStore from './store/amber-store'
import { amberCommands } from './menu/amber-menu'
import AmberSchema from './schema/amber-schema'

// import { exampleSetup } from './setup'

@Component({
  name: 'AmberEditor',
  components: {
    Editable
  }
})
export default class AmberEditor extends Vue {
  className = 'vue-prosemirror';
  blockToEdit = null;
  fileInput?: HTMLElement;
  // filePortal: FilePortal = new FilePortal({
  //   host: '//os.sundogrd.com/upload',
  //   apiKey: 'keke',
  //   token: 'keke'
  // });;
  qiniu4jsUploader: any = new UploaderBuilder()
    .debug(false)// 开启debug，默认false
    // .button('uploadButton')// 指定上传按钮
    .domain({ http: 'http://up-z1.qiniup.com', https: 'https://up-z1.qiniup.com' })// 默认为{http: "http://upload.qiniu.com", https: "https://up.qbox.me"}
    .scheme('https')// 默认从 window.location.protocol 获取，可以通过指定域名为 "http://img.yourdomain.com" 来忽略域名选择。
    .retry(1)// 设置重传次数，默认0，不重传
    .compress(0.5)// 默认为1,范围0-1
    .scale([300, 0]) // 第一个参数是宽度，第二个是高度,[200,0],限定高度，宽度等比缩放.[0,100]限定宽度,高度等比缩放.[200,100]固定长宽
    .size(1024 * 1024)// 分片大小，最多为4MB,单位为字节,默认1MB
    .chunk(true)// 是否分块上传，默认true，当chunk=true并且文件大于4MB才会进行分块上传
    .auto(true)// 选中文件后立即上传，默认true
    .multiple(true)// 是否支持多文件选中，默认true
    .accept(['.gif', 'image/*', 'video/*'])// 过滤文件，默认无，详细配置见http://www.w3schools.com/tags/att_input_accept.asp
    .tokenShare(true)
    .tokenUrl('/api/qiniu/token')
    .saveKey(true)
    .saveKey('lwio/images/$(uuid)_$(imageInfo.width)x$(imageInfo.height)$(ext)')

  // 任务拦截器
    .interceptor({
      // 拦截任务,返回true，任务将会从任务队列中剔除，不会被上传
      onIntercept: function (task: any) {
        return task.file.size > 1024 * 1024
      },
      // 中断任务，返回true，任务队列将会在这里中断，不会执行上传操作。
      onInterrupt: function (task: any) {
        if (this.onIntercept(task)) {
          alert('请上传小于1m的文件')
          return true
        } else {
          return false
        }
      }
    })
    .listener({
      onReady (tasks: any) {
        // 该回调函数在图片处理前执行,也就是说task.file中的图片都是没有处理过的
        // 选择上传文件确定后,该生命周期函数会被回调。

      },
      onStart (tasks: any) {
        // 所有内部图片任务处理后执行
        // 开始上传

      },
      onTaskGetKey (task: any) {
        // 为每一个上传的文件指定key,如果不指定则由七牛服务器自行处理
        // return 'test.png'
        return ''
      },
      onTaskProgress: function (task: any) {
        // 每一个任务的上传进度,通过`task.progress`获取
        console.log(task.progress)
      },
      onTaskSuccess (task: any) {
        // 一个任务上传成功后回调
        console.log(task.result.key)// 文件的key
        console.log(task.result.hash)// 文件hash
      },
      onTaskFail (task: any) {
        // 一个任务在经历重传后依然失败后回调此函数

      },
      onTaskRetry (task: any) {
        // 开始重传

      },
      onFinish: (tasks: any) => {
        // 所有任务结束后回调，注意，结束不等于都成功，该函数会在所有HTTP上传请求响应后回调(包括重传请求)。
        console.log(this)
        this.store.insertImages([{
          src: `//os.sundogrd.com/${tasks[0].result.key}`,
          caption: ''
        }])
      } }
    ).build();

  @Provide() store: any = new AmberStore({
    initialContent: [],
    onChange: this.emitChange,
    onShareFile: this.emitShareFile,
    onShareUrl: this.emitShareUrl,
    onRequestCoverUpload: this.emitRequestCoverUpload,
    onRequestLink: this.emitRequestLink,
    onDropFiles: this.emitDropFiles,
    onDropFileOnBlock: this.emitDropFileOnBlock,
    onCommandsChanged: this.emitCommandsChanged
  });

  initialDoc = null

  @Prop({ type: String, default: '' })
  private initialMarkdown!: string;
  @Prop({ type: Boolean, default: true })
  private hasMenuBar!: boolean;
  @Prop({ type: String, default: './node_modules/' })
  private widgetPath!: string;
  @Prop({
    type: Object,
    default: function () {
      return {}
    }
  })
  private coverPrefs!: any;

  @Emit('mount')
  emitMount () {

  }

  @Emit('change')
  emitChange (val: string) {
    const markdown = defaultMarkdownSerializer.serialize(this.store.pm.state.doc)
    return {
      markdown: markdown,
      doc: this.store.pm.state.doc
    }
  }
  @Emit('share-url')
  emitShareUrl (val: string) {
    return ''
  }
  @Emit('share-file')
  emitShareFile (val: string) {
    const that = this
    this.fileInput!.click()
    return ''
  }
  @Emit('request-cover-upload')
  emitRequestCoverUpload () {

  }
  @Emit('request-link')
  emitRequestLink () {

  }
  @Emit('drop-files')
  emitDropFiles () {

  }
  @Emit('drop-file-on-block')
  emitDropFileOnBlock () {

  }
  @Emit('commands-changed')
  emitCommandsChanged () {

  }

  public created () {
    this.initialDoc = defaultMarkdownParser(AmberSchema).parse(this.initialMarkdown)
    // const handleFileInputChange = () => {
    //   return (event: Event) => {
    //     event.stopPropagation()
    //     const input = event.target
    //     const files = (input as any).files
    //     if (!files || !files.length) return
    //     let task = this.filePortal.addTask(files[0], {
    //       token: 'test token',
    //       apiKey: 'test key'
    //       // host: 'http://0.0.0.0:9991/upload',
    //     })
    //     this.filePortal.start(task.id)
    //     this.filePortal.on('complete', (task: any) => {
    //       console.log(task)
    //       console.log('completed !!!')
    //       // done();
    //     })
    //     this.filePortal.on('uploaded', (res: any, task: any, tasks: any) => {
    //       // uploaded res解析hack一下
    //       const sdosRes = JSON.parse(res.currentTarget.response)
    //       this.store.insertImages([{
    //         src: `//os.sundogrd.com/fetch/${sdosRes.id}`,
    //         caption: ''
    //       }])
    //     })
    //     this.filePortal.on('error', (err: any) => {
    //       console.log(err)
    //     });
    //     // const ids = this.store.insertPlaceholders(0, files.length)
    //     (event.target as any).value = null
    //   }
    // }
    const handleClickUpload = () => {
      return (event: Event) => {
        this.qiniu4jsUploader.chooseFile()
      }
    }

    if (this.fileInput && this.fileInput.parentNode) {
      this.fileInput.parentNode.removeChild(this.fileInput)
    }
    this.fileInput = document.createElement('button')
    // this.fileInput.type = 'file'
    // this.fileInput.multiple = true
    // this.fileInput.accept = 'image/*'
    // this.fileInput.onchange = handleFileInputChange()
    this.fileInput.onclick = handleClickUpload()
    this.fileInput.style.display = 'none'
    document.body.appendChild(this.fileInput)
    // this.store.setContent(initialDoc.content);
    // this.store.on('media.block.edit.open', (blockID: any) => {
    //   // TODO expose prop for native editors?
    //   this.blockToEdit = blockID;
    //   this.blur();
    // });
    // this.store.on('media.block.edit.close', () => {
    //   this.closeMediaBlockModal();
    // });
  }

  mounted () {
    window.addEventListener('dragover', this.handleDragOver)
    window.addEventListener('drop', this.handleDrop)
    this.emitMount()
  }

  public closeMediaBlockModal () {
    this.blockToEdit = null
  }
  public blur () {
    this.store.pm.dom.blur();
    (window as any).getSelection().removeAllRanges()
  }
  public getContent () {
    return this.store.getContent()
  }
  public setContent (content: any) {
    return this.store.setContent(content)
  }
  public execCommand (commandName: string, attrs: any) {
    const item = amberCommands[commandName]
    if (!item) {
      throw new Error('commandName not found')
    }
    const view = this.store.pm.editor
    item.spec.run(view.state, view.dispatch, view, attrs)
  }
  public insertPlaceholders (index: number, count: number) {
    return this.store.insertPlaceholders(index, count)
  }
  public updateProgress (id: any, metadata: any) {
    this.store.updateProgress(id, metadata)
  }
  public setCoverPreview (id: any, src: any) {
    this.store.setCoverPreview(id, src)
  }
  public setCover (id: any, cover: any) {
    this.store.setCover(id, cover)
  }
  public indexOfFold () {
    return this.store.indexOfFold()
  }

  private handleDragOver (event: DragEvent) {
    // Listening to window
    event.preventDefault()
  }
  private handleDrop (event: DragEvent) {
    // Listening to window, for drops not caught by content
    event.preventDefault()
  }

  private handleEditableChange (action: { name: string; vc: any }) {
    this.store.routeChange(action.name, action.vc)
  }
}
</script>

<style lang='less'>
@import './proseMirrorStyle.less';

.ProseMirror {
  height: calc(100vh - 30px);

  p {
    font-size: 18px;
  }
}

.ProseMirror-menubar {
  height: 30px;
  font-size: 22px;

  .ProseMirror-icon {
    line-height: 1;
  }
}
</style>
