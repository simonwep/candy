<template>
    <div class="settings">

        <!-- All string based settings -->
        <section class="paths">
            <h1>Paths</h1>

            <div class="field">
                <text-input-field v-model="current.downloadDirectory" placeholder="Download path"/>
                <button class="action-green" @click="openFolder(current.downloadDirectory)">Open Folder</button>
            </div>

            <div class="field">
                <text-input-field v-model="current.temporaryDirectory" placeholder="Temporary path"/>
                <button class="action-green" @click="openFolder(current.temporaryDirectory)">Open Folder</button>
            </div>

            <button :class="{visible: hasChanged}" @click="applySettings">Apply</button>
        </section>

        <!-- All boolean based settings -->
        <section class="checkboxes">
            <h1>General</h1>

            <div class="item">
                <checkbox v-model="current.createChannelDirectory"/>
                <span>Create a directory for each channel.</span>
            </div>

            <div class="item">
                <checkbox v-model="current.createPlaylistDirectory"/>
                <span>Create a direcotry with playlist's name.</span>
            </div>

            <!-- TODO: Implement -->
            <!--<div class="item">
                <checkbox v-model="current.lockDownloadSettings"/>
                <span>Remember last download settings and apply these to the next one.</span>
            </div>-->

            <button :class="{visible: hasChanged}" @click="applySettings">Apply</button>
        </section>

        <section class="front-page">
            <h1>Frontpage</h1>

            <!-- Edit shown channels -->
            <h3>Channels which should be shown on your front-page</h3>
            <tag-input-field v-model="current.homeVideoChannels"
                             placeholder="Add channel id"/>

            <button :class="{visible: hasChanged}" @click="applySettings">Apply</button>
        </section>

    </div>
</template>

<script>

    // IPC Client
    import ipcClient from '../../ipc/client';

    // Electron stuff
    import {shell} from 'electron';

    // UI Components
    import Checkbox       from '../../ui/input/Checkbox';
    import TagInputField  from '../../ui/input/TagInputField';
    import TextInputField from '../../ui/input/TextInputField';

    export default {

        components: {Checkbox, TagInputField, TextInputField},

        data() {
            return {
                original: {},
                current: {
                    createPlaylistDirectory: false,
                    createChannelDirectory: false,
                    deleteDownloadEntriesIfDone: false,
                    downloadDirectory: null,
                    temporaryDirectory: null,
                    lockDownloadSettings: false,
                    homeVideoChannels: []
                }
            };
        },

        computed: {

            hasChanged() {
                const {original, current} = this;

                for (const [prop, value] of Object.entries(original)) {
                    if (current[prop] !== value) {
                        return true;
                    }
                }

                return false;
            }
        },

        mounted() {
            this.fetchSettings();
        },

        methods: {

            applySettings() {
                const {current} = this;

                ipcClient.request('applySettings', current)
                    .then(this.fetchSettings)
                    .catch(() => {

                        // Show error dialog
                        this.$store.commit('dialogbox/show', {
                            type: 'error',
                            title: 'Whoops',
                            text: 'Failed to save settings, be sure to enter a valid path.',
                            buttons: [
                                {type: 'accept', text: 'Okay'}
                            ]
                        });
                    });
            },

            fetchSettings() {
                ipcClient.request('getSettings').then(res => {
                    this.original = {...res};
                    this.current = {...res};
                });
            },

            openFolder(dir) {
                shell.openItem(dir);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .settings {
        display: grid;
        grid-gap: 0.5em;
        padding: 0.5em;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;

        > section {
            @include flex(column);
            background: $palette-theme-secondary;
            border-radius: 0.15em;
            padding: 1em;
            height: 100%;

            > h1 {
                @include font(600, 1.1em);
                color: $palette-snow-white;
                margin: 0.25em 0 1.25em 0.15em;
            }

            > h3 {
                @include font(600, 0.8em);
                color: $palette-snow-white;
                margin-bottom: 0.25em;
            }

            > button {
                @include font(600, 0.8em);
                margin: auto 0 0 auto;
                padding: 0.5em 1.25em 0.6em;
                border-radius: 0.15em;
                border: 1px solid $palette-turquoise;
                transition: all 0.3s;
                color: $palette-turquoise;
                visibility: hidden;
                opacity: 0;

                &:hover {
                    background: $palette-turquoise;
                    color: $palette-theme-secondary;
                }

                &.visible {
                    opacity: 1;
                    visibility: visible;
                }
            }
        }
    }

    .checkboxes {

        .item {
            @include flex(row, center);
            margin-bottom: 1.25em;

            span {
                @include font(600, 0.75em);
                margin-left: 0.75em;
                line-height: 1.25em;
                color: $palette-snow-white;
            }
        }
    }

    .paths {

        .field {
            @include flex(row, center);

            .text-input-field {
                margin-bottom: 0.75em;
                margin-left: 1em;
                flex-grow: 1;
            }
        }
    }

    .front-page {
        grid-area: 2 / 1 /  2 / 3;

        .tag-input-field {
            margin-top: 0.5em;
        }
    }

</style>
