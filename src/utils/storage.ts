/**
 * window.localStorage
 * @method set
 * @method get
 * @method remove
 * @method clear
 */
export const Local = {
  set(key: string, val: any) {
    window.localStorage.setItem(key, JSON.stringify(val))
  },
  get(key: string) {
    return JSON.parse(window.localStorage.getItem(key) as string)
  },
  remove(key: string) {
    window.localStorage.removeItem(key)
  },
  clear() {
    window.localStorage.clear()
  },
}
/**
 * localStorage
 */
export class local {
  constructor() {}
  /**
   * 设置本地存储
   * @param key 键
   * @param val 值
   */
  set(key: string, val: any) {
    window.localStorage.setItem(key, JSON.stringify(val))
  }
  /**
   * 获取本地存储
   * @param key 键
   * @returns 返回对应键的值
   */
  get(key: string) {
    return JSON.parse(window.localStorage.getItem(key) as string)
  }
  /**
   * 删除对应的键值
   * @param key 键
   */
  remove(key: string) {
    window.localStorage.removeItem(key)
  }
  /**
   * 清空本地存储
   */
  clear() {
    window.localStorage.clear()
  }
}
/**
 * window.sessionStorage
 * @method set
 * @method get
 * @method remove
 * @method clear
 */
export const Session = {
  set(key: string, val: any) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  },
  get(key: string) {
    return JSON.parse(window.sessionStorage.getItem(key) as string)
  },
  remove(key: string) {
    window.sessionStorage.removeItem(key)
  },
  clear() {
    window.sessionStorage.clear()
  },
}
/**
 * sessionStorage
 */
export class session {
  constructor() {}
  /**
   * 设置本地存储
   * @param key 键
   * @param val 值
   */
  set(key: string, val: any) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  }
  /**
   * 获取本地存储
   * @param key 键
   * @returns 返回对应键的值
   */
  get(key: string) {
    return JSON.parse(window.sessionStorage.getItem(key) as string)
  }
  /**
   * 删除对应的键值
   * @param key 键
   */
  remove(key: string) {
    window.sessionStorage.removeItem(key)
  }
  /**
   * 清空本地存储
   */
  clear() {
    window.sessionStorage.clear()
  }
}

/**
 * IndexDB
 */
