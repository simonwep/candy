<template>
    <div class="video-snippet-card" @click="download">

        <!-- Thumbnail and title -->
        <div class="thumbnail">
            <img :src="video.thumbnail_url" alt="">
            <span>{{ utils.formatSeconds(Number(video.length_seconds)) }}</span>
        </div>

        <h1>{{ video.title }}</h1>

        <!-- Channel stuff -->
        <div class="channel">
            <p class="name">{{ video.author.name }}</p>
            <i v-if="video.author.verified" class="fas fa-fw fa-check"></i>
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
        },

        methods: {
            download() {
                this.$router.push(`/downloads?id=${this.video.video_id}`);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .video-snippet-card {
        @include flex(column);
        color: white;
        cursor: pointer;
        background: $palette-theme-primary;
        padding: 0.5em;
        border-radius: 0.15em;
        transition: all 0.3s;

        &:hover {
            filter: brightness(1.15);
            box-shadow: 0 0.1em 2em rgba(black, 0.1);
        }

        .thumbnail {
            @include flex(row, flex-start);
            position: relative;
            overflow: hidden;

            img {
                width: 100%;
                border-radius: 0.15em;
            }

            span {
                @include font(600, 0.75em);
                @include position(auto, 0, 0, auto);
                position: absolute;
                background: $palette-theme-tertiary;
                padding: 0.25em 0.5em 0.4em;
                border-top-left-radius: 0.25em;
            }
        }

        > h1 {
            @include font(600, 0.75em);
            margin: 0.5em 0;
            line-height: 1.4em;
        }

        .channel {
            @include flex(row, center);
            @include font(600, 0.8em);
            margin-top: auto;

            > i {
                color: $palette-cloud-blue;
                font-size: 0.7em;
                margin-left: 0.5em;
            }
        }
    }

</style>
