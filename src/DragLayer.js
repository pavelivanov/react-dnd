import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { eventNames, closest, getCursorPosition, vendorPrefix } from './helpers'
import Manager from './Manager'


class DragLayer extends PureComponent {

  static childContextTypes = {
    dnd: PropTypes.shape({
      manager: PropTypes.object,
    }),
  }

  static propTypes = {
    onDragEnd: PropTypes.func,
  }

  manager               = new Manager()
  node                  = null
  activeNode            = null
  initialTouchPosition  = null
  helper                = null

  getChildContext() {

    return {
      dnd: {
        manager: this.manager,
      },
    }
  }

  componentDidMount() {
    this.toggleListeners(true)
  }

  componentWillUnmount() {
    this.toggleListeners(false)
  }

  toggleListeners(isEnabled) {
    const documentHandlers = {
      move: this.handleDrag,
      end: this.handleTouchEnd,
    }

    const nodeHandlers = {
      start: this.handleTouchStart,
      move: this.handleSort,
    }

    this.applyHandlers(document, documentHandlers, isEnabled)
    this.applyHandlers(this.node, nodeHandlers, isEnabled)
  }

  applyHandlers(node, handlers, isEnabled) {
    const method = isEnabled ? 'addEventListener' : 'removeEventListener'

    Object.keys(handlers).forEach((key) => {
      const params = isEnabled ? { passive: key !== 'move' } : false

      eventNames[key].forEach((eventName) => {
        node[method](eventName, handlers[key], params)
      })
    })
  }

  handleTouchStart = (event) => {
    const node          = closest(event.target, (node) => node.dndData)
    const isManagerNode = this.manager.nodes.includes(node)

    if (!node || node.dndData.disabled || !isManagerNode) {
      return
    }

    this.activeNode = node

    this.manager.filterItems().forEach((node) => {
      node.initialBounds = node.getBoundingClientRect()
    })
  }

  handleDrag = (event) => {
    event.preventDefault()

    if (!this.activeNode) {
      return
    }

    if (!this.helper) {
      this.createHelper(event)
    }

    this.updateHelperPosition(event)
  }

  handleSort = () => {
    if (!this.activeNode || !this.helper) {
      return
    }

    this.updateNodesPosition()
  }

  handleTouchEnd = () => {
    if (!this.activeNode) {
      return
    }

    const { onDragEnd } = this.props

    const initialIndex  = this.getInitialIndex(this.manager.nodes)
    const hoveredIndex  = this.getHoveredIndex(this.manager.nodes)

    this.manager.nodes.forEach((node) => {
      node.style[`${vendorPrefix}TransitionDuration`] = ''
      node.style[`${vendorPrefix}Transform`] = ''
    })

    this.helper.parentNode.removeChild(this.helper)

    this.activeNode.style.visibility  = ''
    this.activeNode.style.opacity     = ''

    this.activeNode = null
    this.helper = null

    if (typeof onDragEnd === 'function') {
      onDragEnd(initialIndex, hoveredIndex)
    }
  }

  createHelper(event) {
    const bounds  = this.activeNode.getBoundingClientRect()
    const helper  = this.activeNode.cloneNode(true)

    helper.style.position        = 'fixed'
    helper.style.top             = `${bounds.top}px`
    helper.style.left            = `${bounds.left}px`
    helper.style.width           = `${bounds.width}px`
    helper.style.height          = `${bounds.height}px`
    helper.style.boxSizing       = 'border-box'
    helper.style.pointerEvents   = 'none'
    helper.style.zIndex          = 600

    this.activeNode.style.visibility  = 'hidden'
    this.activeNode.opacity           = 0

    this.initialTouchPosition = getCursorPosition(event)
    this.helper = helper

    document.body.appendChild(this.helper)
  }

  updateHelperPosition(event) {
    const offset = getCursorPosition(event)

    const translate = {
      x: offset.x - this.initialTouchPosition.x,
      y: offset.y - this.initialTouchPosition.y,
    }

    this.helper.style[`${vendorPrefix}Transform`] = `translate3d(${translate.x}px, ${translate.y}px, 0)`
  }

  getInitialIndex(nodes) {
    return this.manager.getNodeIndex(nodes, this.activeNode)
  }

  getHoveredIndex(nodes) {
    const helperBounds  = this.helper.getBoundingClientRect()
    let hoveredIndex

    nodes.forEach((node, index) => {
      if (node.dndData.disabled) {
        return
      }

      const bounds = node.initialBounds

      const hovered = helperBounds.left > bounds.left - bounds.width / 2
        && helperBounds.left < bounds.left + bounds.width / 2
        && helperBounds.top > bounds.top - bounds.height / 2
        && helperBounds.top < bounds.top + bounds.height / 2

      if (hovered) {
        hoveredIndex = index
      }
    })

    return hoveredIndex
  }

  updateNodesPosition() {
    const nodes         = this.manager.filterItems()
    const initialIndex  = this.getInitialIndex(nodes)
    const hoveredIndex  = this.getHoveredIndex(nodes)

    // if no one node is hovered then return to not lose translates
    if (hoveredIndex === null) {
      return
    }

    const delta     = hoveredIndex - initialIndex > 0 ? 1 : -1
    const lowIndex  = delta > 0 ? initialIndex : hoveredIndex
    const highIndex = delta > 0 ? hoveredIndex : initialIndex

    nodes.forEach((node, index) => {
      let transformValue

      if (
        delta > 0 && index > lowIndex && index <= highIndex
        || delta < 0 && index >= lowIndex && index < highIndex
      ) {
        const nodeBounds          = node.initialBounds
        const index               = this.manager.getNodeIndex(nodes, node)
        const closestNodeBounds   = nodes[index - delta].initialBounds

        const translate = {
          x: closestNodeBounds.left - nodeBounds.left,
          y: closestNodeBounds.top - nodeBounds.top,
        }

        transformValue = `translate3d(${translate.x}px, ${translate.y}px, 0)`
      }
      else {
        transformValue = `translate3d(0, 0, 0)`
      }

      node.style[`${vendorPrefix}TransitionDuration`] = `${300}ms`
      node.style[`${vendorPrefix}Transform`] = transformValue
    })
  }

  render() {
    const { children } = this.props

    return React.cloneElement(children, {
      ref: (node) => this.node = node,
    })
  }
}


export default DragLayer
