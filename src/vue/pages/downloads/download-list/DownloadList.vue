<template>
    <div class="download-list">

        <template v-if="downloads.length">

            <!-- Header -->
            <div class="header">
                <p>Downloads</p>

                <div :class="{actions: 1, visible: someInProgress || somePaused}">
                    <button class="action-red" @click="cancelAll">Cancel all</button>
                    <button class="action-orange" @click="pauseOrResumeAll">
                        {{ somePaused ? 'Resume all' : 'Pause all' }}
                    </button>
                </div>
            </div>

            <!-- Download list -->
            <div class="list">
                <download-item v-for="download of downloads"
                               :key="download.id"
                               :card-size="cardSize"
                               :download="download"/>
            </div>
        </template>


        <p v-else class="placeholder">
            Currently no downloads active.
        </p>
    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    // IPC Client
    import ipcClient from '../../../ipc/client';

    // Components
    import DownloadItem from './DownloadListItem';

    export default {
        components: {DownloadItem},

        props: {
            cardSize: {type: String, default: 'big'}
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['downloads']),

            somePaused() {
                return this.downloads.find(v => v.status === 'paused');
            },

            someInProgress() {
                return this.downloads.find(v => v.status === 'progress');
            }
        },

        methods: {

            cancelAll() {

                // Warn user
                this.$store.commit('dialogbox/show', {
                    title: 'Cancelling all downlaods',
                    text: 'Do you really want to cancel all downloads?',
                    buttons: [
                        {type: 'cancel', text: 'Cancel'},
                        {type: 'accept', text: 'Okay'}
                    ],
                    onResolve: index => {
                        if (index) {
                            for (const {id: downloadId} of this.downloads) {
                                ipcClient.request('cancelDownload', {downloadId});
                            }
                        }
                    }
                });
            },

            pauseOrResumeAll() {
                const action = this.somePaused ? 'resumeDownload' : 'pauseDownload';
                for (const {id: downloadId} of this.downloads) {
                    ipcClient.request(action, {downloadId});
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .download-list {
        @include flex(column);
        height: 100%;
    }

    .header {
        @include flex(row, center);
        flex-shrink: 0;
        margin: 1em 1em 0.5em;
        padding-bottom: 0.5em;
        border-bottom: 2px solid $palette-theme-secondary;

        > p {
            @include font(600, 1em);
            color: $palette-snow-white;
        }

        .actions {
            margin-left: auto;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;

            &.visible {
                visibility: visible;
                opacity: 1;
            }
        }
    }

    .list {
        @include flex(column);
        flex-shrink: 1;
        width: 100%;
        overflow-y: auto;

        .download-item {
            margin: 0.5em 1em;
            flex-shrink: 0;
        }
    }

    .placeholder {
        @include font(400, 1.1em);
        margin: auto;
        color: $palette-snow-white;
    }

</style>
