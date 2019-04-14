<template>
    <div :class="{'drop-down-selection': 1, open}">

        <button @click="open = !open">
            <i class="fas fa-fw fa-angle-down"></i>
            <span>{{ value ? (itemValueFilter ? itemValueFilter(value) : value) : title }}</span>
        </button>

        <div class="items">
            <p v-for="item of preparedItems" @click="select(item)">{{ item.modified }}</p>
        </div>

    </div>
</template>

<script>

    export default {

        props: {
            title: {type: String, required: true},
            value: {type: String, default: ''},
            items: {type: Array, required: true},
            itemValue: {type: String, default: null},
            itemValueFilter: {type: Function, default: null}
        },

        data() {
            return {
                open: false,
                replacedTitle: null
            };
        },

        computed: {
            preparedItems() {
                const {items, itemValue, itemValueFilter} = this;
                const prep = [];

                for (const item of items) {
                    const v = itemValue ? item[itemValue] : item;

                    if (!v) {
                        continue;
                    }

                    const v2 = itemValueFilter ? itemValueFilter(v) : v;

                    if (v2 && !prep.find(({modified}) => modified === v2)) {
                        prep.push({modified: v2, original: v});
                    }
                }

                return prep.sort((a, b) => a.modified.localeCompare(b.modified));
            }
        },

        methods: {

            select({modified, original}) {
                this.$emit('input', original);
                this.replacedTitle = modified;
                this.open = false;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .drop-down-selection {
        color: white;

        &.open {

            button i {
                transform: rotate(180deg) translateY(0.1em);
            }

            .items {
                opacity: 1;
                visibility: visible;
                transform: none;
            }
        }
    }

    button {
        @include font(600, 0.8em);
        @include flex(row, center);
        align-self: stretch;
        display: inline-block;
        cursor: pointer;
        border: 1px solid rgba(black, 0.2);
        border-radius: 0.15em;
        padding: 0.5em 0.75em;

        i {
            margin-right: 0.5em;
            transition: all 0.3s;
            transform-origin: center;
        }

        span {
            margin-right: 0.25em;
        }
    }

    .items {
        position: absolute;
        background: $palette-theme-secondary;
        padding: 0.2em 0;
        margin-top: 0.5em;
        border-radius: 0.15em;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-0.5em);
        transition: all 0.3s;
        box-shadow: 0 0.05em 0.75em rgba(black, 0.25);
        max-height: 50vh;
        overflow: auto;

        p {
            @include font(400, 0.85em);
            margin: 0.25em 0;
            padding: 0.5em 0.85em;
            transition: all 0.3s;
            cursor: pointer;
            text-transform: capitalize;

            &:hover {
                background: rgba(black, 0.075);
            }
        }
    }

</style>
