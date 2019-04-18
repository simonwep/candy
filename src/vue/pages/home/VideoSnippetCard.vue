<template>
    <div class="video-snippet-card" @click="download">

        <!-- Thumbnail and title -->
        <img :src="video.thumbnail_url" alt="">
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
                this.$router.push(`/downloads?value=${this.video.video_id}`);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .video-snippet-card {
        @include flex(column);
        color: white;
        cursor: pointer;

        > img {
            width: 100%;
            border-radius: 0.15em;
        }

        > h1 {
            @include font(600, 0.8em);
            margin-top: 0.25em;
            line-height: 1.25em;
        }

        .channel {
            @include flex(row, center);
            @include font(600, 0.8em);
            margin-top: 0.25em;

            > i {
                color: $palette-cloud-blue;
                font-size: 0.7em;
                margin-left: 0.5em;
            }
        }
    }

</style>
