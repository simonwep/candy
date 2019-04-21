<template>
    <div class="home">

        <!-- Centered loading screen -->
        <div v-if="loading" class="loading-screen">
            <h1>Fetching latest videos, hang on...</h1>
            <folding-rectangles/>
        </div>

        <p v-if="!channelIds.length" class="placeholder">
            Empty here huh? Go to
            <router-link to="/settings">settings</router-link>
            to add
            channels
        </p>

        <!-- Video cards -->
        <div v-if="channelIds.length && !loading" class="video-snippets">
            <h1>You subscribed to {{ channelIds.length }} channels</h1>

            <div v-for="channel of channels" class="channel">
                <h1>{{ channel.info.title }}</h1>

                <div class="videos">
                    <video-snippet-card v-for="video of channel.videos" :video="video"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Components
    import FoldingRectangles from '../../ui/spinner/FoldingRectangles';
    import BrowserLink       from '../../ui/specific/BrowserLink';
    import VideoSnippetCard  from './VideoSnippetCard';

    export default {
        components: {FoldingRectangles, BrowserLink, VideoSnippetCard},

        data() {
            return {
                channels: [],
                channelIds: [],
                loading: false
            };
        },

        watch: {
            async $route(to) {
                if (to.name === 'home') {
                    const {channelIds} = this;
                    const {homeVideoChannels} = await ipcClient.request('getSettings');

                    if (homeVideoChannels.toString() !== channelIds.toString()) {
                        this.refreshVideoCards();
                    }
                }
            }
        },

        mounted() {
            this.refreshVideoCards();
        },

        methods: {

            refreshVideoCards() {
                this.loading = true;
                this.channels = [];

                ipcClient.request('getSettings').then(res => {
                    const {homeVideoChannels} = res;
                    this.channelIds = [...homeVideoChannels];

                    return this.$store.dispatch('youtube/latestVideosBy', {
                        channelIds: homeVideoChannels
                    });
                }).then(res => {
                    this.channels = res;
                }).catch(() => {
                    this.$store.commit('dialogbox/show', {
                        type: 'error',
                        title: 'Whoops',
                        text: 'Cannot fetch latetest videos. Try again alter',
                        buttons: [
                            {type: 'accept', text: 'Okay'}
                        ]
                    });
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .home {
        @include flex(row, center, center);
        position: relative;
        height: 100%;
    }

    .loading-screen {
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        position: absolute;
        margin: auto;
        z-index: 100;

        @include animate('0.15s ease-in-out') {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        > h1 {
            @include font(600, 1em);
            color: $palette-turquoise;
            margin-bottom: 1em;
        }
    }

    .placeholder {
        @include font(400, 1.1em);
        color: $palette-snow-white;
    }

    .video-snippets {
        @include flex(column);
        @include size(100%);
        flex-shrink: 0;
        padding: 2em;
        overflow-y: auto;

        > h1 {
            @include font(600, 1.2em);
            color: $palette-snow-white;
            border-bottom: 2px solid $palette-theme-secondary;
            padding-bottom: 0.5em;
            margin-bottom: 0.75em;
        }

        .channel {
            @include flex(column);
            position: relative;
            margin-bottom: 2em;
            min-height: 15em;


            > h1 {
                @include font(600, 0.95em);
                color: $palette-snow-white;
                margin-bottom: 0.5em;
            }

            .videos {
                @include flex(row);
                overflow: auto visible;
                padding-bottom: 0.5em;

                .video-snippet-card {
                    min-width: 10em;
                    margin-right: 0.5em;
                }
            }

            &::after {
                @include pseudo();
                @include position(0, 0, 0.5em, auto);
                @include size(auto, 5em);
                background: linear-gradient(to left, $palette-theme-tertiary, transparent);
            }
        }
    }

</style>
