<template>
  <div class='Editable'>
    <div class='Editable-Mirror' ref='mirror'></div>
    <div class='Editable-Plugins' ref='plugins'></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Inject, Emit } from 'vue-property-decorator'
import { EditorState, Plugin, NodeSelection } from 'prosemirror-state'
import { history as pluginHistory } from 'prosemirror-history'
// import {dropCursor as pluginDropCursor} from 'prosemirror-dropcursor'

import { MenuBarView } from 'prosemirror-menu'
import { amberMenuPlugin, amberMenuEmptyPlugin } from '../../menu/amber-menu'

// import GridToDoc from '../../convert/grid-to-doc'
import AmberSchema from '../../schema/amber-schema'
// import {MediaNodeView} from '../../schema/media'
import { ImageNodeView } from '../../schema/image'
import { CodeNodeView } from '../../schema/code-block'
import { PlaceholderNodeView } from '../../schema/placeholder'
import { amberInputRules, amberBaseKeymap, amberKeymap } from '../../inputrules/amber-input-rules'
import { posToIndex } from '../../util/pm'
import { isDropFileEvent } from '../../util/drop'

import PluginShareUrl from '../../plugins/share-url'
// import PluginContentHints from '../plugins/content-hints'
import PluginPlaceholder from '../../plugins/placeholder'
import PluginFixedMenuHack from '../../plugins/fixed-menu-hack'
import PluginCommandsInterface from '../../plugins/commands-interface'
import { PluginStoreRef } from '../../plugins/store-ref'
import { EditorView } from 'prosemirror-view'
@Component({
  name: 'Editable'
})
export default class AddCover extends Vue {
  hasCover = false
  pm: any

  @Inject() store!: any

  @Emit('commands-changed')
  emitCommandsChanged () {

  }
  @Emit('change')
  emitChange (name: string, vueComponent: any) {
    return {
      name,
      vc: vueComponent
    }
  }
  @Emit('drop-files')
  emitDropFiles (index: any, files: any) {
    return {
      index,
      files
    }
  }

  @Prop({ type: Object })
  private initialDoc!: any
  @Prop({ type: Boolean, default: true })
  private hasMenuBar!: boolean
  @Prop({ type: String, default: './node_modules/' })
  private widgetPath!: string
  @Prop({ type: Object,
    default: function () {
      return {}
    } })
  private coverPrefs!: any

  mounted () {
    const { mirror, plugins } = this.$refs
    let amberPlugins = [
      pluginHistory(),
      amberInputRules,
      amberKeymap,
      amberBaseKeymap
    ]
    let amberPluginClasses: any[] = [
      PluginStoreRef,
      PluginShareUrl,
      PluginPlaceholder
    ]
    if (this.hasMenuBar) {
      amberPlugins.push(amberMenuPlugin)
      amberPluginClasses.push(PluginFixedMenuHack)
    } else {
      amberPlugins.push(amberMenuEmptyPlugin)
    }

    amberPluginClasses.push(PluginCommandsInterface)

    const pluginProps = {
      amber: this.store,
      editableView: this,
      elMirror: mirror,
      elPlugins: plugins,
      widgetPath: this.widgetPath,
      coverPrefs: this.coverPrefs
    }

    amberPluginClasses.forEach(function (plugin: any) {
      // FIXME least knowledge per plugin
      plugin.amberStuff = pluginProps
      const p = new Plugin(plugin)
      amberPlugins.push(p)
    })

    console.log(this.initialDoc)
    const state = EditorState.create({
      schema: AmberSchema,
      doc: this.initialDoc,
      plugins: amberPlugins,
      amber: this.store
    })

    let view: any
    // PM setup
    let pmOptions =
      {
        state,
        autoInput: true,
        spellcheck: true,
        dispatchTransaction: (transaction: any) => {
          view.updateState(view.state.apply(transaction))
          if (transaction.steps.length) {
            this.emitChange('EDITABLE_CHANGE', this.pm)
          }
        },
        handleClickOn: function (_view: any, _pos: any, node: any) { return node.type.name === 'media' },
        nodeViews: {
          // media: (node: any, view: any, getPos: any) => {
          //   return new MediaNodeView(node, view, getPos, store, imgfloConfig, coverPrefs, widgetPath)
          // },
          image: (node: any, view: any, getPos: any) => {
            return new ImageNodeView(node, view, getPos, this.store)
          },
          placeholder: (node: any, view: any, getPos: any) => {
            return new PlaceholderNodeView(node, view, getPos, this.store)
          },
          code_block: (node: any, view: any, getPos: any) => {
            return new CodeNodeView(node, view, getPos, this.store)
          }
        },
        editable: function (state: any) { return true },
        attributes: { class: 'ProseMirror-content' },
        handleDOMEvents: {
          drop: this.handleDrop
        },
        // Don't type over node selection
        handleTextInput: function (view: any, from: number, to: number, text: string) {
          if (view.state.selection instanceof NodeSelection) {
            return true
          }
        }
      }

    view = this.pm = new EditorView(mirror, pmOptions)
    this.pm.amber = this.store

    this.emitChange('EDITABLE_INITIALIZE', this)
  }
  destroyed () {
    this.pm.destroy()
  }

