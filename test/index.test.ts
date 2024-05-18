import { expect } from 'chai'
import * as path from 'path'
import { 表 } from '../src/index'

describe('表测试', () => {
  it('创建表', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    const createdTable = 表.创建表(tableData)
    expect(createdTable.取表数据()).to.deep.equal(tableData)
  })
  it('创建空表', () => {
    let tableData: unknown[] = []
    const createdTable = 表.创建空表()
    expect(createdTable.取表数据()).to.deep.equal(tableData)
  })
  it('创建行表', () => {
    let tableData = [{ id: 1, name: 'Alice', age: 25 }]
    const createdTable = 表.创建行表(['id', 'name', 'age'], [1, 'Alice', 25])
    expect(createdTable.取表数据()).to.deep.equal(tableData)
  })
  it('创建列表', () => {
    let tableData = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const createdTable = 表.创建列表([1, 2, 3], 'id')
    expect(createdTable.取表数据()).to.deep.equal(tableData)
  })
  it('从xlsx创建表', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    const createdTable = 表.从xlsx创建表<{ id: number; name: string; age: number }>(
      path.resolve(__dirname, './file1.xlsx'),
    )
    expect(createdTable.取表数据()).to.deep.equal(tableData)
  })
  it('创建高维表', () => {
    const createdTable = 表.创建表([
      { id: 1, data: 表.创建表([{ name: 'Alice', age: 25 }]) },
      { id: 2, data: 表.创建表([{ name: 'Bob', age: 30 }]) },
      { id: 3, data: 表.创建表([{ name: 'Charlie', age: 35 }]) },
    ])
    expect(createdTable.取列数据('data')[1].取表数据()).to.deep.equal([{ name: 'Bob', age: 30 }])
  })
  it('取行数据', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const rowData = table.取行数据(1)
    expect(rowData).to.deep.equal([2, 'Bob', 30])
  })
  it('取行数据(越界)', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const rowData = table.取行数据(999)
    expect(rowData).to.deep.equal(null)
  })
  it('取列数据', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const columnData = table.取列数据('name')
    expect(columnData).to.deep.equal(['Alice', 'Bob', 'Charlie'])
  })
  it('取表数据', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const tableDataResult = table.取表数据()
    expect(tableDataResult).to.deep.equal(tableData)
  })
  it('取表矩阵数据', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const tableDataResult = table.取表矩阵数据(['id', 'name', 'age'])
    expect(tableDataResult).to.deep.equal([
      [1, 'Alice', 25],
      [2, 'Bob', 30],
      [3, 'Charlie', 35],
    ])
  })
  it('取行数', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    expect(table.取行数()).to.deep.equal(3)
  })
  it('取列数', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table1 = 表.创建表(tableData)
    expect(table1.取列数()).to.deep.equal(3)
    let table2 = 表.创建表<{}>([])
    expect(table2.取列数()).to.deep.equal(0)
  })
  it('取列名', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table1 = 表.创建表(tableData)
    expect(table1.取列名()).to.deep.equal(['id', 'name', 'age'])
    let table2 = 表.创建表<{}>([])
    expect(table2.取列名()).to.deep.equal([])
  })
  it('取行', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const row = table.取行([0])
    expect(row.取表数据()).to.deep.equal([{ id: 1, name: 'Alice', age: 25 }])
  })
  it('取列', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const column = table.取列(['name'])
    expect(column.取表数据()).to.deep.equal([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }])
  })

  it('插入行', () => {
    let tableData = [{ id: 1 }, { id: 2 }]
    let table = 表.创建表(tableData)
    const data01 = table.插入行({ id: 3 }, -5)
    const data02 = table.插入行({ id: 3 }, -4)
    const data03 = table.插入行({ id: 3 }, -3)
    const data04 = table.插入行({ id: 3 }, -2)
    const data05 = table.插入行({ id: 3 }, -1)
    const data06 = table.插入行({ id: 3 }, 0)
    const data07 = table.插入行({ id: 3 }, 1)
    const data08 = table.插入行({ id: 3 }, 2)
    const data09 = table.插入行({ id: 3 }, 3)
    const data10 = table.插入行({ id: 3 }, 4)
    const data11 = table.插入行({ id: 3 }, 5)
    const data12 = table.插入行({ id: 3 })
    expect(data01.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 2 }])
    expect(data02.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(data03.取表数据()).to.deep.equal([{ id: 3 }, { id: 1 }, { id: 2 }])
    expect(data04.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 2 }])
    expect(data05.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(data06.取表数据()).to.deep.equal([{ id: 3 }, { id: 1 }, { id: 2 }])
    expect(data07.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 2 }])
    expect(data08.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(data09.取表数据()).to.deep.equal([{ id: 3 }, { id: 1 }, { id: 2 }])
    expect(data10.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 2 }])
    expect(data11.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
    expect(data12.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
  it('批量插入行', () => {
    let tableData = [{ id: 1 }, { id: 2 }]
    let table = 表.创建表(tableData)
    const data01 = table.批量插入行([{ id: 3 }, { id: 4 }], -5)
    const data02 = table.批量插入行([{ id: 3 }, { id: 4 }], -4)
    const data03 = table.批量插入行([{ id: 3 }, { id: 4 }], -3)
    const data04 = table.批量插入行([{ id: 3 }, { id: 4 }], -2)
    const data05 = table.批量插入行([{ id: 3 }, { id: 4 }], -1)
    const data06 = table.批量插入行([{ id: 3 }, { id: 4 }], 0)
    const data07 = table.批量插入行([{ id: 3 }, { id: 4 }], 1)
    const data08 = table.批量插入行([{ id: 3 }, { id: 4 }], 2)
    const data09 = table.批量插入行([{ id: 3 }, { id: 4 }], 3)
    const data10 = table.批量插入行([{ id: 3 }, { id: 4 }], 4)
    const data11 = table.批量插入行([{ id: 3 }, { id: 4 }], 5)
    const data12 = table.批量插入行([{ id: 3 }, { id: 4 }])
    expect(data01.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 4 }, { id: 2 }])
    expect(data02.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    expect(data03.取表数据()).to.deep.equal([{ id: 3 }, { id: 4 }, { id: 1 }, { id: 2 }])
    expect(data04.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 4 }, { id: 2 }])
    expect(data05.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    expect(data06.取表数据()).to.deep.equal([{ id: 3 }, { id: 4 }, { id: 1 }, { id: 2 }])
    expect(data07.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 4 }, { id: 2 }])
    expect(data08.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    expect(data09.取表数据()).to.deep.equal([{ id: 3 }, { id: 4 }, { id: 1 }, { id: 2 }])
    expect(data10.取表数据()).to.deep.equal([{ id: 1 }, { id: 3 }, { id: 4 }, { id: 2 }])
    expect(data11.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
    expect(data12.取表数据()).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])
  })
  it('插入列', () => {
    let tableData = [{ id: 1 }, { id: 2 }]
    let table = 表.创建表(tableData).插入列('name', ['Alice', 'Bob'])
    expect(table.取表数据()).to.deep.equal([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  })
  it('插入列(异常)', () => {
    let tableData = [{ id: 1 }, { id: 2 }]
    try {
      表.创建表(tableData).插入列('name', ['Alice'])
    } catch (e) {
      if (String(e) != 'Error: 插入的列长度必须与表长度相等') throw new Error('非预期')
      return
    }
    throw new Error('非预期')
  })

  it('并接', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    const table2 = 表.创建表([{ age: 25 }, { age: 30 }, { age: 35 }])
    const mergedTable = table1.并接(table2)
    const expectedTable = 表.创建表([
      { A_id: 1, A_name: 'Alice', B_age: 25 },
      { A_id: 2, A_name: 'Bob', B_age: 30 },
      { A_id: 3, A_name: 'Charlie', B_age: 35 },
    ])
    expect(mergedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('并接(异常)', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    const table2 = 表.创建表([{ age: 25 }, { age: 30 }])
    try {
      const mergedTable = table1.并接(table2)
    } catch (e) {
      if (String(e) != 'Error: 只有列数相等的表才可以拼接') throw new Error('非预期')
      return
    }
    throw new Error('非预期')
  })
  it('左连接', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 2, name: 'Benjamin' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Dasan' },
    ])
    const table2 = 表.创建表([
      { id: 1, age: 25 },
      { id: 1, age: 26 },
      { id: 2, age: 30 },
      { id: 3, age: 40 },
      { id: 5, age: 50 },
    ])
    const joinedTable = table1.左连接(table2, 'id')
    const expectedTable = 表.创建表([
      { id: 1, A_name: 'Alice', B_age: 25 },
      { id: 1, A_name: 'Alice', B_age: 26 },
      { id: 2, A_name: 'Bob', B_age: 30 },
      { id: 2, A_name: 'Benjamin', B_age: 30 },
      { id: 3, A_name: 'Charlie', B_age: 40 },
      { id: 4, A_name: 'Dasan', B_age: null },
    ])
    expect(joinedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('右连接', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 2, name: 'Benjamin' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Dasan' },
    ])
    const table2 = 表.创建表([
      { id: 1, age: 25 },
      { id: 1, age: 26 },
      { id: 2, age: 30 },
      { id: 3, age: 40 },
      { id: 5, age: 50 },
    ])
    const joinedTable = table1.右连接(table2, 'id')
    const expectedTable = 表.创建表([
      { id: 1, A_name: 'Alice', B_age: 25 },
      { id: 1, A_name: 'Alice', B_age: 26 },
      { id: 2, A_name: 'Bob', B_age: 30 },
      { id: 2, A_name: 'Benjamin', B_age: 30 },
      { id: 3, A_name: 'Charlie', B_age: 40 },
      { id: 5, A_name: null, B_age: 50 },
    ])
    expect(joinedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('全连接', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 2, name: 'Benjamin' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Dasan' },
    ])
    const table2 = 表.创建表([
      { id: 1, age: 25 },
      { id: 1, age: 26 },
      { id: 2, age: 30 },
      { id: 3, age: 40 },
      { id: 5, age: 50 },
    ])
    const joinedTable = table1.全连接(table2, 'id')
    const expectedTable = 表.创建表([
      { id: 1, A_name: 'Alice', B_age: 25 },
      { id: 1, A_name: 'Alice', B_age: 26 },
      { id: 2, A_name: 'Bob', B_age: 30 },
      { id: 2, A_name: 'Benjamin', B_age: 30 },
      { id: 3, A_name: 'Charlie', B_age: 40 },
      { id: 4, A_name: 'Dasan', B_age: null },
      { id: 5, A_name: null, B_age: 50 },
    ])
    expect(joinedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('内连接', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 2, name: 'Benjamin' },
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'Dasan' },
    ])
    const table2 = 表.创建表([
      { id: 1, age: 25 },
      { id: 1, age: 26 },
      { id: 2, age: 30 },
      { id: 3, age: 40 },
      { id: 5, age: 50 },
    ])
    const joinedTable = table1.内连接(table2, 'id')
    const expectedTable = 表.创建表([
      { id: 1, A_name: 'Alice', B_age: 25 },
      { id: 1, A_name: 'Alice', B_age: 26 },
      { id: 2, A_name: 'Bob', B_age: 30 },
      { id: 2, A_name: 'Benjamin', B_age: 30 },
      { id: 3, A_name: 'Charlie', B_age: 40 },
    ])
    expect(joinedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('合并', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
    const table2 = 表.创建表([{ id: 3, name: 'Charlie' }])
    const appendedTable = table1.合并(table2)
    const expectedTable = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    expect(appendedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('切分', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    const [t1, t2] = table1.切分(1)
    const expectedTable1 = 表.创建表([{ id: 1, name: 'Alice' }])
    const expectedTable2 = 表.创建表([
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    expect(t1.取表数据()).to.deep.equal(expectedTable1.取表数据())
    expect(t2.取表数据()).to.deep.equal(expectedTable2.取表数据())
  })
  it('截取', () => {
    const table1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    const t1 = table1.截取(2)
    const expectedTable1 = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
    expect(t1.取表数据()).to.deep.equal(expectedTable1.取表数据())
  })
  it('筛选', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const filteredTable = table.筛选((row) => row.age > 30)
    const expectedTable = 表.创建表([{ id: 3, name: 'Charlie', age: 35 }])
    expect(filteredTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('行映射', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const mappedTable = table.行映射((row) => ({
      ...row,
      name: row.name.toUpperCase(),
    }))
    const expectedTable = 表.创建表([
      { id: 1, name: 'ALICE', age: 25 },
      { id: 2, name: 'BOB', age: 30 },
      { id: 3, name: 'CHARLIE', age: 35 },
    ])
    expect(mappedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('分组', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const 分组 = table.分组([(x) => x.age <= 30, (x) => x.age >= 30])
    const expectedTable1 = 表.创建表([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
    ])
    const expectedTable2 = 表.创建表([{ id: 3, name: 'Charlie', age: 35 }])
    expect(expectedTable1.取表数据()).to.deep.equal(分组[0].取表数据())
    expect(expectedTable2.取表数据()).to.deep.equal(分组[1].取表数据())
  })
  it('交叉分组', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const 分组 = table.交叉分组([(x) => x.age <= 30, (x) => x.age >= 30])
    const expectedTable1 = 表.创建表([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
    ])
    const expectedTable2 = 表.创建表([
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ])
    expect(expectedTable1.取表数据()).to.deep.equal(分组[0].取表数据())
    expect(expectedTable2.取表数据()).to.deep.equal(分组[1].取表数据())
  })
  it('交叉归类', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const 分组 = table.交叉归类({ a: (x) => x.age <= 30, b: (x) => x.age >= 30 })
    const expectedTable1 = 表.创建表([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
    ])
    const expectedTable2 = 表.创建表([
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ])
    expect(expectedTable1.取表数据()).to.deep.equal(分组.a.取表数据())
    expect(expectedTable2.取表数据()).to.deep.equal(分组.b.取表数据())
  })
  it('删除列', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const tableWithoutColumn = table.列删除('age')
    const expectedTable = 表.创建表([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
    ])
    expect(tableWithoutColumn.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('列改名', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const tableWithoutColumn = table.列改名('name', 'name1')
    const expectedTable = 表.创建表([
      { id: 1, name1: 'Alice', age: 25 },
      { id: 2, name1: 'Bob', age: 30 },
      { id: 3, name1: 'Charlie', age: 35 },
    ])
    expect(tableWithoutColumn.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('列映射', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const mappedTable = table.列映射('name', (value) => value.toUpperCase())
    const expectedTable = 表.创建表([
      { id: 1, name: 'ALICE', age: 25 },
      { id: 2, name: 'BOB', age: 30 },
      { id: 3, name: 'CHARLIE', age: 35 },
    ])
    expect(mappedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('表映射', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const mappedTable = table.表映射((a) => a.sort((a, b) => b.id - a.id))
    const expectedTable = 表.创建表([
      { id: 3, name: 'Charlie', age: 35 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 1, name: 'Alice', age: 25 },
    ])
    expect(mappedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('表排序', () => {
    let tableData = [
      { id: 2, name: 'Bob', age: 30 },
      { id: 1, name: 'Alice', age: 25 },
      { id: 3, name: 'Charlie', age: 35 },
    ]
    let table = 表.创建表(tableData)
    const mappedTable1 = table.排序((a, b) => b.id > a.id)
    const mappedTable2 = table.排序((a, b) => a.id > b.id)
    const expectedTable1 = 表.创建表([
      { id: 3, name: 'Charlie', age: 35 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 1, name: 'Alice', age: 25 },
    ])
    const expectedTable2 = 表.创建表([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ])
    expect(mappedTable1.取表数据()).to.deep.equal(expectedTable1.取表数据())
    expect(mappedTable2.取表数据()).to.deep.equal(expectedTable2.取表数据())
  })
  it('表去重', () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Alice', age: 25 },
    ]
    let table = 表.创建表(tableData)
    const mappedTable = table.去重(['name', 'age'])
    const expectedTable = 表.创建表([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
    ])
    expect(mappedTable.取表数据()).to.deep.equal(expectedTable.取表数据())
  })
  it('存为xlsx', async () => {
    let tableData = [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Alice', age: 25 },
    ]
    let table1 = 表.创建表(tableData)
    await table1.存为xlsx(path.resolve(__dirname, './file2.xlsx'))
    let table2 = 表.从xlsx创建表(path.resolve(__dirname, './file2.xlsx'))
    expect(table1.取表数据()).to.deep.equal(table2.取表数据())
  })
  it('存为xlsx_空表', async () => {
    let table1 = 表.创建表<{ id: number; name: string }>([])
    await table1.存为xlsx(path.resolve(__dirname, './file3.xlsx'))
    let table2 = 表.从xlsx创建表(path.resolve(__dirname, './file3.xlsx'))
    expect(table1.取表数据()).to.deep.equal(table2.取表数据())
  })
})
