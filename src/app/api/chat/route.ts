import { NextRequest, NextResponse } from 'next/server'
import { GEMINI_LITE } from '@/lib/gemini-models'
import { lumenSystemPrompt } from '@/lib/lumen-ai-prompt'

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-gemini-api-key')
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing BYOK key. Add your own key in Settings.' }, { status: 401 })
    }

    const { messages, context } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Build system prompt with context from scan history
    const systemPrompt = lumenSystemPrompt(context)

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GEMINI_LITE,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API Error:', data)
      return NextResponse.json(
        { error: data?.error?.message || data?.[0]?.error?.message || 'AI service error' },
        { status: response.status }
      )
    }

    // Clean up any remaining markdown formatting from the response
    if (data.choices?.[0]?.message?.content) {
      let cleanContent = data.choices[0].message.content

      // Remove bold/italic markdown
      cleanContent = cleanContent.replace(/\*\*([^*]+)\*\*/g, '$1') // **bold**
      cleanContent = cleanContent.replace(/\*([^*]+)\*/g, '$1')     // *italic*
      cleanContent = cleanContent.replace(/__([^_]+)__/g, '$1')     // __bold__
      cleanContent = cleanContent.replace(/_([^_]+)_/g, '$1')       // _italic_

      // Remove bullet points with dashes or asterisks, keep the text
      cleanContent = cleanContent.replace(/^\s*[-*]\s+/gm, '')

      // Clean up extra whitespace
      cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n')

      data.choices[0].message.content = cleanContent.trim()
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
