<template>
    <div class="card w-96 bg-base-100 shadow-xl image-full">
        <!-- <figure><img src="https://placeimg.com/400/225/arch" alt="subsc" /></figure> -->
        <div class="card-body flex flex-col">
            <h2 class="card-title">{{ props.title }}</h2>

            <slot name="icon" />

            <p>{{ props.description }}</p>

            <slot name="default" />

            <div class="card-actions justify-end">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
})
</script>

<style scoped></style>
