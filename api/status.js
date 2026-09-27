export default async function handler(req, res) {
  const p = Math.min(100, Number(req.query.p || 0));
  res.status(200).json({
    progress: p,
    done: p >= 100,
    videoUrl: "/sample.mp4"
  });
}