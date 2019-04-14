<template>
    <div class="download-box">
        <video-summary :video="video"/>
        <div class="divider"></div>
        <format-selection :video="video"/>
    </div>
</template>

<script>

    // Components
    import VideoSummary    from './VideoSummary';
    import FormatSelection from './FormatSelection';

    export default {

        components: {VideoSummary, FormatSelection},

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
        @include flex(column);
        background: $palette-theme-secondary;
        padding: 0.5em 1em;
    }

    .divider {
        @include size(2px, 98%);
        margin: 1em auto;
        background: rgba(black, 0.1);
    }

</style>
