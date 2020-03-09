<template>
    <div class="player-box" ref="playerBox">
        <audio ref="music">
            <source src="music.mp3">
        </audio>
        <canvas ref="canvas" :style="canvasStyle"
                @mousedown="handleMouseDown"
                @mouseup="handleMouseUp"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseUp"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import AudioDecoder from "../audioDecoder";
    import {DrawColor} from "@/types/draw";
    import {debounce} from "@/utils/debounce";

    @Component({})
    export default class AudioVisibleOverview extends Vue {
        @Provide() private decoder: AudioDecoder | null = null;

        @Prop(String) readonly source!: string;
        @Prop({type: Number, default: 500}) readonly width!: number;
        @Prop({type: Number, default: 200}) readonly height!: number;
        @Prop({type: Number, default: 3}) segmentWidth!: number;
        @Prop({type: Number, default: 5}) segmentSpace!: number;
        @Prop({type: Number, default: 3}) pixelRadio!: number;
        @Prop({type: Number, default: 4}) timeLineWidth!: number;
        @Prop({type: Number, default: 0.7}) heightRadio!: number;
        @Prop({type: Boolean, default: true}) timeLine!: boolean;
        @Prop({type: Boolean, default: false, required: true}) playStatus!: boolean;
        @Prop({type: Number, default: 1000}) emitProgressTime!: number;
        @Prop({default: 0.5}) volume!: number;

        public decodedData: number[] | null = null;
        public currentProgress = 0;
        public mouseDown = false;
        public audio: HTMLAudioElement | null = null;

        public debouncedSetProgress = debounce(this.setProgress, 100);

        setProgress() {
            if (this.audio) {
                this.audio.currentTime = this.currentProgress * this.audio.duration;
            }
        }

        setCurrentProgress() {
            setInterval(() => {
                if (this.audio && !this.mouseDown)
                    this.currentProgress = this.audio?.currentTime / this.audio?.duration;
            }, 10)
        }

        setProgressEmitter() {
            setInterval(() => {
                if (this.playStatus) {
                    this.$emit('changeProgress',
                        {
                            progress: this.currentProgress,
                            current: this.audio?.currentTime,
                            duration: this.audio?.duration
                        });
                }
            }, this.emitProgressTime)
        }

        @Watch('pixelRadio')
        onChangePixelRadio() {
            this.initCanvas();
        }

        @Watch('volume')
        onVolumeChange(val: string | number) {
            let value = 0.5;
            if(typeof val === "string") {
                value = parseInt(val);
                if(Number.isNaN(value)) value = 0.5;
            }
            if(typeof val === "number"){
                value = val;
            }
            if (value < 0) {
                value = 0;
            } else if (value > 1) {
                value = 1
            }
            let audio = this.$refs['music'] as HTMLAudioElement;
            audio.volume = value;
        }

        @Watch('source')
        onSourceChange(src: string) {
            this.decodeData(src)
        }

        initDecoder() {
            this.decoder = new AudioDecoder();
            this.decoder.onLoadError = (e) => {
                this.$emit('loadError', e);
            };
            this.decoder.onLoadBuffer = () => {
                if (this.decoder) {
                    this.$emit('load');
                    this.decodedData = this.decoder.getDecodedArray(this.width, this.height);
                }
            };
            this.decoder.openRemoteSource(this.source);
        }

        created() {
            if (this.source) {
                this.initDecoder();
            }
        }

        mounted(): void {
            this.initCanvas();
            this.setCurrentProgress();
            this.setProgressEmitter();
            this.setProgress();
            if (this.source) {
                this.decodeData(this.source);
            }
            this.audio = this.$refs['music'] as HTMLAudioElement;
        }

        @Prop({
            default: () => ({
                timeline: '#e17b5e',
                segment: '#5C9BE1',
                passSegment: '#405dc1'
            })
        }) drawColor!: DrawColor;

        get canvasStyle() {
            return {
                height: this.height + 'px',
                width: this.width + 'px'
            }
        }

        @Watch('decodedData')
        onDataChange() {
            if (this.decodedData !== null) {
                this.draw();
            }
        }

        @Watch('currentProgress')
        onProgressChange() {
            this.debouncedSetProgress(this);
            this.draw();
        }

        @Watch('playStatus')
        onPlayStatusChange(val: boolean) {
            if (this.audio) {
                if (val) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            }
        }

        @Watch('width')
        handleWidthChange() {
            this.initCanvas();
            this.draw();
        }

        @Watch('height')
        handleHeightChange() {
            this.initCanvas();
            this.draw();
        }

        initCanvas() {
            let canvas: HTMLCanvasElement = this.$refs['canvas'] as HTMLCanvasElement;
            canvas.height = this.height * this.pixelRadio;
            canvas.width = this.width * this.pixelRadio;
        }

        handleMouseDown(event: MouseEvent) {
            let parent = this.$refs['playerBox'] as HTMLDivElement;
            let ml = parent.style.marginLeft === '' ? 0 : parseInt(parent.style.marginLeft);
            let scroll = parent.scrollLeft === 0
                ? document.documentElement.scrollLeft === 0 ? 0
                    : document.documentElement.scrollLeft : parent.scrollLeft;
            this.currentProgress = (scroll - ml + event.x) / this.width;
            this.mouseDown = true;
            this.$emit('changeProgress',
                {
                    progress: this.currentProgress,
                    current: this.audio?.currentTime,
                    duration: this.audio?.duration
                });
        }

        handleMouseUp(event: MouseEvent) {
            setTimeout(() => {
                this.mouseDown = false;
                this.$emit('mouseUp')
            }, 100);
        }

        handleMouseMove(event: MouseEvent) {
            if (this.mouseDown) {
                let parent = this.$refs['playerBox'] as HTMLDivElement;
                let ml = parent.style.marginLeft === '' ? 0 : parseInt(parent.style.marginLeft);
                let scroll = parent.scrollLeft === 0
                    ? document.documentElement.scrollLeft === 0 ? 0
                        : document.documentElement.scrollLeft : parent.scrollLeft;
                this.currentProgress = (scroll - ml + event.x) / this.width;
                this.$emit('changeProgress',
                    {
                        progress: this.currentProgress,
                        current: this.audio?.currentTime,
                        duration: this.audio?.duration
                    });
            }
        }

        // TODO: 重绘性能太差，最好局部绘制
        draw() {
            if (this.decodedData !== null) {
                let ctx: CanvasRenderingContext2D = (this.$refs['canvas'] as HTMLCanvasElement)
                    .getContext('2d') as CanvasRenderingContext2D;
                ctx.clearRect(0, 0, this.width * this.pixelRadio, this.height * this.pixelRadio);
                let currentX = 0;
                let step = Math.floor(this.decodedData.length / (this.width / (this.segmentWidth + this.segmentSpace)));
                for (let i = 0; i < this.decodedData!.length; i += step) {
                    if (this.currentProgress * this.width - this.segmentSpace - this.segmentWidth > currentX) {
                        ctx.fillStyle = this.drawColor.passSegment;
                    } else {
                        ctx.fillStyle = this.drawColor.segment;
                    }
                    let width = this.segmentWidth * this.pixelRadio;
                    let height = this.decodedData[i] * this.pixelRadio * this.heightRadio;
                    let x = currentX * this.pixelRadio;
                    let y = (this.height * this.pixelRadio - height) / 2;
                    ctx.fillRect(x, y, width, height);
                    currentX += this.segmentSpace + this.segmentWidth;
                }
                if (this.timeLine) {
                    this.drawTimeLine();
                }
            }
        }

        drawTimeLine() {
            let ctx: CanvasRenderingContext2D = (this.$refs['canvas'] as HTMLCanvasElement)
                .getContext('2d') as CanvasRenderingContext2D;
            ctx.fillStyle = this.drawColor.timeline;
            let currentX = this.currentProgress * this.width - this.segmentSpace - this.segmentWidth - this.timeLineWidth / 2;
            ctx.fillRect(currentX * this.pixelRadio, 0,
                this.timeLineWidth * this.pixelRadio, this.height * this.pixelRadio)
        }

        decodeData(src: string) {
            if (this.decodedData) {
                this.$emit('onLoad');
            } else {
                this.$emit('decodeFailed');
            }
        }

    }
</script>

<style scoped lang="scss">
    .player-box {
        overflow-x: scroll;
        overflow-y: hidden;
    }
</style>
