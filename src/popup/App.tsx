import React, { useState, useEffect } from 'react';
import { Checkbox, Radio } from 'antd';
import { SEACRH_CONFIG_KEY, SEACRH_TIME_CONFIG_KEY } from '../common/constant'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import type { RadioChangeEvent } from 'antd';
import { searchConfig } from '../common/config'
import { get, set } from '../common/storage'
import './App.scss';

const CheckboxGroup = Checkbox.Group;
// 通知当前tab更新高亮

function App() {
  const [checkedList, setCheckedList]: [CheckboxValueType[], Function] = useState([]);
  const [timeQuery, setTimeQuery] = useState('all');
  const onChange = function(val: CheckboxValueType[]) {
    setCheckedList(val)
    set(SEACRH_CONFIG_KEY, val)
  }
  const onRaidoChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    const newTimeQuery = e.target.value;
    setTimeQuery(newTimeQuery);
    set(SEACRH_TIME_CONFIG_KEY, newTimeQuery);
  }
  useEffect(() => {
    // 获取本地配置
    get([SEACRH_CONFIG_KEY, SEACRH_TIME_CONFIG_KEY]).then((res: any) => {
      setCheckedList(res[SEACRH_CONFIG_KEY])
      setTimeQuery(res[SEACRH_TIME_CONFIG_KEY])
      console.log('res[SEACRH_CONFIG_KEY]', res[SEACRH_CONFIG_KEY], 'res[SEACRH_TIME_CONFIG_KEY]', res[SEACRH_TIME_CONFIG_KEY])
    })
  }, [])
  return (
  <div className="highlight-extension app-container">
    <div>
      搜索项：<CheckboxGroup options={searchConfig.map(i => ({value: i.name, label: i.title}))} value={checkedList} onChange={onChange} />
    </div>
    <div>
      时间筛选：
      <Radio.Group onChange={onRaidoChange} value={timeQuery}>
        <Radio value={'day'}>一天</Radio>
        <Radio value={'week'}>一周</Radio>
        <Radio value={'month'}>一个月</Radio>
        <Radio value={'year'}>一年</Radio>
        <Radio value={'all'}>全部</Radio>
      </Radio.Group>
    </div>
 </div>
  );
}

export default App;
