export const highlightClassName = 'extension-highlight' // 高亮关键词的公共类名
export const highlightStyleClassPrefix = 'extension-highlight-style-' // 高亮关键词特性前缀
export const highlightWarpperClassName = 'extension-highlight-useless-class' // 高亮关键词包裹类名 
const whitelist = ['mmbiz.oa.com', 'mp.weixinbridge.com']
export const defaultPopupConfig = {
  switchFlag: true,
  keyword: '',
  whitelist: whitelist.join('\n') // 预设的白名单
}

export const getTime = (time = 'day', type = 'ms') => {
  const timeMap: any = {
    day: 60 * 60 * 24 * 1000,
    week: 7 * 60 * 60 * 24 * 1000,
    month: 30 * 60 * 60 * 24 * 1000,
    year: 365 * 60 * 60 * 24 * 1000,
  }
  const end = + new Date();
  const start = end - timeMap[time]
  if (type === 'ms') return [start, end]
  return [Math.floor(start / 1000), Math.floor(end / 1000)]
}

export const searchConfig = [
  {
    name: 'google',
    title: '谷歌',
    baseUrl: 'https://www.google.com/search?q=',
    timeQuery: {
      day: () => '&tbs=qdr:d',
      week: () => '&tbs=qdr:w',
      month: () => '&tbs=qdr:m',
      year: () => '&tbs=qdr:y',
      all: () => '',
    }
  },
  {
    name: 'baidu',
    title: '百度',
    baseUrl: 'https://www.baidu.com/s?wd=',
    timeQuery: {
      day: () => {
        const time = getTime('day', 's');
        return `&gpc=stf%3D${time[0]}%2C${time[1]}%7Cstftype%3D1`
      },
      week: () => {
        const time = getTime('week', 's');
        return `&gpc=stf%3D${time[0]}%2C${time[1]}%7Cstftype%3D1`
      },
      month: () => {
        const time = getTime('month', 's');
        return `&gpc=stf%3D${time[0]}%2C${time[1]}%7Cstftype%3D1`
      },
      year: () => {
        const time = getTime('year', 's');
        return `&gpc=stf%3D${time[0]}%2C${time[1]}%7Cstftype%3D1`
      },
      all: () => '',
    }
  },
  {
    name: '360',
    title: '360',
    baseUrl: 'https://www.so.com/s?q=',
    timeQuery: {
      day: () => '&adv_t=d',
      week: () => '&adv_t=w',
      month: () => '&adv_t=m',
      year: () => '&adv_t=y',
      all: () => '',
    }
  },
  {
    name: 'souhu',
    title: '搜狐',
    baseUrl: 'https://www.sogou.com/web?query=',
    timeQuery: {
      day: () => '&tsn=1',
      week: () => '&tsn=2',
      month: () => '&tsn=3',
      year: () => '&tsn=4',
      all: () => '',
    }
  },
  {
    name: 'toutiao',
    title: '头条',
    baseUrl: 'https://so.toutiao.com/search?dvpf=pc&source=trending_card&keyword=',
    timeQuery: {
      day: () => {
        const time = getTime('day', 's');
        return `&min_time=${time[0]}&max_time=${time[1]}&filter_period=day`
      },
      week: () => {
        const time = getTime('week', 's');
        return `&min_time=${time[0]}&max_time=${time[1]}&filter_period=week`
      },
      month: () => {
        const time = getTime('month', 's');
        return `&min_time=${time[0]}&max_time=${time[1]}&filter_period=month`
      },
      year: () => {
        const time = getTime('year', 's');
        return `&min_time=${time[0]}&max_time=${time[1]}&filter_period=year`
      },
      all: () => '',
    }
  },
]

export const defaultArticle = `天青色等烟雨，而我在等你。
很多人都知道是方文山的词。

但是他们不知道为什么天青色要等烟雨，难道只是为了押韵？

其实这里面的学问也挺大的


烧汝窑瓷器的时候，天青色对温度和湿度的要求太高，一般很难烧制出来。

古人无法控制湿度，所以必须要等到下雨天温度和湿度刚刚好的时候才行。


但是雨天不可能说有就有，所以那些瓷匠就要一直等呀等。

直到看到远处天空变暗，山雨欲来风满楼的时候，迅速架火起窑开始烧制。

出来的颜色才会是天青色。

这就是为什么天青色要等烟雨。

若是想再往前追根溯源也有说法可考究，

天青色本是汝窑的代名词，

典故出自北宋徽宗年间。

一日徽宗从梦中醒来，在梦中他看到雨过天晴天空出现的颜色，于是他便让窑工以此入色，制作出天青色的瓷器。

瓷器烧成之日，徽宗便以“雨过天青云破处，这般颜色做将来”为名。

从此汝窑便有了天青色。

有人说：文人的圈子真的很难进。

以我看，这种难，并非只难在看书多少，是否足够博闻强识。

而是难在，当学识超常的你看山不是山，看水不是水的时候，可以用文字表达出来，让那些平凡而又普通的人，即使不懂诗词，从你的文字中，依然可以看山是山，看水是水。

汝瓷是颜色瓷，只有一种颜色，完全一种性冷淡风格，而且造型简单素雅。

很难以此形容那种炽热而又诡谲多变的爱情。

天青色等烟雨而我在等你这句话，

字字不提爱，

然而在烟雨朦胧处勾勒的却是最美的爱情。

这便是文人的浪漫。

爱情的美妙源自世人可遇不可求，源自稍纵即逝。

正如天青色需要等待来自远方飘渺烟雨，同样可遇而不可求。

彼时彼刻，在烟雨到来的一刹那，匠人抓住这稍纵即逝的上天的恩赐，方能烧制出最美的天青色。

等待才是最长情的告白。

这意境方文山明白，所以便有了那句：

天青色等烟雨，而我在等你。

炊烟袅袅升起，隔江千万里。
妙哉！`