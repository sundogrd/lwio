<template>
  <div class='Editable'>
    <div class='Editable-Mirror' ref='mirror'></div>
    <div class='Editable-Plugins' ref='plugins'></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Inject, Emit } from 'vue-property-decorator'
import {EditorState, Plugin, NodeSelection} from 'prosemirror-state'
import {history as pluginHistory} from 'prosemirror-history'
// import {dropCursor as pluginDropCursor} from 'prosemirror-dropcursor'

import { MenuBarView } from 'prosemirror-menu'
import {amberMenuPlugin, amberMenuEmptyPlugin} from '../../menu/amber-menu'

import GridToDoc from '../../convert/grid-to-doc'
import AmberSchema from '../../schema/amber-schema'
// import {MediaNodeView} from '../../schema/media'
import {amberInputRules, amberBaseKeymap, amberKeymap} from '../../inputrules/amber-input-rules'
import {posToIndex} from '../../util/pm'
import {isDropFileEvent} from '../../util/drop'

import PluginShareUrl from '../../plugins/share-url'
// import PluginContentHints from '../plugins/content-hints'
import PluginPlaceholder from '../../plugins/placeholder'
import PluginFixedMenuHack from '../../plugins/fixed-menu-hack'
import PluginCommandsInterface from '../../plugins/commands-interface'
import {PluginStoreRef} from '../../plugins/store-ref'
import { EditorView } from 'prosemirror-view';
@Component({
  name: 'Editable'
})
export default class AddCover extends Vue {
  hasCover = false
  pm: any

  @Inject() store!: any

  @Emit('commands-changed')
  emitCommandsChanged() {
    return
  }
  @Emit('change')
  emitChange(name: string, vueComponent: any) {
    return {
      name,
      vc: vueComponent,
    }
  }
  @Emit('drop-files')
  emitDropFiles(index: any, files: any) {
    return {
      index,
      files,
    }
  }

  @Prop(String)
  private initialContent!: string
  @Prop({type: Boolean, default: true})
  private hasMenuBar!: boolean
  @Prop({type: String, default: './node_modules/'})
  private widgetPath!: string
  @Prop({type: Object, default: function() {
    return {}
  }})
  private coverPrefs!: any

  mounted() {
    const { mirror, plugins } = this.$refs
    let amberPlugins = [
      pluginHistory(),
      amberInputRules,
      amberKeymap,
      amberBaseKeymap,
    ]
    let amberPluginClasses: any[] = [
      PluginStoreRef,
      PluginShareUrl,
      PluginPlaceholder,
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
      coverPrefs: this.coverPrefs,
    }

    amberPluginClasses.forEach(function (plugin: any) {
      // FIXME least knowledge per plugin
      plugin.amberStuff = pluginProps
      const p = new Plugin(plugin)
      amberPlugins.push(p)
    })

    const state = EditorState.create({
      schema: AmberSchema,
      doc: GridToDoc(this.initialContent),
      plugins: amberPlugins,
      amber: this.store,
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
        },
        editable: function (state: any) { return true },
        attributes: { class: 'ProseMirror-content' },
        handleDOMEvents: {
          drop: this.handleDrop,
        },
        // Don't type over node selection
        handleTextInput: function (view: any, from: number, to: number, text: string) {
          if (view.state.selection instanceof NodeSelection) {
            return true
          }
        },
      }

    view = this.pm = new EditorView(mirror, pmOptions)
    this.pm.amber = this.store

    this.emitChange('EDITABLE_INITIALIZE', this)
  }
  destroyed() {
    this.pm.editor.destroy()
  }

  public handleDrop(editor: any, event: DragEvent) {
    if (!isDropFileEvent(event)) {
      return
    }
    const {pos} = this.pm.editor.posAtCoords({left: event.clientX, top: event.clientY})
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

.ProseMirror-content::after {
  content: 'Type here or paste links to images, articles, videos...';
  display: block; /* For Firefox */
  position: relative;
  opacity: 0.2;
  bottom: 0;
  z-index: -1;
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

@media screen and (min-width: 728px) {
  .ProseMirror-content {
    padding: 1rem 3rem 3rem 3rem;
  }
}

</style>
