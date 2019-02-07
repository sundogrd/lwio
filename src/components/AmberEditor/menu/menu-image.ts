import crel from 'crel'
import {MenuItem} from 'prosemirror-menu'
import {focusedIndex} from '../util/pm'
import {key} from '../plugins/store-ref'


function run (state: any, onAction?: any) {
  const index = focusedIndex(state)
  if (index == null) return
  const {amber} = key.get(state).options.amberStuff
  amber.trigger('command.menu.file', index)
}

function render (pm: any) {
  const el = crel('div'
  , { class: 'EdMenuText' }
  , 'Image'
  )
  el.addEventListener('mousedown', function (event: MouseEvent) {
    // HACK around #44
    event.stopPropagation()
    event.stopImmediatePropagation()
  })
  el.addEventListener('click', function (event: MouseEvent) {
    run(pm.state)
  })
  return el
}

const menuImage = new MenuItem(
  { label: 'Image',
    title: 'upload image(s) above this block',
    run,
    render,
  }
)

export default menuImage
