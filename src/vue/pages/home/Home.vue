<template>
    <div class="home">

        <!-- Centered loading screen -->
        <div v-if="loading" class="loading-screen">
            <h1>Fetching latest videos, hang on...</h1>
            <folding-rectangles/>
        </div>

        <!-- Video cards -->
        <video-snippet-card v-for="video of videos" :video="video"/>
    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Components
    import FoldingRectangles from '../../ui/spinner/FoldingRectangles';
    import VideoSnippetCard  from './VideoSnippetCard';

    export default {
        components: {FoldingRectangles, VideoSnippetCard},

        data() {
            return {
                videos: [],
                channels: [],
                loading: false
            };
        },

        watch: {
            async $route(to) {
                if (to.name === 'home') {
                    const {channels} = this;
                    const {homeVideoChannels} = await ipcClient.request('getSettings');

                    if (homeVideoChannels.toString() !== channels.toString()) {
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
                this.videos = [];

                ipcClient.request('getSettings').then(res => {
                    const {homeVideoChannels} = res;
                    this.channels = [...homeVideoChannels];

                    return this.$store.dispatch('youtube/latestVideosBy', {
                        channelIds: homeVideoChannels
                    });
                }).then(res => {
                    this.videos = res;
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
        position: relative;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
        grid-gap: 1.5em;
        padding: 2em;
        overflow-y: auto;
        height: 100%;

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
    }

</style>
