# Audio Visible

[简体中文](./readme_zh-CN.md)

A USELESS Wave form Component for Vue.

![ScreenShot](./img/audio.png)

## Param

| Param            | Type    | Default | Explain                                                     |
| ---------------- | ------- | ------- | ----------------------------------------------------------- |
| Volume           | Number  | 0.5     | Volume of audio player                                      |
| Width            | Number  | 500     | Width of audio player(px only)                              |
| Height           | Number  | 200     | Height of audio player(px only)                             |
| HeightRadio      | Number  | 0.7     | Range of segment height                                     |
| SegmentWidth     | Number  | 2       | Width of each segment (px only)                             |
| SegmentSpace     | Number  | 3       | Space between two segement(px only)                         |
| PixelRadio       | Number  | 3       | \* Oversampling range, canvas in small value will be blurry |
| timeline         | Boolean | true    | Show timeline or not                                        |
| emitProgressTime | Number  | 1000    | An intervening time between emit Progress Data              |

## Event

| Name           | Playload                                               | Describe                                                                                              |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| changeProgress | `{progress: number,current: number, duration: number}` | Triggered when progress changed. You can use param `emitProgressTime` to modify the frequency of emit |
| audioEnd       | null                                                   | Triggered when audio is end.                                                                          |
| loadAudio      | null                                                   | Triggered when load audio successfully                                                                |
| loadError      | null                                                   | Triggered when load audio fail                                                                        |

## Todo

- Parallel resolve.
- Create Audio from buffer rather than sending another request.
- multiple audio file support.

## Run

```shell
# Clone and Install
git clone https://github.com/244462375/VueAudioVisible.git
cd VueAudioVisible
yarn install
```

Then, you must copy a audio file to `VueAudioVisible/public` and rename to `music.mp3`.

After that, you can start the dev server.

```shell
yarn start
```

Now, you can see the demo in http://localhost:8080.
