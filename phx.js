// ---------- Data ----------
const CREW = ["Apoorv", "Khushbu", "Sanaa", "Bobby", "Shriya", "Archit"];
const DATES = ["Mon, Dec 21", "Tue, Dec 22", "Wed, Dec 23", "Thu, Dec 24 · Christmas Eve", "Fri, Dec 25 · Christmas", "Sat, Dec 26"];

const ROUTES = {
  loop: { label: "🏜️ Big loop, Dec 21–24", desc: "Sedona → Flagstaff → Grand Canyon, home for Christmas Eve (2–3 nights away)." },
  quick: { label: "⚡ 2 days, 1 night", desc: "Grand Canyon, Sedona and Flagstaff in one overnight trip. The rest is downtime in PHX." },
  day: { label: "🚗 Sedona day trip", desc: "One day of red rocks with no overnight bags. Everything else in Phoenix." },
  none: { label: "🏡 Stay in Phoenix", desc: "No long drives: hikes, Scottsdale, pool and food." },
};

const QUESTIONS = [
  { key: "arrive", title: "1. When do we land in Phoenix on Dec 21?", opts: {
      am: ["🌅 Morning / midday", "Enough time to do something on day 1."],
      pm: ["🌙 Evening", "Day 1 is just landing, dinner and sleep."] } },
  { key: "route", title: "2. How much of northern Arizona?", opts: Object.fromEntries(Object.entries(ROUTES).map(([k, r]) => [k, [r.label, r.desc]])) },
  { key: "when", title: "3. Which days do we go?", show: (s) => s.route === "quick" || s.route === "day", opts: {
      "22": ["Tue 22 → Wed 23", "Back home with a full day to rest before Christmas Eve."],
      "23": ["Wed 23 → Thu 24", "Back home on the evening of Christmas Eve."] } },
  { key: "base", title: "4. Where do we sleep that one night?", show: (s) => s.route === "quick", opts: {
      canyon: ["🌄 Grand Canyon (Tusayan)", "Sunset and sunrise at the rim. Most canyon time."],
      flagstaff: ["🍻 Flagstaff", "Cheapest beds, the most restaurants and breweries, and stargazing."],
      sedona: ["🔴 Sedona", "Red-rock morning hike. Prettiest place to wake up."] } },
  { key: "snow", title: "5. If it snows up north, we'll…", show: (s) => s.route !== "none", opts: {
      go: ["🚙 Go anyway, carefully", "Rent AWD, carry chains, check az511.gov and leave buffer time."],
      sedona: ["🔴 Stay low: Sedona & Verde Valley", "Sedona (~4,300 ft) is usually clear. Swap the canyon for Jerome and wineries."],
      south: ["🌵 Go south to Tucson", "Saguaro cactus forests, Desert Museum and great food. Very unlikely to snow."] } },
  { key: "depart", title: "6. When is the flight back on Dec 26?", opts: {
      am: ["🌅 Morning", "Straight to the airport."],
      pm: ["☀️ Afternoon", "Brunch and one last activity."],
      red: ["🌙 Evening / red-eye", "Almost a full last day."] } },
  { key: "fun", title: "7. Phoenix downtime: what's the crew into? (pick any)", multi: true, opts: {
      hike: ["🥾 Sunrise hike", "Piestewa Peak or Camelback (Echo Canyon). Steep, so start early."],
      scottsdale: ["🍸 Old Town Scottsdale", "Stroll, shops, dinner and drinks."],
      dbg: ["🌵 Desert Botanical Garden", "Check holiday lights (luminaria) dates."],
      balloon: ["🎈 Hot-air balloon", "Sunrise over the Sonoran Desert. Book ahead ($$$)."],
      lake: ["⛵ Canyon Lake & Tortilla Flat", "Scenic drive east, lake cruise and an old-west stop."],
      pool: ["🏊 Pool & spa day", "Home pool or a resort day pass."],
      food: ["🌮 Food crawl", "Sonoran hot dogs, Mexican food and famous Phoenix pizza."],
      tempe: ["⛳ Tempe & Topgolf", "Tempe Town Lake, Mill Ave and Topgolf with the group."],
      games: ["🎲 Games & movie night", "At home, with snacks."] } },
];

const FUN_DETAIL = Object.fromEntries(Object.entries(QUESTIONS.find((q) => q.key === "fun").opts).map(([k, [l, d]]) => [k, `${l}: ${d}`]));

