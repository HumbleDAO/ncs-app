<template>
    <div class="flex h-screen" :data-theme="colorMode.preference">
        <hero>
            <h1 class="text-5xl font-bold">My App</h1>
            <p class="py-6"></p>
            <label for="main-drawer" class="btn btn-primary drawer-button rounded-none">Open drawer</label>
        </hero>
    </div>
</template>

<script setup>
const colorMode = useColorMode()
</script>
