<template>
    <div>
        <canvas ref="canvas" :style="canvasStyle"></canvas>
        <button @click="draw">draw</button>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import {DrawColor} from "@/types/draw";

    @Component
    export default class AudioDrawer extends Vue {
        @Prop({type: Number, required: true}) width!: number;
        @Prop({type: Number, required: true}) height!: number;
        @Prop({required: true}) decodedData!: number[] | null;
        @Prop({type: Number, default: 3}) segmentWidth!: number;
        @Prop({type: Number, default: 2}) segmentSpace!: number;
        @Prop({type: Number, default: 3}) pixelRadio!: number;
        @Prop({
            default: () => ({
                timeline: 'blue',
                segment: '#5C9BE1'
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

        mounted() {
            this.initCanvas();
        }

        initCanvas() {
            let canvas: HTMLCanvasElement = this.$refs['canvas'] as HTMLCanvasElement;
            canvas.height = this.height * this.pixelRadio;
            canvas.width = this.width * this.pixelRadio;
        }

        draw() {
            if (this.decodedData !== null) {
                let ctx: CanvasRenderingContext2D = (this.$refs['canvas'] as HTMLCanvasElement)
                    .getContext('2d') as CanvasRenderingContext2D;
                ctx.fillStyle = this.drawColor.segment;
                let currentX = 10;
                for (let i = 0; i < this.decodedData.length && this.width * this.pixelRadio > currentX; i += 2) {
                    let width = this.segmentWidth * this.pixelRadio;
                    let height = this.decodedData[i] * this.pixelRadio;
                    let x = (currentX + this.segmentSpace) * this.pixelRadio;
                    let y = (this.height * this.pixelRadio - height) / 2;
                    ctx.fillRect(x, y, width, height);
                    currentX += this.segmentSpace + this.segmentWidth;
                }
            }
        }


    }
</script>

<style scoped>
a {
    color: rgba(92,155,225,0.94);
}
</style>
