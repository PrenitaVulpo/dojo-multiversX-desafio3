<script setup lang="ts">
import type { ChatBubbleI } from './TS/Interfaces/ChatBubbleI'
import { generateContent } from './utils/gemini'
import { ref } from 'vue'

const prompt = ref("")
const chatHistory = ref<Array<ChatBubbleI>>([]);
const inputEnabled = ref<boolean>(false)

const inputSwitch = () => {
  inputEnabled.value = !inputEnabled.value;
};

const updateChatU = () => {
  inputSwitch()
  chatHistory.value.push({
    from: 'user',
    text: prompt.value
  })
  inputSwitch()
};
const updateChatB = (message: string) => {
  chatHistory.value[chatHistory.value.length-1] = {
    from: 'bot',
    text: message
  };
};


const generateByPrompt = async () => {
  inputSwitch()
  updateChatU();

  chatHistory.value.push({
    from: 'bot',
    text: '...'
  });
  setTimeout(() =>{},500);
  try {
    const content = await generateContent(prompt.value)
    updateChatB(content)
  } catch (error) {
    updateChatB("desculpe! Houve um erro durante o processamento da sua requisição.")
  console.error(error)
  }

  inputSwitch()
  prompt.value = ""
}



</script>

<template>
  <div id="prompt-chat"></div>
  <section class="input-area" id="chat">
    <div v-for="(bubble, index) in chatHistory" :key="index" :id="bubble.from=='user' ? 'user' : 'bot' " class="chat-bubble">
      {{ bubble.text }}
    </div>
  </section>
  <section class="input-area">
    <textarea v-model="prompt" type="text" name="prompt" id="prompt" class="textbox" :disabled="inputEnabled"/>
    <button @click="generateByPrompt" class="action-button" :disabled="inputEnabled">Fale comigo!</button>
  </section>

</template>

<style scoped>
.input-area {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: space-between;
  border-radius: 20px;
  border: 1px solid rgb(102, 102, 95);
}

#chat {
  height: 40vh;
  flex-direction: column;
}

.chat-bubble {
  padding: 1rem;
  border-radius: 50px;
}

#user {
  background-color: aqua;
  color: black;
  align-self: flex-end;
}

#bot {
  background-color: blue;
  align-self: flex-start;
}

.textbox {
  max-height: 10rem;
  width: 45rem;
  border-radius: 25px;
  display: flex;
  background-color: #16161667;
  padding: .5rem .5rem;
  text-align: left;          /* Aligns text to the left horizontally */
  vertical-align: top;       /* Makes sure text aligns at the top */
  padding: 25px 5px;              /* Adds padding around the content */
}
.action-button {
  height: 3rem;
  width: 5rem;
  margin-left: 1rem;
  border: 1px solid rgb(102, 102, 95);
  border-radius: 5px;
  background-color: #16161667;
}

.action-button:hover {

  background-color: #29292967;
}

</style>
