<template>
    <div class="download-item" :data-card-size="cardSize">

        <!-- Colored status bar -->
        <div class="status-bar" :data-status="download.status">
            <i v-if="download.status === 'progress'" class="fas fa-fw fa-angle-down"></i>
            <i v-else-if="download.status === 'finish'" class="fas fa-fw fa-check"></i>
            <i v-else-if="download.status === 'convert'" class="fas fa-fw fa-cog"></i>
            <i v-else-if="download.status === 'errored'" class="fas fa-fw fa-times"></i>
            <div></div>
        </div>

        <!-- Video info -->
        <img class="thumbnail" :src="download.video.thumbnailUrl" alt="Thumbnail">
        <h1 class="title">{{ download.video.title }}</h1>

        <!-- Download progress -->
        <div class="progress">
            <p>
                <b>{{ utils.readableByteCount(download.progress) }}</b> /
                <b>{{ utils.readableByteCount(download.size) }}</b>
            </p>

            <div class="progress-bar" :data-status="download.status">
                <div :style="{width: `${(download.progress / download.size) * 100}%`}"></div>
            </div>
        </div>


    </div>
</template>

<script>

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

        > p {
            font-size: 0.75em;
            margin-bottom: 0.5em;
            color: white;

            b {
                font-weight: 600;
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


</style>
