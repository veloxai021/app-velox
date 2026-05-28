/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));

// Initializing Google Gen AI dynamically
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing Gemini AI Client:', err);
  }
}

/// REST endpoints for the app
app.post('/api/velox/generate-response', async (req, res) => {
  const { message, style } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mensagem é obrigatória.' });
  }

  const chosenStyle = style || 'Ousado';

  // Fallback data in Portuguese (short, natural, direct)
  const localFallbacks: Record<string, any[]> = {
    Ousado: [
      {
        content: "Agora fiquei melhor... mas a culpa foi sua por ter aparecido aqui. 😉",
        context: "Conversa aberta",
        recommendation: "Mantenha o tom confiante e leve.",
        levelText: "Alto interesse",
        percentage: 87
      },
      {
        content: "Eu ia falar algo inteligente, mas sua foto me fez esquecer. De quem é a culpa?",
        context: "Flerte direto",
        recommendation: "Faça ela brincar se defendendo.",
        levelText: "Atração instantânea",
        percentage: 89
      }
    ],
    "Engraçado": [
      {
        content: "Não sou de fazer cena, mas você merece uma trilha sonora de cinema tocando agora.",
        context: "Tom descontraído",
        recommendation: "Valorize a risada e o humor.",
        levelText: "Envolvimento leve",
        percentage: 85
      },
      {
        content: "Ia dizer que você é linda, mas meu corretor disse 'maravilhosa'. Não discuto com a IA.",
        context: "Humor inocente",
        recommendation: "Transfira o foco para iniciar assunto.",
        levelText: "Conexão amigável",
        percentage: 82
      }
    ],
    "Brincalhão": [
      {
        content: "Ganhou um passe livre para me mandar mensagem quando quiser. Use com moderação!",
        context: "Provocação leve",
        recommendation: "Desafie de forma teatral.",
        levelText: "Clima amigável",
        percentage: 84
      }
    ],
    "Romântico": [
      {
        content: "Engraçado como meu dia ficou bem melhor quando vi sua mensagem. Qual o segredo?",
        context: "Sintonia sincera",
        recommendation: "Demonstre interesse genuíno por ela.",
        levelText: "Sintonia em alta",
        percentage: 92
      },
      {
        content: "Sabe, dizem que papos online são frios. Eles claramente nunca conversaram com você.",
        context: "Intimidade crescente",
        recommendation: "Seja caloroso.",
        levelText: "Interesse mútuo",
        percentage: 93
      }
    ],
    "Sedutor": [
      {
        content: "Seu jeito de falar me deixa muito intrigado. Que tal continuarmos isso numa ligação rápida?",
        context: "Estímulo direto",
        recommendation: "Faça uma proposta sutil.",
        levelText: "Aproximação física",
        percentage: 91
      },
      {
        content: "Você tem um mistério que me atrai mais do que deveria. O que vamos fazer sobre isso?",
        context: "Tensão e mistério",
        recommendation: "Crie suspense nas próximas respostas.",
        levelText: "Desejo latente",
        percentage: 94
      }
    ]
  };

  const currentFallbacks = localFallbacks[chosenStyle] || localFallbacks['Ousado'];
  const fallback = currentFallbacks[Math.floor(Math.random() * currentFallbacks.length)];

  if (!ai) {
    // Return mock fallback immediately
    return res.json({
      content: fallback.content,
      context: fallback.context,
      style: chosenStyle,
      recommendation: fallback.recommendation,
      levelText: fallback.levelText,
      percentage: fallback.percentage
    });
  }

  try {
    const prompt = `Você é o Velox AI, especialista em inteligência social de altíssimo nível, flerte moderno e conversação extremamente carismática de alta inteligência social.
Analise a mensagem recebida: "${message}" com o estilo de resposta escolhido: "${chosenStyle}".

REGRAS ABSOLUTAS E RÍGIDAS DE HUMANIDADE (PARA SER INDISTINGUÍVEL DE UM HUMANO NO WHATSAPP/TINDER):
1. NUNCA diga piadas prontas ou clichês bregas de cantadas antigas.
2. NUNCA parecer um assistente prestativo. Evite totalmente construções fofas ou robóticas tais como "Com certeza!", "Ah, que fantástico!", "Olá!", "Que interessante!", ou terminar com conselhos morais.
3. ESTILO DE DIGITAÇÃO REAL: Use gírias naturais do jovem brasileiro de 18 a 30 anos (como: "mano", "tipo", "boto fé", "massa", "caraca", "papo reto", "velho"). Se o estilo permitir, use abreviações leves normais no WhatsApp (como "vc", "pq", "tb", "mto", "fds") para dar autenticidade orgânica.
4. VARIABILIDADE POR ESTILO:
   - "Ousado": Confiante, misterioso, provocativo com classe, desafiador, direto mas brincalhão.
   - "Engraçado/Brincalhão": Irônico, sarcástico de leve, faz piada de si mesmo ou cria cenários hipotéticos absurdos engraçados.
   - "Romântico": Atencioso, charmoso, caloroso, faz um elogio sincero e focado na personalidade ou vibe dela.
   - "Sedutor": Tom de voz mais maduro, joga com tensão sutil implícita, propõe encontros ou chamadas de forma misteriosa e segura.
5. COMPRIMENTO DA RESPOSTA: A resposta ("content") DEVE ser extremamente curta, natural, direta de bate-rebate. De 15 a 52 caracteres maximo, contendo no máximo 1 frase curta rápida. Evite textos longos que assustam a outra pessoa.

Rigorosamente responda em formato JSON (sem markdown no JSON):
- "content": A resposta carismática, natural, viva e 100% humana (sem cara de IA).
- "context": Descrição curtíssima da intenção do flerte (ex: "Tensão de leve").
- "recommendation": Uma única dica prática e cirúrgica para que o homem saiba como manter o mistério ou avançar. Use tom firme, direto e seguro.
- "levelText": Resumo da situação atual do papo (ex: "Clima favorável").
- "percentage": Inteiro de 40 a 98 representando o progresso do flerte.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            context: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            levelText: { type: Type.STRING },
            percentage: { type: Type.INTEGER }
          },
          required: ['content', 'context', 'recommendation', 'levelText', 'percentage']
        }
      }
    });

    const bodyText = response.text;
    if (bodyText) {
      let cleanJson = bodyText.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      const parsed = JSON.parse(cleanJson);
      
      // Strict length guarantee: if it's too long, trim to first punctuation or clamp it
      let finalContent = parsed.content || fallback.content;
      if (finalContent.length > 80) {
        const punctuationIndex = finalContent.search(/[.!?]/);
        if (punctuationIndex > 10 && punctuationIndex < 80) {
          finalContent = finalContent.slice(0, punctuationIndex + 1).trim();
        } else if (finalContent.length > 80) {
          finalContent = finalContent.slice(0, 77).trim() + '...';
        }
      }

      return res.json({
        content: finalContent,
        context: parsed.context || fallback.context,
        style: chosenStyle,
        recommendation: parsed.recommendation || fallback.recommendation,
        levelText: parsed.levelText || fallback.levelText,
        percentage: parsed.percentage || fallback.percentage
      });
    }

    return res.json({ ...fallback, style: chosenStyle });
  } catch (err) {
    console.error('Error in generate-response:', err);
    return res.json({ ...fallback, style: chosenStyle });
  }
});

app.post('/api/velox/generate-pickup', async (req, res) => {
  const { style, imageBase64 } = req.body;
  const chosenStyle = style || 'Romântico';

  // Fallbacks
  const fallbackPickups: Record<string, any[]> = {
    Ousado: [
      {
        content: "Se seu status já prendeu minha atenção... imagina uma conversa de verdade.",
        context: "Perfil autêntico",
        recommendation: "Seja direto e confiante.",
        levelText: "Excelente engajamento",
        percentage: 92
      },
      {
        content: "Ia passar direto pelo feed hoje, mas sua foto me fez parar. Que tal um oi?",
        context: "Presença de impacto",
        recommendation: "Destaque a singularidade dela.",
        levelText: "Forte impacto",
        percentage: 88
      }
    ],
    "Brincalhão": [
      {
        content: "Com tantas fotos bonitas, acho que seu objetivo é me deixar desconcentrado.",
        context: "Fotos dinâmicas",
        recommendation: "Pergunte levemente sobre as fotos.",
        levelText: "Humor propício",
        percentage: 86
      }
    ],
    "Romântico": [
      {
        content: "Se seu olhar for tão leve quanto sua foto transmite, tomar um café com você mudaria meu mês.",
        context: "Foto receptiva",
        recommendation: "Continue sincero e sem exageros.",
        levelText: "Boa conexão",
        percentage: 91
      },
      {
        content: "Sua foto me deu dúvidas: você é mais de um romance calmo ou de uma aventura real?",
        context: "Atmosfera intimista",
        recommendation: "Pergunte sobre as preferências dela.",
        levelText: "Excelente conexão",
        percentage: 93
      }
    ],
    "Sedutor": [
      {
        content: "Você tem um magnetismo sutil que diz que de perto fica ainda melhor. Qual o segredo?",
        context: "Charme expressivo",
        recommendation: "Crie um suspense leve.",
        levelText: "Flerte agudo",
        percentage: 94
      }
    ]
  };

  const currentFallbacks = fallbackPickups[chosenStyle] || fallbackPickups['Romântico'];
  const fallback = currentFallbacks[Math.floor(Math.random() * currentFallbacks.length)];

  if (!ai) {
    return res.json({
      content: fallback.content,
      context: fallback.context,
      style: chosenStyle,
      recommendation: fallback.recommendation,
      levelText: fallback.levelText,
      percentage: fallback.percentage
    });
  }

  try {
    let promptText = `Você é o Velox AI, maior mentor de inteligência social e conquistas naturais do Brasil.
Você vai analisar o perfil ou interesse para gerar uma mensagem de abertura/início de conversa (cantada/comentário inteligente) que seja IRRESISTÍVEL, autêntica, intrigante e de alto impacto de estilo: "${chosenStyle}".

REGRAS SUPREMAS PARA PREVENIR APARÊNCIA DE INTELIGÊNCIA ARTIFICIAL:
1. SEM CLICHÊS DE INTERNET: Nunca compare ela a uma obra de arte, anjo, flor ou museu do Louvre. Isso é extremamente artificial e brega.
2. DETALHE SUTIL: Foque em detalhes específicos e profundos que pareçam uma observação natural de alguém muito perspicaz (ex: uma pulseira, a vibe da foto, o jeito do cabelo, o clima da imagem, ou o interesse listado).
3. TOM DE CHAT: Escreva como humanos de verdade enviam mensagens no Direct do Instagram: despretensioso, seguro de si, sem desespero, sem pontos de exclamação excessivos ou capslock. Opcionalmente use abreviações casuais paulistas/cariocas/mineiras como "vc", "tb", "mto", "pq".
4. PROPÓSITO: Chamar atenção imediata e despertar a curiosidade para fazer ela responder com um "kkkk" ou uma pergunta surpresa.
5. COMPRIMENTO DA CANTADA: A cantada ("content") DEVE ser extremamente curta, natural, direta de bate-rebate. De 15 a 52 caracteres maximo, contendo no máximo 1 frase rápida de direct. Nunca envie parágrafos longos ou descrições prolixas.

Gere o JSON estrito com as seguintes chaves (sem formatar markdown):
- "content": A abertura inteligente 100% natural e humana.
- "context": Descrição breve da foto ou interesse detectado de forma perspicaz.
- "recommendation": Dica de comportamento sobre como conduzir o assunto após essa mensagem.
- "levelText": Nível de resposta provável (ex: "Conexão garantida").
- "percentage": Inteiro de 40 a 98 representando o nível de progresso provável.`;

    let response;
    if (imageBase64) {
      const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanedBase64,
        },
      };
      
      const promptPart = {
        text: `${promptText}\n\nAnalise também as características da imagem enviada para calibrar o contexto e a cantada de forma brilhante!`
      };

      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: { parts: [imagePart, promptPart] },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              context: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              levelText: { type: Type.STRING },
              percentage: { type: Type.INTEGER }
            },
            required: ['content', 'context', 'recommendation', 'levelText', 'percentage']
          }
        }
      });
    } else {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              context: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              levelText: { type: Type.STRING },
              percentage: { type: Type.INTEGER }
            },
            required: ['content', 'context', 'recommendation', 'levelText', 'percentage']
          }
        }
      });
    }

    const bodyText = response.text;
    if (bodyText) {
      let cleanJson = bodyText.trim();
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      const parsed = JSON.parse(cleanJson);

      // Strict length guarantee: if it's too long, trim to first punctuation or clamp it
      let finalContent = parsed.content || fallback.content;
      if (finalContent.length > 80) {
        const punctuationIndex = finalContent.search(/[.!?]/);
        if (punctuationIndex > 10 && punctuationIndex < 80) {
          finalContent = finalContent.slice(0, punctuationIndex + 1).trim();
        } else if (finalContent.length > 80) {
          finalContent = finalContent.slice(0, 77).trim() + '...';
        }
      }

      return res.json({
        content: finalContent,
        context: parsed.context || fallback.context,
        style: chosenStyle,
        recommendation: parsed.recommendation || fallback.recommendation,
        levelText: parsed.levelText || fallback.levelText,
        percentage: parsed.percentage || fallback.percentage
      });
    }

    return res.json({ ...fallback, style: chosenStyle });
  } catch (err) {
    console.error('Error in generate-pickup:', err);
    return res.json({ ...fallback, style: chosenStyle });
  }
});

// Helper to clean environment variables (removing spaces, raw double/single quotes)
const cleanEnvVar = (val: string | undefined): string => {
  if (!val) return '';
  let s = val.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1).trim();
  }
  if (s.startsWith("'") && s.endsWith("'")) {
    s = s.slice(1, -1).trim();
  }
  const lower = s.toLowerCase();
  if (
    lower === 'your-anon-public-key' ||
    lower === 'your-supabase-service-role-key' ||
    lower === 'https://your-project.supabase.co' ||
    lower === 'your-project-id' ||
    lower === 'my_gemini_api_key' ||
    lower.includes('placeholder')
  ) {
    return '';
  }
  return s;
};

// Initializing Supabase server-side with user-specified environment variables
let sUrl = cleanEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
if (sUrl.endsWith('/')) {
  sUrl = sUrl.slice(0, -1);
}

const rawPublishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const rawPublicable = process.env.NEXT_PUBLIC_SUPABASE_PUBLICABLE_KEY;
const rawServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const rawSupabaseKey = process.env.SUPABASE_KEY;

const sKey = cleanEnvVar(
  rawPublishable ||
  rawPublicable ||
  rawServiceRole ||
  rawSupabaseKey
);

const isServerSupabaseConfigured = !!(sUrl && sKey);

console.log('[Supabase Server Diagnostic]');
console.log('  - Configured URL:', sUrl ? `${sUrl} (length: ${sUrl.length})` : 'Missing');
console.log('  - Selected Key Source:', 
  (cleanEnvVar(rawPublishable) ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY' : '') ||
  (cleanEnvVar(rawPublicable) ? 'NEXT_PUBLIC_SUPABASE_PUBLICABLE_KEY' : '') ||
  (cleanEnvVar(rawServiceRole) ? 'SUPABASE_SERVICE_ROLE_KEY/SERVICE_ROLE_KEY' : '') ||
  (cleanEnvVar(rawSupabaseKey) ? 'SUPABASE_KEY' : '') ||
  'None'
);
if (sKey) {
  const isJWT = sKey.startsWith('eyJ');
  console.log(`  - Key starts with 'eyJ' (Valid Supabase JWT prefix): ${isJWT ? 'YES ✅' : 'NO ❌ (starts with: "' + sKey.substring(0, 10) + '...")'}`);
  if (!isJWT) {
    console.warn('  ⚠️ WARNING: The selected Supabase API Key does not appear to be a valid JWT (anon/service_role key)! Please verify that you copied the correct key from your Supabase dashboard.');
  }
} else {
  console.log('  - Key Status: Missing or empty ❌');
}

const supabaseServer = isServerSupabaseConfigured
  ? createClient(sUrl, sKey, {
      auth: {
        persistSession: false
      }
    })
  : null;

// Supabase helper endpoints
app.get('/api/supabase/status', (req, res) => {
  res.json({ configured: isServerSupabaseConfigured });
});

app.post('/api/supabase/sync-profile', async (req, res) => {
  if (!supabaseServer) {
    return res.status(503).json({ error: 'Supabase Server-Side details not configured.' });
  }
  const { profile } = req.body;
  if (!profile || !profile.id) {
    return res.status(400).json({ error: 'Perfil inválido.' });
  }
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .upsert({
        id: profile.id,
        display_name: profile.display_name,
        email: profile.email || null,
        photo_url: profile.photo_url || null,
        selected_plan: profile.selected_plan || 'free',
        credits: profile.credits ?? 3,
        max_credits: profile.max_credits ?? 3,
        credits_used: profile.credits_used ?? 0,
        total_responses_generated: profile.total_responses_generated ?? 0,
        total_pickups_created: profile.total_pickups_created ?? 0,
        quiz_answers: profile.quiz_answers || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      let msg = error.message || '';
      if (error.code === 'PGRST125') {
        msg += " | SUGESTÃO: A tabela 'users' não existe no banco de dados. Acesse o painel do Supabase -> SQL Editor do seu projeto e execute o script contido em '/supabase/migrations/20260526000000_init_schema.sql' para criar as tabelas necessárias.";
      } else if (msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('jwt') || error.code === 'UNKNOWN' || error.code === 'PGRST301') {
        msg += " | SUGESTÃO: A chave de API do Supabase está incorreta ou inválida. Verifique se o valor de NEXT_PUBLIC_SUPABASE_PUBLICABLE_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no painel do AI Studio foi copiado corretamente e não contém aspas extras ou espaços. Ela deve iniciar com 'eyJ...'.";
      }
      console.error(`Error in secure syncUserProfile: [Code: ${error.code || 'UNKNOWN'}] ${msg} | Details: ${error.details || 'none'} | Hint: ${error.hint || 'none'}`);
      return res.status(500).json({ error: msg, code: error.code, details: error.details });
    }
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Exception in secure syncUserProfile:', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

app.post('/api/supabase/save-log', async (req, res) => {
  if (!supabaseServer) {
    return res.status(503).json({ error: 'Supabase Server-Side details not configured.' });
  }
  const { log } = req.body;
  if (!log || !log.id || !log.user_id) {
    return res.status(400).json({ error: 'Log inválido.' });
  }
  try {
    const { data, error } = await supabaseServer
      .from('logs')
      .insert({
        id: log.id,
        user_id: log.user_id,
        type: log.type,
        context: log.context || '',
        style: log.style || 'Ousado',
        recommendation: log.recommendation || '',
        level_text: log.level_text || '',
        percentage: log.percentage ?? 75,
        content: log.content,
        created_at: log.created_at || new Date().toISOString()
      });

    if (error) {
      let msg = error.message || '';
      if (error.code === 'PGRST125') {
        msg += " | SUGESTÃO: A tabela 'logs' não existe no banco de dados. Acesse o painel do Supabase -> SQL Editor do seu projeto e execute o script contido em '/supabase/migrations/20260526000000_init_schema.sql' para criar as tabelas necessárias.";
      } else if (msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('jwt') || error.code === 'UNKNOWN' || error.code === 'PGRST301') {
        msg += " | SUGESTÃO: A chave de API do Supabase está incorreta ou inválida. Verifique se o valor de NEXT_PUBLIC_SUPABASE_PUBLICABLE_KEY ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no painel do AI Studio foi copiado corretamente e não contém aspas extras ou espaços. Ela deve iniciar com 'eyJ...'.";
      }
      console.error(`Error in secure saveLogToSupabase: [Code: ${error.code || 'UNKNOWN'}] ${msg} | Details: ${error.details || 'none'} | Hint: ${error.hint || 'none'}`);
      return res.status(500).json({ error: msg, code: error.code, details: error.details });
    }
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Exception in secure saveLogToSupabase:', err);
    return res.status(500).json({ error: err?.message || String(err) });
  }
});

app.get('/api/supabase/fetch-logs', async (req, res) => {
  if (!supabaseServer) {
    return res.json({ data: [] });
  }
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'userId es obrigatório.' });
  }
  try {
    const { data, error } = await supabaseServer
      .from('logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error in secure fetchLogs:', error);
      return res.json({ data: [] });
    }
    return res.json({ data: data || [] });
  } catch (err) {
    console.error('Exception in secure fetchLogs:', err);
    return res.json({ data: [] });
  }
});

app.get('/api/supabase/fetch-profile', async (req, res) => {
  if (!supabaseServer) {
    return res.json({ data: null });
  }
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: 'userId es obrigatório.' });
  }
  try {
    const { data, error } = await supabaseServer
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error in secure fetchUserProfile:', error);
      }
      return res.json({ data: null });
    }
    return res.json({ data });
  } catch (err) {
    console.error('Exception in secure fetchUserProfile:', err);
    return res.json({ data: null });
  }
});

// Configure Vite or Static delivery
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Velox AI server running on port ${PORT}`);
  });
}

startServer();
