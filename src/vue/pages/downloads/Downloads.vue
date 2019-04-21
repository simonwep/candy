<template>
    <div class="downloads">

        <!-- Header with url - input field -->
        <div class="header">

            <!-- Url input -->
            <div class="url-input">
                <i class="fas fa-fw fa-search"></i>
                <input v-model="input"
                       placeholder="Enter video, playlist or channel url / id"
                       type="text"
                       @input="checkDownloadAvailability">
            </div>

            <!-- Choose between video and audio if both avaiable -->
            <div v-if="videoAndPlaylist && !loading" class="recognition-type">
                <button :class="{active: type === 'video'}" @click="chooseType('video')">Video</button>
                <button :class="{active: type === 'playlist'}" @click="chooseType('playlist')">Playlist</button>
            </div>

            <!-- Loading spinner -->
            <dual-ring-spinner v-if="loading"/>

            <!-- Different view buttons -->
            <div class="views">
                <div :class="{active: viewType === 'big'}" @click="viewType = 'big'">
                    <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
                        <rect height="5"
                              width="11"
                              y="6"></rect>
                        <rect height="5" width="11"></rect>
                    </svg>
                </div>

                <div :class="{active: viewType === 'mid'}" @click="viewType = 'mid'">
                    <svg viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
                        <rect height="3"
                              width="11"
                              y="8"></rect>
                        <rect height="3" width="11"></rect>
                        <rect height="3"
                              width="11"
                              y="4"></rect>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Download card -->
        <download-card v-if="video || playlist"
                       :video="video"
                       :playlist="playlist"/>

        <!-- Download list -->
        <download-list :card-size="viewType"/>

    </div>
</template>

