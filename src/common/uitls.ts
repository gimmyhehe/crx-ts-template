// 防抖
export const debounce = function (fn: Function, wait :number = 500) {
  let timer: NodeJS.Timeout | null = null;
  return function (this: any, ...args: any[]) {
      if (timer) {
          clearTimeout(timer);
          timer = null;
      }
      timer = setTimeout(() => {
          fn.call(this, ...args)
      }, wait)
  }
}

// 获取当前的tab页
export const getCurrentTab = function () {
    return new Promise((resolve, reject) => {
        try {
            if(chrome.tabs && chrome.tabs.query) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    resolve(tabs[0])
                });
            } else { // electron环境中直接返回一个mockTab
                const mockTab = { id: 0 }
                resolve(mockTab)
            }
        } catch(e) {
            console.log('获取当前的tab页发生错误')
            reject(e)
        }
    })
}

// 将base64图片转换成bloburl
export const base64ToUrl = ({b64data = '', contentType = '', sliceSize = 512} = {}) => {
    return new Promise((resolve, reject) => {
      // 使用 atob() 方法将数据解码
      let byteCharacters = atob(b64data);
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = [];
        for (let i = 0; i < slice.length; i++) {
            byteNumbers.push(slice.charCodeAt(i));
        }
        // 8 位无符号整数值的类型化数组。内容将初始化为 0。
        // 如果无法分配请求数目的字节，则将引发异常。
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      let result = new Blob(byteArrays, {
        type: contentType
      })
      resolve(URL.createObjectURL(result))
    })
   }