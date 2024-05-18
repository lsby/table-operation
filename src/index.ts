import { 联合转元组, 错误 } from '@lsby/ts_type_fun'
import * as R from 'ramda'
import * as XLSX from 'xlsx'

type 基础类型 =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | 基础类型[]
  | { [key: string | number]: 基础类型 }

type _创建表_类型检查<Obj, Key> = Key extends []
  ? Obj
  : Key extends [infer x, ...infer xs]
  ? x extends keyof Obj
    ? Obj[x] extends 基础类型 | 表<any>
      ? _创建表_类型检查<Obj, xs>
      : 错误<[x, '的类型不是基础类型']>
    : 错误<['验证失败']>
  : 错误<['解构失败']>
type 创建表_类型检查<Obj> = _创建表_类型检查<Obj, 联合转元组<keyof Obj>>
type _表_取行数据_类型<A, arr> = arr extends []
  ? []
  : arr extends [infer x, ...infer xs]
  ? x extends keyof A
    ? [A[x], ..._表_取行数据_类型<A, xs>]
    : never
  : never
type 表_取行数据_类型<A> = _表_取行数据_类型<A, 联合转元组<keyof A>>
type _表_分组_返回类型<arr, B> = arr extends []
  ? {}
  : arr extends [infer x, ...infer xs]
  ? x extends string | number
    ? Record<x, B> & _表_分组_返回类型<xs, B>
    : never
  : never
type 表_分组_返回类型<A, B> = _表_分组_返回类型<联合转元组<keyof A>, B>
type 固定映射<Arr, A> = Arr extends [] ? [] : Arr extends [infer x, ...infer xs] ? [A, ...固定映射<xs, A>] : never
type 数组长度相等<A, B> = A extends Array<any>
  ? B extends Array<any>
    ? A['length'] extends B['length']
      ? true
      : false
    : false
  : false
type 表_创建行表_计算返回类型<A, B> = A extends []
  ? {}
  : B extends []
  ? {}
  : A extends [infer a, ...infer as]
  ? B extends [infer b, ...infer bs]
    ? b extends string | number
      ? Record<b, a> & 表_创建行表_计算返回类型<as, bs>
      : never
    : never
  : never
type 表_创建行表<A, B> = 数组长度相等<A, B> extends true ? A : never
type 表_列改名_类型约束<A, N> = N extends keyof A ? never : N
type _加前缀<arr, A, T extends string> = arr extends []
  ? {}
  : arr extends [infer x, ...infer xs]
  ? x extends string
    ? x extends keyof A
      ? Record<`${T}${x}`, A[x]> & _加前缀<xs, A, T>
      : never
    : never
  : never
type 加前缀<A, T extends string> = _加前缀<联合转元组<keyof A>, A, T>
type 表_取列_计算返回<A, arr> = arr extends []
  ? {}
  : arr extends [infer x, ...infer xs]
  ? x extends keyof A
    ? Record<x, A[x]> & 表_取列_计算返回<A, xs>
    : never
  : never

function 读xlsx<A extends {}>(路径: string): A[] {
  const workbook = XLSX.readFile(路径)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
  const columnNames: string[] = jsonData[0]
  const dataRows: any[] = jsonData.slice(1)

  const objectsArray: A[] = dataRows.map((row: any[]) => {
    const obj: any = {}
    for (let i = 0; i < columnNames.length; i++) {
      obj[columnNames[i]] = row[i]
    }
    return obj
  })

  return objectsArray
}
function 深克隆<T>(obj: T): T {
  return R.clone(obj)
}

export class 表<A extends {}> {
  private constructor(private data: A[]) {}
  static 创建表<A extends B, B extends {} = 创建表_类型检查<A>>(data: A[]): 表<A> {
    return new 表(深克隆(data))
  }
  static 创建空表<A extends B, B extends {} = 创建表_类型检查<A>>(): 表<A> {
    return new 表([])
  }
  static 创建行表<A extends _A, B extends (string | number)[], _A extends 基础类型[] = 表_创建行表<A, B>>(
    列名: [...B],
    data: [...A],
  ): 表<表_创建行表_计算返回类型<A, B>> {
    var _列名 = 深克隆(列名)
    var _data = 深克隆(data)
    return new 表([_列名.map((n, i) => ({ [n]: _data[i] })).reduce((s, a) => Object.assign(s, a), {})] as any)
  }
  static 创建列表<A extends 基础类型, B extends string | number>(data: A[], 列名: B): 表<Record<B, A>> {
    return new 表(深克隆(data).map((x) => ({ [列名]: x })) as any)
  }
  static 从xlsx创建表<A extends B, B extends {} = 创建表_类型检查<A>>(路径: string): 表<A> {
    var 数据 = 读xlsx<A>(路径)
    return new 表(数据)
  }

