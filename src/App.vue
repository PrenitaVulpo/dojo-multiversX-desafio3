<script setup lang="ts">
import type { ChatBubbleI } from './TS/Interfaces/ChatBubbleI'
import { generateContent } from './utils/gemini'
import { ref } from 'vue'
import fOneStopped from '@/assets/f-one-stopped.svg'
import fOneRan1 from '@/assets/f-one-ran-1.svg'
import fOneRan2 from '@/assets/f-one-ran-2.svg'

const currentImage = ref(fOneStopped);
let speed = ref(0)
let rotate = ref(0)
let intervalId = null;

const run = (speedParam) => {
  stop()

  if (speedParam < 1) {
    return
  }

  const mapSpeedToInterval = (param) => {
    const minInterval = 200;
    const maxInterval = 450;

    speed.value = param > 100 ? 100 : param;
    return minInterval + (maxInterval - minInterval) * ((100 - speed.value) / 99);
  };

  const interval = mapSpeedToInterval(speedParam);
  console.log(interval)
  intervalId = setInterval(() => {
    currentImage.value = currentImage.value === fOneRan2 ? fOneRan1 : fOneRan2;
  }, interval);
};

const stop = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    currentImage.value = fOneStopped;
    speed.value = 0;
  }
}

const left = () => {
  rotate.value = -45
}

const right = () => {
  rotate.value = 45
}

const talk = () => {
  console.log("Listening")
}


</script>

<template>
  <header class="header">
    Hi, I’m <span>Senna</span> your AI Agent
  </header>
  <main class="main">
    <section>
      <button
        @click="talk"
      >
        Click to talk <br>
        <span>(or press space bar)</span>
      </button>

      <!-- <button @click="run(100)">run</button>
      <button @click="stop">stop</button>
      <button @click="left">left</button>
      <button @click="right">right</button> -->
    </section>
    <section>
      <div>
      <img 
        :key="currentImage"
        :src="currentImage" 
        alt="Formula 1"
        :style="`transform: rotate(${rotate}deg);`"
      >
      </div>

      <div class="informations">
        <div class="information">
          <p>Speed</p>
          <div>{{ `${speed}%` }}</div>
        </div>
        <div class="divider" />
        <div class="information">
          <p>Direction</p>
          <div>{{ `${rotate}deg` }}</div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.header {
  text-align: center;
  font-size: 64px;
  padding-top: 20px;
}

.header span {
  color: #FF0000;
  font-weight: 600;
}

.main {
  display: flex;
  padding: 0 40px;
  justify-content: space-between;
  align-items: center;
  margin: 100px auto 0 auto;
  max-width: 900px;
}

.main button {
  background: none;
  cursor: pointer;
  border: 2px solid #FFFFFF;
  border-radius: 10px;
  font-size: 48px;
  padding: 20px;
  color: #FFFFFF;
  line-height: 0.7;
  min-width: 330px;
  font-family: "Pixelify Sans", serif;
}

.main button span {
  font-size: 20px;
}

.main button:hover {
  transform: scale(1.1);
}

.main .informations {
  display: flex;
  margin-top: 20px;
}

.main .informations .divider {
  width: 10px;
}

.main .informations .information {
  flex: 1;
  font-size: 20px;
}

.main .informations .information p {
  margin: unset;
  text-align: center;
}

.main .informations .information div {
  border: 1px solid #FFFFFF;
  border-radius: 10px;
  text-align: center;
  padding: 4px;
}

</style>
