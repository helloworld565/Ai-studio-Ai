export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  try {
    const { prompt } = req.body;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/veo-3.0-generate-001:generateVideos?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      }
    );

    const data = await r.json();

    if (!r.ok) return res.status(r.status).json(data);

    res.status(200).json({ name: data.name });

  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}