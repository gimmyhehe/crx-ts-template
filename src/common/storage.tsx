export const get = function(keys: string | string[]) {
  let keyList: string | string[];
  if (keys.constructor === String) {
    keyList = [keys]
  } else {
    keyList = keys;
  }
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(keyList, function (result: any) {
        if (keys.constructor === String) {
          resolve(result[keys])
        } else {
          resolve(result)
        }
      });
    } catch(err) {
      reject(err)
    }
  })
}

// 用对象方式赋值
export const setByObj = function(data: any) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(data, function () {
        resolve(null)
      });
    } catch(err) {
      reject(err)
    }
  })
}
// 获取某个key的值
export const set = function(key: string, data: any) {
  return setByObj({ [key]: data })
}

const stroage = {
  get,
  set,
  setByObj,
}
export default stroage;
