<template>
    <div class="folding-rectangles">

        <div class="box-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    $big-border-radius: 2em;
    $small-border-radius: 0.15em;
    $jump-height: 0.25em;

    .folding-rectangles {
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        pointer-events: none;
        transition: all 0.3s;

        // To prevent actions if a request / operation is pending
        &::after {
            @include pseudo(fixed);
            @include position(0, 0, 0, 0);
            background: transparent;
            z-index: 1;
        }
    }

    .box-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 2px;
        z-index: 2;

        > div {
            @include size(7px);
            background: $palette-turquoise;
            animation-play-state: paused;

            @include animate('6s infinite') {
                0%, 60%, 100% {
                    opacity: 1;
                    transform: none;
                }
                10%, 49.999% {
                    opacity: 0;
                    transform: translateY(0.5em);
                }
            }

            @for $i from 0 through 9 {
                &:nth-child(#{$i}) {
                    animation-delay: #{$i * 300ms};
                }
            }
        }

        &.open {
            animation-play-state: running;
        }
    }

</style>
