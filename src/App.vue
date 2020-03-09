<template>
    <div id="app">
        <audio-visible-overview source="music.mp3"
                                :width="width"
                                :height="height"
                                :play-status="playStatus"
                                @changeProgress="handleChange"
                                :segment-space="segmentSpace"
                                :segment-width="segmentWidth"
                                :time-line-width="timeLineWidth"
                                :height-radio="heightRadio"
                                :volume="volume"
                                :emit-progress-time="emitProgressTime"
                                :pixel-radio="pixelRadio"
                                @audioEnd="playStatus=false"
                                @loadAudio="status='Load Successfully'"
                                @loadError="handleError"
        />
        <div class="demo">
            <h1>{{toPlayTime(this.playProgress.current)}} / {{toPlayTime(this.playProgress.duration)}}</h1>
<!--            <h2>Status: {{status}}</h2>-->
            <button @click="handlePlay">{{playStatus?'Pause': 'Play'}}</button>
            <demo-input v-model="volume" title="Volume"/>
            <demo-input v-model="width" title="Width"/>
            <demo-input v-model="height" title="Height"/>
            <demo-input v-model="segmentWidth" title="SegmentWidth"/>
            <demo-input v-model="segmentSpace" title="SegmentSpace"/>
            <demo-input v-model="timeLineWidth" title="TimeLineWidth"/>
            <demo-input v-model="heightRadio" title="HeightRadio"/>
            <demo-input v-model="emitProgressTime" title="EmitProgressTime"/>
            <demo-input v-model="pixelRadio" title="PixelRadio"/>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import AudioVisibleOverview from "@/components/audioVisible/AudioVisibleOverview.vue";
    import {ProgressChangePlayload} from "@/types/draw";
    import DemoInput from "@/components/DemoInput.vue";

    @Component({
        components: {DemoInput, AudioVisibleOverview},
    })
    export default class App extends Vue {

        public status = '';
        public playStatus = false;
        public playProgress: ProgressChangePlayload = {
            progress: 0,
            current: 0,
            duration: 0
        };
        public volume = 0.4;
        public width = 3000;
        public height = 200;
        public segmentSpace = 3;
        public segmentWidth = 2;
        public timeLineWidth = 5;
        public heightRadio = 0.6;
        public emitProgressTime = 1000;
        public pixelRadio = 3;

        toPlayTime(secondCount: number) {
            let minutes = Math.floor((secondCount) / 60);
            let second = Math.round(secondCount - minutes * 60);
            return `${minutes}:${second}`
        }

        handlePlay() {
            this.playStatus = !this.playStatus;
        }

        handleChange(changePlayload: ProgressChangePlayload) {
            this.playProgress = changePlayload;
        }

        handleError(e: Error){
            this.status = 'Error Occur: ' + e;
        }
    }
</script>

<style lang="scss">
    * {
        margin: 0;
        padding: 0;
    }

    .demo {
        margin-top: 50px;
        margin-bottom: 100px;
        text-align: center;

        button {
            margin: 20px auto;
            width: 100px;
            height: 40px;
            color: gray;
            border: 1px solid #989898;
            border-radius: 3px;
            background-color: transparent;
            transition: all .5s;

            &:hover {
                color: black;
                border: 2px solid black;
            }
        }
    }
</style>
