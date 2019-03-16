import MarkdownSerializer from './MarkdownSerializer'
// :: MarkdownSerializer
// A serializer for the [basic schema](#schema).
const defaultMarkdownSerializer = new MarkdownSerializer({
    blockquote(state: any, node: any) {
        state.wrapBlock('> ', null, node, () => state.renderContent(node))
    },
    code_block(state: any, node: any) {
        state.write('```' + (node.attrs.params || '') + '\n')
        state.text(node.textContent, false)
        state.ensureNewLine()
        state.write('```')
        state.closeBlock(node)
    },
    heading(state: any, node: any) {
        state.write(state.repeat('#', node.attrs.level) + ' ')
        state.renderInline(node)
        state.closeBlock(node)
    },
    horizontal_rule(state: any, node: any) {
        state.write(node.attrs.markup || '---')
        state.closeBlock(node)
    },
    bullet_list(state: any, node: any) {
        state.renderList(node, '  ', () => (node.attrs.bullet || '*') + ' ')
    },
    ordered_list(state: any, node: any) {
        let start = node.attrs.order || 1
        let maxW = String(start + node.childCount - 1).length
        let space = state.repeat(" ", maxW + 2)
        state.renderList(node, space, (i: number) => {
            let nStr = String(start + i)
            return state.repeat(' ', maxW - nStr.length) + nStr + '. '
        })
    },
    list_item(state: any, node: any) {
        state.renderContent(node)
    },
    paragraph(state: any, node: any) {
        state.renderInline(node)
        state.closeBlock(node)
    },
    hard_break(state: any, node: any, parent: any, index: number) {
        for (let i = index + 1; i < parent.childCount; i++)
            if (parent.child(i).type != node.type) {
                state.write("\\\n")
                return
            }
    },
    text(state: any, node: any) {
        state.text(node.text)
    },
    // amber
    image(state: any, node: any) {
        state.write('![' + state.esc(node.attrs.alt || '') + '](' + state.esc(node.attrs.src) +
            (node.attrs.caption ? ' ' + state.quote(node.attrs.caption) : '') + ')')
    },
    placeholder(state: any, node: any) {
        
    }
 }, {
    em: { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true },
    strong: { open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true },
    link: {
        open(_state: any, mark: any, parent: any, index: number) {
            return isPlainURL(mark, parent, index, 1) ? '<' : '['
        },
        close(state: any, mark: any, parent: any, index: number) {
            return isPlainURL(mark, parent, index, -1) ? '>'
                : '](' + state.esc(mark.attrs.href) + (mark.attrs.title ? ' ' + state.quote(mark.attrs.title) : '') + ')'
        }
    },
    code: {
        open(_state: any, _mark: any, parent: any, index: number) {
            return backticksFor(parent.child(index), -1)
        },
        close(_state: any, _mark: any, parent: any, index: number) {
            return backticksFor(parent.child(index - 1), 1)
        },
        escape: false
    }
})


function backticksFor(node: any, side: any) {
    let ticks = /`+/g, m, len = 0
    if (node.isText) while (m = ticks.exec(node.text)) len = Math.max(len, m[0].length)
    let result = len > 0 && side > 0 ? " `" : "`"
    for (let i = 0; i < len; i++) result += "`"
    if (len > 0 && side < 0) result += " "
    return result
}

function isPlainURL(link: any, parent: any, index: any, side: any) {
    if (link.attrs.title) return false
    let content = parent.child(index + (side < 0 ? -1 : 0))
    if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link) return false
    if (index == (side < 0 ? 1 : parent.childCount - 1)) return true
    let next = parent.child(index + (side < 0 ? -2 : 1))
    return !link.isInSet(next.marks)
}

export default defaultMarkdownSerializer