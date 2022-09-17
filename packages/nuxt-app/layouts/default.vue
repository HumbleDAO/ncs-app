<template>
    <div class="h-screen w-screen" :data-theme="colorMode.preference">
        <nc-drawer>
            <nc-navbar />

            <slot />
        </nc-drawer>
    </div>
</template>

<script setup>
const colorMode = useColorMode()
</script>