<script>

    // IPC Client and electron stuff
    import ipcClient   from '../../ipc/client';
    import {clipboard} from 'electron';

    // Components
    import DualRingSpinner from '../../ui/spinner/DualRingSpinner';
    import DownloadList    from './download-list/DownloadList';
    import DownloadCard    from './DownloadCard';

    export default {

        components: {DualRingSpinner, DownloadCard, DownloadList},

        data() {
            return {
                input: '',
                video: null,
                playlist: null,
                loading: false,

                videoAndPlaylist: false,
                type: null,

                viewType: 'big',

                clipboardInterval: null
            };
        },

        watch: {
            $route(to) {
                if (to.name === 'downloads') {
                    this.input = to.query.id || '';

                    if (this.input) {
                        this.checkDownloadAvailability();
                    }
                }
            }
        },

        mounted() {

            let lastText = null;
            this.clipboardInterval = setInterval(() => {
                const text = clipboard.readText();

                if (text !== lastText) {

                    // Validate content
                    if (this.utils.resolveYouTubeUrl(text).isValid) {
                        this.checkDownloadAvailability(text);
                    }

                    lastText = text;
                }
            }, 500);
        },

        destroyed() {
            clearInterval(this.clipboardInterval);
        },

        methods: {

            chooseType(type) {
                if (this.type !== type) {
                    this.type = type;
                    this.checkDownloadAvailability();
                }
            },

            checkDownloadAvailability(content = null) {
                content = typeof content === 'string' && content;
                const {input, type} = this;

                let {playlistId, videoId, channelId, isValid} = this.utils.resolveYouTubeUrl(content || input);
                this.videoAndPlaylist = videoId && playlistId;

                if (!isValid) {
                    return;
                }

                // Check if it's valid and the user choosed a type if both are available
                if (this.videoAndPlaylist) {
                    if (type === 'video') {
                        playlistId = null;
                    } else if (type === 'playlist') {
                        videoId = null;
                    }
                }

                // Shorthand to show an error dialog
                const err = title => {
                    if (!content) {
                        this.video = this.playlist = null;
                        this.$store.commit('dialogbox/show', {
                            type: 'error',
                            title,
                            text: 'Be sure to have an active internet connection, entered a valid video id and the video itself is public.',
                            buttons: [
                                {type: 'accept', text: 'Okay'}
                            ]
                        });
                    }
                };

                if (videoId) {
                    this.type = this.type || 'video';
                    ipcClient.request('getVideoInfo', videoId).then(res => {
                        this.video = res;
                        this.playlist = null;
                        content && (this.input = content);
                    }).catch(() => err('Can\'t fetch video details')).finally(() => this.loading = false);
                } else if (playlistId) {
                    this.type = this.type || 'playlist';
                    this.$store.dispatch('youtube/resolvePlaylist', {playlistId}).then(res => {
                        this.playlist = res;
                        this.video = null;
                        content && (this.input = content);
                    }).catch(() => err('Can\'t fetch playlist videos')).finally(() => this.loading = false);
                } else if (channelId) {
                    this.type = 'channel';
                    this.$store.dispatch('youtube/resolveChannelVideos', {channelId}).then(res => {
                        this.playlist = res;
                        this.video = null;
                        content && (this.input = content);
                    }).catch(() => err('Can\'t fetch channel videos')).finally(() => this.loading = false);
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .downloads {
        position: relative;
        @include flex(column);
        border-left: 1px solid $palette-theme-tertiary;
    }

    .header {
        @include flex(row, center, flex-start);
        flex-shrink: 0;
        background: $palette-theme-secondary;
        padding: 1em 2em;

        .url-input {
            @include flex(row, center);
            @include width(50vw, auto, 30em);
            background: $palette-theme-tertiary;
            padding: 0.5em 0.75em;
            border-radius: 0.15em;
            color: $palette-snow-white;

            &:focus-within i {
                color: $palette-snow-white;
            }

            > i {
                font-size: 0.75em;
                margin-right: 0.75em;
                transition: all 0.3s;
                color: rgba($palette-snow-white, 0.6);
            }

            > input {
                font-family: 'Source Sans Pro';
                flex-grow: 1;
                @include font(400, 0.9em);

                &::placeholder {
                    color: rgba($palette-snow-white, 0.6);
                }
            }
        }

        .recognition-type {
            @include flex(row, center);
            align-self: stretch;
            margin-left: 0.5em;
            border-radius: 0.15em;
            transition: all 0.3s;
            overflow: hidden;
            flex-shrink: 0;

            @include animate('0.25s ease-in-out forwards') {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            button {
                @include font(600, 0.9em);
                padding: 0.25em 0.75em;
                align-self: stretch;
                color: $palette-theme-secondary;
                background: $palette-theme-tertiary;
                transition: all 0.3s;
                flex-shrink: 0;

                &.active {
                    background: $palette-cloud-blue;
                    align-self: stretch;
                    color: $palette-snow-white;
                }

                &:not(.active):hover {
                    filter: brightness(1.1);
                }
            }
        }

        .dual-ring-spinner {
            align-self: stretch;
            @include size(2em);
            margin-left: 0.5em;
        }

        .views {
            @include flex(row, center);
            margin-left: auto;
            align-self: stretch;
            flex-shrink: 0;

            &:before {
                content: '';
                margin-left: 0.5em;
            }

            svg {
                @include size(16px);
                fill: $palette-theme-tertiary;
                transition: all 0.3s;
            }

            > div {
                @include flex(row, center, center);
                @include size(100%, 2.5em);
                transition: all 0.3s;
                cursor: pointer;
                border: 1px solid $palette-theme-tertiary;

                &:first-child {
                    border-radius: 0.15em 0 0 0.15em;
                }

                &:last-child {
                    border-radius: 0 0.15em 0.15em 0;
                }

                &.active {
                    background: $palette-cloud-blue;
                    border-color: $palette-cloud-blue;

                    svg {
                        fill: $palette-snow-white;
                    }
                }
            }
        }
    }

    .download-card {
        flex-shrink: 0;
        margin-top: 1px;

        @include animate('0.3s ease-in-out') {
            from {
                opacity: 0;
                transform: translateY(-0.1em);
            }
            to {
                opacity: 1;
                transform: none;
            }
        }
    }

    .download-list {
        overflow: auto;
    }

</style>
