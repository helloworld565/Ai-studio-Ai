export default async function handler(req, res) {
  try {
    const videoUrl = req.query.url;

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing url" });
    }

    const response = await fetch(videoUrl, {
      headers: {
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      redirect: "follow"
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch video" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'attachment; filename="veo-video.mp4"');
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}