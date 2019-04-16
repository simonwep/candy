<template>
    <section class="video-summary">

        <!-- Thumbnail and duration -->
        <div class="thumnail">
            <img :src="video.thumbnail_url" alt="Thumbnail">
            <span class="duration">{{ utils.formatSeconds(Number(video.length_seconds)) }}</span>
        </div>


        <!-- Video details -->
        <div class="video-details">
            <h1>{{ video.title }}</h1>

            <p class="date">Published on the {{ utils.formatDate('DD. MMMM YYYY', video.published) }}</p>

            <div class="author">
                <img :src="video.author.avatar" alt="Avatar">

                <div class="channel">
                    <p class="name">{{ video.author.name }}</p>
                    <i class="fas fa-fw fa-check" v-if="video.author.verified"></i>
                </div>
            </div>
        </div>
    </section>
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

    .video-summary {
        @include flex(row, flex-start, flex-start);
        color: white;

        .thumnail {
            position: relative;

            img {
                border-radius: 0.15em;
            }

            .duration {
                position: absolute;
                @include position(auto, 0.5em, 0.75em, auto);
                @include font(400, 0.75em);
                padding: 0.15em 0.4em 0.1em;
                border-radius: 0.15em;
                background: $palette-theme-primary;
                box-shadow: 0 1px 3px rgba(black, 0.2);
                color: white;
            }
        }

        .video-details {
            @include flex(column);
            margin-left: 0.75em;

            p {
                @include font(600, 0.8em);
            }

            h1 {
                @include font(400, 0.95em);
            }

            .date {
                font-size: 0.75em;
                margin: 0.45em 0 0.75em;
            }

            .author {
                @include flex(row, flex-start);

                > img {
                    border-radius: 0.15em;
                    margin-right: 0.5em;
                    @include size(2em);
                }

                .channel {
                    @include flex(row, center);

                    i {
                        color: $palette-cloud-blue;
                        font-size: 0.6em;
                        margin-left: 0.5em;
                    }
                }
            }
        }
    }

</style>
