<template>
    <div>
        <button @click="decodeData">load</button>
        <audio-drawer :width="width" :height="height" :decodedData="decodedData"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Provide, Vue, Watch} from 'vue-property-decorator';
    import AudioDecoder from "../audioDecoder";
    import AudioDrawer from './drawer/AudioDrawer'

    @Component({
        components: {
            AudioDrawer
        }
    })
    export default class AudioVisible extends Vue {
        @Provide() private decoder: AudioDecoder | null = null;

        @Prop(String) readonly source!: string;
        @Prop({type: Number, default: 500}) readonly width!: number;
        @Prop({type: Number, default: 200}) readonly height!: number;

        public decodedData: number[] | null = null;

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
            if (this.source) {
                this.decodeData(this.source);
            }
        }

        decodeData(src: string) {
            if (this.decodedData) {
                this.$emit('onLoad');
            }else {
                this.$emit('decodeFailed');
            }
        }

    }
</script>

<style scoped>

</style>
