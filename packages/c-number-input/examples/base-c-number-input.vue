<script setup lang="ts">
import { ref } from "vue"
import { CNumberInput, CNumberInputField } from "../src"

const value = ref("1")
</script>

<template>
  <CNumberInput v-model="value">
    <CNumberInputField />
  </CNumberInput>
</template>
