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
  const prompt = promptEl?.value?.trim();
  if (!prompt) {
    alert("Prompt लिखो");
    return;
  }

  if (pollTimer) clearInterval(pollTimer);

  stageEl.innerText = "Starting...";
  percentEl.innerText = "0%";
  barEl.value = 0;
  etaEl.innerText = "...";
  previewEl.innerText = "⏳";
  lastVideo = "";
  lastJob = "";

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
      previewEl.innerText = "❌";
      return;
    }

    lastJob = data.name;
    stageEl.innerText = "Queued";
    pollStatus();

  } catch (err) {
    alert(err.message);
    stageEl.innerText = "Error";
    previewEl.innerText = "❌";
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
        stageEl.innerText = "Error";
        previewEl.innerText = "❌";
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
  }, 5000);
}

function downloadVideo() {
  if (!lastVideo) {
    alert("पहले video generate करो");
    return;
  }

  const downloadUrl = "/api/download?url=" + encodeURIComponent(lastVideo);

  // Mobile + Desktop दोनों के लिए best method
  try {
    // 1. नई tab में खोलो (mobile पर सबसे reliable)
    const newTab = window.open(downloadUrl, "_blank");

    // 2. अगर popup block हो जाए तो direct click
    if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "veo-video.mp4";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } catch (e) {
    // Last fallback
    window.location.href = downloadUrl;
  }
}

function resetUI() {
  if (pollTimer) clearInterval(pollTimer);

  if (promptEl) promptEl.value = "";
  if (imageEl) imageEl.value = "";

  stageEl.innerText = "Ready";
  percentEl.innerText = "0%";
  barEl.value = 0;
  etaEl.innerText = "0 sec";
  previewEl.innerText = "🎥";

  lastJob = "";
  lastVideo = "";
}