<template>
  <div v-bind:class="className">
    <div class="real amber">
      <div class="amber-content" style="z-index: 1;">
        <editable 
          :initialContent="initialContent"
          :hasMenuBar="hasMenuBar"
          @change="handleEditableChange"
          @share-url="emitShareUrl"
          @share-file="emitShareFile"
          @commands-changed="emitCommandsChanged"
          @drop-files="emitDropFiles"
          :widgetPath="widgetPath"
          :coverPrefs="coverPrefs"
        />
      </div>
      <!-- <modal 
        @close="closeMediaBlockModal"
      >
        <widget-edit :blockToEdit="blockToEdit" :coverPrefs="coverPrefs" />
      </modal> -->
    </div>
    <h2>Output</h2>
    <pre>
      <!-- <code>{{JSON.stringify(doc, null, 2)}}</code> -->
    </pre>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Provide, Emit } from 'vue-property-decorator'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer
} from 'prosemirror-markdown'
// import imageSchema from './schema/block-image'
import Editable from './views-components/Editable/index.vue'
// import WidgetEdit from './views-components/WidgetEdit/index.vue'
// import Modal from './views-components/Modal/index.vue'
import AmberStore from './store/amber-store'
import {amberCommands} from './menu/amber-menu'

// import { exampleSetup } from './setup'

@Component({
  name: 'AmberEditor',
  components: {
    Editable
  }
})
export default class AmberEditor extends Vue {
  className = 'vue-prosemirror'
  blockToEdit = null

  @Provide() store: any = new AmberStore({ 
    initialContent: "",
    onChange: this.emitChange,
    onShareFile: this.emitShareFile,
    onShareUrl: this.emitShareUrl,
    onRequestCoverUpload: this.emitRequestCoverUpload,
    onRequestLink: this.emitRequestLink,
    onDropFiles: this.emitDropFiles,
    onDropFileOnBlock: this.emitDropFileOnBlock,
    onCommandsChanged: this.emitCommandsChanged,
  })

  // TODO: old
  @Prop({
    default: 'editor', // 'editor', 'markdown', 'all'
    type: String
  })
  private mode!: string
  // TODO: old
  @Prop(String)
  private initialMarkdown!: string

  @Prop({type:String, default: ""})
  private initialContent!: string
  @Prop({type: Boolean, default: true})
  private hasMenuBar!: boolean
  @Prop({type: String, default: './node_modules/'})
  private widgetPath!: string
  @Prop({type: Object, default: function() {
    return {}
  }})
  private coverPrefs!: any

  @Emit('mount')
  emitMount() {
    return
  }

  @Emit('change')
  emitChange(val: string) {
    return ''
  }
  @Emit('share-url')
  emitShareUrl(val: string) {
    return ''
  }
  @Emit('share-file')
  emitShareFile(val: string) {
    return ''
  }
  @Emit('request-cover-upload')
  emitRequestCoverUpload() {
    return
  }
  @Emit('request-link')
  emitRequestLink() {
    return
  }
  @Emit('drop-files')
  emitDropFiles() {
    return
  }
  @Emit('drop-file-on-block')
  emitDropFileOnBlock() {
    return
  }
  @Emit('commands-changed')
  emitCommandsChanged() {
    return
  }

  public created () {
    this.store.setContent(this.initialContent)
    this.store.on('media.block.edit.open', (blockID: any) => {
      // TODO expose prop for native editors?
      this.blockToEdit = blockID
      this.blur()
    })
    this.store.on('media.block.edit.close', () => {
      this.closeMediaBlockModal()
    })
  }

  mounted() {
    window.addEventListener('dragover', this.handleDragOver)
    window.addEventListener('drop', this.handleDrop)
    this.emitMount()
  }

  public closeMediaBlockModal() {
    this.blockToEdit = null
  }
  public blur () {
    this.store.pm.editor.content.blur()
    window.getSelection().removeAllRanges()
  }
  public getContent() {
    return this.store.getContent()
  }
  public setContent(content: any) {
    return this.store.setContent(content)
  }
  public execCommand (commandName: string, attrs: any) {
    const item = amberCommands[commandName]
    if(!item) {
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

  private handleEditableChange(action: {name: string, vc: any}) {
    this.store.routeChange(action.name, action.vc)
  }

  // private setupProseMirror (content: any, editor: any) {
  //   this.view = new EditorView(editor, {
  //     state: EditorState.create({
  //       doc: defaultMarkdownParser.parse(content),
  //       plugins: exampleSetup({ schema })
  //     }),
  //     dispatchTransaction: (action: any) => {
  //       this.$emit('_content-change-editor', action)
  //       this.doc = this.view.state.doc
  //       this.markdown = defaultMarkdownSerializer.serialize(
  //         this.view.state.doc
  //       )
  //     }
  //   })
  //   this.view.focus()
  // }

  // private bindTextarea (area: any) {
  //   const self = this

  //   function mtodoc () {
  //     self.doc = defaultMarkdownParser.parse(area.value)
  //     self.markdown = area.value
  //     self.$emit('_content-change-markdown')
  //   }
  //   // emulate v-model
  //   if (area.addEventListener) {
  //     area.addEventListener('input', mtodoc, false)
  //   } else if (area.attachEvent) {
  //     area.attachEvent('onpropertychange', mtodoc)
  //   }
  // }

  // // applyMarkdown(newData) {
  // //   this.markdown = newData.markdown
  // //   this.$emit('_content-change-markdown')
  // // }
  // @Watch('initialMarkdown')
  // private onInit (val: string) {
  //   this.markdown = val
  //   this.$emit('_content-change-markdown')
  // }

  // @Watch('markdown', { deep: true })
  // private onContentChange (
  //   val: { content: string; markdown: string },
  //   oldVal: { content: string; markdown: string }
  // ) {
  //   this.$emit('content-change', val, oldVal)
  //   this.$emit('content-change-markdown', val.markdown, oldVal.markdown)
  //   this.$emit('update:markdown', val)
  // }

  // @Watch('mode')
  // private onModeChange (val: string, oldVal: string) {
  //   // editor doesn't get updated when it isn't visible.
  //   // Do manually here
  //   if (oldVal !== 'all' && (val === 'editor' || val === 'all')) {
  //     const state = EditorState.create({
  //       doc: defaultMarkdownParser.parse(this.markdown),
  //       plugins: exampleSetup({ schema })
  //     })
  //     this.view.updateState(state)
  //   }

  //   this.$emit('modeChange', val, oldVal)
  // }
}
</script>

<style lang="less">
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