interface BDataType {
  uid: string
  [key: string]: any
}
export class indexDB {
  private db: IDBDatabase
  constructor(private dbName: string) {}
  /**
   * 打开数据库
   * @param {string} version 数据库的版本
   * @return 该函数会返回一个数据库实例
   */
  openDB(version: string = '1'): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      let indexDB = window.indexedDB
      const request = indexDB.open(this.dbName)
      request.onerror = (err) => reject(err)
      request.onsuccess = (event) => {
        this.db = (<IDBOpenDBRequest>event.target).result
        resolve((<IDBOpenDBRequest>event.target).result)
      }
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const objectStore = (<IDBOpenDBRequest>event.target).result.createObjectStore(this.dbName, {
          keyPath: 'uid',
        })
        objectStore.createIndex('uid', 'uid', { unique: true })
      }
    })
  }
  /**
   * 新增数据
   * @param {any} data 数据
   */
  addDataDB(data: BDataType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.dbName], 'readwrite')
      transaction.oncomplete = (event) => {
        console.log('事务成功!', event)
        resolve(true)
      }
      transaction.onerror = (event) => {
        console.log('事务失败!', event)
        reject(false)
      }
      const request = transaction.objectStore(this.dbName).add(data)
      request.onsuccess = (event) => {
        console.log('添加成功!', event)
      }
      request.onerror = (event) => {
        console.log('添加失败!', event)
      }
    })
  }
  /**
   * 通过主键读取数据
   * @param {string} uid 主键值
   */
  getDataByKeyDB(uid: string): Promise<object | boolean> {
    return new Promise((resolve, reject) => {
      let transaction = this.db.transaction([this.dbName])
      let objectStore = transaction.objectStore(this.dbName)
      let request = objectStore.get(uid)
      request.onsuccess = (event) => {
        console.log('主键查询结果:', request.result)
        resolve(request.result)
      }
      request.onerror = (event) => {
        console.log('事务失败!', event)
        reject(false)
      }
    })
  }
  /**
   * 通过游标读取数据
   */
  cursorDataDB(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let listArr: any = []
      let store = this.db.transaction(this.dbName, 'readwrite').objectStore(this.dbName)
      let request = store.openCursor()
      request.onsuccess = (event) => {
        let cursor = (<IDBRequest>event.target).result as IDBCursorWithValue
        if (cursor) {
          listArr.push(cursor.value)
          cursor.continue()
        } else {
          console.log('游标读取的数据：', listArr)
          resolve(listArr)
        }
      }
    })
  }
  /**
   * 通过索引读取数据
   * @param {string} indexName 索引名称
   * @param {string} indexValue 索引值
   */
  getDataByIndex(indexName: string, indexValue: string): Promise<any | boolean> {
    return new Promise((resolve, reject) => {
      var store = this.db.transaction(this.dbName, 'readwrite').objectStore(this.dbName)
      var request = store.index(indexName).get(indexValue)
      request.onerror = function () {
        console.log('事务失败')
        reject(false)
      }
      request.onsuccess = (event) => {
        let result = (<IDBRequest>event.target).result as IDBCursorWithValue
        console.log('索引查询结果：', result)
        resolve(result)
      }
    })
  }
  /**
   * 通过索引和游标查询记录
   * @param {string} indexName 索引名称
   * @param {string} indexValue 索引值
   */
  cursorAndIndexDB(indexName: string, indexValue: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let listArr: any = []
      let store = this.db.transaction(this.dbName, 'readwrite').objectStore(this.dbName)
      let request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
      request.onsuccess = (event) => {
        let cursor = (<IDBRequest>event.target).result as IDBCursorWithValue
        if (cursor) {
          listArr.push(cursor.value)
          cursor.continue()
        } else {
          console.log('游标读取的数据：', listArr)
          resolve(listArr)
        }
      }
    })
  }
  /**
   * 更新数据
   * @param {BDataType} data 数据
   */
  updateDB(data: BDataType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([this.dbName], 'readwrite')
        .objectStore(this.dbName)
        .put(data)
      request.onsuccess = function () {
        console.log('数据更新成功')
        resolve(true)
      }
      request.onerror = function () {
        console.log('数据更新失败')
        reject(false)
      }
    })
  }
  /**
   * 通过主键删除数据
   * @param {string} uid 主键值
   */
  deleteDataDB(uid: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([this.dbName], 'readwrite')
        .objectStore(this.dbName)
        .delete(uid)
      request.onerror = function (event) {
        console.log('删除失败')
        reject(false)
      }
      request.onsuccess = function (event) {
        console.log('删除成功')
        resolve(true)
      }
    })
  }
  /**
   * 关闭数据库
   */
  closeDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.close()
      console.log('数据库已关闭')
      resolve(true)
    })
  }
  /**
   * 删除数据库
   */
  deleteAllDB(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.deleteDatabase(this.dbName)
      request.onerror = function (event) {
        console.log('删除失败')
        reject(false)
      }
      request.onsuccess = function (event) {
        console.log('删除成功')
        resolve(true)
      }
    })
  }
}

/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} version 数据库的版本
 * @return 该函数会返回一个数据库实例
 */
export function openDB(dbName: string, version: string = '1'): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    let indexDB = window.indexedDB
    let DB: IDBDatabase
    const request = indexDB.open(dbName)
    request.onerror = (err) => reject(err)
    request.onsuccess = (event) => resolve((<IDBOpenDBRequest>event.target).result)
    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      console.log('onupgradeneeded')
      DB = (<IDBOpenDBRequest>event.target).result
      const objectStore = DB.createObjectStore(dbName, { keyPath: 'uid' })
      objectStore.createIndex('uid', 'uid', { unique: true })
    }
  })
}

