import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Storage from '../../common/storage'
import { STATISTIC_STYLE } from '../../common/constant'

// 将配置中的样式插入头部
Storage.get(STATISTIC_STYLE).then((styleConfig: any = []) => {
  const styleTag = document.createElement('style')
  const innerText = styleConfig?.reduce((pre: string, item: any) => {
    return pre + `\n .${item.className} { background-color: ${item.backgroundColor}; color: ${item.color} }`
  }, '')
  styleTag.innerText = innerText;
  document.getElementsByTagName("head")[0].appendChild(styleTag);
})



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
