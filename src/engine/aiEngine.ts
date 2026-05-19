// AI Work Intelligence OS — AI Engine
// Multi-model strategy via OpenRouter (OpenAI-compatible)
//
// Models:
//   Gemma 4 31B IT   — primary conversation + extraction (free)
//   GPT-OSS 120B     — quality writing (reflections, portfolio) (free)
//   Nemotron 3 Nano  — lightweight classification (free)
//
// Budget: ~200 requests/day per model. Batch operations where possible.

import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { buildSystemPrompt } from './systemPrompt';
import { useAppStore } from '../store';
import type { AIExtractions } from '../store/types';

// ─── Model Constants ─────────────────────────────────────────────────────────

export const MODELS = {
  /** Primary: real-time conversation + structured extraction */
  PRIMARY: 'google/gemma-4-31b-it:free',
  /** Quality: weekly reflections, monthly summaries, portfolio bullets */
  QUALITY: 'openai/gpt-oss-120b:free',
  /** Fast: lightweight classification checks */
  FAST: 'nvidia/nemotron-3-super-120b-a12b:free',
} as const;

// ─── Core API Call ───────────────────────────────────────────────────────────

async function callAI(
  messages: { role: string; content: string }[],
  model: string = MODELS.PRIMARY,
  temperature: number = 0.7,
  max_tokens: number = 4096,
  additionalParams: any = {}
): Promise<string> {
  const userApiKey = useAppStore.getState().settings.openaiApiKey;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      messages, 
      model, 
      temperature, 
      max_tokens,
      apiKey: userApiKey || undefined, // Fallback handled by server if undefined
      ...additionalParams 
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  return data.content;
}



// ─── Main Conversation Handler ───────────────────────────────────────────────
// Uses Gemma 3 27B IT — primary model for core intelligence

