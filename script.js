let lastJob = "";
let lastVideo = "";
let pollTimer = null;

const promptEl = document.getElementById("prompt");
const imageEl = document.getElementById("image");
const stageEl = document.getElementById("stage");
const percentEl = document.getElementById("percent");
const barEl = document.getElementById("bar");
const etaEl = document.getElementById("eta");
const previewEl = document.getElementById("preview");

async function startGen() {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    alert("Prompt लिखो");
    return;
  }

  // reset
  if (pollTimer) clearInterval(pollTimer);
  stageEl.innerText = "Starting...";
  percentEl.innerText = "0%";
  barEl.value = 0;
  etaEl.innerText = "...";
  previewEl.innerText = "⏳";
  lastVideo = "";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        aspectRatio: "16:9"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Generate failed");
      stageEl.innerText = "Error";
      return;
    }

    lastJob = data.name;
    stageEl.innerText = "Queued";
    pollStatus();

  } catch (err) {
    alert(err.message);
    stageEl.innerText = "Error";
  }
}

function pollStatus() {
  if (pollTimer) clearInterval(pollTimer);

  pollTimer = setInterval(async () => {
    try {
      const res = await fetch("/api/status?id=" + encodeURIComponent(lastJob));
      const s = await res.json();

      if (!res.ok) {
        clearInterval(pollTimer);
        alert(s.error || "Status error");
        return;
      }

      percentEl.innerText = (s.progress || 0) + "%";
      barEl.value = s.progress || 0;
      etaEl.innerText = (s.eta || 0) + " sec";
      stageEl.innerText = s.state || "Generating...";

      if (s.done) {
        clearInterval(pollTimer);
        stageEl.innerText = "Complete";
        percentEl.innerText = "100%";
        barEl.value = 100;
        etaEl.innerText = "0 sec";
        previewEl.innerText = "✅";

        lastVideo = s.videoUrl || "";

        if (!lastVideo) {
          alert("Video URL नहीं मिला। API response चेक करें।");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, 5000); // 5 seconds
}

function downloadVideo() {
  if (!lastVideo) {
    alert("पहले video generate करो");
    return;
  }

  // Gemini video URI को API key के साथ download करना पड़ता है
  // इसलिए हम एक proxy endpoint इस्तेमाल करेंगे
  const a = document.createElement("a");
  a.href = "/api/download?url=" + encodeURIComponent(lastVideo);
  a.download = "veo-video.mp4";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function resetUI() {
  if (pollTimer) clearInterval(pollTimer);
  promptEl.value = "";
  if (imageEl) imageEl.value = "";
  stageEl.innerText = "Ready";
  percentEl.innerText = "0%";
  barEl.value = 0;
  etaEl.innerText = "0 sec";
  previewEl.innerText = "🎥";
  lastJob = "";
  lastVideo = "";
}
        
      

  