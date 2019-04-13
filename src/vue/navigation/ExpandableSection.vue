<template>
    <div :class="{'expandable-section': 1, active}">

        <!-- Topic header -->
        <router-link class="topic" :to="route">{{ title }}</router-link>

        <!-- Expandable link secion -->
        <ul v-if="subs.length && $scopedSlots.default" class="items">
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
            route: {type: String, required: true},
            subs: {type: Array, default: []}
        },

        computed: {

            active() {
                return this.$route.path.startsWith(this.route);
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

        &.active {
            border-color: $palette-cloud-blue;

            .topic {
                background: rgba(white, 0.035);
            }

            .items {
                max-height: 100vh;
            }
        }
    }

    .topic {
        cursor: pointer;
        color: white;
        padding: 0.75em 1.5em;
        @include font(600, 0.85em);
        transition: all 0.15s;

        &:hover {
            background: rgba(white, 0.02);
        }
    }

    .items {
        background: $palette-theme-primary;
        max-height: 0;
        transition: all 0.15s;
        overflow: hidden;

        li {
            list-style: none;
            margin: 0.75em 0;
            padding: 0.25em 1.5em;
            color: rgba(white, 0.85);
            @include font(600, 0.75em);
        }
    }

</style>
