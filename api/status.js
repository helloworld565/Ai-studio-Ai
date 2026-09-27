export default async function handler(req, res) {
  const { id } = req.query;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1/operations/${id}?key=${process.env.GEMINI_API_KEY}`
  );

  const d = await r.json();

  res.json({
    done: d.done || false,
    stage: d.metadata?.state || "Processing",
    progress: d.metadata?.progressPercentage || 0,
    eta: d.metadata?.estimatedSecondsRemaining || 0,
    videoUrl: d.response?.generatedVideos?.[0]?.video?.uri || ""
  });
}