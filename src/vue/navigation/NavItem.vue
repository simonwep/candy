<template>
    <div :class="{'nav-item': 1, active: $route.path === to}">

        <!-- Topic header -->
        <router-link :to="to" class="topic">{{ title }}</router-link>

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
            to: {type: String, required: true},
            subs: {type: Array, default: () => []}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .nav-item {
        @include flex(column);
        border-left: 2px solid transparent;
        transition: all 0.15s;
        width: 100%;

        a {
            text-decoration: none;
        }

        &.active {
            border-color: $palette-cloud-blue;

            .topic {
                background: rgba($palette-snow-white, 0.035);
            }

            .items {
                max-height: 50vh;
            }
        }
    }

    .topic {
        cursor: pointer;
        color: $palette-snow-white;
        padding: 0.85em 2em;
        @include font(600, 0.8em);
        transition: all 0.15s;

        &:hover {
            background: rgba($palette-snow-white, 0.02);
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
            color: rgba($palette-snow-white, 0.85);
            @include font(600, 0.85em);
        }
    }

</style>
