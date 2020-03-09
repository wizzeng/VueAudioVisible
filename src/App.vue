<template>
    <div id="app">
        <audio ref="music">
            <source src="music.mp3">
        </audio>
        <button @click="handlePlay">play</button>
        <audio-visible-overview source="music.mp3"
                                :width="1000"
                                :height="200"
                                @changeProgress="handleProgress"
                                :play-progress="playProgress"
                                :play-status="playStatus"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AudioVisibleOverview from "@/components/audioVisible/AudioVisibleOverview.vue";

    @Component({
        components: {AudioVisibleOverview},
    })
    export default class App extends Vue {

        public playProgress = 0;
        public playStatus = false;

        handlePlay() {
            let audio = this.$refs['music'] as HTMLAudioElement;
            if (!this.playStatus) {
                this.playStatus = true;
                audio.play();
            } else {
                this.playStatus = false;
                audio.pause();
            }
            setInterval(() => {
                this.playProgress = audio.currentTime / audio.duration;
            }, 10);
        }

        handleProgress(value: number) {
            let audio = this.$refs['music'] as HTMLAudioElement;
            audio.currentTime = audio.duration * value;
        }
    }
</script>

<style lang="scss">

</style>
