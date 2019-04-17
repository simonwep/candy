<template>
    <div class="downloads">

        <!-- Header with url - input field -->
        <div class="header">

            <div class="url-input">
                <i class="fas fa-fw fa-search"></i>
                <input placeholder="Enter video or playlist url"
                       type="text"
                       @input="checkAvailableDownload">
            </div>

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

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Components
    import DownloadList from './download-list/DownloadList';
    import DownloadCard from './DownloadCard';

    export default {

        components: {DownloadCard, DownloadList},

        data() {
            return {
                video: null,
                playlist: null,
                viewType: 'big'
            };
        },

        methods: {

            checkAvailableDownload({target: {value}}) {
                const {isValid, playlistId, videoId} = this.utils.resolveYouTubeUrl(value);

                // TODO Ask user if both is detected
                if (!isValid) {
                    return this.video = this.playlist = null;
                } else if (videoId) {
                    this.type = 'video';
                    ipcClient.request('getVideoInfo', videoId).then(res => this.video = res);
                } else if (playlistId) {
                    this.type = 'playlist';
                    this.$store.dispatch('youtube/resolvePlaylist', {playlistId}).then(res => this.playlist = res);
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
        @include flex(row, center, space-between);
        flex-shrink: 0;
        background: $palette-theme-secondary;
        padding: 1em 2em;

        .url-input {
            @include flex(row, center);
            @include width(50vw, auto, 30em);
            background: $palette-theme-tertiary;
            padding: 0.5em 0.75em;
            border-radius: 0.1em;
            color: white;

            &:focus-within i {
                color: white;
            }

            > i {
                font-size: 0.75em;
                margin-right: 0.75em;
                transition: all 0.3s;
                color: rgba(white, 0.6);
            }

            > input {
                font-family: 'Source Sans Pro';
                flex-grow: 1;
                @include font(400, 0.9em);

                &::placeholder {
                    color: rgba(white, 0.6);
                }
            }
        }

        .views {
            @include flex(row, center);
            margin-left: auto;
            align-self: stretch;
            border-radius: 0.15em;
            overflow: hidden;

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

                &:not(:first-child) {
                    border-left: none;
                }

                &.active {
                    background: $palette-cloud-blue;
                    border-color: $palette-cloud-blue;
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
