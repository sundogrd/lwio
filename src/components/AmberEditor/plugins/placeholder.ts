/*
* Plugin to manage `empty` class for placeholder text
*/

import {Decoration, DecorationSet} from 'prosemirror-view'


function docToEmptyBlockDecorationSet (doc: any) {
  let decorations = []
  let pos = 0
  for (let i = 0, len = doc.content.content.length; i < len; i++) {
    const node = doc.content.content[i]
    if ((node.type.name === 'paragraph' || node.type.name === 'heading') && node.textContent === '') {
      decorations.push(Decoration.node(pos, pos + 2, {class: 'empty'}))
    }
    pos += node.nodeSize
  }
  return DecorationSet.create(doc, decorations)
}

export default {
  state: {
    init: function (config: any, state: any) {      
      const {amber} = (this as any).spec.amberStuff
      setTimeout(function () {
        amber.trigger('plugin.placeholder.initialized')
      }, 0)
      return docToEmptyBlockDecorationSet(state.doc)
    },
    apply: function (transaction: any, prevDeco: any, prev: any, state: any) {
      if (transaction.steps.length) {
        return docToEmptyBlockDecorationSet(state.doc)
      }
      return prevDeco
    },
  },
  props: {
    decorations (state: any): any {
      return (this as any).getState(state)
    },
  },
}
