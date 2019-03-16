import MarkdownParser from './MarkdownParser'
import markdownIt from "markdown-it"
// A parser parsing unextended [CommonMark](http://commonmark.org/),
// without inline HTML, and producing a document in the basic schema.
const defaultMarkdownParser = (schema: any) => {
    return new MarkdownParser(schema, markdownIt("commonmark", { html: false }), {
        // blockquote: { block: "blockquote" },
        paragraph: { block: "paragraph" },
        list_item: { block: "list_item" },
        bullet_list: { block: "bullet_list" },
        ordered_list: { block: "ordered_list", getAttrs: (tok: any) => ({ order: +tok.attrGet('order') || 1 }) },
        heading: { block: "heading", getAttrs: (tok: any) => ({ level: +tok.tag.slice(1) }) },
        code_block: { block: "code_block" },
        // fence: { block: "code_block", getAttrs: (tok: any) => ({ params: tok.info || '' }) },
        hr: { node: "horizontal_rule" },
        image: {
            node: "image", 
            getAttrs: (tok: any) => {
                return {
                    src: tok.attrGet("src"),
                    title: tok.attrGet("title") || null,
                    alt: tok.children[0] && tok.children[0].content || null
                }
            }
        },
        hardbreak: { 
            node: "hard_break" 
        },
        em: { 
            mark: "em" 
        },
        strong: { 
            mark: "strong" 
        },
        link: {
            mark: "link", getAttrs: (tok: any) => ({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null
            })
        },
        code_inline: { 
            mark: "code" 
        }
    })
}
export default defaultMarkdownParser