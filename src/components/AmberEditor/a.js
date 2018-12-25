const insertCss = require('insert-css')
const { EditorView } = require('prosemirror-view')
const { EditorState } = require('prosemirror-state')
const { schema, defaultMarkdownParser, defaultMarkdownSerializer } = require('prosemirror-markdown')
const { exampleSetup } = require('prosemirror-example-setup')



exports.install = function (Vue, options) {
  options = Object.assign({
    'css': true
  }, options)

  if (options.css) {
    insertCss(css)
  }

  Vue.component('prosemirror', {
    name: 'prosemirror',
    template: `
      <div v-bind:class="className">
        <div class="editor" v-bind:class="className" v-show="mode === 'editor' || mode ==='all'"></div>
        <textarea
            class="markdown"
            :name="textareaConfig.name"
            :required="textareaConfig.required && (mode === 'markdown' || mode ==='all')"
            v-bind:class="className"
            v-show="mode === 'markdown' || mode ==='all'"
            v-model="content.markdown"></textarea>
      </div>`,
    
  })
}