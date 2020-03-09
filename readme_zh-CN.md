# # Audio Visible

[English](./READEME.md)

勉强能用的 Vue 音频波形组件。

![ScreenShot](./img/audio.png)

## 参数

| 参数             | 类型    | 默认值 | 描述                                                              |
| ---------------- | ------- | ------ | ----------------------------------------------------------------- |
| Volume           | Number  | 0.5    | 播放器音量大小                                                    |
| Width            | Number  | 500    | 音频组件宽度(px only)                                             |
| Height           | Number  | 200    | 音频组件高度(px only)                                             |
| HeightRadio      | Number  | 0.7    | 音频段高度比例                                                    |
| SegmentWidth     | Number  | 2      | 段宽度 (px only)                                                  |
| SegmentSpace     | Number  | 3      | 段间隔(px only)                                                   |
| PixelRadio       | Number  | 3      | \* 像素采样率，建议保持默认值，太低会导致在 Retina 屏幕的绘制模糊 |
| timeline         | Boolean | true   | 是否显示时间线                                                    |
| emitProgressTime | Number  | 1000   | 播放时的播放信息 emit 间隔，如果不是有特殊需求，建议保持默认值    |

## 事件

| 事件名         | Playload                                               | 描述                                                                                |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| changeProgress | `{progress: number,current: number, duration: number}` | 当播放时和拖动进度时触发，播放触发频率可通过 `emitProgressTime` 参数设置，默认为 1s |
| audioEnd       | null                                                   | 播放结束时触发                                                                      |
| loadAudio      | null                                                   | 载入音频数据成功后触发                                                              |
| loadError      | null                                                   | 载入失败时触发                                                                      |

## Todo

- 并行下载 / 边下载边解析
- 从 Buffer 取 Audio。现在用 Audio.src 取数据导致两次请求
- 多格式参数支持

## Run

```shell
# Clone and Install
git clone https://github.com/244462375/VueAudioVisible.git
cd VueAudioVisible
yarn install
```

将 mp3 音频文件放置至 `VueAudioVisible/public` 并重命名为 `music.mp3`。

启动服务器。

```shell
yarn start
```

启动浏览器 http://localhost:8080 即可查看效果。
