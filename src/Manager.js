class Manager {

  constructor() {
    this.nodes = []
  }

  add(node) {
    this.nodes.push(node)
  }

  filterItems() {
    return this.nodes.filter((node) => !node.dndData.disabled)
  }

  getNodeIndex(nodes, node) {
    return nodes.findIndex((item) => item === node)
  }
}


export default Manager
