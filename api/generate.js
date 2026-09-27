export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  const r = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-preview:generateVideo?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        aspectRatio: "16:9",
        durationSeconds: 8
      })
    }
  );

  const data = await r.json();
  res.status(200).json(data);
}