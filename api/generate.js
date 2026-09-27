export default async function handler(req, res) {
  const { prompt, style } = req.body;

  return res.status(200).json({
    message: "Ready for Wan API",
    prompt,
    style
  });
}