<template>
    <div id="app">
        <audio-drawer source="music.mp3" :width="1000" :height="200"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AudioDrawer from "@/components/audioVisible/AudioVisible.vue";

    @Component({
        components: {AudioDrawer},
    })
    export default class App extends Vue {


    }
</script>

<style lang="scss">

</style>