  取行数据(n: number): 表_取行数据_类型<A> | null {
    var d = this.data[n]
    if (d == null) return null
    return 深克隆(Object.values(d)) as any
  }
  取列数据<B extends keyof A>(列名: B): A[B][] {
    return 深克隆(this.data.map((x) => x[列名]))
  }
  取表数据(): A[] {
    return 深克隆(this.data)
  }
  取表矩阵数据<列名 extends keyof A>(列: 列名[]): 表_取行数据_类型<A>[] {
    return 深克隆(this.data).map((a) => 列.map((x) => a[x])) as any
  }

  取行数(): number {
    return this.data.length
  }
  取列数(): number {
    if (this.data[0] == null) return 0
    return Object.keys(this.data[0]).length
  }
  取列名(): string[] {
    if (this.data[0] == null) return []
    return Object.keys(this.data[0])
  }

  取行(ns: number[]): 表<A> {
    return new 表(this.data.filter((_, i) => ns.includes(i)) as any)
  }
  取列<B extends keyof A>(列名: B[]): 表<表_取列_计算返回<A, 联合转元组<B>>> {
    return new 表(
      this.data.map((x) => 列名.map((n) => ({ [n]: x[n] })).reduce((s, a) => Object.assign(s, a), {})) as any,
    )
  }

  插入行(data: A, 位置: number = -1): 表<A> {
    var 位置 = 位置 % (this.data.length + 1)
    if (位置 < 0) 位置 += this.data.length + 1
    var 前 = this.data.slice(0, 位置)
    var 后 = this.data.slice(位置)
    var 新表 = new 表([...前, 深克隆(data), ...后])
    return 新表
  }
  批量插入行(data: A[], 位置: number = -1): 表<A> {
    var 位置 = 位置 % (this.data.length + 1)
    if (位置 < 0) 位置 += this.data.length + 1
    var 前 = this.data.slice(0, 位置)
    var 后 = this.data.slice(位置)
    var 新表 = new 表([...前, ...深克隆(data), ...后])
    return 新表
  }
  插入列<C extends 基础类型, B extends _B, _B extends string = B extends keyof A ? never : B>(
    列名: B,
    data: C[],
  ): 表<A & Record<B, C>> {
    if (this.data.length != data.length) throw new Error('插入的列长度必须与表长度相等')
    var 输入数据 = 深克隆(data)
    var 新数据 = this.data.map((a, i) => ({ ...a, [列名]: 输入数据[i] }))
    return new 表(新数据) as any
  }

