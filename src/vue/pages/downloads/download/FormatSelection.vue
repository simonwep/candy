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

    </div>
</template>

<script>

    // Components
    import DropDownSelection from '../../../ui/DropDownSelection';

    export default {

        components: {DropDownSelection},

        props: {
            video: {type: Object, require: true}
        },

        computed: {

            formatItems() {
                const format = this.format.split(';')[0];
                return this.video.formats.filter(v => v.type.startsWith(format));
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
            }
        }
    };

</script>

<style lang="scss" scoped>

    .format-selection {
        @include flex(row, center);

        .drop-down-selection {
            margin-right: 1em;
        }
    }

</style>
