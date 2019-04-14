<template>
    <div class="download-box">
        <video-summary :video="video"/>
    </div>
</template>

<script>

    // Components
    import VideoSummary from './VideoSummary';

    export default {

        components: {VideoSummary},

        props: {
            video: {type: Object, required: true}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .download-box {
        background: $palette-theme-secondary;
        padding: 0.5em 1em;
    }

</style>
