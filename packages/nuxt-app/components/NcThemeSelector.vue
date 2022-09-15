<template>
    <div>
        <select v-model="colorMode.preference" class="select w-full max-w-xs rounded-none">
            <option disabled selected>Theme</option>
            <option v-for="theme of themes" :key="theme">
                {{ theme }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const themes = useThemes()
</script>

<style lang="scss" scoped></style>
