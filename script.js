// ========================
// PinkCare PCOS Quiz Logic (separate JS)
// ========================

// --- Questions & Options ---
const QUESTIONS = [
  "Do you experience irregular menstrual cycles?",
  "Do you notice excessive facial/body hair growth?",
  "Do you experience frequent acne/pimples?",
  "Do you gain weight easily despite diet control?",
  "Do you face difficulty losing weight?",
  "Do you have dark patches of skin (neck, underarms)?",
  "Do you crave fast food or sugary foods often?",
  "Do you feel fatigued or low energy frequently?",
  "Do you experience hair thinning or hair loss?",
  "Do you have a family history of PCOS or diabetes?",
  "Do you exercise regularly?",
  "Do you experience mood swings or depression symptoms?",
  "Do you have sleep disturbances?",
  "How long are your menstrual cycles usually?",
  "Do you experience heavy or painful periods?",
  "Do you consume fruits/vegetables daily?",
  "Do you eat junk food often?",
  "Do you face difficulty concentrating or brain fog?",
  "Do you have irregular sleep (< 6 hrs/night)?",
  "Do you experience abdominal bloating frequently?"
];

const OPTIONS = [
  ["a) Frequently irregular","b) Occasionally irregular","c) Regular"],
  ["a) Significant","b) Mild","c) None"],
  ["a) Severe & persistent","b) Occasional","c) Rare/none"],
  ["a) Yes, often","b) Sometimes","c) No"],
  ["a) Yes","b) Sometimes","c) No"],
  ["a) Prominent","b) Mild","c) None"],
  ["a) Daily","b) Weekly","c) Rarely"],
  ["a) Almost daily","b) Occasionally","c) Rarely"],
  ["a) Severe","b) Moderate","c) None"],
  ["a) Yes","b) Not sure","c) No"],
  ["a) No","b) Sometimes","c) Yes"],
  ["a) Frequently","b) Occasionally","c) Rarely"],
  ["a) Very often","b) Sometimes","c) Rarely"],
  ["a) >35 days or skipped","b) 30–35 days","c) 25–30 days"],
  ["a) Yes, very heavy/painful","b) Sometimes","c) No"],
  ["a) Rarely","b) Sometimes","c) Regularly"],
  ["a) Daily","b) Weekly","c) Rarely"],
  ["a) Very often","b) Sometimes","c) Rarely"],
  ["a) Yes, most days","b) Sometimes","c) No, 7–9 hrs"],
  ["a) Often","b) Sometimes","c) Rarely"]
];

// --- State / DOM refs ---
let current = 0;
let answers = new Array(QUESTIONS.length).fill(null);

const $ = (id) => document.getElementById(id);

const quizArea      = $("quiz-area");
const prevBtn       = $("prev-btn");
const nextBtn       = $("next-btn");
const resultBox     = $("result");
const resultText    = $("result-text");
const resultAdvice  = $("result-advice");
const doctorSection = $("doctor-section");
const errorEl       = $("quiz-error"); // <-- inline error paragraph

// Optional landing → quiz elements (hide landing, show quiz)
const startBtn   = $("start-btn");
const landing    = $("landing");
const quizHeader = $("quiz-header");
const quiz       = $("quiz");

// ---- Inline error helpers ----
function showError(msg) {
  if (!errorEl) return;
  errorEl.textContent = msg || "Please select an option to continue.";
  errorEl.classList.remove("hidden");
  nextBtn?.classList.add("shake");
  setTimeout(() => nextBtn?.classList.remove("shake"), 300);
}
function hideError() {
  errorEl?.classList.add("hidden");
}

// Render a question
function renderQuestion(){
  const qText = QUESTIONS[current];
  const opts  = OPTIONS[current];

  const qHtml = `
    <div class="q">
      <h4>${current+1}. ${qText}</h4>
      <div class="opts"></div>
    </div>
  `;
  quizArea.innerHTML = qHtml;

  const optsWrap = quizArea.querySelector(".opts");
  opts.forEach((opt,i) => {
    const val = ["a","b","c"][i];
    const label = document.createElement("label");
    label.className = "opt";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "opt";
    input.value = val;
    if (answers[current] === val) input.checked = true;

    label.appendChild(input);
    label.appendChild(document.createTextNode(" " + opt));
    optsWrap.appendChild(label);
  });

  // hide any previous error on new question render
  hideError();

  // as soon as user picks anything, clear the error (once per question)
  quizArea.addEventListener("change", (e) => {
    if (e.target && e.target.matches('input[type="radio"][name="opt"]')) hideError();
  }, { once: true });

  prevBtn.disabled = current === 0;
  nextBtn.textContent = current === QUESTIONS.length-1 ? "See Result" : "Next";
}

// Next/Prev handlers
function handleNext(){
  const sel = document.querySelector('input[name="opt"]:checked');
  if(!sel){
    showError("Please select an option to continue.");
    return;
  }
  answers[current] = sel.value;

  if(current < QUESTIONS.length-1){
    current++;
    renderQuestion();
  } else {
    showResult();
  }
}
function handlePrev(){
  if(current > 0){
    current--;
    renderQuestion();
  }
}

