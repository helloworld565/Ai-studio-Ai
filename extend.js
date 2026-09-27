export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name } = req.body;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1/${name}:extend?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          seconds: 8
        })
      }
    );

    const d = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: d.error?.message || "Extend failed"
      });
    }

    return res.status(200).json({
      name: d.name
    });

  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }
}