<template>
    <section class="playlist-summary">

        <h1>{{ playlist.info.title }} <span>/ {{ playlist.videos.length }} Videos</span></h1>

        <!-- Videos -->
        <div class="snippets">
            <video-snippet-card v-for="video of playlist.videos"
                                :video="video"
                                :key="video.video_id"/>
        </div>

    </section>
</template>

<script>

    // Components
    import VideoSnippetCard from './VideoSnippetCard';

    export default {

        components: {
            VideoSnippetCard
        },

        props: {
            playlist: {type: Object, required: true}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .playlist-summary {
        @include flex(column, flex-start, flex-start);
        color: $palette-snow-white;
        position: relative;
        overflow: hidden;

        > h1 {
            @include font(500, 1.1em);
            margin-top: 0.5em;

            span {
                opacity: 0.8;
            }
        }

        .snippets {
            @include flex(row, flex-start);
            margin-top: 1em;
            overflow: auto hidden;
            max-width: 100%;
        }

        &::after {
            @include pseudo();
            @include position(0, 0, 0.5em, auto);
            @include size(auto, 5em);
            background: linear-gradient(to left, $palette-theme-secondary, transparent);
        }
    }

</style>