/**
 * 新增数据
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {any} data 数据
 */
export function addDataDB(db: IDBDatabase, storeName: string, data: BDataType): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    transaction.oncomplete = (event) => {
      console.log('事务成功!', event)
      resolve(true)
    }
    transaction.onerror = (event) => {
      console.log('事务失败!', event)
      reject(false)
    }
    const request = transaction.objectStore(storeName).add(data)
    request.onsuccess = (event) => {
      console.log('添加成功!', event)
    }
  })
}
/**
 * 通过主键读取数据
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} uid 主键值
 */
export function getDataByKeyDB(
  db: IDBDatabase,
  storeName: string,
  uid: string,
): Promise<object | boolean> {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([storeName])
    let objectStore = transaction.objectStore(storeName)
    let request = objectStore.get(uid)
    request.onsuccess = (event) => {
      console.log('主键查询结果:', request.result)
      resolve(request.result)
    }
    request.onerror = (event) => {
      console.log('事务失败!', event)
      reject(false)
    }
  })
}
/**
 * 通过游标读取数据
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 */
export function cursorDataDB(db: IDBDatabase, storeName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let listArr: any = []
    let store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    let request = store.openCursor()
    request.onsuccess = (event) => {
      let cursor = (<IDBRequest>event.target).result as IDBCursorWithValue
      if (cursor) {
        listArr.push(cursor.value)
        cursor.continue()
      } else {
        console.log('游标读取的数据：', listArr)
        resolve(listArr)
      }
    }
  })
}
/**
 * 通过索引读取数据
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function getDataByIndex(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string,
): Promise<any | boolean> {
  return new Promise((resolve, reject) => {
    var store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    var request = store.index(indexName).get(indexValue)
    request.onerror = function () {
      console.log('事务失败')
      reject(false)
    }
    request.onsuccess = (event) => {
      let result = (<IDBRequest>event.target).result as IDBCursorWithValue
      console.log('索引查询结果：', result)
      resolve(result)
    }
  })
}
/**
 * 通过索引和游标查询记录
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function cursorAndIndexDB(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: string,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let listArr: any = []
    let store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    let request = store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
    request.onsuccess = (event) => {
      let cursor = (<IDBRequest>event.target).result as IDBCursorWithValue
      if (cursor) {
        listArr.push(cursor.value)
        cursor.continue()
      } else {
        console.log('游标读取的数据：', listArr)
        resolve(listArr)
      }
    }
  })
}

/**
 * 更新数据
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {BDataType} data 数据
 */
export function updateDB(db: IDBDatabase, storeName: string, data: BDataType): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).put(data)
    request.onsuccess = function () {
      console.log('数据更新成功')
      resolve(true)
    }
    request.onerror = function () {
      console.log('数据更新失败')
      reject(false)
    }
  })
}
/**
 * 通过主键删除数据
 * @param {IDBDatabase} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} uid 主键值
 */
export function deleteDataDB(db: IDBDatabase, storeName: string, uid: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(uid)
    request.onerror = function (event) {
      console.log('删除失败')
      reject(false)
    }
    request.onsuccess = function (event) {
      console.log('删除成功')
      resolve(true)
    }
  })
}
/**
 * 删除数据库
 * @param {string} dbName 数据库名称
 */
export function deleteAllDB(dbName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    let request = window.indexedDB.deleteDatabase(dbName)
    request.onerror = function (event) {
      console.log('删除失败')
      reject(false)
    }
    request.onsuccess = function (event) {
      console.log('删除成功')
      resolve(true)
    }
  })
}
/**
 * 关闭数据库
 * @param {IDBDatabase} db 数据库实例
 */
export function closeDB(db: IDBDatabase): Promise<boolean> {
  return new Promise((resolve, reject) => {
    db.close()
    console.log('数据库已关闭')
    resolve(true)
  })
}
