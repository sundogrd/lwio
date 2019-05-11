import { Mark } from 'prosemirror-model'

function maybeMerge (a: any, b: any) {
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) { return a.copy(a.text + b.text) }
}

// Object used to track the context of a running parse.
class MarkdownParseState {
    schema: any;
    stack: any;
    marks: any;
    tokenHandlers: any;
    constructor (schema: any, tokenHandlers: any) {
      this.schema = schema
      this.stack = [{ type: schema.topNodeType, content: [] }]
      this.marks = Mark.none
      this.tokenHandlers = tokenHandlers
    }

    top () {
      return this.stack[this.stack.length - 1]
    }

    push (elt: any) {
      if (this.stack.length) this.top().content.push(elt)
    }

    // : (string)
    // Adds the given text to the current position in the document,
    // using the current marks as styling.
    addText (text: any) {
      if (!text) return
      let nodes = this.top().content; let last = nodes[nodes.length - 1]
      let node = this.schema.text(text, this.marks); let merged
      if (last && (merged = maybeMerge(last, node))) nodes[nodes.length - 1] = merged
      else nodes.push(node)
    }

    // : (Mark)
    // Adds the given mark to the set of active marks.
    openMark (mark: any) {
      this.marks = mark.addToSet(this.marks)
    }

    // : (Mark)
    // Removes the given mark from the set of active marks.
    closeMark (mark: any) {
      this.marks = mark.removeFromSet(this.marks)
    }

    parseTokens (toks: any) {
      for (let i = 0; i < toks.length; i++) {
        let tok = toks[i]
        let handler = this.tokenHandlers[tok.type]
        if (!handler) { throw new Error('Token type `' + tok.type + '` not supported by Markdown parser') }
        handler(this, tok)
      }
    }

    // : (NodeType, ?Object, ?[Node]) → ?Node
    // Add a node at the current position.
    addNode (type: any, attrs: any, content: any) {
      let node = type.createAndFill(attrs, content, this.marks)
      if (!node) return null
      this.push(node)
      return node
    }

    // : (NodeType, ?Object)
    // Wrap subsequent content in a node of the given type.
    openNode (type: any, attrs: any) {
      this.stack.push({ type: type, attrs: attrs, content: [] })
    }

    // : () → ?Node
    // Close and return the node that is currently on top of the stack.
    closeNode () {
      if (this.marks.length) this.marks = Mark.none
      let info = this.stack.pop()
      return this.addNode(info.type, info.attrs, info.content)
    }
}

function attrs (spec: any, token: any) {
  if (spec.getAttrs) return spec.getAttrs(token)
  // For backwards compatibility when `attrs` is a Function
  else if (spec.attrs instanceof Function) return spec.attrs(token)
  else return spec.attrs
}

// Code content is represented as a single token with a `content`
// property in Markdown-it.
function noOpenClose (type: string) {
  return type == 'code_inline' || type == 'code_block' || type == 'fence'
}

function withoutTrailingNewline (str: string) {
  return str[str.length - 1] == '\n' ? str.slice(0, str.length - 1) : str
}

function noOp () { }

function tokenHandlers (schema: any, tokens: any) {
  let handlers = Object.create(null)
  for (let type in tokens) {
    let spec = tokens[type]
    if (spec.block) {
      let nodeType = schema.nodeType(spec.block)
      if (noOpenClose(type)) {
        handlers[type] = (state: any, tok: any) => {
          state.openNode(nodeType, attrs(spec, tok))
          state.addText(withoutTrailingNewline(tok.content))
          state.closeNode()
        }
      } else {
        handlers[type + '_open'] = (state: any, tok: any) => state.openNode(nodeType, attrs(spec, tok))
        handlers[type + '_close'] = (state: any) => state.closeNode()
      }
    } else if (spec.node) {
      let nodeType = schema.nodeType(spec.node)
      handlers[type] = (state: any, tok: any) => state.addNode(nodeType, attrs(spec, tok))
    } else if (spec.mark) {
      let markType = schema.marks[spec.mark]
      if (noOpenClose(type)) {
        handlers[type] = (state: any, tok: any) => {
          state.openMark(markType.create(attrs(spec, tok)))
          state.addText(withoutTrailingNewline(tok.content))
          state.closeMark(markType)
        }
      } else {
        handlers[type + '_open'] = (state: any, tok: any) => state.openMark(markType.create(attrs(spec, tok)))
        handlers[type + '_close'] = (state: any) => state.closeMark(markType)
      }
    } else if (spec.ignore) {
      if (noOpenClose(type)) {
        handlers[type] = noOp
      } else {
        handlers[type + '_open'] = noOp
        handlers[type + '_close'] = noOp
      }
    } else {
      throw new RangeError('Unrecognized parsing spec ' + JSON.stringify(spec))
    }
  }

  handlers.text = (state: any, tok: any) => state.addText(tok.content)
  handlers.inline = (state: any, tok: any) => state.parseTokens(tok.children)
  handlers.softbreak = handlers.softbreak || ((state: any) => state.addText('\n'))

  return handlers
}

// ::- A configuration of a Markdown parser. Such a parser uses
// [markdown-it](https://github.com/markdown-it/markdown-it) to
// tokenize a file, and then runs the custom rules it is given over
// the tokens to create a ProseMirror document tree.
export default class MarkdownParser {
    tokens: any;
    schema: any;
    tokenizer: any;
    tokenHandlers: any;
    // :: (Schema, MarkdownIt, Object)
    // Create a parser with the given configuration. You can configure
    // the markdown-it parser to parse the dialect you want, and provide
    // a description of the ProseMirror entities those tokens map to in
    // the `tokens` object, which maps token names to descriptions of
    // what to do with them. Such a description is an object, and may
    // have the following properties:
    //
    // **`node`**`: ?string`
    //   : This token maps to a single node, whose type can be looked up
    //     in the schema under the given name. Exactly one of `node`,
    //     `block`, or `mark` must be set.
    //
    // **`block`**`: ?string`
    //   : This token comes in `_open` and `_close` variants (which are
    //     appended to the base token name provides a the object
    //     property), and wraps a block of content. The block should be
    //     wrapped in a node of the type named to by the property's
    //     value.
    //
    // **`mark`**`: ?string`
    //   : This token also comes in `_open` and `_close` variants, but
    //     should add a mark (named by the value) to its content, rather
    //     than wrapping it in a node.
    //
    // **`attrs`**`: ?Object`
    //   : Attributes for the node or mark. When `getAttrs` is provided,
    //     it takes precedence.
    //
    // **`getAttrs`**`: ?(MarkdownToken) → Object`
    //   : A function used to compute the attributes for the node or mark
    //     that takes a [markdown-it
    //     token](https://markdown-it.github.io/markdown-it/#Token) and
    //     returns an attribute object.
    //
    // **`ignore`**`: ?bool`
    //   : When true, ignore content for the matched token.
    constructor (schema: any, tokenizer: any, tokens: any) {
      // :: Object The value of the `tokens` object used to construct
      // this parser. Can be useful to copy and modify to base other
      // parsers on.
      this.tokens = tokens
      this.schema = schema
      this.tokenizer = tokenizer
      this.tokenHandlers = tokenHandlers(schema, tokens)
    }

    // :: (string) → Node
    // Parse a string as [CommonMark](http://commonmark.org/) markup,
    // and create a ProseMirror document as prescribed by this parser's
    // rules.
    parse (text: any) {
      let state = new MarkdownParseState(this.schema, this.tokenHandlers); let doc
      state.parseTokens(this.tokenizer.parse(text, {}))
      do { doc = state.closeNode() } while (state.stack.length)
      return doc
    }
}
