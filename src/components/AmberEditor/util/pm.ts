export function focusedIndex (state: any) {
  if (!state) return 0
  const {doc, selection} = state
  if (!selection) return 0
  if (selection.anchor != null) {
    return doc.childBefore(selection.anchor).index
  }
  if (selection.to != null) {
    return doc.childBefore(selection.to).index
  }
}

export function isCollapsed (pm: any) {
  const {anchor, head} = pm.selection
  if (anchor == null) return false
  return (anchor === head)
}

export function indexToPos (doc: any, index: number) {
  let pos = 0
  for (let i = 0; i < index; i++) {
    const node = doc.maybeChild(i)
    if (!node) continue
    pos += node.nodeSize
  }
  return pos
}

export function indexOfId (doc: any, id: any) {
  for (let i = 0, len = doc.childCount; i < len; i++) {
    const node = doc.child(i)
    if (!node.attrs || !node.attrs.id) {
      continue
    }
    if (node.attrs.id === id) {
      return i
    }
  }
  return -1
}

export function posToIndex (doc: any, pos: any) {
  return doc.childBefore(pos).index
}
