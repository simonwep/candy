<template>
    <div class="title-bar">
        <p class="title">
            Candy YouTube Downloader <span>- v{{ version }}</span>
        </p>

        <div class="drag"></div>

        <div class="window-actions">
            <div class="minimize" @click="minimize"></div>
            <div class="min-max" @click="minMax"></div>
            <div class="close" @click="close"></div>
        </div>
    </div>
</template>

<script>

    import {remote} from 'electron';
    import {version} from '../../package.json';

    export default {

        data() {
            return {version};
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
        flex-shrink: 0;
    }

    .title {
        @include font(600, 0.8em);
        margin-left: 0.25em;
        color: $palette-snow-white;

        span {
            opacity: 0.7;
        }
    }

    .drag {
        flex-grow: 1;
        height: 100%;
        -webkit-app-region: drag;
    }

    .window-actions {
        @include flex(row, center);
        align-self: stretch;
        $icon-color: rgba($palette-snow-white, 0.85);

        div {
            @include size(1em, 100%);
            position: relative;
            padding: 0 0.8em 0 0.7em;
            margin-left: 0.25em;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
                background: rgba($palette-snow-white, 0.05);
            }

            &::before,
            &::after {
                @include pseudo();
                @include position(0, 0, 0, 0);
                margin: auto;
            }
        }

        .minimize::before {
            @include size(0.75em, 2px);
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
