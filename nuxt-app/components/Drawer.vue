<template>
    <div class="drawer">
        <input id="main-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content" :data-theme="colorMode.preference">
            <slot name="default" />
        </div>
        <div class="drawer-side" :data-theme="colorMode.preference">
            <label for="main-drawer" class="drawer-overlay"></label>

            <div class="overflow-y-auto w-80 bg-base-100 text-base-content flex flex-col">
                <!-- Sidebar content here -->
                <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content flex-col flex-1">
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>

                <ThemeSelector />
            </div>
        </div>
    </div>
</template>

<script setup>
const colorMode = useColorMode()
</script>

<style lang="scss" scoped></style>
