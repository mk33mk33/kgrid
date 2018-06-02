class SameNodeError extends Error {
  constructor(msg) {
      super(msg)
      this.code = -101
  }
}
class NodeNotFoundError extends Error {
  constructor(msg) {
      msg = msg || '节点不存在'
      super(msg)
      this.code = -102
  }
}
class NodeExistError extends Error {
  constructor(msg) {
      msg = msg || '节点已存在'
      super(msg)
      this.code = -103
  }
}
exports.SameNodeError = SameNodeError
exports.NodeNotFoundError = NodeNotFoundError
exports.NodeExistError = NodeExistError
