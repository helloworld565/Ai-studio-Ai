export default async function handler(req, res) {
  try {
    const { id, seconds } = req.body;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${id}:extend?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          durationSeconds: Number(seconds || 8)
        })
      }
    );

    const d = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: d.error?.message || "Extend failed"
      });
    }

    res.status(200).json({
      name: d.name
    });

  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}