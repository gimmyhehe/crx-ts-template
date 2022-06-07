declare namespace NodeJS {
  export interface Global {
    isMacos: boolean,
    isDev: boolean,
    config: Record<string, any>,
    weapps: Array<any>
  }
}

declare interface TabItem {
  id: number
}
declare type ChromeTabs = Array<TabItem>;