  public handleDrop (editor: any, event: DragEvent) {
    if (!isDropFileEvent(event)) {
      return
    }
    const { pos } = this.pm.posAtCoords({ left: event.clientX, top: event.clientY })
    if (pos == null) {
      return
    }
    const index = posToIndex(editor.state.doc, pos)
    if (index == null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    this.emitDropFiles(index, (event as any).dataTransfer.files)
  }
}
</script>

<style lang='less'>
[contenteditable]:focus {
  outline: 0 solid transparent;
}

.Amber {
  font-family: -apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif;
}

.Amber button:hover {
  color: #222 !important;
}

.ProseMirror {
  border: none;
}

.ProseMirror-content {
  font-family: Georgia, Times, serif;
  font-size: 1.2rem;
  border: none;
  margin: 0 auto 40px auto;
  padding: 1rem;
  white-space: pre-wrap;
  max-width: 856px;
  -webkit-user-modify: read-write-plaintext-only;
  -moz-user-modify: read-write-plaintext-only;
}

.ProseMirror-focused .ProseMirror-content::after {
  opacity: 0;
}

/* Font junk */
.ProseMirror-content > * {
  margin: 1.75rem 0;
  padding: 0;
}

.ProseMirror-content h1,
.ProseMirror-content h2,
.ProseMirror-content h3,
.ProseMirror-content h4,
.ProseMirror-content h5,
.ProseMirror-content h6 {
  font-family: -apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif;
  font-weight: normal;
}

.ProseMirror-content img {
  max-width: 100%;
}

.ProseMirror-content h1 {
  font-size: 250%;
  line-height: 1.2;
}

.ProseMirror-content h2 {
  font-size: 175%;
  line-height: 1.3;
}

.ProseMirror-content h3 {
  font-size: 125%;
  line-height: 1.4;
}

.ProseMirror-content p {
  font-size: 100%;
  line-height: 1.5;
}

.ProseMirror-content p:first-child,
.ProseMirror-content h1:first-child,
.ProseMirror-content h2:first-child,
.ProseMirror-content h3:first-child,
.ProseMirror-content h4:first-child,
.ProseMirror-content h5:first-child,
.ProseMirror-content h6:first-child {
  margin-top: 0.3em;
  padding-top: 0;
}

.ProseMirror-content li > p {
  margin-bottom: 0.3em;
}

.ProseMirror-menubar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
}

.ProseMirror-tooltip {
  height: auto;
  padding: 10px 15px 7px;
  border-color: #ddd;
}

.ProseMirror-tooltip-pointer {
  border-top-color: #ccc;
}

.ProseMirror-prompt {
  background-color: white;
  border: 1px silver solid;
  position: absolute;
  padding: 0.5em;
}

.ProseMirror-prompt input {
  padding: 0.5em;
  display: block;
  margin-bottom: 0.5em;
}

.ProseMirror-prompt h5 {
  margin: 0 0 0.5em 0;
}

.ProseMirror-prompt .ProseMirror-prompt-close {
  left: auto;
  right: 5px;
}

.ProseMirror-content hr {
  border-width: 2px 0 0 0;
  padding-bottom: 1rem; /* Make it easier to tap */
  margin-bottom: 0.75rem;
}

/* Placeholder text hacks */
.ProseMirror-content > .empty {
  position: relative;
}

.ProseMirror-content > h1.empty::after {
  content: 'Title';
  opacity: 0.2;
  position: absolute;
  top: 0;
}

