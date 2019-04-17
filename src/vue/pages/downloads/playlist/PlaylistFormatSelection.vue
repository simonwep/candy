<template>
    <div class="format-selection">

        <!-- Video codec and format -->
        <drop-down-selection :item-value-filter="contentFilter"
                             :items="availableContent"
                             :title="content || 'choose format'"
                             v-model="content"/>

        <!-- Container format -->
        <drop-down-selection :item-value-filter="formatFilter"
                             :items="extensions"
                             :title="format || 'choose file format'"
                             v-if="content"
                             v-model="format"/>

        <!-- Start download -->
        <button @click="startDownload" v-if="content && format">
            <span>Download</span>
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
            playlist: {type: Object, require: true}
        },

        computed: {

            extensions() {
                if (this.content.includes('video')) {
                    return ['mp4', '3gp', 'ogg', 'wmv', 'webm', 'flv', 'avi', 'vob'];
                } else {
                    return ['mp3', 'oog', 'aac', 'wma'];
                }
            }
        },

        data() {
            return {
                availableContent: ['audio', 'video', 'audio/video'],
                content: null,
                format: null
            };
        },

        watch: {
            content() {
                this.resolution = this.bitrate = this.format = null;
            }
        },

        methods: {
            formatFilter(v) {
                return v.toUpperCase();
            },

            contentFilter(v) {
                return ({
                    'video': 'Video only',
                    'audio': 'Audio only',
                    'audio/video': 'Video & Audio'
                })[v];
            },

            startDownload() {
                const {playlist: {videos}, content, format} = this;

                // Download everything lol
                for (const {info: video} of videos) {
                    const {formats} = video;

                    // TODO Use native numbers
                    const getMiddle = arr => arr[Math.round((arr.length - 1) / 2)];
                    const getAudioChannel = () => formats.sort((a, b) => parseInt(a.resolution, 10) - parseInt(b.resolution));
                    const getVideoChannel = () => formats.sort((a, b) => parseInt(a.bitrate, 10) - parseInt(b.bitrate));

                    let sources;

                    switch (content) {
                        case 'audio/video': {
                            const [video, audio] = [getVideoChannel(), getAudioChannel()];
                            sources = (video && audio) ? [getMiddle(video), getMiddle(audio)] : null;
                            break;
                        }
                        case 'audio': {
                            const audio = getAudioChannel();
                            sources = audio ? [getMiddle(audio)] : null;
                            break;
                        }
                        case 'video': {
                            const video = getVideoChannel();
                            sources = video ? [getMiddle(video)] : null;
                            break;
                        }
                    }

                    if (!sources) {
                        console.error(`Nothing found for ${video.title}`);
                        continue;
                    }

                    ipcClient.request('startDownload', {sources, video, format});
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
