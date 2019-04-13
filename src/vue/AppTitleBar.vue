<template>
    <div class="title-bar">
        <p class="title">YouTube downloader</p>

        <div class="drag"></div>

        <div class="window-actions">
            <div class="minimize" @click="minimize"></div>
            <div class="min-max" @click="minMax"></div>
            <div class="close" @click="close"></div>
        </div>
    </div>
</template>

<script>

    import {remote, ipcRenderer} from 'electron';

    export default {

        data() {
            return {};
        },

        methods: {

            minimize() {
                remote.getCurrentWindow().minimize();
            },

            minMax() {
                const currentWindow = remote.getCurrentWindow();
                currentWindow.isMaximized() ? currentWindow.unmaximize() : currentWindow.maximize();
            },

            close() {
                remote.getCurrentWindow().close();
            }
        }
    };

</script>

<style lang="scss" scoped>

    .title-bar {
        @include flex(row, center);
        background: darken($palette-theme-primary, 9);
        box-shadow: 0 0 0.25em rgba(black, 0.1);
        height: 0.75em;
        padding: 0.5em 0.75em;
        z-index: 100;
        box-sizing: content-box;
    }

    .title {
        @include font(600, 0.8em);
        color: white;
    }

    .drag {
        flex-grow: 1;
        height: 100%;
        -webkit-app-region: drag;
    }

    .window-actions {
        @include flex(row, center);
        align-self: stretch;

        div {
            @include size(0.75em);
            position: relative;
            margin-left: 1em;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                background: rgba(white, 0.05);
            }

            &::before,
            &::after {
                @include pseudo();
                @include position(0, 0, 0, 0);
                @include size(100%);
                margin: auto;
            }
        }

        .minimize::before {
            top: auto;
            background: white;
            height: 2px;
        }

        .min-max {
            border: 2px solid white;
        }

        .close {
            position: relative;
            @include size(0.85em);

            &::before,
            &::after {
                height: 2px;
                background: white;
            }

            &::after {
                transform: rotate(45deg);
            }

            &::before {
                transform: rotate(-45deg);
            }
        }
    }

</style>
