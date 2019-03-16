import uuid from 'uuid'
import {isUrl} from '../util/url'


function testPrevUrl (state: any) {
  const {selection, doc} = state

  // Entered into a new block, collapsed selection
  if (!selection.empty) return

  // Current position (under potential url line)
  const currentNode = doc.childBefore(selection.anchor)
  if (!currentNode || currentNode.index < 1) return

  // Potential url line
  const index = currentNode.index - 1
  const prevNode = doc.maybeChild(index)
  if (!prevNode || prevNode.type.name !== 'paragraph') return

  // Test if url
  const url = prevNode.textContent.trim()
  if (!url || !isUrl(url)) return

  // Make share
  const id = uuid.v4()
  const block =
    { id,
      type: 'placeholder',
      metadata:
      { status: `Sharing... ${url}`,
        percent: 0,
      },
    }
  setTimeout(() => {
    // HACK timeout needed for store to do transform
    // Transform _should_ be in plugin applyAction
    this.spec.amberStuff.amber.routeChange('PLUGIN_URL', {index, id, block, url})
  }, 0)
}

export default {
  state: {
    init: function () {
      (this as any).testPrevUrl = testPrevUrl.bind(this)
    },
    apply: function (transaction: any, value: any, prev: any, state: any) {
      if (transaction.steps.length) {
        (this as any).testPrevUrl(state)
      }
    },
  },
}
