import { Plugin } from 'prosemirror-state'
import {
    Dropdown,
    undoItem,
    redoItem,
    liftItem,
} from 'prosemirror-menu'
import { buildMenuItems } from 'prosemirror-example-setup'
import AmberSchema from '../schema/amber-schema'
import menuImage from './menu-image'
import makeToggleLink from './menu-link'
import {
    menuCode
    , menuLocation
    , menuUserhtml
    , menuCta
    , menuQuote,
} from './menu-media'

const menuItems = buildMenuItems(AmberSchema)
const { 
    // makeParagraph,
    // makeHead1
    // , makeHead2
    // , makeHead3,
    wrapBulletList
    , wrapOrderedList
    , insertHorizontalRule
    , toggleEm
    , toggleLink
    , toggleStrong,
} = menuItems

// Customise link
const amberToggleLink = makeToggleLink(toggleLink)

// Customise labels
// makeHead1.spec.label = 'h1 - Main title'
// makeHead2.spec.label = 'h2 - Section heading'
// makeHead3.spec.label = 'h3 - Subsection heading'
// makeParagraph.spec.label = 'p - Body text'

// Disable these menus on media block selection
// makeParagraph.spec.select = function (state: any) {
//     debugger
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
    'bullet_list:wrap': wrapBulletList,
    'ordered_list:wrap': wrapOrderedList,
    'horizontal_rule:insert': insertHorizontalRule,
    'lift': liftItem,
    'undo': undoItem,
    'redo': redoItem,
    'ed_upload_image': menuImage,
    'ed_add_code': menuCode,
    'ed_add_location': menuLocation,
    'ed_add_userhtml': menuUserhtml,
    'ed_add_cta': menuCta,
    'ed_add_quote': menuQuote,
}

const typeDropdown = new Dropdown(
    [
        // makeParagraph,
        // makeHead1,
        // makeHead2,
        // makeHead3,
    ]
    , { label: 'Type' }
)

const addDropdown = new Dropdown(
    [insertHorizontalRule,
        menuLocation,
        menuCode,
        menuCta,
        menuUserhtml,
    ]
    , { label: 'Add' }
)

export const amberBlockMenu = [
    [toggleStrong,
        toggleEm,
        amberToggleLink,
    ],
    [typeDropdown],
    [wrapBulletList,
        wrapOrderedList,
        menuQuote,
        liftItem,
    ],
    [menuImage],
    [addDropdown],
]

export const amberBarMenu = amberBlockMenu
    .concat([[undoItem, redoItem]])


export const amberMenuPlugin = new Plugin({
    props: {
        menuContent: amberBarMenu,
        floatingMenu: false,
    },
})

export const amberMenuEmptyPlugin = new Plugin({
    props: {
        menuContent: [],
        floatingMenu: false,
    },
})