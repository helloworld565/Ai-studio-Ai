export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const {
    prompt,
    image = "",
    resolution = "1080P",
    fps = 24,
    duration = 8,
    aspect = "16:9"
  } = req.body;

  const body = {
    prompt,
    config: {
      aspectRatio: aspect,
      durationSeconds: Number(duration),
      frameRate: Number(fps)
    }
  };

  if (image) body.image = { uri: image };

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-preview:generateVideo?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );

  const data = await r.json();

  if (!r.ok) return res.status(500).json(data);

  res.json({ name: data.name });
}