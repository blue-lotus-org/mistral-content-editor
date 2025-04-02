import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, context, settings } = await req.json()

    if (!settings.apiKey) {
      return NextResponse.json({ message: "Mistral API key is required" }, { status: 400 })
    }

    // Prepare the prompt with context
    const fullPrompt = context ? `Context: ${context}\n\nTask: ${prompt}` : prompt

    // Call Mistral API
    const response = await fetch("https://api.mistral.ai/v1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [{ role: "user", content: fullPrompt }],
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { message: error.error?.message || "Failed to generate content" },
        { status: response.status },
      )
    }

    const data = await response.json()
    const generatedContent = data.choices[0].message.content

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("Error in Mistral API route:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

