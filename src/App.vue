<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { generateContent } from './utils/gemini'
import { onMounted, ref } from 'vue'

const prompt = ref("")

const generateByPrompt = async () => {
  const content = await generateContent(prompt.value)
  console.log({ content })
}
</script>

<template>
  <div id="prompt-chat"></div>
  <input v-model="prompt" type="text" name="prompt" id="prompt">
  <button @click="generateByPrompt">Pesquisar</button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
