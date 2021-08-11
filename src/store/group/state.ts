// 自定义类型

// group模块的总体类型
export interface GroupInterface {
  pages: { // 各个页面所需vuex数据
  }
  tables: { // 扁平的data table
  }
}

// group模块初始值
function state (): GroupInterface {
  return {
    pages: {},
    tables: {}
  }
}

export default state
