import { NodeSelection } from 'prosemirror-state'
import ImageNode from './ImageNode.vue'
import uuid from 'uuid'

export const image =
{
    isLeaf: true,
    draggable: true,
    attrs: {
        id: '',
        caption: '',
        src: '',
    },
    parseDOM: [{
        tag: 'div[amber-image-id]',
        getAttrs(dom: HTMLElement) {
            const id = dom.getAttribute('amber-image-id')
            const caption = dom.getAttribute('amber-image-caption')
            const src = dom.getAttribute('amber-image-src')
            if (id && src) {
                return { id, caption, src }
            }
            return false
        },
    }],
    toDOM(node: any) {
        const { id, caption, src } = node.attrs
        return [
            'div',
            {
                'class': 'AmberSchemaImage',
                'amber-image-id': id,
                'amber-image-caption': caption,
                'amber-image-src': src,
            },
        ]
    },
}

export class ImageNodeView {
    node: any;
    view: any;
    getPos: any;
    amber: any;

    dom: any;
    select: any;
    mounted: any;
    constructor(node: any, view: any, getPos: any, store: any) {
        console.log('ImageNodeView constructor')
        this.node = node
        this.view = view
        this.getPos = getPos
        this.amber = store

        let { id } = node.attrs
        const initialBlock = this.amber.getBlock(id)
        if (!initialBlock) {
            throw new Error('Block not found in content: ' + id)
        }

        // 如果是复制
        if (document.querySelector(`div[amber-image-id='${id}']`)) {
            id = uuid.v4()
            this.amber.addBlock({
                ...initialBlock,
                id,
            })
        }

        const props = {
            initialBlock,
            id,
            store,
            nodeView: this,
        }
        this.dom = document.createElement('div')
        this.dom.className = 'AmberSchemaImage'
        this.dom.setAttribute('amber-image-id', id)
        this.dom.setAttribute('amber-image-caption', node.attrs.caption)
        this.dom.setAttribute('amber-image-src', node.attrs.src)
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
            this.mounted = new ImageNode({
                propsData: props
            }).$mount(`div[amber-image-id='${id}'] div`)
        }, 0)
    }
    update(node: any, decorations: any) {
        console.log('ImageNodeView update')
        if (node.attrs.id !== this.node.attrs.id && node.attrs.src !== this.node.attrs.src && node.attrs.caption !== this.node.attrs.caption) {
            return false
        }
        return true
    }
    destroy() {
        this.mounted.$destroy()
    }
}