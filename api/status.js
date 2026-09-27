export default async function handler(req, res) {
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1/operations/${id}?key=${process.env.GEMINI_API_KEY}`
    );

    const d = await r.json();

    return res.status(200).json({
      done: d.done || false,
      progress: d.metadata?.progressPercentage || 0,
      eta: d.metadata?.estimatedSecondsRemaining || 0,
      videoUrl: d.response?.generatedVideos?.[0]?.video?.uri || ""
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}