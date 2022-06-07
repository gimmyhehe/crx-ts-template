import { FC, memo, useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import Storage from '../../common/storage'
import { STATISTIC_STYLE } from '../../common/constant'

interface IProps {
  article: string,
  list: HTMLElement[];
}

interface DataType {
  label: string;
  count: number;
  allPercent: string;
  markPercent: string;
  className: string;
  backgroundColor: string;
}

let styleConfig: any;
const getConfig = (): Promise<any> => {
  if (styleConfig) return Promise.resolve(styleConfig);
  return Storage.get(STATISTIC_STYLE).then((res) => {
    styleConfig = res;
    return res;
  })
}

const columns: ColumnsType<DataType> = [
  {
    title: '标记类型',
    dataIndex: 'label',
    key: 'label',
    render: (_: any, { label, backgroundColor }: any) => (
      <div className='flex'>
      <div className={'color-icon'} style={{backgroundColor}}></div>
      <span>{label}</span>
      </div>
    )
  },
  {
    title: '总字数',
    dataIndex: 'count',
    key: 'count',
  },
  {
    title: '占全文比例',
    dataIndex: 'allPercent',
    key: 'allPercent',
  },
  {
    title: '占标记比例',
    dataIndex: 'markPercent',
    key: 'markPercent',
  },
]



const getCount = (str: string, isCountSpace: Boolean = false): number => {
  let newStr;
  newStr = str?.replace(/\n/g, '') || '';
  const whiteSpaceNum = newStr.match(/\s/g)?.length || 0;
  // 将空格换成占位符￥
  newStr = newStr?.replace(/\s/g, '￥') 
  // 英文字数
  const asciiWordNum = newStr.match(/([\x00-\xff]+)/g)?.length || 0
  const chineseWordNum = newStr.match(/([^\x00-\xff])/g)?.length || 0
  if (isCountSpace) {
    return asciiWordNum + chineseWordNum;
  }
  return asciiWordNum + chineseWordNum - whiteSpaceNum;
}

const parsePercent = (num: number) => {
  return (num * 100).toFixed(2) + "%" 
}

const StatisticTable: FC<IProps> = (props: IProps) => {

  console.log('StatisticTable rerender')
  const [articleCount, setCount]: [number, Function] = useState(0) 
  const [data, setData]: [DataType[], Function] = useState([]) 
  useEffect(() => {
    const domList = props.list;
    const newData: DataType[] = [];
    let markCount: number = 0;

    const allCount: number =  getCount(props.article);
    setCount(allCount)

    console.log('statistic start')
    // 获取配置 处理表格数据
    getConfig().then((config) => {
      domList.forEach((item: HTMLElement) => {
        console.log(config, item)
        const className: string = item.className;
        const configItem = config.find((i: any) => className.indexOf(i.className) >= 0);
        const newDateItem = newData.find((i: DataType) => i.className === configItem.className)
        const itemCount: number = getCount(item.innerText);
        markCount = markCount + itemCount;
        if (configItem && newDateItem) {
          newDateItem.count = newDateItem.count + itemCount
        } else if (configItem) {
          const label: string = configItem.label
          newData.push({ className, label, backgroundColor: configItem.backgroundColor,  count: itemCount, allPercent: '', markPercent: '' })
        }

        // 计算各项百分比
        newData.forEach((dateItem: DataType) => {
          dateItem.allPercent = parsePercent(dateItem.count / allCount);
          dateItem.markPercent = parsePercent(dateItem.count / markCount);
        })
      })
      setData(newData)
      console.log('statistic end', newData)
    })

  }, [props.list, props.article])
  return <div>
    <div className='header-title'>全文字数：{articleCount}</div>
    <Table columns={columns} dataSource={data} />
  </div>
}

export default memo(StatisticTable, (pre, next) => {
  return pre.list.length === next.list.length
    && pre.article === next.article
})