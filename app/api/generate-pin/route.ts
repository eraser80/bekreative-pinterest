import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, productName, productLink } = await request.json();

    const BOARDS = [
      "Piante Artificiali di Design per la Casa",
      "Vasi Decorativi e Complementi d'Arredo",
      "Copridivano e Tessile per il Salotto",
      "Profumatori Casa Esteban Paris",
      "Ispirazione Salotto e Soggiorno",
      "Tavola e Stoviglie di Design",
      "Corni Portafortuna e Oggetti Scaramantici",
      "Quadri e Decorazioni da Parete",
      "Mobili su Misura Bari — BeKreative",
      "Ispirazione Home Décor Italia"
    ];

    const productContext = productName ? `\nProdotto: ${productName}` : '';
    const linkContext = productLink ? `\nLink: ${productLink}` : '';

    const prompt = `Sei un esperto Pinterest marketing per home décor italiano. Analizza questa immagine di BeKreative (arredamento Bari — bekreative.it).${productContext}${linkContext}

Rispondi SOLO con JSON valido senza markdown:
{
  "board": "scegli tra: ${BOARDS.join(' | ')}",
  "title": "titolo max 100 caratteri con parole chiave Pinterest in italiano",
  "description": "descrizione 150-200 caratteri evocativa${productLink ? ' includi ' + productLink : ' menziona bekreative.it'}",
  "hashtags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 }
            },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text.trim();
    const clean = text.replace(/```json\n?|```\n?/g, '').trim();
    const pinData = JSON.parse(clean);

    return NextResponse.json(pinData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Errore generazione' }, { status: 500 });
  }
}
