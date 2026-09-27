let lastJob = "";
let lastVideo = "";

const prompt = document.getElementById("prompt");
const img = document.getElementById("img");
const resolution = document.getElementById("resolution");
const fps = document.getElementById("fps");
const duration = document.getElementById("duration");
const aspect = document.getElementById("aspect");

const stage = document.getElementById("stage");
const percent = document.getElementById("percent");
const bar = document.getElementById("bar");
const eta = document.getElementById("eta");

const downloadBtn = document.getElementById("downloadBtn");
const newBtn = document.getElementById("newBtn");
const deleteBtn = document.getElementById("deleteBtn");
const extendBtn = document.getElementById("extendBtn");

async function gen() {
  if (!prompt.value.trim()) {
    alert("Prompt likho");
    return;
  }

  stage.innerText = "Generating...";
  percent.innerText = "0%";
  bar.value = 0;

  try {
    const r = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt.value,
        image: img.value,
        resolution: resolution.value,
        fps: fps.value,
        duration: duration.value,
        aspect: aspect.value
      })
    });

    const d = await r.json();

    if (!r.ok) {
      alert(d.error || "Server Error");
      return;
    }

    lastJob = d.name;
    pollStatus();

  } catch (e) {
    alert(e.message);
  }
}

async function pollStatus() {

  const timer = setInterval(async () => {

    const r = await fetch("/api/status?id=" + lastJob);
    const s = await r.json();

    percent.innerText = (s.progress || 0) + "%";
    bar.value = s.progress || 0;
    eta.innerText = (s.eta || 0) + " sec";

    if (s.state) stage.innerText = s.state;

    if (s.done) {
      clearInterval(timer);

      stage.innerText = "Ready";
      lastVideo = s.videoUrl;

      downloadBtn.onclick = () => {
        window.open(lastVideo, "_blank");
      };
    }

  }, 2000);

}

async function extendVideo() {

  if (!lastJob) {
    alert("Pehle video generate karo");
    return;
  }

  const r = await fetch("/api/extend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: lastJob
    })
  });

  const d = await r.json();

  if (!r.ok) {
    alert(d.error);
    return;
  }

  lastJob = d.name;
  stage.innerText = "Extending...";
  pollStatus();

}

function newVideo() {
  prompt.value = "";
  img.value = "";
  stage.innerText = "Ready";
  percent.innerText = "0%";
  bar.value = 0;
  eta.innerText = "0 sec";
  lastJob = "";
  lastVideo = "";
}

function deleteVideo() {
  newVideo();
}