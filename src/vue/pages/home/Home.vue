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
                videos: null,
                loading: false
            };
        },

        mounted() {
            this.loading = true;
            ipcClient.request('getSettings').then(res => {
                const {homeVideoChannels} = res;
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
