export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, aspectRatio = "16:9" } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt.trim()
            }
          ],
          parameters: {
            aspectRatio: aspectRatio,
            sampleCount: 1
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API Error"
      });
    }

    // operation name example: "operations/xxxxx"
    return res.status(200).json({
      name: data.name
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}