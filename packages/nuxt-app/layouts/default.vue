<template>
    <div class="h-screen" :data-theme="colorMode.preference">
        <nc-drawer>
            <slot />
        </nc-drawer>
    </div>
</template>

<script setup>
const colorMode = useColorMode()
</script>

<style lang="scss" scoped></style>
