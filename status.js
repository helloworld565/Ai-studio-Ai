export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing job id" });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1/${id}?key=${process.env.GEMINI_API_KEY}`
    );

    const d = await r.json();

    const done = d.done || false;
    const progress = d.metadata?.progressPercentage || 0;
    const eta = d.metadata?.etaSeconds || 0;

    const videoUrl =
      d.response?.generatedVideos?.[0]?.video?.uri || "";

    return res.status(200).json({
      done,
      progress,
      eta,
      state: done ? "Ready" : "Generating...",
      videoUrl
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}