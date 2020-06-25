<template>
    <div :data-card-size="cardSize" class="download-item">
        <!-- Colored status bar -->
        <div :data-status="download.status" class="status-bar">
            <i v-if="download.status === 'progress'" class="fas fa-fw fa-angle-down"></i>
            <i v-else-if="download.status === 'finish'" class="fas fa-fw fa-check"></i>
            <i v-else-if="download.status === 'convert'" class="fas fa-fw fa-cog"></i>
            <i v-else-if="download.status === 'cancelled'" class="fas fa-fw fa-eject"></i>
            <i v-else-if="download.status === 'errored'" class="fas fa-fw fa-times"></i>
            <i v-else-if="download.status === 'paused'" class="fas fa-fw fa-pause-circle"></i>
            <div></div>
        </div>

        <!-- Video info -->
        <img :src="download.video.thumbnail"
             alt="Thumbnail"
             class="thumbnail">

        <div class="video-info">
            <h1>{{ download.video.videoDetails.title }}</h1>
            <p><span v-for="(source, index) of download.sources" :key="index">{{ source.bitrate || source.resolution }}</span></p>
        </div>

        <!-- Download progress -->
        <div class="progress">
            <div class="info-text">
                <span v-if="download.status === 'progress'">
                    <b>{{ prettyBytes(download.progress) }}</b>
                    /
                    <b>{{ prettyBytes(download.size) }} ({{ percentualProgress }}) - </b>
                </span>

                <b>{{ statusText }}</b>

                <b v-if="download.status === 'finish'"> - Took {{ downloadDuration }}</b>
            </div>

            <div :data-status="download.status" class="progress-bar">
                <div v-if="download.status !== 'cancelled'" :style="{width: `${(download.progress / download.size) * 100}%`}"></div>
            </div>
        </div>

        <!-- Actions -->
        <div class="actions">
            <template v-if="['progress', 'paused'].includes(download.status)">
                <button class="action-red" @click="cancelDownload">
                    Cancel
                </button>
                <button class="action-orange" @click="pauseOrResumeDownload">
                    {{ download.status === 'paused' ? 'Resume' : 'Pause' }}
                </button>
            </template>

            <template v-if="download.status === 'finish'">
                <button class="afterward" @click="openDestinationDirectory">
                    <i class="fas fa-fw fa-folder-open"></i>
                </button>
                <button class="afterward" @click="openDestinationFile">
                    <i class="fas fa-fw fa-play-circle"></i>
                </button>
            </template>

            <template v-if="['errored', 'cancelled'].includes(download.status)">
                <button class="action-blue" @click="retryDownload">
                    Retry
                </button>
            </template>
        </div>
    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../../ipc';

    // Electron stuff
    import {shell} from 'electron';

    import prettyBytes from 'pretty-bytes';

    export default {

        props: {
            download: {type: Object, required: true},
            cardSize: {
                default: 'big',
                validator(v) {
                    return typeof v === 'string' && ['big', 'mid'].includes(v);
                }
            }
        },

        data() {
            return {};
        },

        computed: {

            statusText() {
                switch (this.download.status) {
                    case 'progress':
                        return 'Downloading...';
                    case 'finish':
                        return 'Done!';
                    case 'convert':
                        return 'Converting...';
                    case 'errored':
                        return 'Ooops, try again later.';
                    case 'cancelled':
                        return 'Download cancelled.';
                    case 'paused':
                        return 'Download paused.';
                }

                return 'Unknown';
            },

            percentualProgress() {
                const {size, progress} = this.download;
                return `${Number(((progress / size) * 100).toFixed(1)) || 0}%`;
            },

            downloadDuration() {
                const {startTimestamp, endTimestamp} = this.download;
                return `${Math.round((endTimestamp - startTimestamp) / 1000)}s`;
            }
        },

        methods: {
            prettyBytes,

            cancelDownload() {
                ipcClient.request('cancelDownload', {downloadId: this.download.id});
            },

            pauseOrResumeDownload() {
                const {download} = this;
                ipcClient.request(
                    download.status === 'paused' ? 'resumeDownload' : 'pauseDownload',
                    {downloadId: download.id}
                );
            },

            retryDownload() {
                ipcClient.request('retryDownload', {downloadId: this.download.id});
            },

            openDestinationDirectory() {
                shell.showItemInFolder(this.download.destinationFile);
            },

            openDestinationFile() {
                shell.openItem(this.download.destinationFile);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .download-item {
        @include flex(row, center);
        background: $palette-theme-primary;
        padding: 0.5em;
        border-radius: 0.15em;
        box-shadow: 0 0.1em 0.5em rgba(black, 0.1);

        @include animate('0.15s ease-in-out') {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        &[data-card-size='mid'] {
            .thumbnail,
            .status-bar > div {
                display: none;
            }

            .status-bar {
                justify-content: center;

                i {
                    margin: 0;
                }
            }
        }
    }

    .status-bar {
        @include flex(column, center);
        align-self: stretch;

        > div {
            flex-grow: 1;
            background: $palette-theme-tertiary;
            border-radius: 100em;
            width: 5px;
            transition: all 0.3s;
        }

        > i {
            flex-shrink: 0;
            font-size: 0.7em;
            margin-bottom: 0.5em;
            transition: all 0.3s;
            color: $palette-theme-tertiary;

            &.fa-check {
                margin-left: 0.1em;
            }
        }

        &[data-status='progress'],
        &[data-status='paused'] {
            > div {
                background: $palette-nature-orange;
            }

            i {
                color: $palette-nature-orange;
            }
        }

        &[data-status='convert'] {
            > div {
                background: $palette-turquoise;
            }

            i {
                color: $palette-turquoise;

                @include animate('2s linear infinite') {
                    to {
                        transform: rotate(360deg);
                    }
                }
            }
        }

        &[data-status='errored'] {
            > div {
                background: $palette-bright-red;
            }

            i {
                color: $palette-bright-red;
            }
        }

        &[data-status='finish'] {
            > div {
                background: $palette-success-green;
            }

            i {
                color: $palette-success-green;
            }
        }
    }

    .thumbnail {
        height: 4em;
        border-radius: 0.15em;
        margin-left: 0.5em;
    }

    .video-info {
        @include flex(column);
        width: 30%;
        color: $palette-snow-white;
        margin-left: 1em;
        line-height: 1.3em;

        > h1 {
            @include font(600, 0.85em);
            @include white-space-overflow();
        }

        > p {
            @include font(600, 0.75em);

            span:not(:last-child)::after {
                content: '/';
                display: inline-block;
                margin: 0 0.25em;
            }
        }
    }

    .progress {
        @include flex(column, center, center);
        flex-grow: 1;
        margin-left: 1em;

        .info-text {
            text-align: center;
            font-size: 0.75em;
            margin-bottom: 0.5em;
            color: $palette-snow-white;

            b {
                font-weight: 600;
            }

            &.cancelled {
                @include font(600, 0.8em);
                color: $palette-theme-secondary;
            }
        }

        .progress-bar {
            @include size(100%, 5px);
            position: relative;
            background: $palette-theme-tertiary;
            border-radius: 5em;
            overflow: hidden;

            > div {
                position: absolute;
                height: 100%;
                background: $palette-nature-orange;
                transition: all 0.3s;
            }

            &.done > div {
                background: $palette-success-green;
            }

            &[data-status='progress'] > div {
                background: $palette-nature-orange;
            }

            &[data-status='convert'] > div {
                background: $palette-turquoise;
            }

            &[data-status='errored'] > div {
                background: $palette-bright-red;
            }

            &[data-status='finish'] > div {
                background: $palette-success-green;
            }
        }
    }

    .actions {
        @include flex(row, center);
        margin: 0 1.25em 0 1.25em;

        button.afterward {
            @include size(2.5em);
            padding: 0;
            border-radius: 100%;
            color: rgba($palette-snow-white, 0.75);
            border: 1px solid rgba($palette-snow-white, 0.75);
            font-size: 0.8em;
            transition: all 0.3s;

            &:hover {
                color: $palette-turquoise;
                border-color: $palette-turquoise;
            }

            &:not(:last-child) {
                margin-right: 0.75em;
            }
        }
    }

</style>
