/*
* Plugin to manage events for content hint buttons
*/

import _ from 'lodash'

// The plugin

export default class PluginContentHints {
  pm: any;
  amber: any;
  updater: any;
  debouncedDocChanged: any;
  initialized: boolean = false;
  constructor (pm: any, options: any) {
    this.debouncedDocChanged = _.debounce(this.onDocChanged, 500)

    this.pm = pm
    this.amber = options.amber

    this.updater = pm.updateScheduler([pm.on.change], this.debouncedDocChanged)
    this.updater.force()
  }
  detach () {
    this.updater.detach()
  }
  onDocChanged = () => {
    // Should use debounced version
    const doc = this.pm.doc
    let hasCover = false
    let hasFold = false
    doc.forEach(function (node: any, offset: number, index: number) {
      const { name } = node.type
      if (name === 'media') {
        const { type } = node.attrs
        if (type === 'image' || type === 'placeholder') {
          hasCover = true
        }
      }
      if (name === 'horizontal_rule') {
        hasFold = true
      }
    })
    this.amber.trigger('plugin.contenthints', { hasCover, hasFold })

    // Signal widgets initialized if first
    if (!this.initialized) {
      this.initialized = true
      this.amber.trigger('plugin.contenthints.initialized')
    }
  }
}
