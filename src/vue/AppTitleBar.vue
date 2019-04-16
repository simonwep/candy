<template>
    <div class="title-bar">
        <p class="title">Downloader</p>

        <div class="drag"></div>

        <div class="window-actions">
            <div @click="minimize" class="minimize"></div>
            <div @click="minMax" class="min-max"></div>
            <div @click="close" class="close"></div>
        </div>
    </div>
</template>

<script>

    import {remote} from 'electron';

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
        height: 1.75em;
        padding: 0 0.75em;
        z-index: 100;
        box-sizing: content-box;
    }

    .title {
        @include font(600, 0.8em);
        margin-left: 0.25em;
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
        $icon-color: rgba(white, 0.85);

        div {
            @include size(100%, 1em);
            position: relative;
            padding: 0 0.8em 0 0.7em;
            margin-left: 0.25em;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                background: rgba(white, 0.05);
            }

            &::before,
            &::after {
                @include pseudo();
                @include position(0, 0, 0, 0);
                margin: auto;
            }
        }

        .minimize::before {
            @include size(2px, 0.75em);
            background: $icon-color;
            top: 9px;
        }

        .min-max::before {
            @include size(0.5em);
            border: 2px solid $icon-color;
            border-radius: 0.1em;
        }

        .close {
            position: relative;

            &::before,
            &::after {
                @include size(0.8em);
                height: 2px;
                background: $icon-color;
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
