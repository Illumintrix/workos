import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { input, apiKey } = req.body;

    if (!input) {
      res.status(400).json({ error: 'Input text is required' });
      return;
    }

    // Use user-provided API key or fallback to system environment variable
    const activeApiKey = (apiKey || process.env.VITE_OPENAI_API_KEY || '').trim();

    if (!activeApiKey || activeApiKey === 'undefined') {
      res.status(401).json({ error: 'OpenAI API key not configured. Add it in Settings.' });
      return;
    }

    const apiResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input,
        model: 'text-embedding-3-small',
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('OpenAI API error:', apiResponse.status, errorText);
      res.status(apiResponse.status).json({ error: `OpenAI API error: ${apiResponse.status}`, details: errorText });
      return;
    }

    const data = await apiResponse.json() as any;
    const embedding = data.data?.[0]?.embedding;

    if (!embedding) {
      res.status(500).json({ error: 'Failed to generate embedding' });
      return;
    }

    res.status(200).json({ embedding });
  } catch (error: any) {
    console.error('Embedding proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
