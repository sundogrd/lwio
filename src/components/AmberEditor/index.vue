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
} from 'vue-property-decorator';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
// import {
//   schema,
//   defaultMarkdownParser,
//   defaultMarkdownSerializer
// } from 'prosemirror-markdown';
import defaultMarkdownSerializer from './parsers/markdown/to-markdown/defaultMarkdownSerializer'
import defaultMarkdownParser from './parsers/markdown/from-markdown/defaultMarkdownParser'
import Editable from './views-components/Editable/index.vue';
// import WidgetEdit from './views-components/WidgetEdit/index.vue'
// import Modal from './views-components/Modal/index.vue'
import AmberStore from './store/amber-store';
import { amberCommands } from './menu/amber-menu';
import AmberSchema from './schema/amber-schema';

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
    default: function() {
      return {};
    }
  })
  private coverPrefs!: any;

  @Emit('mount')
  emitMount() {
    return;
  }

  @Emit('change')
  emitChange(val: string) {
    const markdown = defaultMarkdownSerializer.serialize(this.store.pm.state.doc)
    return {
      markdown: markdown,
      doc: this.store.pm.state.doc,
    };
  }
  @Emit('share-url')
  emitShareUrl(val: string) {
    return '';
  }
  @Emit('share-file')
  emitShareFile(val: string) {
    const that = this;
    let input: HTMLInputElement;
    function filesUploadSim(index: number, files: any) {
      // Make placeholder blocks
      let names: string[] = [];
      for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i];
        const name = file.name.substr(0, file.name.indexOf('.'));
        names.push(name);
      }
    }
    const makeInputOnChange = (index: number) => {
      return (event: Event) => {
        event.stopPropagation();
        const input = event.target;
        const files = (input as any).files;
        if (!files || !files.length) return;
        filesUploadSim(index, files);
        const ids = that.store.insertPlaceholders(index, files.length)
        // TODO: Test Image        
        that.store.insertImages(index, [{
          src: 'https://avatars2.githubusercontent.com/u/41531553?s=200&v=4',
          caption: 'fuck',
        }])
        
        for (let i = 0, len = files.length; i < len; i++) {
          const file = files[i]
          const url = URL.createObjectURL(file)
          const id = ids[i]
          that.store.setCoverPreview(id, url)
        }
      };
    }
    function onShareFileDemo(index: number) {
      console.log('onShareFile: app triggers native picker', index);

      // Remove old input from DOM
      if (input && input.parentNode) {
        input.parentNode.removeChild(input);
      }
      input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*';
      input.onchange = makeInputOnChange(index);
      input.style.display = 'none';
      document.body.appendChild(input);
      input.click();
    }
    onShareFileDemo(0)
    return '';
  }
  @Emit('request-cover-upload')
  emitRequestCoverUpload() {
    return;
  }
  @Emit('request-link')
  emitRequestLink() {
    return;
  }
  @Emit('drop-files')
  emitDropFiles() {
    return;
  }
  @Emit('drop-file-on-block')
  emitDropFileOnBlock() {
    return;
  }
  @Emit('commands-changed')
  emitCommandsChanged() {
    return;
  }

  public created() {
    this.initialDoc = defaultMarkdownParser(AmberSchema).parse(this.initialMarkdown)
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

  mounted() {
    window.addEventListener('dragover', this.handleDragOver);
    window.addEventListener('drop', this.handleDrop);
    this.emitMount();
  }

  public closeMediaBlockModal() {
    this.blockToEdit = null;
  }
  public blur() {
    this.store.pm.dom.blur();
    window.getSelection().removeAllRanges();
  }
  public getContent() {
    return this.store.getContent();
  }
  public setContent(content: any) {
    return this.store.setContent(content);
  }
  public execCommand(commandName: string, attrs: any) {
    const item = amberCommands[commandName];
    if (!item) {
      throw new Error('commandName not found');
    }
    const view = this.store.pm.editor;
    item.spec.run(view.state, view.dispatch, view, attrs);
  }
  public insertPlaceholders(index: number, count: number) {
    return this.store.insertPlaceholders(index, count);
  }
  public updateProgress(id: any, metadata: any) {
    this.store.updateProgress(id, metadata);
  }
  public setCoverPreview(id: any, src: any) {
    this.store.setCoverPreview(id, src);
  }
  public setCover(id: any, cover: any) {
    this.store.setCover(id, cover);
  }
  public indexOfFold() {
    return this.store.indexOfFold();
  }

  private handleDragOver(event: DragEvent) {
    // Listening to window
    event.preventDefault();
  }
  private handleDrop(event: DragEvent) {
    // Listening to window, for drops not caught by content
    event.preventDefault();
  }

  private handleEditableChange(action: { name: string; vc: any }) {
    this.store.routeChange(action.name, action.vc);
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
