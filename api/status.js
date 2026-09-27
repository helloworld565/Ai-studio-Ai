export default async function handler(req, res) {
  const id = req.query.id;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${id}?key=${process.env.GEMINI_API_KEY}`
  );

  const d = await r.json();

  const done = d.done || false;

  res.status(200).json({
    progress: done ? 100 : 50,
    eta: done ? 0 : 30,
    done,
    videoUrl: d.response?.generatedVideos?.[0]?.video?.uri || ""
  });
}