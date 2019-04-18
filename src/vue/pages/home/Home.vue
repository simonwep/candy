<template>
    <div class="home">
        <span>Coming soon</span>
    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    export default {

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
            }).then(res => this.videos = res);
        }
    };

</script>

<style lang="scss" scoped>

    .home {
        @include flex(row, center, center);
        @include font(600, 1.5em);
        color: $palette-theme-secondary;
    }

</style>
