<template>
    <div class="settings">

        <!-- All string based settings -->
        <div class="paths grid-item">
            <h1>Paths</h1>

            <text-input-field placeholder="Download path" v-model="current.downloadDirectory"/>
            <text-input-field placeholder="Temporary path" v-model="current.temporaryDirectory"/>

            <button @click="applySettings" v-if="hasChanged">Apply</button>
        </div>

        <!-- All boolean based settings -->
        <div class="checkboxes grid-item">
            <h1>General</h1>

            <div class="item">
                <checkbox v-model="current.createChannelDirectory"/>
                <span>Create a directory for each channel.</span>
            </div>

            <div class="item">
                <checkbox v-model="current.createPlaylistDirectory"/>
                <span>Create a direcotry with playlist's name.</span>
            </div>

            <div class="item">
                <checkbox v-model="current.lockDownloadSettings"/>
                <span>Remember last download settings and apply these to the next one.</span>
            </div>

            <button @click="applySettings" v-if="hasChanged">Apply</button>
        </div>

    </div>
</template>

<script>

    // IPC Client
    import ipcClient      from '../../ipc/client';
    // UI Components
    import Checkbox       from '../../ui/input/Checkbox';
    import TextInputField from '../../ui/input/TextInputField';

    export default {

        components: {Checkbox, TextInputField},

        data() {
            return {
                original: {},
                current: {
                    createPlaylistDirectory: false,
                    createChannelDirectory: false,
                    deleteDownloadEntriesIfDone: false,
                    downloadDirectory: null,
                    temporaryDirectory: null,
                    lockDownloadSettings: false
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
                    .catch(reason => {
                        // TODO: Handle error
                        /* eslint-disable no-console */
                        console.error(reason);
                    });
            },

            fetchSettings() {
                ipcClient.request('getSettings').then(res => {
                    this.original = {...res};
                    this.current = {...res};
                });
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

        .grid-item {
            @include flex(column);
            background: $palette-theme-secondary;
            border-radius: 0.15em;
            padding: 1em;
            height: 100%;

            > h1 {
                @include font(600, 1.1em);
                color: white;
                margin-bottom: 1em;
            }

            > button {
                @include font(600, 0.8em);
                margin: auto 0 0 auto;
                padding: 0.5em 1.25em 0.6em;
                border-radius: 0.15em;
                border: 1px solid $palette-turquoise;
                transition: all 0.3s;
                color: $palette-turquoise;

                &:hover {
                    background: $palette-turquoise;
                    color: $palette-theme-secondary;
                }
            }
        }
    }

    .checkboxes {

        .item {
            @include flex(row, center);
            margin-bottom: 1em;

            span {
                @include font(600, 0.75em);
                margin-left: 0.75em;
                line-height: 1.25em;
                color: white;
            }
        }
    }

    .paths {
        .text-input-field {
            margin-bottom: 0.75em;
        }
    }

</style>
