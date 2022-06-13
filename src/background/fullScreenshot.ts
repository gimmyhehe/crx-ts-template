import { CDP_VERSION
} from '../common/constant'

import { base64ToUrl, getCurrentTab } from '../common/uitls'

// 将debuggerAPI附加到某个tab上
const attach = (tabId: number) => new Promise((resolve) => {
	if (!tabId) return console.error('tabId not exist');
	chrome.debugger.attach(
		{ tabId },
		CDP_VERSION,
		() => {
			resolve(null)
		}
	)
})

// 将debuggerAPI从tab上移除
const detach = (tabId: number) => new Promise((resolve) => {
	if (!tabId) return console.error('tabId not exist');
	chrome.debugger.detach(
		{ tabId },
		() => {
			resolve(null)
		}
	)
})


const clearDeviceMetricsOverride = (tabId: number) => new Promise((resolve) => {
  chrome.debugger.sendCommand(
    {
      tabId: tabId,
    },
    "Emulation.clearDeviceMetricsOverride",
    () => {
      resolve(null)
    }
  );
})

const captureScreenshot = (tabId: number) => new Promise((resolve, reject) => {

  chrome.debugger.sendCommand(
    { tabId: tabId },
    "Page.captureScreenshot",
    {
      format: "png",
      fromSurface: true,
    },
    (response: any) => {
      if (chrome.runtime.lastError) {
        console.log(`{back}: captureScreenshot: status=failed, tabId=${tabId}`);
        reject(null)
      } else {
        resolve(response.data)
        base64ToUrl({b64data: response.data, contentType: 'image/png'}).then((res: any) => {
          // 转后后的blob对象
          chrome.downloads.download(
            { url: res },
            (id) => {
              console.log('download finish, downloadId:', id)
            },
          )
        })
        detach(tabId)
        setTimeout(() => {
          clearDeviceMetricsOverride(tabId);
        }, 100);
      }
    }
  );
})

const setDeviceMetricsOverride = (tabId: number, height: number, width: number) => new Promise((resolve, reject) => {
  chrome.debugger.sendCommand(
    {
      tabId: tabId,
    },
    "Emulation.setDeviceMetricsOverride",
    { height: height, width: width, deviceScaleFactor: 1, mobile: false },
    function () {
      console.log('page width:', width)
      console.log('page height:', height)
      // 需要设置延迟 否则截图将重复
      setTimeout(() => {
        resolve(null);
      }, 100)
    }
  );
})

const getLayoutMetrics = (tabId: number) => new Promise((resolve, reject) => {
  chrome.debugger.sendCommand(
    {
      tabId: tabId,
    },
    "Page.getLayoutMetrics",
    {},
    function (object: any) {
      const { height, width } = object.contentSize;
      resolve({ height, width })
    }
  );
})

const setColorlessBackground = (tabId: number) => new Promise((resolve, reject) => {
  chrome.debugger.sendCommand(
    { tabId: tabId },
    "Emulation.setDefaultBackgroundColorOverride",
    { color: { r: 0, g: 0, b: 0, a: 0 } },
    function () {
      resolve(null);
    }
  );
})



const fullSreenshot = () => {

	getCurrentTab().then(({ id }: any) => {
		attach(id).then(() => {
      setColorlessBackground(id)
        .then(() => getLayoutMetrics(id))
        .then(({ height, width } : any) => setDeviceMetricsOverride(id, height, width))
        .then(() => captureScreenshot(id))
		})
	})
}

export default fullSreenshot;

