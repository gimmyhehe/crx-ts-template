import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";

export default function ColorBlock(props: any) {
  // 默认选择器宽度
  const defaultPickerWidth: any = 220;
  // 默认选择器高度
  const defaultPickerHeight: number = 300;

  // 色块容器样式
  const containerStyle: any = {
    display: "inline-block",
    width: props.width || 40,
    height: props.height || 40,
    position: "relative"
  };

  // 颜色选择器显隐控制
  const [picker, setPicker] = useState(false);

  // 颜色选择器自定义位置
  const [pickerPos, setPickerPos] = useState({
    left: containerStyle.width,
    top: 0
  });

  // 处理点击任意外部区域关闭颜色选择器
  useEffect(() => {
    document.addEventListener("click", hidePicker);
    return () => {
      document.removeEventListener("click", hidePicker);
    };
  });

  // 色块样式
  const blockStyle = {
    backgroundColor: props.color,
    width: "100%",
    height: "100%"
  };

  // 颜色选择器样式
  const pickerStyle: any = {
    backgroundColor: "white",
    position: "absolute",
    zIndex: "99",
    left: pickerPos.left,
    top: pickerPos.top,
    display: picker ? "block" : "none"
  };

  // 点击色块
  const onClickBlock = (e: any) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const width = window.innerWidth;
    const height = window.innerHeight;
    let left = 0;
    let top = 0;

    // 此处仅作参考，可依据实际情况，计算颜色选择器出现的合理位置

    if (width - clientX < containerStyle.width + defaultPickerWidth) {
      left = -defaultPickerWidth;
    } else {
      left = containerStyle.width;
    }

    if (height - clientY < defaultPickerHeight) {
      top = height - clientY - defaultPickerHeight;
    } else {
      top = 0;
    }

    setPickerPos({ left, top });
    doPrevent(e);
    setPicker(true);
  };

  // 阻止进一步冒泡
  const doPrevent = (e: any) => {
    e.nativeEvent.stopImmediatePropagation();
  };

  // 隐藏颜色选择器
  const hidePicker = (e: any) => {
    setPicker(false);
  };

  return (
      <div style={containerStyle}>
        <div style={blockStyle} onClick={onClickBlock}></div>
        <div style={pickerStyle} onClick={doPrevent}>
          <SketchPicker
            width={defaultPickerWidth}
            color={props.color}
            onChange={props.onChange}
          />
        </div>
      </div>
  );
}