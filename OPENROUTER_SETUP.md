# OpenRouter Setup Guide

## ✅ Setup Complete!

OpenRouter has been configured in your Next.js project using the OpenAI SDK.

## 📝 Next Steps

### 1. Get Your API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to [Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key and add it to `.env.local`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

### 2. Usage Examples

#### Basic Chat Completion

```typescript
import { createChatCompletion, MODELS } from '@/lib/openrouter';

// Using GPT-4O
const response = await createChatCompletion(
  MODELS.GPT4O,
  [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ]
);

console.log(response.choices[0].message.content);
```

#### Using Different Models

```typescript
import { createChatCompletion, MODELS } from '@/lib/openrouter';

// Google Gemini
const geminiResponse = await createChatCompletion(
  MODELS.GEMINI_PRO_15,
  [{ role: 'user', content: 'Explain quantum computing' }]
);

// Anthropic Claude
const claudeResponse = await createChatCompletion(
  MODELS.CLAUDE_35_SONNET,
  [{ role: 'user', content: 'Write a poem' }]
);

// Mistral
const mistralResponse = await createChatCompletion(
  MODELS.MISTRAL_LARGE,
  [{ role: 'user', content: 'Summarize this text...' }]
);

// Meta Llama
const llamaResponse = await createChatCompletion(
  MODELS.LLAMA_31_70B,
  [{ role: 'user', content: 'Code review request...' }]
);
```

#### Vision (Image Analysis)

```typescript
import { createVisionCompletion, MODELS } from '@/lib/openrouter';

const response = await createVisionCompletion(
  MODELS.GPT4O, // Vision-capable model
  'https://example.com/image.jpg',
  'What is in this image?'
);

console.log(response.choices[0].message.content);
```

#### Streaming Responses

```typescript
import { createStreamingChatCompletion, MODELS } from '@/lib/openrouter';

const stream = await createStreamingChatCompletion(
  MODELS.GPT4O_MINI,
  [{ role: 'user', content: 'Tell me a story' }]
);

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

#### Custom Options

```typescript
import { createChatCompletion, MODELS } from '@/lib/openrouter';

const response = await createChatCompletion(
  MODELS.GPT4O,
  [{ role: 'user', content: 'Write a creative story' }],
  {
    temperature: 0.9,  // Higher = more creative
    maxTokens: 1000    // Limit response length
  }
);
```

### 3. API Routes

Two example API routes have been created:

#### `/api/chat` - Text Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "model": "openai/gpt-4o-mini"}'
```

#### `/api/analyze-image` - Image Analysis
```bash
curl -X POST http://localhost:3000/api/analyze-image \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "prompt": "What is in this image?",
    "model": "openai/gpt-4o"
  }'
```

### 4. Available Models

All models are available in `MODELS` constant:

**OpenAI:**
- `MODELS.GPT4O` - GPT-4O (latest, vision)
- `MODELS.GPT4O_MINI` - GPT-4O Mini (cost-effective)
- `MODELS.GPT4_TURBO` - GPT-4 Turbo
- `MODELS.GPT35_TURBO` - GPT-3.5 Turbo

**Google:**
- `MODELS.GEMINI_PRO_15` - Gemini Pro 1.5
- `MODELS.GEMINI_FLASH_15` - Gemini Flash 1.5
- `MODELS.GEMINI_PRO` - Gemini Pro

**Anthropic:**
- `MODELS.CLAUDE_35_SONNET` - Claude 3.5 Sonnet
- `MODELS.CLAUDE_3_OPUS` - Claude 3 Opus
- `MODELS.CLAUDE_3_HAIKU` - Claude 3 Haiku

**Mistral:**
- `MODELS.MISTRAL_LARGE` - Mistral Large
- `MODELS.MISTRAL_MEDIUM` - Mistral Medium
- `MODELS.MISTRAL_SMALL` - Mistral Small

**Meta:**
- `MODELS.LLAMA_31_405B` - Llama 3.1 405B
- `MODELS.LLAMA_31_70B` - Llama 3.1 70B
- `MODELS.LLAMA_31_8B` - Llama 3.1 8B

### 5. Client-Side Usage

```typescript
'use client';

import { useState } from 'react';

export default function ChatComponent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        model: 'openai/gpt-4o-mini' // or any other model
      }),
    });

    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <div>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={handleSubmit}>Send</button>
      <div>{response}</div>
    </div>
  );
}
```

### 6. Cost Optimization

OpenRouter shows costs for each model. For development:
- Use `GPT4O_MINI` or `GEMINI_FLASH_15` for cost-effective testing
- Use `GPT4O` or `CLAUDE_35_SONNET` for production/quality

### 7. Error Handling

```typescript
try {
  const response = await createChatCompletion(
    MODELS.GPT4O,
    [{ role: 'user', content: 'Hello' }]
  );
  console.log(response.choices[0].message.content);
} catch (error) {
  console.error('OpenRouter error:', error);
  // Handle error appropriately
}
```

## 📚 Additional Resources

- [OpenRouter Models](https://openrouter.ai/models)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Pricing](https://openrouter.ai/docs/models)

## 🔒 Security Note

- Never commit `.env.local` to Git (already in `.gitignore`)
- Keep your API key secure
- Use environment variables in production
