import React, { useState, useEffect, useRef } from 'react';
import { Radio, Button, Affix, Collapse } from 'antd';
import { STATISTIC_STYLE, STATISTIC_STR } from '../../common/constant'
import { defaultArticle } from '../../common/config';
import type { RadioChangeEvent } from 'antd';
import { get } from '../../common/storage';
import StatisticTable from './table';
import './App.scss';
import Highlighter from 'web-highlighter';

const { Panel } = Collapse;

const extensionId = chrome.runtime.id;

let highlighter: any;

function App() {
  const [styleType, setStyleType]: [string, Function] = useState('');
  const [article, setArticle]: [string, Function] = useState('');
  const [reset, setReset]: [Boolean, Function] = useState(false);
  const [statArticle, setStatArticle]: [string, Function] = useState('');
  const [isStat, setStat]: [Boolean, Function] = useState(false);
  const [styleList, setStyleList] = useState([]);
  const [domList, setDomList]: [HTMLElement[], Function] = useState([])

  const preRef = useRef<HTMLPreElement>(null)

  const onRaidoChange = (e: RadioChangeEvent) => {
    const newType = e.target.value;
    console.log(styleType, 77777, newType)
    highlighter.setOption({ style: { className: newType } })
    setStyleType(newType);
  }
  // 开始打标
  const start = () => {
    setStat(true)
    highlighter?.run();
  }
  // 结束打标
  const stop = () => {
    setStat(false)
    highlighter?.stop();
  }
  // 统计结果
  const doStat = () => {
    const allDomList = highlighter.getDoms()
    const newArt: string = preRef.current?.innerText || '';
    console.log(preRef, 777777, newArt);
    setStatArticle(newArt)
    setDomList(allDomList)
  }
  const resetArticle = (newArticle: string) => {
    setReset(true);
    setTimeout(() => {
      setReset(false);
      setArticle(newArticle)
    })
  }

  const onMouseover = (e: any) => {
    const tagName: string = e.target?.tagName
    if (tagName !== 'SPAN') return;
    const id: string = e.target?.getAttribute('data-highlight-id') || ''
    if (id && !isStat) {
      highlighter?.addClass('search-evidence-highlight-hover', id)
    }
  }
  
  const onMouseout = (e: any) => {
    const tagName: string = e.target?.tagName
    if (tagName !== 'SPAN') return;
    const id: string = e.target?.getAttribute('data-highlight-id') || ''
    if (id && !isStat) {
      highlighter?.removeClass('search-evidence-highlight-hover', id)
    }
  }
  
  
  const onClick = (e: any) => {
    const tagName: string = e.target?.tagName
    if (tagName !== 'SPAN') return;
    const id: string = e.target?.getAttribute('data-highlight-id') || ''
    if (id && e.target.className.indexOf('search-evidence-highlight-hover') >= 0) {
      highlighter.remove(id)
    }
  }
  
  const setDefalutArticle = () => {
    highlighter?.dispose();
    resetArticle(defaultArticle)
  }

  useEffect(() => {
    // 获取本地配置
    get([STATISTIC_STYLE, STATISTIC_STR]).then((res: any) => {
      setArticle(res[STATISTIC_STR]);
      setStyleList(res[STATISTIC_STYLE]);
      const defaultStyleType: string = res[STATISTIC_STYLE]?.[0]?.className || ''
      setStyleType(defaultStyleType)
      console.log('res[STATISTIC_STYLE]', res[STATISTIC_STYLE], 'res[STATISTIC_STR]', res[STATISTIC_STR]);
      highlighter = new Highlighter({
        $root: document.getElementById('statistic-text') || undefined,
        style: { className: defaultStyleType }
      })
    })
  }, [])
  return (
  <div className="statistic-page app-container">
    <div className='header'>
      <div className='header-title'>
        搜证插件： 打标统计
      </div>
      <Button type="primary" size='small' onClick={setDefalutArticle}>示例文章</Button>
      <a style={{ float: 'right' }} href={`chrome-extension://${extensionId}/config.html`} target='_blank' rel='noreferrer'>配置页</a>
    </div>
    <Affix offsetTop={0} style={{ zIndex: 99}}>
      <div className='tool-bar'>
        <span className='header-title'>工具栏：</span>
        <div className='tool-bar-item'>
          标记类型：
          <Radio.Group onChange={onRaidoChange} value={styleType}>
            { styleList.map((item) => {
              const { label, className, backgroundColor } = item;
              return  <Radio key={className} value={className}>{label} <div className={'color-icon'} style={{backgroundColor}}></div></Radio>
            }) }
          </Radio.Group>
        </div>
        <div className='tool-bar-item'>
          <Button type="primary" size='small' onClick={start}>开始标记</Button>
          <Button type="primary" size='small' onClick={stop}>结束标记</Button>
          <Button type="primary" size='small' onClick={() => { highlighter.dispose() }}>清空标记</Button>
          <Button type="primary" size='small' onClick={doStat}>统计结果</Button>
        </div>
      </div>
    </Affix>

    <Collapse defaultActiveKey={['1', '2']} className='collapse-box'>
      <Panel header={'打标文章'} key="1">
      <div id='statistic-text' className={isStat ? 'statistic-box' : ''}>
        {
          reset ? null :
          <pre contentEditable={true} onMouseOver={onMouseover} onMouseOut={onMouseout} onClick={onClick} suppressContentEditableWarning={true} ref={preRef}>
            {article}
          </pre>
        }
      </div>
      </Panel>
      <Panel header="统计结果" key="2">
        <StatisticTable list={domList} article={statArticle} />
      </Panel>
    </Collapse>
 </div>
  );
}

export default App;
