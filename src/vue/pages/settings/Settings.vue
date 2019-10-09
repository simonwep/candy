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

    </div>
</template>

<script>

    // Electron stuff
    import {shell}  from 'electron';
    import settings from 'electron-settings';
    import path     from 'path';
    import os       from 'os';
    import fs       from 'fs';

    // UI Components
    import Checkbox       from '../../ui/input/Checkbox';
    import TagInputField  from '../../ui/input/TagInputField';
    import TextInputField from '../../ui/input/TextInputField';

    export default {

        components: {Checkbox, TagInputField, TextInputField},

        data() {
            return {
                hasChanged: false,
                original: {},
                current: {
                    createPlaylistDirectory: true,
                    createChannelDirectory: true,
                    deleteDownloadEntriesIfDone: false,
                    downloadDirectory: path.resolve(os.homedir(), 'Downloads'),
                    temporaryDirectory: path.resolve(os.tmpdir(), 'candy'),
                    homeVideoChannels: []
                }
            };
        },

        watch: {
            current: {
                deep: true,
                handler() {
                    const {original, current} = this;

                    for (const [prop, value] of Object.entries(original)) {
                        if (current[prop] !== value) {
                            this.hasChanged = true;
                            return;
                        }
                    }

                    this.hasChanged = false;
                }
            }
        },

        mounted() {
            const cs = settings.getAll();

            // Check if this is the initial startup
            if (!Object.keys(cs).length) {
                this.applySettings();
            }

            Object.assign(this.current, cs);
            Object.assign(this.original, cs);
        },

        methods: {

            applySettings() {
                const {downloadDirectory, temporaryDirectory} = this.current;

                // Validate paths
                for (const dir of [downloadDirectory, temporaryDirectory]) {
                    if (!fs.existsSync(dir)) {

                        // Show error dialog
                        this.$store.commit('dialogbox/show', {
                            type: 'error',
                            title: 'Invalid directory',
                            text: `${dir} does not exist.`,
                            buttons: [
                                {type: 'accept', text: 'Okay'}
                            ]
                        });

                        return;
                    }
                }

                settings.setAll(this.current);
                Object.assign(this.original, this.current);
                this.hasChanged = false;
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
