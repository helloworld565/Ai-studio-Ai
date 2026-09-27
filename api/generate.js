const r = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/veo-3.0-generate-001:generateVideos?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt
    })
  }
);

const data = await r.json();

if (!r.ok) {
  return res.status(r.status).json(data);
}

return res.status(200).json({ name: data.name });