.ProseMirror-content > h2.empty::after {
  content: 'Section';
  opacity: 0.2;
  position: absolute;
  top: 0;
}

.ProseMirror-content > h3.empty::after {
  content: 'Subsection';
  opacity: 0.2;
  position: absolute;
  top: 0;
}

.ProseMirror-content > p.empty::after {
  content: '¶';
  opacity: 0.2;
  position: absolute;
  top: 0;
}

.ProseMirror-content > ul {
  list-style-type: disc;
}

.ProseMirror-content > ol {
  list-style-type: decimal;
}

@media screen and (min-width: 728px) {
  .ProseMirror-content {
    padding: 1rem 3rem 3rem 3rem;
  }
}

/* BASICS */

.CodeMirror {
  /* Set height, width, borders, and global font properties here */
  font-family: monospace;
  // height: 100px;
  // max-height: 300px;
  color: black;
}

/* PADDING */

.CodeMirror-lines {
  padding: 4px 0; /* Vertical padding around content */
}
.CodeMirror pre {
  padding: 0 4px; /* Horizontal padding of content */
}

.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  background-color: white; /* The little square between H and V scrollbars */
}

/* GUTTER */

.CodeMirror-gutters {
  border-right: 1px solid #ddd;
  background-color: #f7f7f7;
  white-space: nowrap;
}
.CodeMirror-linenumbers {}

.CodeMirror-linenumber {
  padding: 0 3px 0 5px;
  min-width: 20px;
  text-align: right;
  color: #999;
  white-space: nowrap;
}

