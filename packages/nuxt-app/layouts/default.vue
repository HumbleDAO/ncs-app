<template>
    <div class="h-screen" :data-theme="colorMode.preference">
        <Drawer>
            <slot />
        </Drawer>
    </div>
</template>

<script setup>
const colorMode = useColorMode()
</script>

<style lang="scss" scoped></style>
