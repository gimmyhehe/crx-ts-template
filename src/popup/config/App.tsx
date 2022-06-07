import React, { useState, useEffect } from 'react';
import { Checkbox, Radio, Input  } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { SEACRH_CONFIG_KEY, SEACRH_TIME_CONFIG_KEY, STATISTIC_STYLE } from '../../common/constant'
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import type { RadioChangeEvent } from 'antd';
import { searchConfig } from '../../common/config'
import { get, set } from '../../common/storage'
import ColorPicker from "./ColorPicker";
import './App.scss';

const CheckboxGroup = Checkbox.Group;

function App() {
  const [checkedList, setCheckedList]: [CheckboxValueType[], Function] = useState([]);
  const [timeQuery, setTimeQuery] = useState('all');
  const [styleList, setStyleList] : [any, Function] = useState([]);
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
  const setNewStyleList  = () => {
    set(STATISTIC_STYLE, styleList)
    setStyleList(styleList.slice(0))
  }
  const changeBackgroundColor = (val: any, index: number) => {
    styleList[index].backgroundColor = val.hex
    setNewStyleList()
  }
  const changeColor = (val: any, index: number) => {
    styleList[index].color = val.hex
    setNewStyleList()
  }
  const changeText = (e: any, index: number) => {
    styleList[index].label = e.target.value
    setNewStyleList()
  }

  const delRow = (index: number) => {
    styleList.splice(index, 1)
    setNewStyleList()
  }

  const addRow = (index: number) => {
    styleList.push({
      label: 'xxx',
      className: `search-evidence-highlight-${String(index).padStart(3, '0')}`,
      backgroundColor: '#ff9',
      color: '#000'
    })
    setNewStyleList()
  }
  
  useEffect(() => {
    // 获取本地配置
    get([SEACRH_CONFIG_KEY, SEACRH_TIME_CONFIG_KEY, STATISTIC_STYLE]).then((res: any) => {
      setCheckedList(res[SEACRH_CONFIG_KEY])
      setTimeQuery(res[SEACRH_TIME_CONFIG_KEY])
      setStyleList(res[STATISTIC_STYLE])
      console.log('res[SEACRH_CONFIG_KEY]', res[SEACRH_CONFIG_KEY], 'res[SEACRH_TIME_CONFIG_KEY]', res[SEACRH_TIME_CONFIG_KEY])
    })
  }, [])
  return (
  <div className="highlight-extension app-container">
    <h2>搜证插件配置页</h2>
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
    <div style={{marginTop: '20px'}}>
      打标样式配置：
      {
        styleList.map((item: any, index: number) => {
          const { label, backgroundColor, color } = item
          return <div className='style-config-item'>
            <Input placeholder="请输入标签名称" value={label} onChange={(e: any) => { changeText(e, index) }} />
            <span>背景颜色：</span>
            <ColorPicker color={backgroundColor} onChange={(val: any) => { changeBackgroundColor(val, index) }} />
            <span>字体颜色：</span>
            <ColorPicker color={color} onChange={(val: any) => { changeColor(val, index) }} />
            <span>效果预览：</span>
            <div style={{ backgroundColor, color }}>效果预览</div>
            {
              index === styleList.length - 1 ? <PlusCircleOutlined onClick={() => { addRow(index + 1) }} /> : null
            }
            <MinusCircleOutlined onClick={() => { delRow(index) }} />
          </div>
        })
      }
    </div>
 </div>
  );
}

export default App;
