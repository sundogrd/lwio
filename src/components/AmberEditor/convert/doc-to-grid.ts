import {DOMSerializer} from 'prosemirror-model'
import AmberSchema from '../schema/amber-schema'

import {isMediaType} from './types'
import BlockMetaSchema from '../schema/block-meta'
import _ from 'lodash'

const serializer = DOMSerializer.fromSchema(AmberSchema)


export default function (doc: any, apiContentMap: any) {
  const fragment = serializer.serializeFragment(doc.content)
  const dom = document.createElement('div')
  dom.appendChild(fragment)

  let currentContent = []
  let starred = true
  for (let i = 0, len = dom.children.length; i < len; i++) {
    const child = dom.children[i]
    const id = child.getAttribute('grid-id') || null
    let type = child.getAttribute('grid-type') || child.tagName.toLowerCase()

    if (isHR(child)) {
      type = 'hr'
      // Fold = first hr (for now)
      starred = false
    }

    type = translateIrregularGridTypes(type)
    const isMedia = isMediaType(type)

    let apiBlock = apiContentMap[id as any]
    if (!apiBlock) {
      apiBlock = isMedia ? {id, type} : {type}
    }
    if (!isMedia) {
      apiBlock.html = child.outerHTML
      if (type === 'hr') {
        apiBlock.html = '<hr>'
      }
      // Skip empty blocks in output content
      if (isEmpty(type, apiBlock.html)) {
        continue
      }
    }
    if (isMedia) {
      const html = metaToHtml(apiBlock)
      if (html) {
        apiBlock.html = html
      }
    }

    if (!apiBlock.metadata) {
      apiBlock.metadata = {}
    }
    apiBlock.metadata.starred = starred

    currentContent.push(apiBlock)
  }

  currentContent = trimContent(currentContent)

  return currentContent
}


function trimContent (content: any) {
  return _.map(content, function (item) {
    let cleaned = _.pick(item
    , [ 'id',
      'type',
      'item',
      'html',
      'text',
      'metadata',
      'cover',
      'cta',
      'price',
      'label',
      'url',
      'height',
    ]
    )
    if (cleaned.cover) {
      cleaned.cover = _.pick(cleaned.cover
      , [ 'src',
        'width',
        'height',
        'unsalvageable',
      ]
      )
    }
    return cleaned
  })
}

function isHR (el: Element) {
  return (el.tagName === 'HR' ||
    el.tagName === 'DIV' && el.firstChild && (el.firstChild as any).tagName === 'HR'
  )
}

// Ugh.
function translateIrregularGridTypes (type: string) {
  switch (type) {
    case 'blockquote':
      return 'quote'
    case 'p':
      return 'text'
    default:
      return type
  }
}

export function metaToHtml (block: any) {
  const { type } = block
  const schema = BlockMetaSchema[type]
  if (schema && schema.makeHtml) {
    return schema.makeHtml(block)
  }
}

function isEmpty (type: string, html: string) {
  if (type === 'text' && html === '<p></p>') return true
  if (type === 'h1' && html === '<h1></h1>') return true
  if (type === 'h2' && html === '<h2></h2>') return true
  if (type === 'h3' && html === '<h3></h3>') return true
  return false
}
