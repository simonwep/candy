<template>
    <div :class="{'expandable-section': 1, active}">

        <!-- Topic header -->
        <router-link :to="to" class="topic">{{ title }}</router-link>

        <!-- Expandable link secion -->
        <ul class="items" v-if="subs.length && $scopedSlots.default">
            <li v-for="item of subs">
                <slot :item="item"></slot>
            </li>
        </ul>
    </div>
</template>

<script>

    export default {

        props: {
            title: {type: String, required: true},
            to: {type: String, required: true},
            subs: {type: Array, default: () => []}
        },

        computed: {

            active() {
                return this.$route.path.startsWith(this.to);
            }
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .expandable-section {
        @include flex(column);
        border-left: 2px solid transparent;
        transition: all 0.15s;
        width: 100%;

        &.active {
            border-color: $palette-cloud-blue;

            .topic {
                background: rgba(white, 0.035);
            }

            .items {
                max-height: 50vh;
            }
        }
    }

    .topic {
        cursor: pointer;
        color: white;
        padding: 0.85em 2em;
        @include font(600, 0.8em);
        transition: all 0.15s;

        &:hover {
            background: rgba(white, 0.02);
        }
    }

    .items {
        background: $palette-theme-primary;
        max-height: 0;
        transition: all 0.3s;
        overflow: hidden;

        li {
            list-style: none;
            margin: 0.75em 0;
            padding: 0.25em 2em;
            color: rgba(white, 0.85);
            @include font(600, 0.85em);
        }
    }

</style>
