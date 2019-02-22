class Stage {
  data = []

  static getTotal (...instanceArr) {
    return instanceArr.reduce((pre, cur, i, arr) => pre + cur.size, 0)
  }

  get size () {
    return this.data.length
  }

  add (item) {
    this.data.push(item)
  }

  send (target, offset) {
    let ret = null
    if (offset) {
      ret = this.data.splice(-offset, offset)
    } else {
      ret = this.data
    }
    target.receive(ret)
  }
  
  receive (data) {
    data.forEach(item => {
      this.data.push(item)
    })
  }
}

module.exports = Stage
