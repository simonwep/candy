<template>
    <div class="format-selection">

        <!-- Video codec and format -->
        <drop-down-selection :item-value-filter="contentFilter"
                             :items="availableContent"
                             :title="content || 'choose format'"
                             v-model="content"/>

        <!-- Video codec and format -->
        <drop-down-selection v-if="['video', 'audio/video'].includes(content)"
                             :item-value-filter="videoQualityFilter"
                             :items="availableQualities"
                             :title="videoQuality || 'choose video quality'"
                             v-model="videoQuality"/>

        <!-- Video codec and format -->
        <drop-down-selection v-if="['audio', 'audio/video'].includes(content)"
                             :item-value-filter="audioQualityFilter"
                             :items="availableQualities"
                             :title="audioQuality || 'choose audio quality'"
                             v-model="audioQuality"/>


        <!-- Container format -->
        <drop-down-selection v-if="content"
                             :item-value-filter="extensionFilter"
                             :items="extensions"
                             :title="format || 'choose file format'"
                             v-model="format"/>

        <!-- Start download -->
        <button v-if="content && format" @click="startDownload">
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
            playlist: {type: Object, required: true}
        },

        data() {
            return {
                availableContent: ['audio', 'video', 'audio/video'],
                availableQualities: ['high', 'middle', 'low'],
                content: null,
                audioQuality: null,
                videoQuality: null,
                format: null
            };
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

        watch: {
            content() {
                this.format = this.audioQuality = this.videoQuality = null;
            }
        },

        methods: {
            extensionFilter(v) {
                return v.toUpperCase();
            },

            videoQualityFilter(v) {
                return `${v} video quality`;
            },

            audioQualityFilter(v) {
                return `${v} audio quality`;
            },

            contentFilter(v) {
                return ({
                    'video': 'Video only',
                    'audio': 'Audio only',
                    'audio/video': 'Video & Audio'
                })[v];
            },

            startDownload() {
                const {
                    playlist: {videos},
                    content,
                    format,
                    audioQuality,
                    videoQuality
                } = this;

                const priorities = {
                    resolution: ['72p', '144p', '144p60', '180p', '240p', '240p60', '270p', '360p', '360p60', '480p', '480p60', '720p', '720p60', '1080p', '1080p60', '1440p', '1440p60', '2160p', '2160p60', '3072p', '4320p'],
                    bitrate: ['48kbps', '128kbps', '256kbps', '50kbps', '70kbps', '160kbps']
                };

                // Filters and sorts an array of formats by a specific property
                const filterFormats = (formats, property) => {
                    return formats.sort((a, b) => {

                        // Resolve
                        a = a && a[property];
                        b = b && b[property];

                        // Compare
                        const an = a && priorities[property].indexOf(a) || -1;
                        const ab = a && priorities[property].indexOf(b) || -1;
                        return an - ab;
                    }).filter(v => v && Boolean(v[property]));
                };

                const getElement = (arr, pos = 'middle') => {
                    switch (pos) {
                        case 'low':
                            return arr[0];
                        case 'middle':
                            return arr[Math.round((arr.length - 1) / 2)];
                        case 'high':
                            return arr[arr.length - 1];
                        default:
                            /* eslint-disable no-console */
                            console.error(`Unknown position: ${pos}`);
                    }
                };

                // Download everything lol
                for (const {info: video} of videos) {
                    const {formats} = video;

                    // Getter for audio and video channels
                    const audioChannels = () => filterFormats(formats, 'bitrate');
                    const videoChannels = () => filterFormats(formats, 'resolution');

                    const sources = (() => {
                        switch (content) {
                            case 'audio/video': {
                                const [video, audio] = [videoChannels(), audioChannels()];
                                return (video && audio) ? [getElement(video, videoQuality), getElement(audio, audioQuality)] : null;
                            }
                            case 'audio': {
                                const audio = audioChannels();
                                return audio ? [getElement(audio, audioQuality)] : null;
                            }
                            case 'video': {
                                const video = videoChannels();
                                return video ? [getElement(video, videoQuality)] : null;
                            }
                        }
                    })();

                    if (!sources) {

                        /* eslint-disable no-console */
                        console.error(`Nothing found for ${video.title}`);
                        continue;
                    }

                    ipcClient.request('startDownload', {
                        sources,
                        video,
                        format,
                        playlist: this.playlist.info
                    });
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
