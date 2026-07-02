const OpenAI = require('openai');
const { SYSTEM_PROMPT } = require('../prompts/system');

const client = new OpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN,
});

const askAI = async (userMessage, history = []) => {
  try {
    console.log('Calling GitHub Models with message:', userMessage);

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history
        .filter((msg) => msg.text && msg.text.trim() !== '')
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
      { role: 'user', content: userMessage },
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    console.log('AI responded successfully');
    return reply;

  } catch (error) {
    console.error('AI error:', error.message);
    if (error.status === 429) {
      return 'I am receiving too many requests. Please wait a moment and try again.';
    }
    if (error.status === 401) {
      return 'Authentication error. Please check the API configuration.';
    }
    return 'I am having trouble connecting right now. Please try again in a moment.';
  }
};

module.exports = { askAI };