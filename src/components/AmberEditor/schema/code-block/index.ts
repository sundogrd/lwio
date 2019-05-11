// import { schema as baseSchema } from "prosemirror-schema-basic"
import CodeMirror from 'codemirror'
import { Selection, TextSelection } from 'prosemirror-state'
import { redo, undo } from 'prosemirror-history'
import { exitCode } from 'prosemirror-commands'
import AmberSchema from '../amber-schema'

export const codeBlock = {
  group: 'block',
  attrs: {
    text: { default: '' },
    language: { default: 'text/plain' }
  },
  parseDOM: [{
    tag: 'pre',
    getAttrs: (dom: any) => {
      debugger
      return {
        text: dom.textContent,
        language: dom.getAttribute('data-language') || 'text/plain'
      }
    }
  }],
  toDOM (node: any) {
    const { language, text } = node.attrs
    debugger
    return ['pre', { 'data-language': language }, text]
  }
}

function computeChange (oldVal: any, newVal: any) {
  if (oldVal == newVal) return null
  let start = 0; let oldEnd = oldVal.length; let newEnd = newVal.length
  while (start < oldEnd && oldVal.charCodeAt(start) == newVal.charCodeAt(start)) {
    ++start
  }
  while (oldEnd > start && newEnd > start &&
    oldVal.charCodeAt(oldEnd - 1) == newVal.charCodeAt(newEnd - 1)
  ) {
    oldEnd--
    newEnd--
  }
  return {
    from: start,
    to: oldEnd,
    text: newVal.slice(start, newEnd)
  }
}

export class CodeNodeView {
  node: any;
  view: any;
  getPos: any;
  amber: any;
  incomingChanges: boolean;
  updating: boolean;
  cm: CodeMirror.Editor;

  dom: any;
  select: any;
  mounted: any;
  constructor (node: any, view: any, getPos: any, store: any) {
    // Store for later
    this.node = node
    this.view = view
    this.getPos = getPos
    this.incomingChanges = false
    this.amber = store

    // Create a CodeMirror instance
    // @ts-ignore
    this.cm = new CodeMirror(null, {
      value: this.node.textContent,
      lineNumbers: true,
      extraKeys: this.codeMirrorKeymap()
    })

    // The editor's outer node is our DOM representation
    this.dom = this.cm.getWrapperElement()
    // CodeMirror needs to be in the DOM to properly initialize, so
    // schedule it to update itself
    setTimeout(() => this.cm.refresh(), 20)

    // This flag is used to avoid an update loop between the outer and
    // inner editor
    this.updating = false
    // Track whether changes are have been made but not yet propagated
    this.cm.on('beforeChange', () => this.incomingChanges = true)
    // Propagate updates from the code editor to ProseMirror
    // this.cm.on("cursorActivity", () => {
    //   if (!this.updating && !this.incomingChanges) this.forwardSelection()
    // })
    this.cm.on('changes', () => {
      if (!this.updating) {
        this.valueChanged()
        // this.forwardSelection()
      }
      this.incomingChanges = false
    })
    // this.cm.on("focus", () => this.forwardSelection())
  }

  forwardSelection () {
    if (!this.cm.hasFocus()) return
    let state = this.view.state
    // let selection = this.asProseMirrorSelection(state.doc)
    // if (!selection.eq(state.selection)) {
    //   this.view.dispatch(state.tr.setSelection(selection))
    // }
  }
  asProseMirrorSelection (doc: any) {
    let offset = this.getPos() + 1
    let anchor = this.cm.getDoc().indexFromPos(this.cm.getDoc().getCursor('anchor')) + offset
    let head = this.cm.getDoc().indexFromPos(this.cm.getDoc().getCursor('head')) + offset
    return TextSelection.create(doc, anchor, head)
  }
  valueChanged () {
    let change = computeChange(this.node.textContent, this.cm.getValue())
    if (change) {
      let start = this.getPos() + 1
      console.log('codeblock, replaceWith')
      let tr = this.view.state.tr.replaceWith(
        start - 1,
        start + 1,
        change.text ? AmberSchema.nodes.code_block.create({
          language: this.node.attrs.language,
          text: change.text
        }) : null)
      this.view.dispatch(tr)
    }
  }
  codeMirrorKeymap () {
    let view = this.view
    let mod = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl'
    return (CodeMirror as any).normalizeKeyMap({
      Up: () => this.maybeEscape('line', -1),
      Left: () => this.maybeEscape('char', -1),
      Down: () => this.maybeEscape('line', 1),
      Right: () => this.maybeEscape('char', 1),
      [`${mod}-Z`]: () => undo(view.state, this.amber.pm.dispatch),
      [`Shift-${mod}-Z`]: () => redo(view.state, this.amber.pm.dispatch),
      [`${mod}-Y`]: () => redo(view.state, this.amber.pm.dispatch),
      [`${mod}-Enter`]: () => {
        if (exitCode(view.state, this.amber.pm.dispatch)) view.focus()
      }
    })
  }
  maybeEscape (unit: string, dir: number) {
    let pos = this.cm.getDoc().getCursor()
    if (this.cm.getDoc().somethingSelected() ||
      pos.line != (dir < 0 ? this.cm.getDoc().firstLine() : this.cm.getDoc().lastLine()) ||
      (unit == 'char' &&
      pos.ch != (dir < 0 ? 0 : this.cm.getDoc().getLine(pos.line).length))
    ) {
      return CodeMirror.Pass
    }
    this.view.focus()
    let targetPos = this.getPos() + (dir < 0 ? 0 : this.node.nodeSize)
    let selection = Selection.near(this.view.state.doc.resolve(targetPos), dir)
    this.view.dispatch(this.view.state.tr.setSelection(selection).scrollIntoView())
    this.view.focus()
  }
  // selectNode() {
  //   this.cm.focus()
  // }
  stopEvent () {
    return true
  }
  update (node: any) {
    console.log('codeblock update')
    debugger
    if (node.type.name != this.node.type.name) {
      return false
    }
    if (node.attrs.text === this.node.attrs.text) {
      return false
    }
    return true
  }
}
