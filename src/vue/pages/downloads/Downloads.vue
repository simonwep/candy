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
        </div>

        <!-- Video info -->
        <download-box v-if="videoStats" :video="videoStats"/>

        <!-- Download list -->
        <download-list/>

    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Components
    import DownloadBox  from './download/DownloadBox';
    import DownloadList from './download-list/DownloadList';

    export default {

        components: {DownloadBox, DownloadList},

        data() {
            return {
                videoStats: null
            };
        },

        mounted() {
            this.checkAvailableDownload({target: {value: 'https://www.youtube.com/watch?v=p_8yK2kmxoo'}});
        },

        methods: {

            checkAvailableDownload({target: {value}}) {

                // Validate url
                const match = value.match(/^((https?):\/\/www\.youtube.com\/watch\?v=.*?)(&|$)/);
                if (match && match[1]) {
                    ipcClient.request('getVideoInfo', match[1]).then(res => {
                        this.videoStats = res;
                    });
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
    }

    .download-box {
        margin-top: 1px;

    }

</style>
