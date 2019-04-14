<template>
    <div class="format-selection">

        <!-- Video codec and format -->
        <drop-down-selection :title="content || 'Choose format'"
                             :items="video.formats"
                             :item-value-filter="formatFilter"
                             item-value="content"
                             v-model="content"/>

        <!-- If video - quality  -->
        <drop-down-selection v-if="['video', 'audio/video'].includes(content)"
                             :title="resolution || 'Choose quality'"
                             :items="formatItems"
                             :item-value-filter="qualityFilter"
                             item-value="resolution"
                             v-model="resolution"/>

        <!-- If audio - bitrate -->
        <drop-down-selection v-if="content === 'audio'"
                             :title="bitrate || 'Choose bitrate'"
                             :items="formatItems"
                             item-value="bitrate"
                             v-model="bitrate"/>

        <!-- Start download -->
        <button v-if="target" @click="startDownload">
            <span>Download</span>
            <span class="size" v-if="target.clen">({{ utils.readableByteCount(Number(target.clen)) }})</span>
        </button>

    </div>
</template>

<script>

    // Components
    import DropDownSelection from '../../../ui/DropDownSelection';

    // IPC Client
    import ipcClient from '../../../ipc/client';

    export default {

        components: {DropDownSelection},

        props: {
            video: {type: Object, require: true}
        },

        computed: {

            formatItems() {
                return this.video.formats.filter(v => v.content === this.content);
            },

            target() {
                const {resolution, bitrate, formatItems} = this;

                if (resolution) {
                    return formatItems.find(v => v.resolution === resolution);
                } else if (bitrate) {
                    return formatItems.find(v => v.bitrate === bitrate);
                }

                return null;
            }
        },

        data() {
            return {
                content: null,
                resolution: null,
                bitrate: null
            };
        },

        watch: {
            content() {
                this.resolution = this.bitrate = null;
            }
        },

        methods: {
            formatFilter(v) {
                return v.replace('/', ' & ');
            },

            qualityFilter(v) {
                const [res, fps] = v.split('p');
                return `${res}p / ${fps || 30}fps`;
            },

            startDownload() {
                if (this.target) {
                    ipcClient.request('startDownload', {
                        format: this.target,
                        basicInfo: this.video
                    });
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
