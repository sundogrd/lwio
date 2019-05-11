import { NodeSelection } from 'prosemirror-state'
import PlaceholderNode from './PlaceholderNode.vue'

export const placeholder =
{
  isLeaf: true,
  draggable: true,
  attrs: {
    id: ''
  },
  parseDOM: [{
    tag: 'div[amber-placeholder-id]',
    getAttrs (dom: HTMLElement) {
      const id = dom.getAttribute('amber-placeholder-id')
      if (id) {
        return { id }
      }
      return false
    }
  }],
  toDOM (node: any) {
    const { id } = node.attrs
    return [
      'div',
      {
        'class': 'AmberSchemaPlaceholder',
        'amber-placeholder-id': id
      }
    ]
  }
}

export class PlaceholderNodeView {
    node: any;
    view: any;
    getPos: any;
    amber: any;

    dom: any;
    select: any;
    mounted: any;
    constructor (node: any, view: any, getPos: any, store: any) {
      console.log('PlaceholderNodeView constructor')
      this.node = node
      this.view = view
      this.getPos = getPos
      this.amber = store

      const { id } = node.attrs
      const initialBlock = this.amber.getBlock(id)

      if (!initialBlock) {
        throw new Error('Block not found in content: ' + id)
      }

      const props = {
        initialBlock,
        id,
        store,
        nodeView: this
      }
      this.dom = document.createElement('div')
      this.dom.className = 'AmberSchemaPlaceholder'
      this.dom.setAttribute('amber-placeholder-id', id)
      var nodeContentPlaceholder = document.createElement('div')
      this.dom.appendChild(nodeContentPlaceholder)

      this.dom.contentEditable = false
      this.dom.spellcheck = false
      this.select = function (event: any) {
        view.dispatch(
          view.state.tr.setSelection(
            NodeSelection.create(
              view.state.doc, getPos()
            )
          )
        )
      }
      setTimeout(() => {
        this.mounted = new PlaceholderNode({
          propsData: props
        }).$mount(`div[amber-placeholder-id='${id}'] div`)
      }, 0)

      // this.mounted = new PlaceholderNode({
      //     $el: this.dom,
      //     propsData: props
      // })
    }
    update (node: any, decorations: any) {
      console.log('PlaceholderNodeView update')
      if (node.attrs.id !== this.node.attrs.id) {
        return false
      }
      return true
    }
    destroy () {
      this.mounted.$destroy()
    }
}
