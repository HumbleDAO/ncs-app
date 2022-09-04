<template>
    <div class="hero min-h-screen" :data-theme="colorMode.preference">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <slot name="default" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
</script>

<style scoped></style>
