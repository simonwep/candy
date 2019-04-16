<template>
    <div class="downloads">

        <!-- Header with url - input field -->
        <div class="header">

            <div class="url-input">
                <i class="fas fa-fw fa-search"></i>
                <input type="text"
                       placeholder="Enter video or playlist url"
                       @input="checkAvailableDownload">
            </div>

            <div class="views">

                <div :class="{active: viewType === 'big'}" @click="viewType = 'big'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11">
                        <rect y="6" width="11" height="5"></rect>
                        <rect width="11" height="5"></rect>
                    </svg>
                </div>

                <div :class="{active: viewType === 'mid'}" @click="viewType = 'mid'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 11">
                        <rect y="8" width="11" height="3"></rect>
                        <rect width="11" height="3"></rect>
                        <rect y="4" width="11" height="3"></rect>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Video info -->
        <download-form v-if="videoStats" :video="videoStats"/>

        <!-- Download list -->
        <download-list :card-size="viewType"/>

    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Components
    import DownloadForm from './download-form/DownloadForm';
    import DownloadList from './download-list/DownloadList';

    export default {

        components: {DownloadForm, DownloadList},

        data() {
            return {
                videoStats: null,
                viewType: 'big'
            };
        },

        methods: {

            checkAvailableDownload({target: {value}}) {

                // TODO: Hard-coded youtube video- and playlistid's
                // Check if value conforms to a video- or playlistid
                if (value.match(/^[\w\d_-]+$/)) {
                    value = `https://www.youtube.com/${value.length < 12 ? 'watch?v=' : 'playlist?list=$'}${value}`;
                }

                // Validate url
                const match = value.match(/^((https?):\/\/www\.youtube.com\/watch\?v=.*?)(&|$)/);
                if (match && match[1]) {
                    ipcClient.request('getVideoInfo', match[1]).then(res => {
                        this.videoStats = res;
                    });
                } else {
                    this.videoStats = null;
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

    .download-form {
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
