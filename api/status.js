export default async function handler(req, res) {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Missing operation id" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${id}`,
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Status check failed"
      });
    }

    const done = data.done === true;

    // Official path from Google docs
    let videoUrl = "";
    if (done) {
      videoUrl =
        data.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri ||
        data.response?.generatedVideos?.[0]?.video?.uri ||
        data.response?.generatedSamples?.[0]?.video?.uri ||
        "";
    }

    return res.status(200).json({
      done,
      progress: done ? 100 : 45,
      eta: done ? 0 : 40,
      state: done ? "Complete" : "Generating...",
      videoUrl
    });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}