// Day templates for the north trips
const D = {
  arriveSedona: { title: "Land & drive to Sedona", where: "PHX → Sedona (~2h)", night: "Sedona", north: true, items: [
    "Land at PHX. Pick up a 7-seater (or 2 cars for 6 people + bags)", "Drive I-17 north (~2h), lunch on the way", "Sunset at Airport Mesa"] },
  sedonaFlag: (fromPhx) => ({ title: "Red rocks → Flagstaff", where: "Sedona → Flagstaff (45–60 min)", night: "Flagstaff", north: true, items: [
    fromPhx ? "Leave PHX by 7am → Sedona (~2h)" : "Morning hike: Devil's Bridge or Cathedral Rock",
    "Bell Rock and the Tlaquepaque arts village", "Scenic Oak Creek Canyon drive (89A) up to Flagstaff", "Dinner and breweries in downtown Flagstaff"] }),
  canyonDay: { title: "Grand Canyon day", where: "Flagstaff → South Rim (~1.5h)", night: "Grand Canyon / Tusayan", north: true, items: [
    "Mather Point, then the Rim Trail to Yavapai Point", "Hermit Road (open to cars in winter)", "Sunset at Hopi Point", "Dinner in Tusayan"] },
  canyonHome: { title: "Canyon sunrise → home for Christmas Eve", where: "South Rim → Phoenix (~4h)", night: "Home in PHX", north: true, items: [
    "Sunrise at Mather or Yavapai Point", "Desert View Watchtower on the way out (east exit)", "Drive home via Cameron & Flagstaff (~4h)", "🎄 Christmas Eve dinner at home"] },
  quick: {
    canyon: [
      { title: "Straight to the Grand Canyon", where: "PHX → South Rim (~3.5–4h)", night: "Tusayan / Grand Canyon Village", north: true, items: [
        "Leave by 6–7am, breakfast stop in Flagstaff", "Rim Trail: Mather Point → Yavapai", "Sunset at Hopi Point (Hermit Road)"] },
      { title: "Sunrise → Flagstaff → Sedona → home", where: "South Rim → Flagstaff → Sedona → PHX", night: "Home in PHX", north: true, items: [
        "Sunrise at Mather Point", "Lunch in downtown Flagstaff (~1.5h)", "Oak Creek Canyon drive down to Sedona (~1h)", "Sedona sunset at Airport Mesa, then home (~2h)"] }],
    flagstaff: [
      { title: "Sedona → Flagstaff", where: "PHX → Sedona → Flagstaff", night: "Flagstaff", north: true, items: [
        "Leave by 7am → Sedona (~2h)", "Cathedral Rock or Bell Rock hike, Tlaquepaque", "Oak Creek Canyon up to Flagstaff", "Downtown dinner and breweries. Lowell Observatory stargazing (check schedule)"] },
      { title: "Grand Canyon → home", where: "Flagstaff → South Rim → PHX", night: "Home in PHX", north: true, items: [
        "Early drive to the South Rim (~1.5h)", "Mather Point, Rim Trail, Hermit Road", "Leave by ~2pm, home by ~6pm (3.5–4h)"] }],
    sedona: [
      { title: "Grand Canyon → Sedona", where: "PHX → South Rim → Sedona", night: "Sedona", north: true, items: [
        "Leave by 6am → South Rim (~3.5–4h)", "Mather Point, Rim Trail, Desert View", "Early dinner in Flagstaff, then down to Sedona (take I-17 instead of 89A if it's icy after dark)"] },
      { title: "Red rocks → home", where: "Sedona → PHX (~2h)", night: "Home in PHX", north: true, items: [
        "Morning hike: Devil's Bridge or Cathedral Rock", "Brunch & Tlaquepaque", "Optional off-road Jeep tour", "Drive home (~2h), back by evening"] }],
  },
  sedonaDay: { title: "Sedona day trip", where: "PHX ⇄ Sedona (~2h each way)", night: "Home in PHX", north: true, items: [
    "Leave ~7am", "Devil's Bridge or Cathedral Rock hike", "Lunch & Tlaquepaque", "Sunset at Airport Mesa, home by ~8pm"] },
};

