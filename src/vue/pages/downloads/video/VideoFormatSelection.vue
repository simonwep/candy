<template>
    <div class="format-selection">

        <!-- Video codec and format -->
        <drop-down-selection :item-value-filter="contentFilter"
                             :items="video.formats"
                             :title="content || 'choose format'"
                             v-model="content"
                             item-value="content"/>

        <!-- If video - quality  -->
        <drop-down-selection v-if="['video', 'audio/video'].includes(content)"
                             :item-value-filter="qualityFilter"
                             :items="videoResolutions"
                             :title="resolution || 'choose quality'"
                             v-model="resolution"
                             item-value="resolution"/>

        <!-- If audio - bitrate -->
        <drop-down-selection v-if="['audio', 'audio/video'].includes(content)"
                             :items="audioBitrates"
                             :title="bitrate || 'choose bitrate'"
                             v-model="bitrate"
                             item-value="bitrate"/>

        <!-- Container format -->
        <drop-down-selection v-if="content"
                             :item-value-filter="extensionsFilter"
                             :items="extensions"
                             :title="format || 'choose file format'"
                             v-model="format"/>

        <!-- Start download -->
        <button v-if="sources" @click="startDownload">
            <span>Download</span>
            <span v-if="sources.clen" class="size">({{ utils.readableByteCount(Number(sources.clen)) }})</span>
        </button>

    </div>
</template>

<script>

    // Components
    import DropDownSelection from '../../../ui/input/DropDownSelection';

    // IPC Client
    import ipcClient from '../../../ipc/client';

    export default {

        components: {DropDownSelection},

        props: {
            video: {type: Object, required: true}
        },

        data() {
            return {
                content: null,
                resolution: null,
                bitrate: null,
                format: null
            };
        },

        computed: {

            videoResolutions() {
                return this.video.formats.filter(v => v.resolution);
            },

            audioBitrates() {
                return this.video.formats.filter(v => v.bitrate);
            },

            extensions() {
                if (this.content.includes('video')) {
                    return ['mp4', '3gp', 'ogg', 'wmv', 'webm', 'flv', 'avi', 'vob'];
                } else {
                    return ['mp3', 'oog', 'aac', 'wma'];
                }
            },

            sources() {
                const {format, content, resolution, bitrate, video} = this;
                const getVideoChannel = () => resolution ? video.formats.find(v => v.resolution === resolution) : null;
                const getAudioChannel = () => bitrate ? video.formats.find(v => v.bitrate === bitrate) : null;

                // Format is universial but required
                if (!format) {
                    return null;
                }

                switch (content) {
                    case 'audio/video': {
                        const [video, audio] = [getVideoChannel(), getAudioChannel()];
                        return (video && audio) ? [video, audio] : null;
                    }
                    case 'audio': {
                        const audio = getAudioChannel();
                        return audio ? [audio] : null;
                    }
                    case 'video': {
                        const video = getVideoChannel();
                        return video ? [video] : null;
                    }
                }
            }
        },

        watch: {
            content() {
                this.resolution = this.bitrate = this.format = null;
            }
        },

        methods: {
            contentFilter(v) {
                return ({
                    'video': 'Video only',
                    'audio': 'Audio only',
                    'audio/video': 'Video & Audio'
                })[v];
            },

            extensionsFilter(v) {
                return v.toUpperCase();
            },

            qualityFilter(v) {
                const [res, fps] = v.split('p');
                return `${res}p / ${fps || 30}fps`;
            },

            startDownload() {
                if (this.sources) {
                    const {sources, video, format} = this;
                    ipcClient.request('startDownload', {sources, video, format});
                } else {
                    /* eslint-disable no-console */
                    console.error('[DOWNLOAD] Tried to download without a resolved target', this.format, this.resolution, this.bitrate);
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .format-selection {
        @include flex(row, center);

        .drop-down-selection {
            margin-right: 1em;
            align-self: stretch;
        }

        > button {
            @include flex(row, center);
            color: $palette-theme-primary;
            background: $palette-turquoise;
            align-self: stretch;
            border-radius: 0.15em;
            padding: 0 0.75em;
            font-size: 0.8em;

            span {
                font-weight: 600;
            }

            .size {
                font-size: 0.95em;
                margin-left: 0.5em;
            }
        }
    }

</style>
