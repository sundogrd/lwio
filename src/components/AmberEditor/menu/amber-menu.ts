import { Plugin } from 'prosemirror-state'
import {
  Dropdown,
  undoItem,
  redoItem,
  liftItem
} from './common'
import {
  MenuBarView
} from './common/menu-bar-view'
import { buildMenuItems } from 'prosemirror-example-setup'
import AmberSchema from '../schema/amber-schema'
import menuImage from './menu-image'
import makeToggleLink from './menu-link'
import {
// , menuLocation
// , menuUserhtml
// , menuCta
// , menuQuote,
} from './menu-media'
import menuCode from './menu-code'

const menuItems = buildMenuItems(AmberSchema)
const {
  makeParagraph,
  makeHead1,
  makeHead2,
  makeHead3,
  wrapBlockQuote,
  wrapBulletList,
  wrapOrderedList,
  insertHorizontalRule,
  toggleEm,
  toggleLink,
  toggleStrong
} = menuItems

// Customise link
const amberToggleLink = makeToggleLink(toggleLink)

// Customise labels
makeHead1.spec.label = 'h1 - Main title'
makeHead2.spec.label = 'h2 - Section heading'
makeHead3.spec.label = 'h3 - Subsection heading'
makeParagraph.spec.label = 'p - Body text'

// Disable these menus on media block selection
// makeParagraph.spec.select = function (state: any) {
//     if (state.selection && state.selection.node && !state.selection.node.isTextblock) {
//         return false
//     }
//     return (this as any).run.call(state, false)
// }
// makeHead1.spec.select = function (state: any) {
//     if (state.selection && state.selection.node && !state.selection.node.isTextblock) {
//         return false
//     }
//     return (this as any).run.call(state, false)
// }
// makeHead2.spec.select = function (state: any) {
//     if (state.selection && state.selection.node && !state.selection.node.isTextblock) {
//         return false
//     }
//     return (this as any).run.call(state, false)
// }
// makeHead3.spec.select = function (state: any) {
//     if (state.selection && state.selection.node && !state.selection.node.isTextblock) {
//         return false
//     }
//     return (this as any).run.call(state, false)
// }

export const amberCommands: { [key: string]: any } = {
  'strong:toggle': toggleStrong,
  'em:toggle': toggleEm,
  'link:toggle': amberToggleLink,
  // 'paragraph:make': makeParagraph,
  // 'heading:make1': makeHead1,
  // 'heading:make2': makeHead2,
  // 'heading:make3': makeHead3,
  'code_block:insert': menuCode,
  'blockquote:wrap': wrapBlockQuote,
  'bullet_list:wrap': wrapBulletList,
  'ordered_list:wrap': wrapOrderedList,
  'horizontal_rule:insert': insertHorizontalRule,
  'lift': liftItem,
  'undo': undoItem,
  'redo': redoItem,
  'amber_upload_image': menuImage
  // 'ed_add_location': menuLocation,
  // 'ed_add_userhtml': menuUserhtml,
  // 'ed_add_cta': menuCta,
  // 'ed_add_quote': menuQuote,
}

const typeDropdown = new Dropdown(
  [
    makeParagraph,
    makeHead1,
    makeHead2,
    makeHead3
  ]
  , { label: 'Type' }
)

const addDropdown = new Dropdown(
  [insertHorizontalRule,
    // menuLocation,
    menuCode
    // menuCta,
    // menuUserhtml,
  ]
  , { label: 'Add' }
)

export const amberBlockMenu = [
  [
    toggleStrong,
    toggleEm,
    amberToggleLink
  ],
  [typeDropdown],
  [
    wrapBlockQuote,
    wrapBulletList,
    wrapOrderedList,
    // menuQuote,
    liftItem
  ],
  [menuCode],
  [menuImage],
  [addDropdown]
]

export const amberBarMenu = amberBlockMenu
  .concat([[undoItem, redoItem]])

export const amberMenuPlugin = new Plugin({
  view (editorView: any) {
    let menuView = new MenuBarView(editorView, {
      content: amberBarMenu
    })
    // editorView.dom.parentNode.insertBefore(menuView.wrapper, editorView.dom)
    return menuView
  },
  props: {
    menuContent: amberBarMenu,
    floatingMenu: false
  }
})

export const amberMenuEmptyPlugin = new Plugin({
  props: {
    menuContent: [],
    floatingMenu: false
  }
})
