import { amberCommands } from '../menu/amber-menu'

function makeCommands (state: any) {
  let commands: any = {}

  let keys = Object.keys(amberCommands)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const item = amberCommands[key]
    commands[key] = makeCommand(item, state)
  }

  return commands
}

function makeCommand (item: any, state: any) {
  let commandState = 'inactive'
  let command = item.spec
  if (command.active && command.active(state)) {
    commandState = 'active'
  }
  if (command.select && command.select(state) === false) {
    commandState = 'disabled'
  }
  if (command.class === 'flaggedFeature') {
    commandState = 'flagged'
  }
  return commandState
}

export default {
  state: {
    init: function (config: any, state: any) {
      const { amber } = (this as any).spec.amberStuff
      if (!amber.onCommandsChanged) {
        throw new Error('Should not init this plugin without Ed onCommandsChanged option.')
      }

      const commands = makeCommands(state)
      amber.onCommandsChanged(commands)
    },
    apply: function (transaction: any, value: any, prev: any, state: any) {
      const { amber } = (this as any).spec.amberStuff
      const commands = makeCommands(state)
      amber.onCommandsChanged(commands)
      return transaction
    }
  }
}