.CodeMirror-guttermarker { color: black; }
.CodeMirror-guttermarker-subtle { color: #999; }

/* CURSOR */

.CodeMirror-cursor {
  border-left: 1px solid black;
  border-right: none;
  width: 0;
}

/* Shown when moving in bi-directional text */
.CodeMirror div.CodeMirror-secondarycursor {
  border-left: 1px solid silver;
}

.cm-fat-cursor .CodeMirror-cursor {
  width: auto;
  border: 0 !important;
  background: #7e7;
}

.cm-fat-cursor div.CodeMirror-cursors {
  z-index: 1;
}

.cm-animate-fat-cursor {
  width: auto;
  border: 0;
  -webkit-animation: blink 1.06s steps(1) infinite;
  -moz-animation: blink 1.06s steps(1) infinite;
  animation: blink 1.06s steps(1) infinite;
  background-color: #7e7;
}

@keyframes blink {
  0% {}
  50% { background-color: transparent; }
  100% {}
}

/* Can style cursor different in overwrite (non-insert) mode */
.CodeMirror-overwrite .CodeMirror-cursor {}

.cm-tab { display: inline-block; text-decoration: inherit; }

.CodeMirror-rulers {
  position: absolute;
  left: 0; right: 0; top: -50px; bottom: -20px;
  overflow: hidden;
}

.CodeMirror-ruler {
  border-left: 1px solid #ccc;
  top: 0; bottom: 0;
  position: absolute;
}

/* DEFAULT THEME */

.cm-s-default .cm-header {color: blue;}
.cm-s-default .cm-quote {color: #090;}
.cm-negative {color: #d44;}
.cm-positive {color: #292;}
.cm-header, .cm-strong {font-weight: bold;}
.cm-em {font-style: italic;}
.cm-link {text-decoration: underline;}
.cm-strikethrough {text-decoration: line-through;}

.cm-s-default .cm-keyword {color: #708;}
.cm-s-default .cm-atom {color: #219;}
.cm-s-default .cm-number {color: #164;}
.cm-s-default .cm-def {color: #00f;}
.cm-s-default .cm-variable,
.cm-s-default .cm-punctuation,
.cm-s-default .cm-property,
.cm-s-default .cm-operator {}
.cm-s-default .cm-variable-2 {color: #05a;}
.cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}
.cm-s-default .cm-comment {color: #a50;}
.cm-s-default .cm-string {color: #a11;}
.cm-s-default .cm-string-2 {color: #f50;}
.cm-s-default .cm-meta {color: #555;}
.cm-s-default .cm-qualifier {color: #555;}
.cm-s-default .cm-builtin {color: #30a;}
.cm-s-default .cm-bracket {color: #997;}
.cm-s-default .cm-tag {color: #170;}
.cm-s-default .cm-attribute {color: #00c;}
.cm-s-default .cm-hr {color: #999;}
.cm-s-default .cm-link {color: #00c;}

.cm-s-default .cm-error {color: #f00;}
.cm-invalidchar {color: #f00;}

.CodeMirror-composing { border-bottom: 2px solid; }

/* Default styles for common addons */

div.CodeMirror span.CodeMirror-matchingbracket {color: #0f0;}
div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #f22;}
.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }
.CodeMirror-activeline-background {background: #e8f2ff;}

/* STOP */

/* The rest of this file contains styles related to the mechanics of
   the editor. You probably shouldn't touch them. */

.CodeMirror {
  position: relative;
  overflow: hidden;
  background: white;
}

.CodeMirror-scroll {
  overflow: scroll !important; /* Things will break if this is overridden */
  /* 30px is the magic margin used to hide the element's real scrollbars */
  /* See overflow: hidden in .CodeMirror */
  margin-bottom: -30px; margin-right: -30px;
  padding-bottom: 30px;
  height: 100%;
  outline: none; /* Prevent dragging from highlighting the element */
  position: relative;
}

.CodeMirror-sizer {
  position: relative;
  border-right: 30px solid transparent;
}

/* The fake, visible scrollbars. Used to force redraw during scrolling
   before actual scrolling happens, thus preventing shaking and
   flickering artifacts. */
.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {
  position: absolute;
  z-index: 6;
  display: none;
}
.CodeMirror-vscrollbar {
  right: 0; top: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.CodeMirror-hscrollbar {
  bottom: 0; left: 0;
  overflow-y: hidden;
  overflow-x: scroll;
}
.CodeMirror-scrollbar-filler {
  right: 0; bottom: 0;
}
.CodeMirror-gutter-filler {
  left: 0; bottom: 0;
}

.CodeMirror-gutters {
  position: absolute; left: 0; top: 0;
  min-height: 100%;
  z-index: 3;
}
.CodeMirror-gutter {
  white-space: normal;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  margin-bottom: -30px;
}
.CodeMirror-gutter-wrapper {
  position: absolute;
  z-index: 4;
  background: none !important;
  border: none !important;
}
.CodeMirror-gutter-background {
  position: absolute;
  top: 0; bottom: 0;
  z-index: 4;
}
.CodeMirror-gutter-elt {
  position: absolute;
  cursor: default;
  z-index: 4;
}
.CodeMirror-gutter-wrapper ::selection { background-color: transparent }
.CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }

.CodeMirror-lines {
  cursor: text;
  min-height: 1px; /* prevents collapsing before first draw */
}
.CodeMirror pre {
  /* Reset some styles that the rest of the page might have set */
  -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;
  border-width: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-variant-ligatures: contextual;
  font-variant-ligatures: contextual;
}
.CodeMirror-wrap pre {
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: normal;
}

.CodeMirror-linebackground {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  z-index: 0;
}

.CodeMirror-linewidget {
  position: relative;
  z-index: 2;
  overflow: auto;
}

.CodeMirror-widget {}

.CodeMirror-rtl pre { direction: rtl; }

.CodeMirror-code {
  outline: none;
}

/* Force content-box sizing for the elements where we expect it */
.CodeMirror-scroll,
.CodeMirror-sizer,
.CodeMirror-gutter,
.CodeMirror-gutters,
.CodeMirror-linenumber {
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.CodeMirror-measure {
  position: absolute;
  width: 100%;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}

.CodeMirror-cursor {
  position: absolute;
  pointer-events: none;
}
.CodeMirror-measure pre { position: static; }

div.CodeMirror-cursors {
  visibility: hidden;
  position: relative;
  z-index: 3;
}
div.CodeMirror-dragcursors {
  visibility: visible;
}

.CodeMirror-focused div.CodeMirror-cursors {
  visibility: visible;
}

.CodeMirror-selected { background: #d9d9d9; }
.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }
.CodeMirror-crosshair { cursor: crosshair; }
.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }
.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }

.cm-searching {
  background: #ffa;
  background: rgba(255, 255, 0, .4);
}

/* Used to force a border model for a node */
.cm-force-border { padding-right: .1px; }

@media print {
  /* Hide the cursor when printing */
  .CodeMirror div.CodeMirror-cursors {
    visibility: hidden;
  }
}

/* See issue #2901 */
.cm-tab-wrap-hack:after { content: ''; }

/* Help users use markselection to safely style text background */
span.CodeMirror-selectedtext { background: none; }

</style>
