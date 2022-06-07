import { highlightClassName, highlightStyleClassPrefix, highlightWarpperClassName } from './config';

// todo 暂时没有配置，高亮范围是整个body，后续可能添加用户个性化配置
const getHighlightNodeList = () => {
  return [document.body]
}
// 实际处理高亮的操作
const doHighlight = function(node, re, settings) {
  const { className, nodeName, styleMap } = settings
  // 只处理文本节点
  if (node.nodeType === 3) {
    const match = node.data.match(re);
    if (match) {
        const matchWord = match[0]
        const highlight = document.createElement(nodeName || 'span');
        let targetNode = node;
        const parent = node.parentNode;
        highlight.className = `${className} ${highlightStyleClassPrefix}${styleMap.get(matchWord)}` || highlightClassName;
        // 如果包含高亮关键词，则包一层
        if(!(parent?.className?.indexOf(highlightWarpperClassName) >=0)) {
          const highlightWraper = document.createElement(nodeName || 'span');
          highlightWraper.className = highlightWarpperClassName;
          highlightWraper.appendChild(node.cloneNode(true))
          for (let i = 0; i < highlightWraper.childNodes.length; i++) {
            i += doHighlight(highlightWraper.childNodes[i], re, settings);
          }
          parent.replaceChild(highlightWraper, node)
          targetNode = highlightWraper.firstChild
          if (!node.__extensionHighlightObserver) {
            node.__extensionHighlightObserver = true;
            const mockParent = document.createElement(nodeName || 'span');
            mockParent.appendChild(node)
            // 观察器的配置（需要观察什么变动）
            const config = { characterData: true, childList: true, subtree: true };
            const observer = new MutationObserver(() => {
              if (parent && highlightWraper) {
                if (mockParent.childNodes.length) {
                  parent.replaceChild(node.cloneNode(true), parent.firstChild)
                } else {
                  parent.removeChild(parent.firstChild)
                  observer.disconnect();
                }
              }
            });
            // 以上述配置开始观察目标节点
            observer.observe(mockParent, config);
          }
          return 0;
        }
        const wordNode = targetNode.splitText(match.index);
        wordNode.splitText(match[0].length);
        const wordClone = wordNode.cloneNode(true);
        highlight.appendChild(wordClone);
        const highlightParent = wordNode.parentNode;
        highlightParent.replaceChild(highlight, wordNode);
        return 1; //skip added node in parent
    }
  } 
  // else if ( (node.nodeType === 1 && node.childNodes) &&
  //   node.className.indexOf &&
  //   node.className.indexOf('el-cascader__label') >= 0
  // ) {
  //   return 0;
  // } 
  else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
  !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
  !(node.tagName === nodeName.toUpperCase() && node.className.indexOf(className) >= 0)) { // skip if already highlighted
    for (var i = 0; i < node.childNodes.length; i++) {
      i += doHighlight(node.childNodes[i], re, settings);
    }
  }
  return 0;
}

// 实际处理取消高亮的方法
const doUnHighlight = function(node, settings) {
  const { nodeName, className } = settings;
  const matchList = node.querySelectorAll(`${nodeName}.${className}`)
  Array.from(matchList).forEach((matchItem) => {
    const parent = matchItem.parentNode;
    parent.replaceChild(matchItem.firstChild, matchItem);
    parent.normalize();
  })
  const uselessList = node.querySelectorAll(`.${highlightWarpperClassName}`)
  Array.from(uselessList).forEach((matchItem) => {
    const parent = matchItem.parentNode;
    parent.replaceChild(matchItem.firstChild, matchItem);
    parent.normalize();
  })
}
// 高亮方法
export const highlight = function(words, options) {
  const defaultSettings = { className: highlightClassName, nodeName: 'span', caseSensitive: true, wordsOnly: false };
  const settings = { ...options, ...defaultSettings }
  if (words.constructor === String) {
    words = [words];
  }
  // 去空
  let wordList = words.filter(i => i)
  const styleMap = new Map();
  // 转义
  wordList = wordList.map((word, index) => {
    styleMap.set(word, index % 10);
    return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/gm, "\\$&");
  })
  if (wordList.length === 0) { return this }
  // 大小写是否敏感
  const flag = settings.caseSensitive ? "" : "i";
  let pattern = "(" + wordList.join("|") + ")";
  if (settings.wordsOnly) {
      pattern = "\\b" + pattern + "\\b";
  }
  const re = new RegExp(pattern, flag);
  settings.styleMap = styleMap
  const list = getHighlightNodeList()
  list.forEach((node) => doHighlight(node, re, settings));
}

export const unHighlight = function(options = {}) {
  const defaultSettings = { className: highlightClassName, nodeName: 'span', caseSensitive: true, wordsOnly: false };
  const settings = { ...options, ...defaultSettings }
  const list = getHighlightNodeList()
  list.forEach((node) => doUnHighlight(node, settings));
}