  并接<B extends {}>(b: 表<B>): 表<加前缀<A, 'A_'> & 加前缀<B, 'B_'>> {
    if (this.data.length != b.data.length) throw new Error('只有列数相等的表才可以拼接')
    var 行们: any = []
    for (var i = 0; i < Math.max(this.data.length, b.data.length); i++) {
      var 行: any = {}
      for (var a_name in this.data[i]) 行['A_' + a_name] = this.data[i][a_name]
      for (var b_name in b.data[i]) 行['B_' + b_name] = b.data[i][b_name]
      行们.push(行)
    }
    return new 表(行们)
  }
  左连接<B extends {}>(右表: 表<B>, 链接字段: keyof A & keyof B): 表<加前缀<A, 'A_'> & 加前缀<Partial<B>, 'B_'>> {
    const 结果: 表<any> = new 表([])
    for (const 左项 of this.data) {
      let 匹配项找到 = false
      for (const 右项 of 右表.data) {
        if ((左项[链接字段] as any) === (右项[链接字段] as any)) {
          结果.data.push({
            ...Object.keys(左项)
              .map((n) => ({ [n == 链接字段 ? n : 'A_' + n]: (左项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
            ...Object.keys(右项)
              .filter((a) => a != 链接字段)
              .map((n) => ({ ['B_' + n]: (右项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
          })
          匹配项找到 = true
        }
      }
      if (!匹配项找到) {
        结果.data.push({
          ...Object.keys(左项)
            .map((n) => ({ [n == 链接字段 ? n : 'A_' + n]: (左项 as any)[n] }))
            .reduce((s, a) => Object.assign(s, a), {}),
          ...Object.fromEntries(
            Object.entries(右表.data[0])
              .filter((a) => a[0] != 链接字段)
              .map(([key]) => ['B_' + key, null]),
          ),
        })
      }
    }
    return 结果
  }
  右连接<B extends {}>(右表: 表<B>, 链接字段: keyof A & keyof B): 表<加前缀<Partial<A>, 'A_'> & 加前缀<B, 'B_'>> {
    const 结果: 表<any> = new 表([])

    for (const 右项 of 右表.data) {
      let 匹配项找到 = false
      for (const 左项 of this.data) {
        if ((右项[链接字段] as any) === (左项[链接字段] as any)) {
          结果.data.push({
            ...Object.keys(左项)
              .filter((a) => a != 链接字段)
              .map((n) => ({ ['A_' + n]: (左项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
            ...Object.keys(右项)
              .map((n) => ({ [n == 链接字段 ? n : 'B_' + n]: (右项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
          })
          匹配项找到 = true
        }
      }
      if (!匹配项找到) {
        结果.data.push({
          ...Object.fromEntries(
            Object.entries(this.data[0])
              .filter((a) => a[0] != 链接字段)
              .map(([key]) => ['A_' + key, null]),
          ),
          ...Object.keys(右项)
            .map((n) => ({ [n == 链接字段 ? n : 'B_' + n]: (右项 as any)[n] }))
            .reduce((s, a) => Object.assign(s, a), {}),
        })
      }
    }

    return 结果
  }
  全连接<B extends {}>(
    右表: 表<B>,
    链接字段: keyof A & keyof B,
  ): 表<加前缀<Partial<A>, 'A_'> & 加前缀<Partial<B>, 'B_'>> {
    const 结果: 表<any> = new 表([])

    for (const 左项 of this.data) {
      let 匹配项找到 = false
      for (const 右项 of 右表.data) {
        if ((左项[链接字段] as any) === (右项[链接字段] as any)) {
          结果.data.push({
            ...Object.keys(左项)
              .map((n) => ({ [n == 链接字段 ? n : 'A_' + n]: (左项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
            ...Object.keys(右项)
              .filter((a) => a != 链接字段)
              .map((n) => ({ ['B_' + n]: (右项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
          })
          匹配项找到 = true
        }
      }
      if (!匹配项找到) {
        结果.data.push({
          ...Object.keys(左项)
            .map((n) => ({ [n == 链接字段 ? n : 'A_' + n]: (左项 as any)[n] }))
            .reduce((s, a) => Object.assign(s, a), {}),
          ...Object.fromEntries(
            Object.entries(右表.data[0])
              .filter((a) => a[0] != 链接字段)
              .map(([key]) => ['B_' + key, null]),
          ),
        })
      }
    }

    for (const 右项 of 右表.data) {
      let 匹配项找到 = false
      for (const 左项 of this.data) {
        if ((右项[链接字段] as any) === (左项[链接字段] as any)) {
          匹配项找到 = true
        }
      }
      if (!匹配项找到) {
        结果.data.push({
          ...Object.fromEntries(
            Object.entries(this.data[0])
              .filter((a) => a[0] != 链接字段)
              .map(([key]) => ['A_' + key, null]),
          ),
          ...Object.keys(右项)
            .map((n) => ({ [n == 链接字段 ? n : 'B_' + n]: (右项 as any)[n] }))
            .reduce((s, a) => Object.assign(s, a), {}),
        })
      }
    }

    return 结果
  }
  内连接<B extends {}>(右表: 表<B>, 链接字段: keyof A & keyof B): 表<加前缀<A, 'A_'> & 加前缀<B, 'B_'>> {
    const 结果: 表<any> = new 表([])

    for (const 左项 of this.data) {
      for (const 右项 of 右表.data) {
        if ((左项[链接字段] as any) === (右项[链接字段] as any)) {
          结果.data.push({
            ...Object.keys(左项)
              .map((n) => ({ [n == 链接字段 ? n : 'A_' + n]: (左项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
            ...Object.keys(右项)
              .filter((a) => a != 链接字段)
              .map((n) => ({ ['B_' + n]: (右项 as any)[n] }))
              .reduce((s, a) => Object.assign(s, a), {}),
          })
        }
      }
    }

    return 结果
  }

  合并(b: 表<A>): 表<A> {
    const 结果: 表<A> = new 表([...this.data, ...b.data])
    return 结果
  }
  切分(n: number): [表<A>, 表<A>] {
    var 数据 = this.data
    var 数据1 = 数据.slice(0, n)
    var 数据2 = 数据.slice(n)
    return [new 表(数据1), new 表(数据2)]
  }
  截取(n: number): 表<A> {
    var 数据 = this.data
    var 数据1 = 数据.slice(0, n)
    return new 表(数据1)
  }
  筛选(条件: (a: A) => boolean): 表<A> {
    var 保留的 = this.data.map((x, i) => (条件(深克隆(x)) ? i : -1)).filter((a) => a != -1)
    return this.取行(保留的)
  }
  行映射<C extends _C, _C extends {} = 创建表_类型检查<C>>(函数: (a: A) => C): 表<C> {
    var 新数据: any = 深克隆(this.data).map((a) => 深克隆(函数(a)))
    return new 表(新数据)
  }

  分组<F extends ((x: A) => boolean)[]>(函数们: [...F]): 固定映射<[...F], 表<A>> {
    var 数据 = this.data

    var 结果: 表<A>[] = 函数们.map((_) => new 表([]))
    for (var 行数据 of 数据) {
      for (var i = 0; i < 函数们.length; i++) {
        var 当前函数 = 函数们[i]
        if (当前函数(深克隆(行数据))) {
          结果[i].data.push(深克隆(行数据))
          break
        }
      }
    }
    return 结果 as any
  }
  交叉分组<F extends ((x: A) => boolean)[]>(函数们: [...F]): 固定映射<[...F], 表<A>> {
    var 数据 = this.data

    var 结果: 表<A>[] = 函数们.map((_) => new 表([]))
    for (var 行数据 of 数据) {
      for (var i = 0; i < 函数们.length; i++) {
        var 当前函数 = 函数们[i]
        if (当前函数(深克隆(行数据))) {
          结果[i].data.push(深克隆(行数据))
        }
      }
    }
    return 结果 as any
  }
  交叉归类<F extends Record<string | number, (x: A) => boolean>>(函数: F): 表_分组_返回类型<F, 表<A>> {
    var key们 = Object.keys(函数)
    var 数据 = this.data

    var 结果 = {} as any
    for (var k of key们) {
      结果[k] = new 表([])
    }
    for (var 行数据 of 数据) {
      for (var k of key们) {
        var 当前函数 = 函数[k]
        if (当前函数(深克隆(行数据))) {
          结果[k].data.push(深克隆(行数据))
        }
      }
    }
    return 结果
  }

  列删除<列名类型 extends keyof A>(列名: 列名类型): 表<Omit<A, 列名类型>> {
    const 结果: 表<Omit<A, 列名类型>> = new 表([])
    for (const 行 of this.data) {
      const 新行 = 深克隆(行)
      delete 新行[列名]
      结果.data.push(新行)
    }
    return 结果
  }
  列改名<C extends keyof A, N extends _N, _N extends string = 表_列改名_类型约束<A, N>>(
    列名: C,
    新列名: N,
  ): 表<Omit<A, C> & Record<N, A[C]>> {
    const 结果: 表<Omit<A, C>> = new 表([])
    for (const 行 of this.data) {
      const 新行: any = 深克隆(行)
      新行[新列名] = 新行[列名]
      delete 新行[列名]
      结果.data.push(新行)
    }
    return 结果 as any
  }
  列映射<列名类型 extends keyof A, C extends 基础类型>(
    列名: 列名类型,
    f: (a: A[列名类型]) => C,
  ): 表<Omit<A, 列名类型> & Record<列名类型, C>> {
    const 结果: 表<A & Record<列名类型, C>> = new 表([])
    for (const 行 of this.data) {
      const 新行 = 深克隆(行) as any
      delete 新行.列名
      新行[列名] = 深克隆(f(深克隆(新行[列名])))
      结果.data.push(新行)
    }
    return 结果
  }

  表映射<B extends _B, _B extends {} = 创建表_类型检查<B>>(f: (a: A[]) => B[]): 表<B> {
    var 新结果 = 深克隆(f(深克隆(this.data)))
    return new 表(新结果)
  }

  排序(f: (a: A, b: A) => boolean): 表<A> {
    return this.表映射((x) => x.sort((a, b) => (f(深克隆(a), 深克隆(b)) ? 1 : -1)) as any) as any
  }
  去重<B extends keyof A>(列们: B[]): 表<A> {
    const 新表: 表<A> = new 表([])
    for (const 行 of this.data) {
      const 重复 = 新表.data.some((已有行) => 列们.every((列) => 行[列] === 已有行[列]))
      if (!重复) 新表.data.push(行)
    }
    return 新表
  }
  async 存为xlsx(路径: string): Promise<void> {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([this.取列名(), ...this.取表矩阵数据(this.取列名() as any)])
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, 路径)
  }
}
