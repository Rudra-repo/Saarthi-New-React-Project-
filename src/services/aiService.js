// src/services/aiService.js

/**
 * Saarthi AI Service - Robust Google Gemini Integration
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const ROOT_URL = 'https://generativelanguage.googleapis.com'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

let modelOptions = [];

/**
 * Groq Fetch: Ultra-fast alternative/fallback
 */
async function fetchGroq(messages, model = 'llama-3.3-70b-versatile') {
  if (!GROQ_API_KEY) throw new Error("Groq API Key missing. Please provide it in the console.");
  
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" }
    })
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(`Groq API Error (${res.status}): ${errorBody.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/**
 * Grid Search Fetch: Tries every combination of models and versions (v1, v1beta).
 */
async function fetchGeminiExhaustive(payload) {
  const options = await discoverModels();
  const versions = ['v1', 'v1beta'];
  
  for (const modelId of options) {
    for (const ver of versions) {
      const url = `${ROOT_URL}/${ver}/${modelId}:generateContent?key=${GEMINI_API_KEY}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) return res;

        if (res.status === 429) {
          // If we have Groq, don't throw yet, let the caller decide to fallback
          const err = new Error("Quota Exceeded (429)");
          err.status = 429;
          throw err;
        }

        if (res.status === 503) {
          await new Promise(r => setTimeout(r, 2000));
          return fetchGeminiExhaustive(payload); 
        }

        if (res.status === 404) continue;
        
      } catch (e) {
        if (e.name === 'AbortError') throw new Error("Connection Timeout (25s)");
        if (e.status === 429) throw e;
        console.warn(`Hunt failed for ${ver}/${modelId}:`, e.message);
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }
  
  throw new Error("Gemini is currently unavailable.");
}

async function discoverModels() {
  if (modelOptions.length > 0) return modelOptions;
  
  try {
    const res = await fetch(`${ROOT_URL}/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await res.json();
    const models = data.models || [];
    
    const flash = models.find(m => m.name.includes('gemini-1.5-flash'));
    const flash8b = models.find(m => m.name.includes('gemini-1.5-flash-8b'));
    const pro = models.find(m => m.name.includes('gemini-pro'));
    
    modelOptions = [
      flash?.name, 
      flash8b?.name, 
      pro?.name, 
      'models/gemini-1.5-flash',
      'models/gemini-pro'
    ].filter(Boolean);
    
    return [...new Set(modelOptions)];
  } catch (error) {
    return ['models/gemini-1.5-flash', 'models/gemini-pro'];
  }
}

function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to find JSON block
    const match = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      try { 
        return JSON.parse(match[0]); 
      } catch (e2) {
        // Simple fallback parsing for semi-valid JSON
        console.warn("JSON block found but fail to parse:", match[0].substring(0, 50));
      }
    }
    return null;
  }
}

/**
 * Core AI Analysis - With Fallback to Groq
 */
export async function analyseSituation(situationText, lang = 'en', profile = {}) {
  const langPrompt = lang === 'hi' ? 'Respond in pure Hindi.' : 'Respond in simple English.';
  const systemPrompt = `You are Saarthi, a highly empathetic and personalized social worker assistant. ${langPrompt} 
1. Provide a comforting, personalized 2-sentence 'summary' addressing their specific situation directly (e.g. "I am so sorry to hear about your job loss, but don't lose hope. We have found several government and private opportunities for you.")
2. Suggest up to 3 'schemeCategories' from this EXACT list ONLY: ["farmer", "health", "education", "loan", "housing", "women", "senior", "disability", "job"].
3. Provide 2 'immediateSteps'.
Return ONLY valid JSON: { "summary": string, "urgency": "low"|"medium"|"high", "schemeCategories": string[], "immediateSteps": string[] }.`;

  try {
    // 1. Try Gemini First
    try {
      const payload = {
        contents: [{ parts: [{ text: `${systemPrompt}\n\nSituation: ${situationText}` }] }]
      };
      const res = await fetchGeminiExhaustive(payload);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return extractJSON(text) || { summary: "AI Data Format Error" };
    } catch (geminiError) {
      // 2. If Gemini Quota Exceeded (429) OR Timeout, try Groq
      if (geminiError.status === 429 && GROQ_API_KEY) {
        console.log("Gemini Quota Hit. Falling back to Groq...");
        const groqText = await fetchGroq([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Situation: ${situationText}` }
        ]);
        return extractJSON(groqText);
      }
      throw geminiError;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Self-Employment Recommendations - With Fallback to Groq
 */
export async function suggestSelfEmployment(skillsText, lang = 'en') {
  const systemPrompt = `Suggest 6 low-capital business ideas for someone with these skills: ${skillsText}. Return ONLY a JSON object with an "ideas" key containing an array of 6 strings. Example: { "ideas": ["idea1", "idea2", ...] }`;
  
  try {
    try {
      const payload = { contents: [{ parts: [{ text: systemPrompt }] }] };
      const res = await fetchGeminiExhaustive(payload);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      const parsed = extractJSON(text);
      
      // Normalize to flat array
      if (Array.isArray(parsed)) return parsed;
      if (parsed && typeof parsed === 'object') {
        return Object.values(parsed).find(val => Array.isArray(val)) || [];
      }
      return [];
    } catch (geminiError) {
      if (geminiError.status === 429 && GROQ_API_KEY) {
        console.log("Gemini Quota Hit in Earn section. Falling back to Groq...");
        const groqText = await fetchGroq([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Skills: ${skillsText}` }
        ]);
        const parsed = extractJSON(groqText);
        
        // Groq in json_object mode always returns an object.
        // We look for any array inside that object (usually "ideas" or similar).
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object') {
          return Object.values(parsed).find(val => Array.isArray(val)) || [];
        }
        return [];
      }
      throw geminiError;
    }
  } catch (error) {
    return [`Error: ${error.message}`];
  }
}
