import crel from 'crel'
import {MenuItem} from 'prosemirror-menu'
import AmberSchema from '../schema/amber-schema'
import {focusedIndex} from '../util/pm'
import {key} from '../plugins/store-ref'


function run (state: any, dispatch: any) {
  const index = focusedIndex(state)
  if (index == null) return
  const {amber} = key.get(state).spec.amberStuff
  
  console.log(AmberSchema)
  dispatch(
    state.tr.insert(state.selection.$cursor.pos, AmberSchema.nodes.code_block.create({}))
  )
}

function render (pm: any) {
  const el = crel('div'
  , { class: 'AmberCode' }
  , 'Code'
  )
  el.addEventListener('mousedown', function (event: MouseEvent) {
    // HACK around #44
    event.stopPropagation()
    event.stopImmediatePropagation()
  })
  el.addEventListener('click', function (event: MouseEvent) {
    run(pm.state, pm.dispatch)
  })
  return el
}

const menuCode = new MenuItem(
  { label: 'Code',
    title: 'Insert Embed Code block',
    run,
    render,
  }
)

export default menuCode
