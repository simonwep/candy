<template>
    <div class="home">

        <video-snippet-card v-for="video of videos" :video="video"/>

    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Components
    import VideoSnippetCard from './VideoSnippetCard';

    export default {
        components: {VideoSnippetCard},

        data() {
            return {
                videos: null
            };
        },

        mounted() {
            ipcClient.request('getSettings').then(res => {
                const {homeVideoChannels} = res;
                return this.$store.dispatch('youtube/latestVideosBy', {
                    channelIds: homeVideoChannels
                });
            }).then(res => {
                this.videos = res;
            });
        }
    };

</script>

<style lang="scss" scoped>

    .home {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
        grid-gap: 1.5em;
        padding: 2em;
        overflow-y: auto;
        height: 100%;
    }

</style>
