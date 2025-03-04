import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateContent(base64AudioFile) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const exampleParts = [
        { text: "input: Senna, run" },
        { text: "output: `{\"speed\": 50, \"voice\": \"Ok, I'm running at 50% of my capacity\"}`" },
        { text: "input: Sena, stop" },
        { text: "output: `{\"speed\": 0, \"voice\": \"Ok, I'm stopping\"}`" },
        { text: "input: Senna, turn right" },
        { text: "output: `{\"direction\": 45, \"voice\": \"Ok, I'm turning 45 degrees\"}`" },
        { text: "input: Senna, turn left" },
        { text: "output: `{\"direction\": -45, \"voice\": \"Ok, I'm turning -45 degrees\"}`" },
        { text: "input: Senna, turn 50 degrees" },
        { text: "output: `{\"direction\": 90, \"voice\": \"Ok, I'm turning 90 degrees\"}`" },
        { text: "input: run" },
        { text: "output: `{\"voice\": \"Sorry, I don't undestand this\"}`" },
        { text: "input: Senna, what is a car?" },
        { text: "output: `{\"voice\": \"Sorry, I don't undestand this\"}`" },
        { text: "input: Sena, increase speed" },
        { text: "output: `{\"speed\": 60, \"voice\": \"Ok, I'm increasing 10% more of my capacity\"}`" },
        { text: "input: Senna, total velocity" },
        { text: "output: `{\"speed\": 100, \"voice\": \"Ok, I'm running at 100% of my capacity\"}`" },
        { text: "input: Sena, increase speed 200% more" },
        { text: "output: `{\"speed\": 200, \"voice\": \"Sorry, I'm running at 100% of my capacity\"}`" },
    ];

    let allParts: any[] = [...exampleParts];

    if (base64AudioFile) {
        allParts.push({
            inlineData: {
                mimeType: "audio/ogg",
                data: base64AudioFile
            }
        },);
    }

    const contents = [{ role: "user", parts: allParts }];

    const result = await model.generateContent({
        contents: contents,
        generationConfig
    });

    return parseJsonFromCodeBlock(result.response.text());
};

function parseJsonFromCodeBlock(codeBlock: string) {
    const jsonString = codeBlock.replace(/```json\n|\n```/g, '');

    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    }
}