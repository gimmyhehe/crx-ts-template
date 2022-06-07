
import { SEARCH, SCREENSHOT, CDP_VERSION, SEACRH_CONFIG_KEY,
	SEACRH_TIME_CONFIG_KEY, STATISTICS, STATISTIC_STR, STATISTIC_STYLE
} from '../common/constant'
import { base64ToUrl, getCurrentTab } from '../common/uitls'
import { searchConfig } from '../common/config'
import Storage from '../common/storage'

chrome.runtime.onInstalled.addListener(() => {
	console.log('搜证插件init');
	Storage.get(STATISTIC_STYLE).then((res) => {
		// 没有样式配置就给个默认配置
		if (!res) {
			Storage.set(STATISTIC_STYLE, [
				{
					label: '内容原创',
					className: 'search-evidence-highlight-001',
					backgroundColor: '#ff9',
					color: '#000'
				},
				{
					label: '通用表述',
					className: 'search-evidence-highlight-002',
					backgroundColor: '#87d068',
					color: '#000'
				},
				{
					label: '法律法规',
					className: 'search-evidence-highlight-003',
					backgroundColor: '#2db7f5',
					color: '#000'
				},
			])
		}
	})
})
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

chrome.contextMenus.create({
  id: SEARCH,
	title: '搜索：%s', // %s表示选中的文字
	contexts: ['selection'], // 只有当选中文字时才会出现搜索
});

chrome.contextMenus.create({
  id: SCREENSHOT,
	title: '截长图',
	contexts: ['all'], // 所以情况均可出现截图
});

chrome.contextMenus.create({
  id: STATISTICS,
	title: '打标统计：%s', // %s表示选中的文字
	contexts: ['selection', 'all'],
});

const doSearch = (params: any) => {
	
	Storage.get([SEACRH_CONFIG_KEY, SEACRH_TIME_CONFIG_KEY]).then((res: any) => {
		const selectSearch: string[] = res[SEACRH_CONFIG_KEY] || [];
		const timeQueryStr: string = res[SEACRH_TIME_CONFIG_KEY] || 'all'
		const list = searchConfig.filter(i => selectSearch?.includes(i.name)) || []; // 选中的搜索引擎
		console.log('选中的搜索引擎：', list, '选中的时间段：', timeQueryStr)
		list.forEach((item: any) => {
			const { baseUrl, timeQuery } = item;
			const url = `${baseUrl}${encodeURI(params.selectionText)}${timeQuery[timeQueryStr]()}`
			console.log(url)
			chrome.tabs.create({ url });
		})
	})
}

const doScreenshot = () => {
	getCurrentTab().then(({ id }: any) => {
		attach(id).then(() => {
			chrome.tabs.executeScript(id, {
				code: '[document.documentElement.scrollWidth, document.documentElement.scrollHeight]'
			}, (...args) => {
				const [width = 1500, height = 3000] = args[0][0] || [];
				console.log(width, height, 111111)
				chrome.debugger.sendCommand({ tabId: id }, 'Page.captureScreenshot', { captureBeyondViewport: true, format: 'png', clip: { x: 0, y: 0, width, height, scale: 1 } }, (result: any) => {
					base64ToUrl({b64data: result.data, contentType: 'image/png'}).then((res: any) => {
						// 转后后的blob对象
						console.log('blob', res)
						// chrome.downloads.download(
						// 	{ url: res },
						// 	(id) => {
						// 		console.log('download finish, downloadId:', id)
						// 	},
						// )
					})
					// detach(id)
					return result;
				})
			})
		})
	})
}

const doStatistics = (params: any) => {
	const extensionId = chrome.runtime.id;
	getCurrentTab().then(({ id }: any) => {
		chrome.tabs.executeScript(id, {
			code: 'window.getSelection().toString()'
		}, (res) => {
			const selectionText: string = res?.[0] || ''
			console.log('selectionText:', selectionText)
			Storage.set(STATISTIC_STR, selectionText).then(() => {
				chrome.tabs.create({ url: `chrome-extension://${extensionId}/statistics.html` });
			})
		})
	})

}

const strategyMap: any = {
	[SEARCH]: doSearch,
	[SCREENSHOT]: doScreenshot,
	[STATISTICS]: doStatistics,
}

chrome.contextMenus.onClicked.addListener(
  (params) => {
		const { menuItemId } = params;
		strategyMap[menuItemId] && strategyMap[menuItemId](params);
  }
)

export {};