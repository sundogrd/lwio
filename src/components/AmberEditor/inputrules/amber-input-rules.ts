// Added as plugin

import { inputRules } from 'prosemirror-inputrules'
import { buildInputRules, buildKeymap } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import AmberSchema from '../schema/amber-schema'

const amberRules = buildInputRules(AmberSchema)
export const amberInputRules = amberRules

export const amberBaseKeymap = keymap(baseKeymap)
export const amberKeymap = keymap(buildKeymap(AmberSchema))
