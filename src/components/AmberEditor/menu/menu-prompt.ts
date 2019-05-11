//
// Copied and modified from https://github.com/ProseMirror/prosemirror-example-setup/blob/07cd58f03dc95f2e9d4375f6ab9166b1850ef327/src/prompt.js
//

const prefix = 'ProseMirror-prompt'

export function openMenuPrompt (options: any) {
  const { menuEl, buttonEl } = options
  let wrapper = document.createElement('div')
  menuEl.appendChild(wrapper)
  wrapper.className = prefix

  let mouseOutside = (e: MouseEvent) => {
    if (!wrapper.contains((e as any).target)) {
      close()
    }
  }
  setTimeout(() => window.addEventListener('mousedown', mouseOutside), 50)
  let close = () => {
    window.removeEventListener('mousedown', mouseOutside)
    if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper)
  }

  let domFields: any = []
  for (let name in options.fields) domFields.push(options.fields[name].render())

  let submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.className = prefix + '-submit'
  submitButton.textContent = 'OK'
  let cancelButton = document.createElement('button')
  cancelButton.type = 'button'
  cancelButton.className = prefix + '-cancel'
  cancelButton.textContent = 'Cancel'
  cancelButton.addEventListener('click', close)

  let form = wrapper.appendChild(document.createElement('form'))
  if (options.title) form.appendChild(document.createElement('h5')).textContent = options.title
  domFields.forEach((field: any) => {
    form.appendChild(document.createElement('div')).appendChild(field)
  })
  let buttons = form.appendChild(document.createElement('div'))
  buttons.className = prefix + '-buttons'
  buttons.appendChild(submitButton)
  buttons.appendChild(document.createTextNode(' '))
  buttons.appendChild(cancelButton)

  let menuBox = menuEl.getBoundingClientRect()
  let buttonBox = buttonEl.getBoundingClientRect()
  wrapper.style.top = (buttonBox.top + buttonBox.height) + 'px'
  wrapper.style.left = (buttonBox.left - menuBox.left) + 'px'

  let submit = () => {
    let params = getValues(options.fields, domFields)
    if (params) {
      close()
      options.callback(params)
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault()
    submit()
  })

  form.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
      e.preventDefault()
      close()
    } else if (e.keyCode === 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
      e.preventDefault()
      submit()
    } else if (e.keyCode === 9) {
      window.setTimeout(() => {
        if (!wrapper.contains(document.activeElement)) close()
      }, 500)
    }
  })

  form.noValidate = true

  let input = form.elements[0]
  if (input) {
    (input as HTMLInputElement).focus()
  }
}

function getValues (fields: any, domFields: any) {
  let result = Object.create(null)
  let i = 0
  for (let name in fields) {
    let field = fields[name]
    let dom = domFields[i++]
    let value = field.read(dom)
    let bad = field.validate(value)
    if (bad) {
      reportInvalid(dom, bad)
      return null
    }
    result[name] = field.clean(value)
  }
  return result
}

function reportInvalid (dom: any, message: string) {
  // FIXME this is awful and needs a lot more work
  let parent = dom.parentNode
  let msg = parent.appendChild(document.createElement('div'))
  msg.style.left = (dom.offsetLeft + dom.offsetWidth + 2) + 'px'
  msg.style.top = (dom.offsetTop - 5) + 'px'
  msg.className = 'ProseMirror-invalid'
  msg.textContent = message
  setTimeout(() => parent.removeChild(msg), 1500)
}

// ::- The type of field that `FieldPrompt` expects to be passed to it.
class Field {
  options: any;
  // :: (Object)
  // Create a field with the given options. Options support by all
  // field types are:
  //
  // **`value`**`: ?any`
  //   : The starting value for the field.
  //
  // **`label`**`: string`
  //   : The label for the field.
  //
  // **`required`**`: ?bool`
  //   : Whether the field is required.
  //
  // **`validate`**`: ?(any) → ?string`
  //   : A function to validate the given value. Should return an
  //     error message if it is not valid.
  constructor (options: any) {
    this.options = options
  }

  // render:: (state: EditorState, props: Object) → dom.Node
  // Render the field to the DOM. Should be implemented by all subclasses.

  // :: (dom.Node) → any
  // Read the field's value from its DOM node.
  read (dom: Element) {
    return dom.querySelector('input')!.value
  }

  // :: (any) → ?string
  // A field-type-specific validation function.
  validateType (_value: any): any {

  }

  validate (value: any) {
    if (!value && this.options.required) {
      return 'Required field'
    }
    return this.validateType(value) || (this.options.validate && this.options.validate(value))
  }

  clean (value: any) {
    return this.options.clean ? this.options.clean(value) : value
  }
}

// ::- A field class for single-line text fields.
export class TextField extends Field {
  render () {
    const label = document.createElement('label')
    const labellabel = document.createElement('span')
    const input = document.createElement('input')
    labellabel.innerText = this.options.label
    label.appendChild(labellabel)
    label.appendChild(input)
    input.type = this.options.type || 'text'
    input.placeholder = this.options.placeholder || ''
    input.value = this.options.value || ''
    input.autocomplete = 'off'
    input.pattern = ''
    return label
  }
}
