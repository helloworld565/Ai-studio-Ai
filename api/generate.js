export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-preview:generateVideos?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      }
    );

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data.error?.message || "Gemini API Error",
      });
    }

    return res.status(200).json({
      name: data.name,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
}