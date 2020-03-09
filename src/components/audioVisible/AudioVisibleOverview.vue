<template>
    <div>
        <canvas ref="canvas" :style="canvasStyle"
                @mousedown="handleMouseDown"
                @mouseup="handleMouseUp"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseUp"></canvas>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import AudioDecoder from "../audioDecoder";
    import {DrawColor} from "@/types/draw";

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
        @Prop({type: Number, default: 0, required: true}) playProgress!: number;
        @Prop({type: Boolean, default: false, required: true}) playStatus!: boolean;

        public decodedData: number[] | null = null;
        public currentProgress = 0;
        public mouseDown = false;

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
            if (this.source) {
                this.decodeData(this.source);
            }
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
            this.draw();
        }

        @Watch('playProgress')
        onPlayProgressChange() {
            this.currentProgress = this.playProgress;
        }

        initCanvas() {
            let canvas: HTMLCanvasElement = this.$refs['canvas'] as HTMLCanvasElement;
            canvas.height = this.height * this.pixelRadio;
            canvas.width = this.width * this.pixelRadio;
        }

        handleMouseDown(event: MouseEvent) {
            this.currentProgress = event.x / this.width;
            this.mouseDown = true;
            this.$emit('changeProgress', this.currentProgress);
        }

        handleMouseUp(event: MouseEvent) {
            this.mouseDown = false;
            this.$emit('mouseUp')
        }

        handleMouseMove(event: MouseEvent) {
            if (this.mouseDown) {
                let progress = event.x / this.width;
                this.currentProgress = progress;
                this.$emit('changeProgress', progress);
            }
        }

        draw() {
            if (this.decodedData !== null) {
                let ctx: CanvasRenderingContext2D = (this.$refs['canvas'] as HTMLCanvasElement)
                    .getContext('2d') as CanvasRenderingContext2D;
                ctx.clearRect(0, 0, this.width * this.pixelRadio, this.height * this.pixelRadio);
                let currentX = 0;
                let step = Math.floor(this.decodedData.length / (this.width / (this.segmentWidth + this.segmentSpace)));
                for (let i = 0; i < this.decodedData.length; i += step) {
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
            let currentX;
            currentX = this.currentProgress * this.width - this.segmentSpace - this.segmentWidth - this.timeLineWidth / 2;
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

<style scoped>

</style>
