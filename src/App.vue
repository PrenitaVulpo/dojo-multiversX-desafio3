<script setup lang="ts">
import { generateContent } from './utils/gemini'
import { onMounted, ref } from 'vue'
import fOneStopped from '@/assets/f-one-stopped.svg'
import fOneRan1 from '@/assets/f-one-ran-1.svg'
import fOneRan2 from '@/assets/f-one-ran-2.svg'

const currentImage = ref(fOneStopped);
let speed = ref(0)
let rotate = ref(0)
let voice = ref('')
let intervalId = null;
let chunks = []
let recorder:MediaRecorder = null;

const canRecord = ref(false);
const isRecording = ref(false);

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        reject('Failed to convert blob to base64 string');
        return;
      }
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
  });
}

const setupStream = (stream: MediaStream) => {
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => {
    chunks.push(e.data);
  }

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });

    chunks = [];

    const base64AudioFile = await blobToBase64(blob);

    const response = await generateContent(base64AudioFile);

    const speedParam = typeof response.speed !== 'number' ? speed.value : response.speed
    run(speedParam);

    voice.value = response.voice;
    rotate.value = response.direction || 0;
  };

  canRecord.value = true;
};

const audioSetup = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(setupStream)
      .catch(err => console.error(err));
  }
};

const record = () => {
  if (!canRecord.value) return;
  isRecording.value = !isRecording.value;

  if (isRecording.value) {
    recorder?.start();
  } else {
    recorder?.stop();
  }
};

const run = (speedParam: number) => {
  stop()

  if (!speedParam || speedParam < 1) {
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

onMounted(() => {
  audioSetup();
  // Listen for spacebar press to trigger the record function
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') { // Space bar
      event.preventDefault(); // Prevent default behavior (scrolling or other actions)
      record();
    }
  });
});
</script>

<template>
  <header class="header">
    Hi, I’m <span>Senna</span> your AI Agent
  </header>
  <main class="main">
    <section>
      <button @click="record">
        Click to talk <br>
        <span v-if="!isRecording">(or press space bar)</span>
        <span v-if="isRecording">Recording!</span>
      </button>
    </section>
    <section>
      <div class="formula1">
        <img
          :key="currentImage"
          :src="currentImage"
          alt="Formula 1"
          :style="`transform: rotate(${rotate}deg);`"
        >

        <div v-if="voice" class="voice">
          {{ voice }}
        </div>
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

.main .formula1 {
  position: relative;
}

.main .formula1 .voice {
  position: absolute;
  top: -50px;
  left: 0px;
  background: #FFFFFF;
  color: #000000;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 10px;
}

.main .formula1 .voice::before {
  content: "";
  position: absolute;
  bottom: -15px;
  right: 0px;
  transform: translateX(-50%);
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 15px solid #000000;
}

.main .formula1 .voice::after {
  content: "";
  position: absolute;
  bottom: -13px;
  right: 6px;
  transform: translateX(-50%);
  border-left: 13px solid transparent;
  border-right: 13px solid transparent;
  border-top: 13px solid #FFFFFF;;
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
