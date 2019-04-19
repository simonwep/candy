<template>
    <section class="playlist-summary">

        <h1>{{ playlist.info.title }} / {{ playlist.channels.length }} Videos</h1>

        <!-- Videos -->
        <div class="snippets">
            <video-snippet-card v-for="video of playlist.channels" :video="video"/>
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
        overflow: hidden;
        color: $palette-snow-white;

        > h1 {
            @include font(500, 1.1em);
            margin-top: 0.5em;
        }

        .snippets {
            @include flex(row, flex-start);
            margin-top: 1em;
            overflow: auto hidden;
            max-width: 100%;

            .video-snippet-card {
                padding-bottom: 1em;
            }
        }
    }

</style>
