export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    prompt,
    image = "",
    extend = false,
    lastVideo = "",
    resolution = "4K",
    fps = 24,
    duration = 8,
    aspect = "16:9"
  } = req.body;

  try {
    const body = {
      prompt,
      config: {
        aspectRatio: aspect,
        durationSeconds: Number(duration),
        frameRate: Number(fps),
        resolution
      }
    };

    if (image) body.image = { uri: image };
    if (extend && lastVideo) body.lastVideo = { uri: lastVideo };

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/veo-3.0-generate-preview:generateVideo?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json(data);
    }

    res.status(200).json({
      name: data.name,
      done: false
    });

  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}