export async function sendMessageToAI(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<{ message: string; extractions: AIExtractions }> {
  const state = useAppStore.getState();

  const systemPrompt = buildSystemPrompt({
    existingTasks: state.tasks.map((t) => ({
      id: t.id,
      title: t.title,
      projectId: t.projectId,
      status: t.status,
    })),
    existingNotes: state.notes.map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      projectId: n.projectId,
    })),
    existingDecisions: state.decisions.map((d) => ({
      id: d.id,
      title: d.title,
      projectId: d.projectId,
    })),
    projects: state.projects.map(p => ({ id: p.id, name: p.name })),
    selectedProjectId: state.selectedProjectId,
    currentDate: format(new Date(), 'yyyy-MM-dd (EEEE)'),
    userName: state.settings.name || '',
  });

  const messages = [
    { role: 'user', content: `[SYSTEM INSTRUCTION]\n${systemPrompt}` },
    ...conversationHistory.slice(-20),
    { role: 'user', content: userMessage },
    { role: 'user', content: '[REMINDER] Respond ONLY with the JSON object. Ensure extractions are populated.' },
  ];

  try {
    // Call PRIMARY model with appropriate prompt
    const raw = await callAI(messages, MODELS.PRIMARY, 0.2, 4096);
    console.log('[AI DEBUG] Raw Response:', raw);
    const aiResponse = parseAIResponse(raw);

    const now = new Date().toISOString();
    const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    const extractions: AIExtractions = {
      tasks: aiResponse.extractions.tasks
        .filter((t) => t.title && t.title.trim().length > 0)
        .map((t) => ({
          id: (t.id && isValidUUID(t.id)) ? t.id : uuidv4(),
          title: t.title,
          description: t.description || '',
          status: t.status || 'to_do',
          priority: t.priority || 'medium',
          dueDate: t.dueDate || t.due_date || null,
          projectId: t.projectId || t.project_id || state.selectedProjectId || null,
          tags: t.tags || [],
          linkedNoteIds: t.linkedNoteIds || t.linked_note_ids || [],
          linkedDecisionIds: t.linkedDecisionIds || t.linked_decision_ids || [],
          sourceMessageId: '',
          aiConfidence: t.confidence || 'high',
          createdAt: now,
          updatedAt: now,
        })),
      notes: aiResponse.extractions.notes
        .filter((n) => n.title && n.title.trim().length > 0)
        .map((n) => ({
          id: (n.id && isValidUUID(n.id)) ? n.id : uuidv4(),
          title: n.title,
          content: n.content || '',
          category: n.category || 'General',
          projectId: n.projectId || n.project_id || state.selectedProjectId || null,
          tags: n.tags || [],
          linkedTaskIds: n.linkedTaskIds || n.linked_task_ids || [],
          linkedDecisionIds: n.linkedDecisionIds || n.linked_decision_ids || [],
          sourceMessageId: '',
          aiConfidence: n.confidence || 'high',
          createdAt: now,
          updatedAt: now,
        })),
      decisions: aiResponse.extractions.decisions
        .filter((d) => d.title && d.title.trim().length > 0)
        .map((d) => ({
          id: (d.id && isValidUUID(d.id)) ? d.id : uuidv4(),
          title: d.title,
          reasoning: d.reasoning || '',
          alternatives: d.alternatives || [],
          tradeoffs: d.tradeoffs || '',
          risks: d.risks || '',
          projectId: d.projectId || d.project_id || state.selectedProjectId || null,
          tags: d.tags || [],
          linkedTaskIds: d.linkedTaskIds || d.linked_task_ids || [],
          linkedNoteIds: d.linkedNoteIds || d.linked_note_ids || [],
          sourceMessageId: '',
          aiConfidence: d.confidence || 'high',
          createdAt: now,
          updatedAt: now,
        })),
      reflections: aiResponse.extractions.reflections.map((r) => ({
        id: uuidv4(),
        type: 'manual' as const,
        summary: r.summary,
        wins: r.wins || [],
        challenges: r.challenges || [],
        learnings: r.learnings || [],
        improvements: r.improvements || [],
        moodScore: null,
        projectId: state.selectedProjectId,
        createdAt: now,
        updatedAt: now,
      })),
      deletions: aiResponse.extractions.deletions || [],
    };

    return { message: aiResponse.message, extractions };
  } catch (error) {
    console.error('AI Engine Error:', error);
    throw error;
  }
}

// ─── Quality Writing (Reflections / Portfolio) ───────────────────────────────
// Uses GPT-OSS 120B — reserved for infrequent high-quality generation

export async function generateWeeklyReflection(
  context: string,
): Promise<string> {
  const messages = [
    {
      role: 'user',
      content: '[SYSTEM]\nYou are a thoughtful work coach. Generate a structured weekly reflection based on the user\'s work data. Include: summary paragraph, wins, challenges, learnings, and improvement suggestions. Write warmly and insightfully. Respond in plain text, not JSON.',
    },
    { role: 'user', content: context },
  ];

  return callAI(messages, MODELS.QUALITY, 0.8, 2048);
}

export async function generatePortfolioBullet(
  achievementContext: string,
): Promise<string> {
  const messages = [
    {
      role: 'user',
      content: '[SYSTEM]\nYou are a career writing expert. Generate a single strong, results-oriented resume bullet point from the work context provided. Use action verbs, quantify impact where possible, and keep it to 1-2 sentences. Respond with just the bullet point text.',
    },
    { role: 'user', content: achievementContext },
  ];

  return callAI(messages, MODELS.QUALITY, 0.6, 256);
}

// ─── Semantic Search ───────────────────────────────────────────────────────────

