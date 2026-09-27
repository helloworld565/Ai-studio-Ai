export default async function handler(req, res) {
  const { id } = req.query;

  const r = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/" +
    id +
    "?key=" +
    process.env.GEMINI_API_KEY
  );

  const op = await r.json();

  const done = op.done || false;
  const progress = op.metadata?.progressPercentage || 0;
  const eta = Math.max(0, Math.ceil((100 - progress) * 1.8));

  let videoUrl = "";
  if (done) {
    videoUrl =
      op.response?.generatedVideos?.[0]?.video?.uri || "";
  }

  res.status(200).json({
    done,
    progress,
    eta,
    videoUrl
  });
}