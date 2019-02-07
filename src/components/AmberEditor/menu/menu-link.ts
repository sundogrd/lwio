import {MenuItem} from 'prosemirror-menu'
import {toggleMark} from 'prosemirror-commands'
import EdSchema from '../schema/amber-schema'
import {TextField, openMenuPrompt} from './menu-prompt'
import {isUrlLike} from '../util/url'
import {key} from '../plugins/store-ref'

const markType = EdSchema.marks.link

function markActive (state: any, type: any) {
  let {from, $from, to, empty} = state.selection
  if (empty) return type.isInSet(state.storedMarks || $from.marks())
  else return state.doc.rangeHasMark(from, to, type)
}

function makeToggleLink (toggleLink: any) {
  const spec = {
    ...toggleLink.spec, 
    ...{
      run: function (state: any, dispatch: any, view: any, attrs: any) {
        // Toggle link off
        if (markActive(state, markType)) {
          toggleMark(markType)(state, dispatch)
          return true
        }

        // Toggle link on
        if (attrs) {
          toggleMark(markType, attrs)(state, dispatch)
          return true
        }

        // Prompt for link
        const {from, to} = state.selection
        const selectedText = state.doc.textBetween(from, to)
        const urlLike = isUrlLike(selectedText)
        const value = (urlLike ? selectedText : '')

        const {amber} = key.get(state).options.amberStuff
        if (amber.onRequestLink) {
          amber.onRequestLink(value)
          return true
        }

        // HAHAHACK
        const menuEl = view.content.parentNode.querySelector('.ProseMirror-menubar')
        if (!menuEl) return false
        const buttonEl = menuEl.querySelector('[title="Add or remove link"]')
        if (!buttonEl) return false

        openMenuPrompt({
          title: 'Create a link',
          fields: {
            href: new TextField({
              label: 'Link address',
              placeholder: 'Starts with http',
              type: 'url',
              required: true,
              value,
              clean: (val: string) => {
                if (!/^https?:\/\//i.test(val)) {
                  val = 'http://' + val
                }
                return val
              },
            }),
            title: new TextField({
              label: 'Hover Title',
            }),
          },
          callback: function (attrs: any) {
            toggleMark(markType, attrs)(state, dispatch)
            view.focus()
          },
          menuEl,
          buttonEl,
        })
      },
    }
  }
  return new MenuItem(spec)
}

export default makeToggleLink

