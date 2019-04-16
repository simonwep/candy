<template>
    <div :data-card-size="cardSize" class="download-item">

        <!-- Colored status bar -->
        <div :data-status="download.status" class="status-bar">
            <i class="fas fa-fw fa-angle-down" v-if="download.status === 'progress'"></i>
            <i class="fas fa-fw fa-check" v-else-if="download.status === 'finish'"></i>
            <i class="fas fa-fw fa-cog" v-else-if="download.status === 'convert'"></i>
            <i class="fas fa-fw fa-eject" v-else-if="download.status === 'cancelled'"></i>
            <i class="fas fa-fw fa-times" v-else-if="download.status === 'errored'"></i>
            <div></div>
        </div>

        <!-- Video info -->
        <img :src="download.video.thumbnailUrl" alt="Thumbnail" class="thumbnail">
        <h1 class="title">{{ download.video.title }}</h1>

        <!-- Download progress -->
        <div class="progress">

            <div class="info-text">
                <span v-if="download.status === 'progress'">
                    <b>{{ utils.readableByteCount(download.progress) }}</b>
                    /
                    <b>{{ utils.readableByteCount(download.size) }} ({{ percentualProgress }}</b>
                    at
                    <b>{{ downloadSpeed }})</b> -
                </span>

                <b>{{ statusText }}</b>

                <b v-if="download.status === 'finish'"> - Took {{ downloadDuration }}</b>
            </div>

            <div :data-status="download.status" class="progress-bar">
                <div :style="{width: `${(download.progress / download.size) * 100}%`}" v-if="download.status !== 'cancelled'"></div>
            </div>
        </div>

        <!-- Actions -->
        <div class="actions">
            <button @click="cancelDownload" class="cancel" v-if="download.status === 'progress'">Cancel</button>
        </div>

    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../../ipc/client';

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
                }
            },

            percentualProgress() {
                const {size, progress} = this.download;
                return `${Number(((progress / size) * 100).toFixed(1)) || 0}%`;
            },

            downloadDuration() {
                const {startTimestamp, endTimestamp} = this.download;
                return `${Math.round((endTimestamp - startTimestamp) / 1000)}s`;
            },

            downloadSpeed() {
                return this.utils.readableByteCount(this.download.speed).toLowerCase() + 'ps';
            }
        },

        data() {
            return {};
        },

        methods: {

            cancelDownload() {
                ipcClient.request('cancelDownload', {downloadId: this.download.id});
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

        &[data-status='progress'] {
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
        width: 5em;
        border-radius: 0.15em;
        margin-left: 0.5em;
    }

    .title {
        @include font(600, 0.75em);
        width: 30%;
        color: white;
        margin-left: 1em;
        line-height: 1.3em;
    }

    .progress {
        @include flex(column, center, center);
        flex-grow: 1;
        margin-left: 1em;

        .info-text {
            text-align: center;
            font-size: 0.75em;
            margin-bottom: 0.5em;
            color: white;

            b {
                font-weight: 600;
            }

            &.cancelled {
                @include font(600, 0.8em);
                color: $palette-theme-secondary;
            }
        }

        .progress-bar {
            @include size(5px, 100%);
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
        margin: 0 1.25em 0 2em;

        button {
            @include font(600, 0.75em);
            padding: 0.5em 1em;
            border: 1px solid $palette-theme-tertiary;
            transition: all 0.3s;
            color: $palette-theme-tertiary;
            border-radius: 0.15em;

            &.cancel {
                color: $palette-bright-red;
                border-color: $palette-bright-red;

                &:hover {
                    background: $palette-bright-red;
                    color: $palette-theme-tertiary;
                }
            }
        }
    }

</style>
