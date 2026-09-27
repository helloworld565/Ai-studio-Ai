export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing operation id" });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${id}?key=${process.env.GEMINI_API_KEY}`
    );

    const op = await r.json();

    const done = op.done === true;

    // Real progress from Google
    let progress = op.metadata?.progressPercentage ?? 0;

    if (done) progress = 100;

    const eta = done ? 0 : Math.max(1, Math.round((100 - progress) * 1.6));

    let videoUrl = "";

    if (done) {
      videoUrl =
        op.response?.generatedVideos?.[0]?.video?.uri || "";
    }

    return res.status(200).json({
      done,
      progress,
      eta,
      stage: progress < 10 ? "Queued"
           : progress < 30 ? "Analyzing"
           : progress < 60 ? "Rendering"
           : progress < 90 ? "Animating"
           : progress < 100 ? "Encoding"
           : "Complete",
      videoUrl
    });

  } catch (e) {
    return res.status(500).json({
      done: false,
      progress: 0,
      eta: 0,
      stage: "Error",
      error: e.message
    });
  }
}