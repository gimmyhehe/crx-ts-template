chrome.devtools.panels.create('MyPanel', 'img/icon.png', 'devPanel.html', function(panel)
{
	console.log('自定义面板创建成功！'); // 注意这个log一般看不到
  const tabId = chrome.devtools.inspectedWindow.tabId;
  console.log(1111, tabId)
  chrome.debugger.attach(
    { tabId },
    '1.3',
    () => {
      console.log('attch success')
    }
  )
});

// 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane("Images", function(sidebar)
{
	// sidebar.setPage('../sidebar.html'); // 指定加载某个页面
	sidebar.setExpression('document.querySelectorAll("img")', 'All Images'); // 通过表达式来指定
	//sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
});


export {};