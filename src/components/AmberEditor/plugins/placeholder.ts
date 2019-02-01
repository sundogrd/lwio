import {Plugin} from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

// function findPlaceholder(state, id) {
//     let decos = placeholderPlugin.getState(state)
//     let found = decos.find(null, null, spec => spec.id == id)
//     return found.length ? found[0].from : null
//   }
const placeholderPlugin = new Plugin({
    state: {
      init() { return DecorationSet.empty },
      apply(tr: any, set: any) {
        // Adjust decoration positions to changes made by the transaction
        set = set.map(tr.mapping, tr.doc)
        // See if the transaction adds or removes any placeholders
        let action = tr.getMeta(this)
        if (action && action.add) {
          let widget = document.createElement('placeholder')
          let deco = Decoration.widget(action.add.pos, widget, {id: action.add.id})
          set = set.add(tr.doc, [deco])
        } else if (action && action.remove) {
          set = set.remove(
            set.find(null, null, (spec: any) => spec.id == action.remove.id)
          )
        }
        return set
      }
    },
    props: {
      decorations(state: any): any { 
        return (this as any).getState(state) 
      }
    }
  })
  
export default placeholderPlugin