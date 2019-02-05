<template>
  <div v-bind:class="className">
    <div class="editor" v-bind:class='className' v-show="mode === 'editor' || mode ==='all'"></div>
    <textarea
      class="markdown"
      v-bind:class="className"
      v-show="mode === 'markdown' || mode ==='all'"
      v-model='markdown'
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer
} from 'prosemirror-markdown'
import imageSchema from './schema/block-image'
import { exampleSetup } from './setup'

@Component({
  name: 'AmberEditor'
})
export default class AmberEditor extends Vue {
  markdown = ''
  doc = ''
  editor = {}
  view: any = {}
  className = 'vue-prosemirror'
  public mounted () {
    this.editor = this.$el.children[0]
    // sets up prose mirror. Also
    // bind textarea content changes
    this.setupProseMirror(this.doc, this.editor)
    this.bindTextarea(this.$el.children[1])

    // handle private change events:
    //  * editor needs separate handling for inside and outside changes
    //  * markdown change is handled through v-model
    this.$on('_content-change-editor', (action: any) => {
      this.view.updateState(this.view.state.apply(action))
      this.$emit('content-change-editor')
    })

    this.$on('_content-change-markdown', () => {
      if (['all', 'editor'].includes(this.mode)) {
        const state = EditorState.create({
          doc: defaultMarkdownParser.parse(this.markdown),
          plugins: exampleSetup({ schema, menuBar: false}),
        })
        this.view.updateState(state)
      }
    })

    if (this.initialMarkdown) {
      this.markdown = this.initialMarkdown
      this.$emit('_content-change-markdown')
    }
    // if (window.eventHub) {
    //   window.eventHub.$on('apply-markdown', this.applyMarkdown)
    // }
  }

  @Prop({
    default: 'editor', // 'editor', 'markdown', 'all'
    type: String
  })
  private mode!: string

  @Prop(String)
  private initialMarkdown!: string

  private setupProseMirror (content: any, editor: any) {
    this.view = new EditorView(editor, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content),
        plugins: exampleSetup({ schema })
      }),
      dispatchTransaction: (action: any) => {
        this.$emit('_content-change-editor', action)
        this.doc = this.view.state.doc
        this.markdown = defaultMarkdownSerializer.serialize(
          this.view.state.doc
        )
      }
    })
    this.view.focus()
  }

  private bindTextarea (area: any) {
    const self = this

    function mtodoc () {
      self.doc = defaultMarkdownParser.parse(area.value)
      self.markdown = area.value
      self.$emit('_content-change-markdown')
    }
    // emulate v-model
    if (area.addEventListener) {
      area.addEventListener('input', mtodoc, false)
    } else if (area.attachEvent) {
      area.attachEvent('onpropertychange', mtodoc)
    }
  }

  // applyMarkdown(newData) {
  //   this.markdown = newData.markdown
  //   this.$emit('_content-change-markdown')
  // }
  @Watch('initialMarkdown')
  private onInit (val: string) {
    this.markdown = val
    this.$emit('_content-change-markdown')
  }

  @Watch('markdown', { deep: true })
  private onContentChange (
    val: { content: string; markdown: string },
    oldVal: { content: string; markdown: string }
  ) {
    this.$emit('content-change', val, oldVal)
    this.$emit('content-change-markdown', val.markdown, oldVal.markdown)
    this.$emit('update:markdown', val)
  }

  @Watch('mode')
  private onModeChange (val: string, oldVal: string) {
    // editor doesn't get updated when it isn't visible.
    // Do manually here
    if (oldVal !== 'all' && (val === 'editor' || val === 'all')) {
      const state = EditorState.create({
        doc: defaultMarkdownParser.parse(this.markdown),
        plugins: exampleSetup({ schema })
      })
      this.view.updateState(state)
    }

    this.$emit('modeChange', val, oldVal)
  }
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
