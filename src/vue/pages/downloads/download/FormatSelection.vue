<template>
    <div class="format-selection">

        <!-- Video codec and format -->
        <drop-down-selection :title="format || 'Choose format'"
                             :items="video.formats"
                             :item-value-filter="formatFilter"
                             item-value="type"
                             v-model="format"/>

        <!-- If video - quality  -->
        <drop-down-selection v-if="format && format.startsWith('video')"
                             :title="quality || 'Choose quality'"
                             :items="formatItems"
                             :item-value-filter="qualityFilter"
                             item-value="quality_label"
                             v-model="quality"/>

        <!-- If audio - bitrate -->
        <drop-down-selection v-if="format && format.startsWith('audio')"
                             :title="bitrate || 'Choose bitrate'"
                             :items="formatItems"
                             :item-value-filter="bitrateFilter"
                             item-value="bitrate"
                             v-model="bitrate"/>

        <!-- Start download -->
        <button v-if="target" @click="startDownload">
            <span>Download</span>
            <span class="size">({{ utils.readableByteCount(Number(target.clen)) }})</span>
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
                const format = this.format && this.format.split(';')[0];
                return this.video.formats.filter(v => v.type.startsWith(format));
            },

            target() {
                const {quality, bitrate, formatItems} = this;

                if (quality) {
                    return formatItems.find(v => v.quality_label === quality);
                } else if (bitrate) {
                    return formatItems.find(v => v.bitrate === bitrate);
                }

                return null;
            }
        },

        data() {
            return {
                format: null,
                quality: null,
                bitrate: null
            };
        },

        watch: {
            format() {
                this.quality = this.bitrate = null;
            }
        },

        methods: {
            formatFilter(v) {
                const [type] = v.split(';');
                const [group, format] = type.split('/');
                return `${group} (${format})`;
            },

            qualityFilter(v) {
                const [res, fps] = v.split('p');
                return `${res}p / ${fps || 30}fps`;
            },

            bitrateFilter(v) {
                return `${Math.floor(Number(v) / 1000)}k`;
            },

            startDownload() {
                if (this.target) {
                    ipcClient.request('startDownload', {
                        format: this.target,
                        basicInfo: this.video
                    });
                } else {
                    /* eslint-disable no-console */
                    console.error('[DOWNLOAD] Tried to download without a resolved target', this.format, this.quality, this.bitrate);
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
