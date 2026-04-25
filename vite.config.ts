import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'http'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'openrouter-ai-proxy',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req: IncomingMessage, res: ServerResponse) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }

            try {
              const { messages, model, temperature, max_tokens, apiKey: userKey, ...rest } = JSON.parse(body);
              const systemApiKey = env.VITE_OPENROUTER_API_KEY;
              
              // Robust API key selection with trimming
              let activeApiKey = (userKey || systemApiKey || '').trim();

              if (!activeApiKey || activeApiKey === 'your-openrouter-api-key-here' || activeApiKey === 'undefined') {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'OpenRouter API key not configured. Add VITE_OPENROUTER_API_KEY to .env or provide your own in Settings.' }));
                return;
              }

              const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${activeApiKey}`,
                  'Content-Type': 'application/json',
                  'HTTP-Referer': 'http://localhost:5173',
                  'X-Title': 'Work Intelligence OS',
                },
                body: JSON.stringify({
                  model: model || 'google/gemma-3-27b-it:free',
                  messages,
                  max_tokens: max_tokens || 4096,
                  temperature: temperature ?? 0.7,
                  top_p: 0.95,
                  ...rest
                }),
              });

              if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                console.error('OpenRouter API error:', apiResponse.status, errorText);
                res.statusCode = apiResponse.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: `OpenRouter API error: ${apiResponse.status}`, details: errorText }));
                return;
              }

              const data = await apiResponse.json() as any;
              const content = data.choices?.[0]?.message?.content || '';

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ content }));
            } catch (error: any) {
              console.error('AI proxy error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
            }
          });
        },
      },
    ],
  }
})
