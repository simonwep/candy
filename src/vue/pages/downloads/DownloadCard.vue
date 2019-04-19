<template>
    <div v-if="video || playlist" class="download-card">

        <!-- Summary types -->
        <video-summary v-if="video" :video="video"/>
        <playlist-summary v-else :playlist="playlist"/>

        <div class="divider"></div>

        <!-- Video types -->
        <video-format-selection v-if="video" :video="video"/>
        <playlist-format-selection v-else :playlist="playlist"/>

    </div>
</template>

<script>

    // Components
    import PlaylistFormatSelection from './playlist/PlaylistFormatSelection';
    import PlaylistSummary         from './playlist/PlaylistSummary';
    import VideoFormatSelection    from './video/VideoFormatSelection';
    import VideoSummary            from './video/VideoSummary';

    export default {

        components: {
            PlaylistFormatSelection,
            PlaylistSummary,
            VideoFormatSelection,
            VideoSummary
        },

        props: {
            video: {type: Object, default: null},
            playlist: {type: Object, default: null}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .download-card {
        @include flex(column);
        background: $palette-theme-secondary;
        padding: 0.5em 1em;
        box-shadow: 0 0.2em 2em rgba(black, 0.1);
    }

    .divider {
        @include size(2px, 98%);
        margin: 1em auto;
        background: rgba(black, 0.1);
    }

</style>
