import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'

const ImageNodeSpec = {
    // Dinosaurs have one attribute, their type, which must be one of
    // the types defined above.
    // Brontosaurs are still the default dino.
    attrs: {
        src: {},
        width: {
            default: 640
        },
        height: {
            default: 480
        }
    },
    inline: false,
    group: 'block',
    draggable: true,

    // These nodes are rendered as images with a `dino-type` attribute.
    // There are pictures for all dino types under /img/dino/.
    toDOM: (node: any) => ['img', {
        'amber-image': true,
        src: node.attrs.src,
        class: 'block-image'
    }],
    // When parsing, such an image, if its type matches one of the known
    // types, is converted to a dino node.
    parseDOM: [{
        tag: 'img[amber-image]',
        getAttrs: (dom: HTMLElement) => {
            let src = dom.getAttribute('src')
            return src ? { src } : false
        }
    }, {
        tag: 'img',
        getAttrs: (dom: HTMLElement) => {
            let src = dom.getAttribute('src')
            return src ? { src } : false
        }
    }]
}

const imageSchema = new Schema({
    nodes: schema.spec.nodes.addBefore('image', 'block_image', ImageNodeSpec),
    marks: schema.spec.marks
})
export default imageSchema