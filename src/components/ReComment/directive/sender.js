/**
 *  指令用于动态生成sender的dom，不必在每个组件都保存sender，并且不必为了只展示一个sender使用兄弟间组件通信方式来通知其他兄弟组件hide自己的sender
 *  sender 就只做展示和传递发送事件
 *  options 参数
 *  show : 是否展示
 *  unique: 是否唯一
 *  props: sender 组件所需属性
 *  sendCallback: 发送动作回调
*/

import Vue from 'vue'
import Sender from '../components/sender.vue'

const noop = () => {}
const senderSymbol = 'sender'
const senderClass = 'sundog-comment--sender'

const createSender = (options = {}) => {
  let { props, sendCallback = noop } = options
  typeof sendCallback !== 'function' && (sendCallback = noop)
  return new Vue({
    render: (h) => {
      return h(
        Sender,
        {
          // 属性
          props,
          // emit 事件
          on: {
            send (content) {
              sendCallback(content, props)
            }
          }
        }
      )
    }
  })
}

const formatProps = (value) => {
  if (typeof value === 'object') {
    if ('props' in value) {
      return { props: value.props, sendCallback: value.sendCallback || noop }
    } else {
      return { props: value, sendCallback: value.sendCallback || noop }
    }
  } else {
    return {}
  }
}

const sender = {
  bind (el, binding, vnode, oldVnode) {
    let dom = document.getElementById(senderSymbol.toString())
    if (dom) {
      dom.remove()
    }
  },
  update (el, binding) {
    // console.log(binding.value)
    let { value } = binding
    typeof value !== 'object' && (value = { show: value })
    const { show, props, unique = true } = value

    if (show) {
      if (unique) { // 这里保持唯一sender
        let senderDom = document.getElementById(senderSymbol.toString())
        if (senderDom) {
          senderDom.remove()
        }
      }
      // 保证指令内单例
      let dom = el.getElementsByClassName(senderClass)[0]
      if (dom) {
        dom.parentElement.remove()
      }
      const wrapper = document.createElement('div')
      wrapper.setAttribute('id', senderSymbol.toString())
      const toMountDom = document.createElement('div')
      wrapper.appendChild(toMountDom)
      // 挂载容器
      el.appendChild(wrapper)
      let component = createSender(formatProps(value))
      // 挂载组件
      component.$mount(toMountDom)
    } else {
      let dom = el.getElementsByClassName(senderClass)[0]
      if (dom) {
        dom.parentElement.remove()
      }
    }
  }
}

export default sender
