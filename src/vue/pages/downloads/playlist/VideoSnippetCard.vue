<template>
    <div class="video-snippet-card">

        <div class="thumbnail">
            <h2 class="author">{{ video.author.name }}</h2>
            <img :src="video.thumbnail_url" alt="">
        </div>

        <div class="info">
            <img :src="video.author.avatar" alt="">
            <p class="title">{{ video.title }}</p>
        </div>

    </div>
</template>

<script>

    export default {

        props: {
            video: {type: Object, required: true}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .video-snippet-card {
        @include inline-flex(column, flex-start);
        margin: 0 0.5em;
        min-width: 10em;
        max-width: 13em;

        .thumbnail {
            @include flex(row, flex-start);
            position: relative;
            border-radius: 0.15em;
            overflow: hidden;
            width: 100%;

            h2 {
                @include font(600, 0.75em);
                @include position(0, auto, auto, 0);
                position: absolute;
                background: $palette-theme-tertiary;
                padding: 0.25em 0.5em 0.4em;
                border-bottom-right-radius: 0.25em;
            }

            img {
                width: 100%;
            }
        }

        .info {
            @include flex(row, flex-start);
            margin-top: 0.5em;

            img {
                @include size(2em);
                flex-shrink: 0;
                border-radius: 0.15em;
            }

            p {
                @include font(600, 0.75em);
                margin-left: 0.5em;
            }
        }
    }

</style>
