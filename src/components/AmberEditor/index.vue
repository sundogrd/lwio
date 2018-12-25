<template>
  <div v-bind:class="className">
    <div class="editor" v-bind:class="className" v-show="mode === 'editor' || mode ==='all'"></div>
    <textarea
      class="markdown"
      :name="textareaConfig.name"
      :required="textareaConfig.required && (mode === 'markdown' || mode ==='all')"
      v-bind:class="className"
      v-show="mode === 'markdown' || mode ==='all'"
      v-model="content.markdown"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "AmberEditor"
})
export default class AmberEditor extends Vue {
  data () {
      return {
        content: {
          markdown: '',
          editor: ''
        },
        editor: {},
        view: {},
        className: this.customClass || 'vue-prosemirror'
      }
    },
    mounted () {
      this.editor = this.$el.children[0]
      // sets up prose mirror. Also
      // bind textarea content changes
      this.setupProseMirror(this.content.editor, this.editor)
      this.bindTextarea(this.$el.children[1])

      // handle private change events:
      //  * editor needs separate handling for inside and outside changes
      //  * markdown change is handled through v-model
      this.$on('_content-change-editor', (action) => {
        this.view.updateState(this.view.state.apply(action))
        this.$emit('content-change-editor')
      })

      this.$on('_content-change-markdown', () => {
        if (['all', 'editor'].includes(this.mode)) {
          const state = EditorState.create({
            doc: defaultMarkdownParser.parse(this.content.markdown),
            plugins: exampleSetup({schema})
          })
          this.view.updateState(state)
        }
      })

      if (this.initialMarkdown) {
        this.content.markdown = this.initialMarkdown
        this.$emit('_content-change-markdown')
      }

      if (window.eventHub) {
        window.eventHub.$on('apply-markdown', this.applyMarkdown)
      }
    },
    methods: {
      setupProseMirror (content, editor) {
        this.view = new EditorView(editor, {
          state: EditorState.create({
            doc: defaultMarkdownParser.parse(content),
            plugins: exampleSetup({schema})
          }),
          dispatchTransaction: (action) => {
            this.$emit('_content-change-editor', action)
            this.content.editor = this.view.state.doc
            this.content.markdown = defaultMarkdownSerializer.serialize(this.view.state.doc)
          }
        })
        this.view.focus()
      },

      bindTextarea (area) {
        const self = this

        function mtodoc () {
          self.content.editor = defaultMarkdownParser.parse(area.value)
          self.content.markdown = area.value
          self.$emit('_content-change-markdown')
        }
        // emulate v-model
        if (area.addEventListener) {
          area.addEventListener('input', mtodoc, false)
        } else if (area.attachEvent) {
          area.attachEvent('onpropertychange', mtodoc)
        }
      },

      applyMarkdown (newData) {
        this.content.markdown = newData.markdown
        this.$emit('_content-change-markdown')
      }
    },
    props: {
      textareaConfig: {
        name: {
          default: '',
          type: String,
          required: false
        },
        required: Boolean
      },
      mode: {
        default: 'editor', // 'editor', 'markdown', 'all'
        type: String,
        required: false
      },
      customClass: {
        default: 'vue-prosemirror',
        type: String,
        required: false
      },
      initialMarkdown: {
        type: String
      }
    },
    watch: {
      initialMarkdown (val) {
        this.content.markdown = val
        this.$emit('_content-change-markdown')
      },
      content: {
        handler (val, oldVal) {
          this.$emit('contentChange', val, oldVal)
          this.$emit('contentChangeMarkdown', val.markdown, oldVal.markdown)
        },
        deep: true
      },
      mode (val, oldVal) {
        // editor doesn't get updated when it isn't visible.
        // Do manually here
        if (oldVal !== 'all' && (val === 'editor' || val === 'all')) {
          const state = EditorState.create({
            doc: defaultMarkdownParser.parse(this.content.markdown),
            plugins: exampleSetup({schema})
          })
          this.view.updateState(state)
        }

        this.$emit('modeChange', val, oldVal)
      }
    }
}
</script>
