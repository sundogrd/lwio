import { InputRule } from 'prosemirror-inputrules'
import { focusedIndex } from '../util/pm'

const inputCode =
  new InputRule(/^```$/, '`', function (pm: any, _: any, pos: any) {
    const index = focusedIndex(pm)
    if (index == null) return
    clearNode(pm, pos)
    pm.amber.routeChange('ADD_MEDIA', {index, type: 'code'})
  })

function clearNode (pm: any, pos: any) {
  const $pos = pm.doc.resolve(pos)
  const start = pos - $pos.parentOffset
  // Delete the input shortcut text (like ```)
  pm.tr
    .delete(start, pos)
    .apply()
}

export default inputCode