export async function performSemanticSearch(
  query: string,
  contextData: { id: string; type: string; title: string; text: string }[]
): Promise<string[]> {
  const systemPrompt = `[SYSTEM]
You are a semantic search engine.
You will be given a user query and a list of workspace items (tasks, notes, decisions, reflections) in JSON format.
Your job is to find the items that conceptually or semantically match the user's query.
Do NOT just look for exact keywords. Understand the meaning.
Return ONLY a JSON array containing the string IDs of the matching items. No other text.
If nothing matches, return an empty array [].
Example: ["id1", "id2"]`;

  const messages = [
    { role: 'user', content: systemPrompt },
    { role: 'user', content: `WORKSPACE DATA:\n${JSON.stringify(contextData)}\n\nQUERY:\n${query}` }
  ];

  try {
    const raw = await callAI(messages, MODELS.PRIMARY, 0.2, 1024);
    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    
    // Extract JSON array
    const match = cleaned.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch (error) {
    console.error('Semantic Search Error:', error);
    return [];
  }
}

// ─── Manual Single Extraction ────────────────────────────────────────────────

export async function extractSingleItem(
  text: string,
  type: 'task' | 'note' | 'decision'
): Promise<any> {
  let formatInstructions = '';
  
  if (type === 'task') {
    formatInstructions = `{"title": "Task title", "description": "Optional details", "dueDate": "YYYY-MM-DD or null", "priority": "high|medium|low", "status": "to_do", "projectId": "Project ID or null", "tags": ["tag1", "tag2"]}`;
  } else if (type === 'note') {
    formatInstructions = `{"title": "Note title", "content": "Full note content", "category": "General topic", "projectId": "Project ID or null", "tags": ["tag1"]}`;
  } else if (type === 'decision') {
    formatInstructions = `{"title": "Decision title", "reasoning": "Why it was made", "alternatives": ["Alt 1"], "tradeoffs": "What was traded off", "risks": "Potential risks", "projectId": "Project ID or null", "tags": ["tag1"]}`;
  }

  const systemPrompt = `[SYSTEM]
You are a helpful data extraction assistant.
The user will provide a short natural language text describing a new ${type}.
Your job is to extract the structured fields from their text and return ONLY a valid JSON object matching the following format:
${formatInstructions}
If a field is not mentioned, use a reasonable default or null. Do not include any other text, reasoning, or markdown formatting outside the JSON block.`;

  const messages = [
    { role: 'user', content: systemPrompt },
    { role: 'user', content: text }
  ];

  try {
    const raw = await callAI(messages, MODELS.PRIMARY, 0.2, 1024);
    const cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    
    // Attempt to extract JSON
    let jsonStr = cleaned;
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error(`Error extracting single ${type}:`, error);
    return null;
  }
}

// ─── Response Parser ─────────────────────────────────────────────────────────

interface ParsedResponse {
  message: string;
  extractions: {
    tasks: any[];
    notes: any[];
    decisions: any[];
    reflections: any[];
    deletions: any[];
  };
}

function parseAIResponse(raw: string): ParsedResponse {
  const thinkingRemoved = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  // Attempt to find JSON block
  let jsonStr = '';
  
  // 1. Try to find content between ```json and ```
  const jsonMatch = thinkingRemoved.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  } else {
    // 2. Try to find content between first { and last }
    const startIdx = thinkingRemoved.indexOf('{');
    const endIdx = thinkingRemoved.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      jsonStr = thinkingRemoved.substring(startIdx, endIdx + 1).trim();
    }
  }

  if (jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      return {
        message: parsed.message || "I've processed your message.",
        extractions: {
          tasks: parsed.extractions?.tasks || [],
          notes: parsed.extractions?.notes || [],
          decisions: parsed.extractions?.decisions || [],
          reflections: parsed.extractions?.reflections || [],
          deletions: parsed.extractions?.deletions || [],
        },
      };
    } catch (e) {
      console.warn('Found JSON-like block but failed to parse it:', e);
    }
  }

  // Fallback: If no JSON found or parsing failed, treat the whole thing as a message
  return {
    message: thinkingRemoved,
    extractions: { tasks: [], notes: [], decisions: [], reflections: [], deletions: [] },
  };
}
