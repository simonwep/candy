<template>
    <div :class="{checkbox: 1, checked: value}" @click="$emit('input', !value)">

        <!-- Check icon -->
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M7,25L17.571,38,44,12"></path>
        </svg>

    </div>
</template>

<script>

    export default {

        props: {
            value: {type: Boolean, required: true}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .checkbox {
        @include inline-flex(row, center, center);
        @include size(1.25em);
        background: $palette-theme-primary;
        border: 2px solid rgba($palette-turquoise, 0.25);
        border-radius: 0.15em;
        cursor: pointer;
        transition: all 0.3s;
        flex-shrink: 0;

        svg {
            @include size(70%);
            fill: transparent;
            stroke: $palette-theme-tertiary;
            stroke-width: 8;
            stroke-dasharray: 78;
            stroke-dashoffset: 100;
            transition: all 0.3s;
        }

        &.checked {
            border-color: $palette-turquoise;

            svg {
                stroke: $palette-turquoise;
                stroke-dashoffset: 0;
            }
        }

        &:hover {
            border-color: rgba($palette-turquoise, 0.5);
        }
    }

</style>