// Snow Plan B replacements
const ALT = {
  sedona: { stay: "Sedona", home: { title: "Back to Phoenix", where: "Sedona → PHX (~2h)", items: ["Slow morning in Sedona", "Montezuma Castle stop off I-17", "Home by afternoon"] }, days: [
    { title: "Plan B: Sedona red rocks", where: "PHX → Sedona (~2h)", items: ["Bell Rock & Cathedral Rock (lower trails)", "Chapel of the Holy Cross", "Sunset at Airport Mesa"] },
    { title: "Plan B: Jerome & Verde Valley", where: "Sedona → Jerome (~45 min)", items: ["Jerome hillside ghost town", "Old Town Cottonwood wine tasting", "Dinner back in Sedona"] },
    { title: "Plan B: Ancient sites", where: "Around the Verde Valley", items: ["Montezuma Castle & Montezuma Well", "Out of Africa Wildlife Park (Camp Verde)", "Stargazing in Sedona"] }] },
  south: { stay: "Tucson", home: { title: "Back to Phoenix", where: "Tucson → PHX (~1h45)", items: ["Breakfast in Tucson", "Picacho Peak stop (optional)", "Home by afternoon"] }, days: [
    { title: "Plan B: Drive to Tucson", where: "PHX → Tucson (~1h45)", items: ["Arizona-Sonora Desert Museum", "Saguaro National Park (West)", "Sunset at Gates Pass"] },
    { title: "Plan B: Missions & food", where: "Tucson", items: ["San Xavier del Bac mission", "Sonoran hot dogs & 4th Ave (Tucson is a UNESCO City of Gastronomy)", "Saguaro NP East: Cactus Forest Loop"] },
    { title: "Plan B: Old West day", where: "Tucson → Tombstone (~1h15)", items: ["Tombstone old west town", "Or Kartchner Caverns (book a tour)", "Dinner back in Tucson"] }] },
};

// ---------- State ----------
const DEFAULT = { arrive: "am", route: "quick", when: "22", base: "canyon", snow: "sedona", depart: "pm", fun: ["hike", "scottsdale", "games"], t: {}, votes: {} };
let state = loadState();

