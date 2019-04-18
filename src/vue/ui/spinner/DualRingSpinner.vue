<template>
    <div class="dual-ring-spinner"></div>
</template>

<style lang="scss" scoped>

    .dual-ring-spinner {
        position: relative;
        display: inline-flex;
        @include size(3em);

        &:after {
            @include pseudo();
            @include position(0, 0, 0, 0);
            @include size(50%);
            margin: auto;
            border-radius: 50%;
            border: 3px solid #fff;
            border-color: #fff transparent #fff transparent;

            @include animate('1.2s linear infinite') {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        }
    }

</style>
