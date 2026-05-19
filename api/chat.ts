import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { messages, model, temperature, max_tokens, apiKey: userKey, ...rest } = req.body;
    const systemApiKey = process.env.VITE_OPENROUTER_API_KEY;
    
    // Robust API key selection with trimming
    let activeApiKey = (userKey || systemApiKey || '').trim();

    if (!activeApiKey || activeApiKey === 'your-openrouter-api-key-here' || activeApiKey === 'undefined') {
      res.status(500).json({ error: 'OpenRouter API key not configured. Add VITE_OPENROUTER_API_KEY to Environment Variables.' });
      return;
    }

    const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${activeApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://work-intelligence-os.vercel.app',
        'X-Title': 'Work Intelligence OS',
      },
      body: JSON.stringify({
        model: model || 'google/gemma-4-31b-it:free',
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
      res.status(apiResponse.status).json({ error: `OpenRouter API error: ${apiResponse.status}`, details: errorText });
      return;
    }

    const data = await apiResponse.json() as any;
    const content = data.choices?.[0]?.message?.content || '';

    res.status(200).json({ content });
  } catch (error: any) {
    console.error('AI proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