function loadState() {
  try {
    if (location.hash.length > 1) return { ...DEFAULT, ...JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(1))))) };
  } catch (e) { /* bad link, fall through */ }
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem("crew-plan") || "{}") }; } catch (e) { return { ...DEFAULT }; }
}
function save() {
  localStorage.setItem("crew-plan", JSON.stringify(state));
  history.replaceState(null, "", "#" + btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- Plan builder ----------
function build(s) {
  const snow = s.t.snow && s.route !== "none";
  const late = s.t.delay || s.arrive === "pm";
  const days = DATES.map((date) => ({ date, title: "", where: "Phoenix", night: "Home in PHX", items: [], free: 2, notes: [] }));

  // Day 1 arrival
  days[0].title = "Arrive from Boston";
  days[0].items.push(s.t.delay ? "✈️ Delayed flight: land late, pick up the rental car, quick dinner and sleep" : late ? "Land at PHX in the evening. Pick up a 7-seater (or 2 cars) and get dinner" : "Land at PHX. Pick up a 7-seater (or 2 cars) and settle in at home");
  days[0].notes.push("Arizona doesn't use daylight saving time, so it's 2h behind Boston in December.");
  days[0].free = late ? 0 : 1;

  // North trip
  let north = []; // [{index, tpl}]
  if (s.route === "loop") {
    const seq = late ? [D.sedonaFlag(true), D.canyonDay, D.canyonHome] : [D.arriveSedona, D.sedonaFlag(false), D.canyonDay, D.canyonHome];
    const start = late ? 1 : 0;
    north = seq.map((tpl, i) => ({ index: start + i, tpl }));
  } else if (s.route === "quick") {
    const start = s.when === "23" ? 2 : 1;
    north = D.quick[s.base].map((tpl, i) => ({ index: start + i, tpl }));
  } else if (s.route === "day") {
    north = [{ index: s.when === "23" ? 2 : 1, tpl: D.sedonaDay }];
  }

  if (snow && s.snow !== "go" && s.route !== "day") {
    const alt = ALT[s.snow];
    north = north.map((n, i) => {
      const last = i === north.length - 1;
      const tpl = last ? { ...alt.home, night: "Home in PHX" } : { ...alt.days[i % alt.days.length], night: alt.stay };
      // keep the arrival bit on day 1 of the early loop
      return { index: n.index, tpl: { ...tpl, north: true, items: n.index === 0 ? ["Land at PHX & pick up the car", ...tpl.items] : tpl.items } };
    });
  }

  north.forEach(({ index, tpl }) => {
    const d = days[index];
    d.title = tpl.title; d.where = tpl.where; d.night = tpl.night; d.free = 0; d.north = true;
    d.items = [...tpl.items];
    if (snow && s.snow === "go") d.notes.push("❄️ Snow plan: AWD or chains, check az511.gov before leaving, and allow extra drive time. Skip any road that's closed.");
    if (snow && s.route === "day") d.notes.push("❄️ Sedona sits lower (~4,300 ft) and is usually clear. If I-17 is bad, swap for a Phoenix day.");
  });

  if (s.t.split && s.route !== "none") {
    north.forEach(({ index }) => days[index].notes.push("😴 Split crew: car 1 does this trip, car 2 stays home and does the Phoenix downtime plan below."));
  }

  // Christmas Eve / Day
  const eve = days[3];
  if (!eve.north) { eve.title = eve.title || "Christmas Eve in Phoenix"; eve.free = 1; }
  if (!eve.items.some((i) => i.includes("Christmas Eve"))) eve.items.push("🎄 Christmas Eve dinner at home, then a drive around to see neighbourhood lights");
  if (eve.north && eve.night === "Home in PHX") eve.notes.push("Back late on Christmas Eve, so do the grocery run on the 22nd or 23rd.");
  else if (!eve.north) eve.items.unshift("🛒 Grocery run for Christmas Day (most shops close early)");

  const xmas = days[4];
  xmas.title = "Christmas Day at home 🎁"; xmas.free = 0;
  xmas.items.push(...(s.fun.includes("hike") ? ["Optional early hike (trails are quiet on Christmas morning)"] : []),
    "Gifts & a big Christmas lunch at home", "Pool / walk in the sun (~19°C / 66°F)", "Games or movie night");
  xmas.notes.push("Most restaurants and attractions are closed, so plan to eat at home.");

  // Departure
  const dep = days[5];
  dep.title = "Fly back to Boston";
  dep.free = s.depart === "am" ? 0 : s.depart === "pm" ? 1 : 2;
  const depItem = { am: "Leave for PHX airport ~2h before the flight", pm: "Brunch, then the airport by early afternoon", red: "Farewell dinner, then the airport for the evening flight" }[s.depart];

  // Fill free time with downtime picks
  const pool = s.fun.length ? [...s.fun] : ["pool", "games"];
  let p = 0;
  days.forEach((d, i) => {
    if (!d.title) d.title = "Phoenix downtime";
    for (let k = 0; k < d.free; k++) {
      const pick = pool[p++];
      d.items.push(pick ? FUN_DETAIL[pick] : "😌 Free time: nap, pool or wander");
    }
  });
  dep.items.push(depItem);

  return { days, snow, late };
}

function contingencies(s) {
  const out = [];
  if (s.route !== "none") {
    const txt = { go: "we still go, with AWD/chains, checking az511.gov and the Grand Canyon NPS alerts each morning. Any closed road gets skipped.",
      sedona: "we swap the Grand Canyon and Flagstaff for Sedona, Jerome and the Verde Valley (lower and usually clear).",
      south: "we head south to Tucson and Saguaro National Park instead." }[s.snow];
    out.push(["❄️ If it snows up north", txt]);
    out.push(["🚧 If I-17, I-40 or AZ-64 closes mid-trip", "we stay put in Sedona or Flagstaff for the night, then come home once roads reopen. Don't drive Oak Creek Canyon (89A) in ice."]);
  }
  out.push(["✈️ If our Dec 21 flight is late", s.route === "loop" ? "the loop starts Dec 22 with an early drive (Sedona and Flagstaff on the same day), so we still get home for Christmas Eve." : "nothing changes. The road trip doesn't start until " + (s.when === "23" ? "Dec 23." : "Dec 22.")]);
  out.push(["😴 If some people want to rest", "we split into 2 cars: one group does the road trip and the other gets the pool and Scottsdale."]);
  out.push(["🌧️ If it rains in Phoenix", "we go indoors: Musical Instrument Museum, Heard Museum or Scottsdale Fashion Square."]);
  if (s.route === "quick" && s.when === "23") out.push(["🎄 If we're driving back on Christmas Eve", "we leave the last stop by ~3pm so we're home for Christmas Eve dinner."]);
  return out;
}

// ---------- Render ----------
function renderQuestions() {
  const el = document.getElementById("questions");
  el.innerHTML = `<h2>🧭 Build the route</h2>` + QUESTIONS.filter((q) => !q.show || q.show(state)).map((q) => `
    <fieldset class="q">
      <legend>${q.title}</legend>
      <div class="opts">${Object.entries(q.opts).map(([v, [label, desc]]) => {
        const on = q.multi ? state.fun.includes(v) : state[q.key] === v;
        return `<button class="opt ${on ? "on" : ""}" data-q="${q.key}" data-v="${v}" aria-pressed="${on}"><strong>${label}</strong><span>${desc}</span></button>`;
      }).join("")}</div>
    </fieldset>`).join("");
}

function renderPlan() {
  const { days, snow } = build(state);
  const awayNights = days.filter((d) => d.night !== "Home in PHX").length;
  document.getElementById("summary").innerHTML =
    `<span class="chip warm">${ROUTES[state.route].label}</span> <span class="chip">${awayNights} night${awayNights === 1 ? "" : "s"} away</span> <span class="chip">${6 - awayNights} night${6 - awayNights === 1 ? "" : "s"} at home</span>` +
    (snow ? ` <span class="chip snow">❄️ Snow plan active</span>` : "");
  document.getElementById("timeline").innerHTML = days.map((d) => `
    <article class="day ${d.north ? "away" : ""} ${d.date.includes("Christmas") ? "xmas" : ""}">
      <div class="day-date">${d.date}</div>
      <div class="day-body">
        <h3>${esc(d.title)}</h3>
        <p class="place">📍 ${esc(d.where)} · 🛏️ ${esc(d.night)}</p>
        <ul>${d.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
        ${d.notes.map((n) => `<p class="note">${esc(n)}</p>`).join("")}
      </div>
    </article>`).join("");
  document.getElementById("ifs").innerHTML = `<h3>🔀 If this happens → we'll do this</h3><ul>` +
    contingencies(state).map(([a, b]) => `<li><strong>${esc(a)}</strong> → ${esc(b)}</li>`).join("") + `</ul>`;
}

function renderVotes() {
  document.getElementById("votes").innerHTML = CREW.map((name) => `
    <div class="voter">
      <span class="who">${name}</span>
      <select data-voter="${name}">
        <option value="">— pick —</option>
        ${Object.entries(ROUTES).map(([k, r]) => `<option value="${k}" ${state.votes[name] === k ? "selected" : ""}>${r.label}</option>`).join("")}
      </select>
    </div>`).join("");
  const counts = {};
  Object.values(state.votes).filter(Boolean).forEach((v) => (counts[v] = (counts[v] || 0) + 1));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tally = document.getElementById("tally");
  if (!total) { tally.textContent = "No votes yet."; return; }
  const max = Math.max(...Object.values(counts));
  const leaders = Object.keys(counts).filter((k) => counts[k] === max);
  tally.innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${ROUTES[k].label}: <strong>${c}</strong>`).join(" · ") +
    `<br>${total}/6 voted · ${leaders.length > 1 ? "It's a tie!" : `Leading: ${ROUTES[leaders[0]].label}`}` +
    (leaders.length === 1 && leaders[0] !== state.route ? ` <button class="btn btn-sea small-btn" id="apply-vote">Use this route</button>` : "");
}

function renderAll() {
  ["snow", "delay", "split"].forEach((k) => (document.getElementById("t-" + k).checked = !!state.t[k]));
  renderQuestions(); renderPlan(); renderVotes(); save();
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.timer); toast.timer = setTimeout(() => (t.hidden = true), 2000);
}

function planText() {
  const { days } = build(state);
  return `🌵 Crew trip: Boston → Phoenix (Dec 21–26)\nRoute: ${ROUTES[state.route].label}\n\n` +
    days.map((d) => `*${d.date}*: ${d.title}\n📍 ${d.where} · 🛏️ ${d.night}\n${d.items.map((i) => "• " + i).join("\n")}`).join("\n\n") +
    `\n\nIf this happens:\n` + contingencies(state).map(([a, b]) => `• ${a} → ${b}`).join("\n");
}

// ---------- Events ----------
document.addEventListener("click", async (e) => {
  const opt = e.target.closest(".opt");
  if (opt) {
    const { q, v } = opt.dataset;
    if (q === "fun") state.fun = state.fun.includes(v) ? state.fun.filter((x) => x !== v) : [...state.fun, v];
    else state[q] = v;
    return renderAll();
  }
  if (e.target.id === "apply-vote") {
    const counts = {};
    Object.values(state.votes).filter(Boolean).forEach((v) => (counts[v] = (counts[v] || 0) + 1));
    state.route = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    renderAll(); return toast("Route updated to the crew favourite 🎉");
  }
  if (e.target.id === "copy-link") { save(); await copy(location.href); return toast("Share link copied 🔗"); }
  if (e.target.id === "copy-text") { await copy(planText()); return toast("Plan copied, paste it in the group chat 📋"); }
});

document.addEventListener("change", (e) => {
  if (e.target.dataset.voter) { state.votes[e.target.dataset.voter] = e.target.value; renderAll(); }
  if (e.target.id && e.target.id.startsWith("t-")) { state.t[e.target.id.slice(2)] = e.target.checked; renderAll(); }
});

async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const ta = Object.assign(document.createElement("textarea"), { value: text }); document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
}

renderAll();
