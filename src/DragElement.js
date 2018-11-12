import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'


class DragElement extends PureComponent {

  static contextTypes = {
    dnd: PropTypes.shape({
      manager: PropTypes.object,
    }),
  }

  static propTypes = {
    data: PropTypes.shape({
      disabled: PropTypes.bool,
    }),
  }

  node = null

  componentDidMount() {
    const { dnd: { manager } } = this.context
    const { data } = this.props

    this.node.dndData = data

    manager.add(this.node)
  }

  render() {
    const { children } = this.props

    return React.cloneElement(children, {
      ref: (node) => this.node = node,
    })
  }
}


export default DragElement