// Show results and reveal doctor search
function showResult(){
  let countA=0,countB=0,countC=0;
  answers.forEach(v=>{
    if(v==="a") countA++;
    else if(v==="b") countB++;
    else if(v==="c") countC++;
  });

  let verdict="", pills=[];
  const prevention=["Eat balanced meals","Prefer low‑GI carbs","Daily movement","7–9 hours sleep"];
  if(countA>countB && countA>countC){
    verdict="High likelihood of PCOS signals.";
    pills=["Consult a gynecologist","Track cycles"].concat(prevention);
  } else if(countB>=countA && countB>countC){
    verdict="Moderate symptoms present.";
    pills=["Consider preventive consultation"].concat(prevention);
  } else {
    verdict="Low risk, maintain healthy habits!";
    pills=prevention;
  }

  resultText.textContent = verdict;
  resultAdvice.innerHTML = "";
  pills.forEach(t=>{
    const s=document.createElement("span");
    s.className="pill";
    s.textContent=t;
    resultAdvice.appendChild(s);
  });

  resultBox.classList.remove("hidden");
  resultBox.style.display = "block";

  if (doctorSection) {
    doctorSection.classList.remove("hidden");
    doctorSection.style.display = "block";
  }

  resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

// -------------- Keyless Maps Launcher --------------
function buildProviderLinks({ lat, lon, text }) {
  const q = text ? `gynecologist in ${text}` : "gynecologist near me";
  const links = [];

  if (lat != null && lon != null) {
    links.push({ label: "Open in Google Maps", href: `https://www.google.com/maps/search/gynecologist/@${lat},${lon},14z` });
    links.push({ label: "Open in Bing Maps", href: `https://www.bing.com/maps?q=gynecologist&cp=${lat}~${lon}&lvl=14` });
    links.push({ label: "Open in OpenStreetMap", href: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}&layers=CN` });
    links.push({ label: "Open in Apple Maps", href: `https://maps.apple.com/?q=gynecologist&sll=${lat},${lon}&z=14` });
  } else {
    const encoded = encodeURIComponent(q);
    links.push({ label: "Open in Google Maps", href: `https://www.google.com/maps/search/${encoded}` });
    links.push({ label: "Open in Bing Maps",   href: `https://www.bing.com/maps?q=${encoded}` });
    links.push({ label: "Open in Apple Maps",  href: `https://maps.apple.com/?q=${encoded}` });
    links.push({ label: "Open in OpenStreetMap", href: `https://www.openstreetmap.org/search?query=${encoded}` });
  }

  return links;
}

function renderLinks(links, container) {
  container.innerHTML = "";
  links.forEach(l => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.style.margin = "8px 0";
    card.style.padding = "10px 12px";
    card.style.border = "1px solid var(--border)";
    card.style.borderRadius = "12px";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <span class="muted">${l.label}</span>
        <a class="cta" target="_blank" href="${l.href}" rel="noopener">Open</a>
      </div>`;
    container.appendChild(card);
  });
}

// City/pincode flow
async function findDoctors() {
  const cityInput = document.getElementById("city");
  const container = document.getElementById("doctor-results");
  const text = (cityInput?.value || "").trim();

  container.innerHTML = "";
  if (!text) {
    container.innerHTML = "<p>Please enter a city or pincode, or use your location.</p>";
    return;
  }

  const links = buildProviderLinks({ text });
  renderLinks(links, container);
  window.open(links[0].href, "_blank", "noopener");
}

// Geolocation flow
function useMyLocation() {
  const container = document.getElementById("doctor-results");
  container.innerHTML = "<p>Getting your location…</p>";

  if (!navigator.geolocation) {
    container.innerHTML = "<p>Your browser doesn’t support Geolocation. Enter a city instead.</p>";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      const links = buildProviderLinks({ lat, lon });
      renderLinks(links, container);
      window.open(links[0].href, "_blank", "noopener");
    },
    (err) => {
      console.error(err);
      container.innerHTML = "<p>Couldn’t get location (permission denied?). Enter a city instead.</p>";
    },
    { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
  );
}

// Wire buttons (call this once on DOMContentLoaded)
(function wireDoctorSearch(){
  const findBtn = document.getElementById("find-btn");
  const locBtn  = document.getElementById("loc-btn");
  if (findBtn) findBtn.addEventListener("click", findDoctors);
  if (locBtn)  locBtn.addEventListener("click", useMyLocation);

  const cityInputEl = document.getElementById("city");
  if (cityInputEl) {
    cityInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        findDoctors();
      }
    });
  }
})();

// Landing → Start Quiz
function wireStart(){
  if (!startBtn) return;
  startBtn.addEventListener("click", () => {
    if (landing) landing.style.display = "none";

    if (quizHeader){ quizHeader.classList.remove("hidden"); quizHeader.style.display = "block"; }
    if (quiz){ quiz.classList.remove("hidden"); quiz.style.display = "block"; }

    current = 0;
    answers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();

    // Hide previous result & doctor section if any
    if (resultBox){ resultBox.classList.add("hidden"); resultBox.style.display = "none"; }
    if (doctorSection){ doctorSection.classList.add("hidden"); doctorSection.style.display = "none"; }

    hideError();
  });
}

// Wire buttons & init
function initQuiz(){
  if (prevBtn) prevBtn.addEventListener("click", handlePrev);
  if (nextBtn) nextBtn.addEventListener("click", handleNext);
  const findBtn = $("find-btn");
  if (findBtn) findBtn.addEventListener("click", findDoctors);
  wireStart();
}

document.addEventListener("DOMContentLoaded", initQuiz);
