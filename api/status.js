export default async function handler(req, res) {
  const { id } = req.query;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${id}?key=${process.env.GEMINI_API_KEY}`
  );

  const op = await r.json();

  const done = op.done === true;
  const progress = done ? 100 : (op.metadata?.progressPercentage || 0);

  const videoUrl =
    op.response?.generatedVideos?.[0]?.video?.uri || "";

  res.json({
    done,
    progress,
    eta: done ? 0 : Math.round((100 - progress) * 1.5),
    videoUrl
  });
}