// =====================================================================
//  Crew Trip Planner: Boston → Phoenix, Dec 21–26
// =====================================================================

const CREW = [
  { name: "Apoorv", c: "#2a78d6", fg: "#fff" },
  { name: "Khushbu", c: "#eb6834", fg: "#fff" },
  { name: "Sanaa", c: "#1baf7a", fg: "#fff" },
  { name: "Bobby", c: "#eda100", fg: "#111" },
  { name: "Shriya", c: "#e87ba4", fg: "#111" },
  { name: "Archit", c: "#6250d6", fg: "#fff" },
];
const DATES = ["Mon, Dec 21", "Tue, Dec 22", "Wed, Dec 23", "Thu, Dec 24 · Christmas Eve", "Fri, Dec 25 · Christmas", "Sat, Dec 26"];
const TRIP_START = new Date(2026, 11, 21, 0, 0, 0);

// Map stops (lat, lon) and label side
const PLACES = {
  PHX: { name: "Phoenix", lat: 33.45, lon: -112.07, side: "left", elev: 1100 },
  SED: { name: "Sedona", lat: 34.87, lon: -111.76, side: "right", elev: 4350 },
  FLG: { name: "Flagstaff", lat: 35.2, lon: -111.65, side: "right", elev: 6900 },
  GC: { name: "Grand Canyon", lat: 36.06, lon: -112.14, side: "right", elev: 7000 },
  JER: { name: "Jerome", lat: 34.75, lon: -112.11, side: "left", elev: 5200 },
  MON: { name: "Montezuma", lat: 34.61, lon: -111.83, side: "right", elev: 3200 },
  TUC: { name: "Tucson", lat: 32.22, lon: -110.97, side: "right", elev: 2400 },
  TOM: { name: "Tombstone", lat: 31.71, lon: -110.07, side: "left", elev: 4500 },
};
const SNOW_LINE = 5000;

const ROUTES = {
  loop: { letter: "A", icon: "🏜️", label: "Big loop, Dec 21–24", name: "The big loop", desc: "Sedona → Flagstaff → Grand Canyon, home for Christmas Eve.",
    pro: "Most to see: sunset and sunrise at the canyon, two red-rock days.", con: "Most driving, 3 rounds of packing, highest snow exposure." },
  quick: { letter: "B", icon: "⚡", label: "2 days, 1 night", name: "Two days, one night", desc: "Grand Canyon, Sedona and Flagstaff in one overnight. The rest is downtime.",
    pro: "All three icons with only one night away.", con: "Two long driving days back to back." },
  day: { letter: "C", icon: "🚗", label: "Sedona day trip", name: "Red rocks, day trip", desc: "One day of red rocks, no overnight bags.",
    pro: "Easy: no hotels, low snow risk, lots of rest.", con: "No Grand Canyon." },
  none: { letter: "D", icon: "🏡", label: "Stay in Phoenix", name: "Phoenix, unhurried", desc: "No long drives: hikes, Scottsdale, pool and food.",
    pro: "Maximum rest, zero snow risk, cheapest.", con: "No red rocks or canyon." },
};

const QUESTIONS = [
  { key: "arrive", title: "Landing on Dec 21", opts: {
      am: ["🌅 Morning / midday", "Enough time to do something on day 1."],
      pm: ["🌙 Evening", "Day 1 is just landing, dinner and sleep."] } },
  { key: "route", title: "How much of northern Arizona?", opts: Object.fromEntries(Object.entries(ROUTES).map(([k, r]) => [k, [`${r.icon} ${r.label}`, r.desc]])) },
  { key: "when", title: "Which days do we go?", show: (s) => s.route === "quick" || s.route === "day", opts: {
      "22": ["Tue 22 → Wed 23", "Back home with a full day to rest before Christmas Eve."],
      "23": ["Wed 23 → Thu 24", "Back home on the evening of Christmas Eve."] } },
  { key: "base", title: "Where do we sleep?", show: (s) => s.route === "quick", opts: {
      canyon: ["🌄 Grand Canyon (Tusayan)", "Sunset and sunrise at the rim. Most canyon time."],
      flagstaff: ["🍻 Flagstaff", "Cheapest beds, the most restaurants and breweries, and stargazing."],
      sedona: ["🔴 Sedona", "Red-rock morning hike. Prettiest place to wake up."] } },
  { key: "snow", title: "If it snows up north…", show: (s) => s.route !== "none", opts: {
      go: ["🚙 Go anyway, carefully", "Rent AWD, carry chains, check az511.gov and leave buffer time."],
      sedona: ["🔴 Stay low: Sedona & Verde Valley", "Sedona (~4,300 ft) is usually clear. Swap the canyon for Jerome and wineries."],
      south: ["🌵 Go south to Tucson", "Saguaro forests, Desert Museum, great food. Very unlikely to snow."] } },
  { key: "depart", title: "Flight back on Dec 26", opts: {
      am: ["🌅 Morning", "Straight to the airport."],
      pm: ["☀️ Afternoon", "Brunch and one last activity."],
      red: ["🌙 Evening / red-eye", "Almost a full last day."] } },
  { key: "fun", title: "Phoenix downtime picks", multi: true, opts: {
      hike: ["🥾 Sunrise hike", "Piestewa Peak or Camelback (Echo Canyon). Steep, so start early."],
      scottsdale: ["🍸 Old Town Scottsdale", "Stroll, shops, dinner and drinks."],
      dbg: ["🌵 Desert Botanical Garden", "Check holiday luminaria dates."],
      balloon: ["🎈 Hot-air balloon", "Sunrise over the Sonoran Desert. Book ahead ($$$)."],
      lake: ["⛵ Canyon Lake & Tortilla Flat", "Scenic drive east, lake cruise and an old-west stop."],
      pool: ["🏊 Pool & spa day", "Home pool or a resort day pass."],
      food: ["🌮 Food crawl", "Sonoran hot dogs, Mexican food and famous Phoenix pizza."],
      tempe: ["⛳ Tempe & Topgolf", "Tempe Town Lake, Mill Ave and Topgolf with the group."],
      games: ["🎲 Games & movie night", "At home, with snacks."] } },
];
const FUN_DETAIL = Object.fromEntries(Object.entries(QUESTIONS.at(-1).opts).map(([k, [l, d]]) => [k, `${l}: ${d}`]));

// ---------- Day templates (hrs = rough driving hours, stops = map path) ----------
const D = {
  arriveSedona: { title: "Land & drive to Sedona", where: "PHX → Sedona (~2h)", night: "Sedona", hrs: 2, stops: ["PHX", "SED"], items: [
    "Land at PHX. Pick up a 7-seater (or 2 cars for 6 people + bags)", "Drive I-17 north (~2h), lunch on the way", "Sunset at Airport Mesa"] },
  sedonaFlag: (fromPhx) => ({ title: "Red rocks → Flagstaff", where: fromPhx ? "PHX → Sedona → Flagstaff" : "Sedona → Flagstaff (45–60 min)", night: "Flagstaff",
    hrs: fromPhx ? 3 : 1, stops: fromPhx ? ["PHX", "SED", "FLG"] : ["SED", "FLG"], items: [
    fromPhx ? "Leave PHX by 7am → Sedona (~2h)" : "Morning hike: Devil's Bridge or Cathedral Rock",
    "Bell Rock and the Tlaquepaque arts village", "Scenic Oak Creek Canyon drive (89A) up to Flagstaff", "Dinner and breweries in downtown Flagstaff"] }),
  canyonDay: { title: "Grand Canyon day", where: "Flagstaff → South Rim (~1.5h)", night: "Grand Canyon / Tusayan", hrs: 1.5, stops: ["FLG", "GC"], items: [
    "Mather Point, then the Rim Trail to Yavapai Point", "Hermit Road (open to cars in winter)", "Sunset at Hopi Point", "Dinner in Tusayan"] },
  canyonHome: { title: "Canyon sunrise → home for Christmas Eve", where: "South Rim → Phoenix (~4h)", night: "Home in PHX", hrs: 4, stops: ["GC", "FLG", "PHX"], items: [
    "Sunrise at Mather or Yavapai Point", "Desert View Watchtower on the way out (east exit)", "Drive home via Cameron & Flagstaff (~4h)", "🎄 Christmas Eve dinner at home"] },
  quick: {
    canyon: [
      { title: "Straight to the Grand Canyon", where: "PHX → South Rim (~3.5–4h)", night: "Tusayan / Grand Canyon Village", hrs: 3.75, stops: ["PHX", "FLG", "GC"], items: [
        "Leave by 6–7am, breakfast stop in Flagstaff", "Rim Trail: Mather Point → Yavapai", "Sunset at Hopi Point (Hermit Road)"] },
      { title: "Sunrise → Flagstaff → Sedona → home", where: "South Rim → Flagstaff → Sedona → PHX", night: "Home in PHX", hrs: 4.5, stops: ["GC", "FLG", "SED", "PHX"], items: [
        "Sunrise at Mather Point", "Lunch in downtown Flagstaff (~1.5h)", "Oak Creek Canyon drive down to Sedona (~1h)", "Sedona sunset at Airport Mesa, then home (~2h)"] }],
    flagstaff: [
      { title: "Sedona → Flagstaff", where: "PHX → Sedona → Flagstaff", night: "Flagstaff", hrs: 3, stops: ["PHX", "SED", "FLG"], items: [
        "Leave by 7am → Sedona (~2h)", "Cathedral Rock or Bell Rock hike, Tlaquepaque", "Oak Creek Canyon up to Flagstaff", "Downtown dinner and breweries. Lowell Observatory stargazing (check schedule)"] },
      { title: "Grand Canyon → home", where: "Flagstaff → South Rim → PHX", night: "Home in PHX", hrs: 5.25, stops: ["FLG", "GC", "PHX"], items: [
        "Early drive to the South Rim (~1.5h)", "Mather Point, Rim Trail, Hermit Road", "Leave by ~2pm, home by ~6pm (3.5–4h)"] }],
    sedona: [
      { title: "Grand Canyon → Sedona", where: "PHX → South Rim → Sedona", night: "Sedona", hrs: 6, stops: ["PHX", "GC", "FLG", "SED"], items: [
        "Leave by 6am → South Rim (~3.5–4h)", "Mather Point, Rim Trail, Desert View", "Early dinner in Flagstaff, then down to Sedona (take I-17 instead of 89A if it's icy after dark)"] },
      { title: "Red rocks → home", where: "Sedona → PHX (~2h)", night: "Home in PHX", hrs: 2, stops: ["SED", "PHX"], items: [
        "Morning hike: Devil's Bridge or Cathedral Rock", "Brunch & Tlaquepaque", "Optional off-road Jeep tour", "Drive home (~2h), back by evening"] }],
  },
  sedonaDay: { title: "Sedona day trip", where: "PHX ⇄ Sedona (~2h each way)", night: "Home in PHX", hrs: 4, stops: ["PHX", "SED", "PHX"], items: [
    "Leave ~7am", "Devil's Bridge or Cathedral Rock hike", "Lunch & Tlaquepaque", "Sunset at Airport Mesa, home by ~8pm"] },
};

// Snow Plan B replacements
const ALT = {
  sedona: { stay: "Sedona",
    home: { title: "Back to Phoenix", where: "Sedona → PHX (~2h)", hrs: 2, stops: ["SED", "MON", "PHX"], items: ["Slow morning in Sedona", "Montezuma Castle stop off I-17", "Home by afternoon"] },
    days: [
      { title: "Plan B: Sedona red rocks", where: "PHX → Sedona (~2h)", hrs: 2, stops: ["PHX", "SED"], items: ["Bell Rock & Cathedral Rock (lower trails)", "Chapel of the Holy Cross", "Sunset at Airport Mesa"] },
      { title: "Plan B: Jerome & Verde Valley", where: "Sedona → Jerome (~45 min)", hrs: 1.5, stops: ["SED", "JER", "SED"], items: ["Jerome hillside ghost town", "Old Town Cottonwood wine tasting", "Dinner back in Sedona"] },
      { title: "Plan B: Ancient sites", where: "Around the Verde Valley", hrs: 1, stops: ["SED", "MON", "SED"], items: ["Montezuma Castle & Montezuma Well", "Out of Africa Wildlife Park (Camp Verde)", "Stargazing in Sedona"] }] },
  south: { stay: "Tucson",
    home: { title: "Back to Phoenix", where: "Tucson → PHX (~1h45)", hrs: 1.75, stops: ["TUC", "PHX"], items: ["Breakfast in Tucson", "Picacho Peak stop (optional)", "Home by afternoon"] },
    days: [
      { title: "Plan B: Drive to Tucson", where: "PHX → Tucson (~1h45)", hrs: 1.75, stops: ["PHX", "TUC"], items: ["Arizona-Sonora Desert Museum", "Saguaro National Park (West)", "Sunset at Gates Pass"] },
      { title: "Plan B: Missions & food", where: "Tucson", hrs: 0.5, stops: ["TUC"], items: ["San Xavier del Bac mission", "Sonoran hot dogs & 4th Ave (Tucson is a UNESCO City of Gastronomy)", "Saguaro NP East: Cactus Forest Loop"] },
      { title: "Plan B: Old West day", where: "Tucson → Tombstone (~1h15)", hrs: 2.5, stops: ["TUC", "TOM", "TUC"], items: ["Tombstone old west town", "Or Kartchner Caverns (book a tour)", "Dinner back in Tucson"] }] },
};

// ---------- State ----------
const DEFAULT = { arrive: "am", route: "quick", when: "22", base: "canyon", snow: "sedona", depart: "pm", fun: ["hike", "scottsdale", "games"], t: {}, votes: {}, done: [] };
const KEYS = ["arrive", "route", "when", "base", "snow", "depart"];
const fromLink = /(^|[#&])route=/.test(location.hash);
let state = loadState();
const ui = { open: fromLink ? null : "arrive", visited: new Set(fromLink ? QUESTIONS.map((q) => q.key) : ["arrive"]), firstPaint: true, prevDays: [], lastPath: "", celebrated: false };

// Readable share link, e.g. #route=quick&base=canyon&if=snow&done=car,flights&vote=Bobby:loop
function encode(s) {
  const p = new URLSearchParams();
  KEYS.forEach((k) => p.set(k, s[k]));
  p.set("fun", s.fun.join(","));
  const t = Object.keys(s.t).filter((k) => s.t[k]);
  if (t.length) p.set("if", t.join(","));
  if (s.done.length) p.set("done", s.done.join(","));
  const v = Object.entries(s.votes).filter(([, r]) => r).map(([n, r]) => `${n}:${r}`);
  if (v.length) p.set("vote", v.join(","));
  return p.toString();
}
function decode(hash) {
  const p = new URLSearchParams(hash.replace(/^#/, ""));
  const s = { ...DEFAULT, fun: [...DEFAULT.fun], t: {}, votes: {}, done: [] };
  KEYS.forEach((k) => { const v = p.get(k); if (v && QUESTIONS.find((q) => q.key === k).opts[v]) s[k] = v; });
  if (p.has("fun")) s.fun = p.get("fun").split(",").filter((f) => FUN_DETAIL[f]);
  (p.get("if") || "").split(",").filter((k) => ["snow", "delay", "split"].includes(k)).forEach((k) => (s.t[k] = true));
  s.done = (p.get("done") || "").split(",").filter(Boolean);
  (p.get("vote") || "").split(",").forEach((x) => { const [n, r] = x.split(":"); if (CREW.some((c) => c.name === n) && ROUTES[r]) s.votes[n] = r; });
  return s;
}
function loadState() {
  if (fromLink) return decode(location.hash);
  try { const saved = JSON.parse(localStorage.getItem("crew-plan") || "{}"); return { ...DEFAULT, ...saved, done: saved.done || [] }; } catch (e) { return { ...DEFAULT }; }
}
function save() {
  localStorage.setItem("crew-plan", JSON.stringify(state));
  history.replaceState(null, "", "#" + encode(state));
}
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const visibleQs = () => QUESTIONS.filter((q) => !q.show || q.show(state));

// ---------- Plan builder ----------
function build(s) {
  const snow = !!s.t.snow && s.route !== "none";
  const late = !!s.t.delay || s.arrive === "pm";
  const days = DATES.map((date) => ({ date, title: "", where: "Phoenix", night: "Home in PHX", items: [], free: 2, notes: [], hrs: 0, stops: ["PHX"], away: false }));

  days[0].title = "Arrive from Boston";
  days[0].items.push(s.t.delay ? "✈️ Delayed flight: land late, pick up the rental car, quick dinner and sleep"
    : late ? "Land at PHX in the evening. Pick up a 7-seater (or 2 cars) and get dinner"
    : "Land at PHX. Pick up a 7-seater (or 2 cars) and settle in at home");
  days[0].notes.push("Arizona doesn't use daylight saving time, so it's 2h behind Boston in December.");
  days[0].free = late ? 0 : 1;

  let north = [];
  if (s.route === "loop") {
    const seq = late ? [D.sedonaFlag(true), D.canyonDay, D.canyonHome] : [D.arriveSedona, D.sedonaFlag(false), D.canyonDay, D.canyonHome];
    north = seq.map((tpl, i) => ({ index: (late ? 1 : 0) + i, tpl }));
  } else if (s.route === "quick") {
    north = D.quick[s.base].map((tpl, i) => ({ index: (s.when === "23" ? 2 : 1) + i, tpl }));
  } else if (s.route === "day") {
    north = [{ index: s.when === "23" ? 2 : 1, tpl: D.sedonaDay }];
  }

  if (snow && s.snow !== "go" && s.route !== "day") {
    const alt = ALT[s.snow];
    north = north.map((n, i) => {
      const last = i === north.length - 1;
      const tpl = last ? { ...alt.home, night: "Home in PHX" } : { ...alt.days[i % alt.days.length], night: alt.stay };
      return { index: n.index, tpl: { ...tpl, items: n.index === 0 ? ["Land at PHX & pick up the car", ...tpl.items] : tpl.items } };
    });
  }

  north.forEach(({ index, tpl }) => {
    const d = days[index];
    Object.assign(d, { title: tpl.title, where: tpl.where, night: tpl.night, hrs: tpl.hrs, stops: tpl.stops, free: 0, away: true, items: [...tpl.items] });
    if (snow && s.snow === "go") d.notes.push("❄️ Snow plan: AWD or chains, check az511.gov before leaving, and allow extra drive time. Skip any road that's closed.");
    if (snow && s.route === "day") d.notes.push("❄️ Sedona sits lower (~4,300 ft) and is usually clear. If I-17 is bad, swap for a Phoenix day.");
    if (s.t.split) d.notes.push("😴 Split crew: car 1 does this trip, car 2 stays home and does the Phoenix downtime picks.");
  });

  const eve = days[3];
  if (!eve.away) { eve.title = "Christmas Eve in Phoenix"; eve.free = 1; eve.items.unshift("🛒 Grocery run for Christmas Day (most shops close early)"); }
  if (!eve.items.some((i) => i.includes("Christmas Eve"))) eve.items.push("🎄 Christmas Eve dinner at home, then a drive around to see neighbourhood lights");
  if (eve.away) eve.notes.push("Back late on Christmas Eve, so do the grocery run on the 22nd or 23rd.");

  const xmas = days[4];
  xmas.title = "Christmas Day at home 🎁"; xmas.free = 0;
  if (s.fun.includes("hike")) xmas.items.push("Optional early hike (trails are quiet on Christmas morning)");
  xmas.items.push("Gifts & a big Christmas lunch at home", "Pool or a walk in the sun (~19°C / 66°F)", "Games or movie night");
  xmas.notes.push("Most restaurants and attractions are closed, so plan to eat at home.");

  const dep = days[5];
  dep.title = "Fly back to Boston";
  dep.free = { am: 0, pm: 1, red: 2 }[s.depart];

  const pool = s.fun.length ? [...s.fun] : ["pool", "games"];
  let p = 0;
  days.forEach((d) => {
    if (!d.title) d.title = "Phoenix downtime";
    for (let k = 0; k < d.free; k++) { const pick = pool[p++]; d.items.push(pick ? FUN_DETAIL[pick] : "😌 Free time: nap, pool or wander"); }
  });
  dep.items.push({ am: "Leave for PHX airport ~2h before the flight", pm: "Brunch, then the airport by early afternoon", red: "Farewell dinner, then the airport for the evening flight" }[s.depart]);
  return { days, snow };
}

function contingencies(s) {
  const out = [];
  if (s.route !== "none") {
    out.push(["❄️ If it snows up north", {
      go: "We still go, with AWD/chains, checking az511.gov and the Grand Canyon NPS alerts each morning. Any closed road gets skipped.",
      sedona: "We swap the Grand Canyon and Flagstaff for Sedona, Jerome and the Verde Valley (lower and usually clear).",
      south: "We head south to Tucson and Saguaro National Park instead." }[s.snow]]);
    out.push(["🚧 If I-17, I-40 or AZ-64 closes mid-trip", "We stay put in Sedona or Flagstaff for the night, then come home once roads reopen. Don't drive Oak Creek Canyon (89A) in ice."]);
  }
  out.push(["✈️ If our Dec 21 flight is late", s.route === "loop"
    ? "The loop starts Dec 22 with an early drive (Sedona and Flagstaff on the same day), so we're still home for Christmas Eve."
    : `Nothing changes. The road trip doesn't start until Dec ${s.when === "23" ? "23" : "22"}.`]);
  out.push(["😴 If some people want to rest", "We split into 2 cars: one group does the road trip and the other gets the pool and Scottsdale."]);
  out.push(["🌧️ If it rains in Phoenix", "We go indoors: Musical Instrument Museum, Heard Museum or Scottsdale Fashion Square."]);
  if (s.route === "quick" && s.when === "23") out.push(["🎄 If we're driving back on Christmas Eve", "We leave the last stop by ~3pm so we're home for Christmas Eve dinner."]);
  return out;
}

// ---------- Rendering ----------
function renderCrew() {
  $("crew").innerHTML = CREW.map((p) => `<span class="avatar ${state.votes[p.name] ? "voted" : ""}"><i style="--c:${p.c};color:${p.fg}">${p.name[0]}</i>${p.name}</span>`).join("");
}

function optLabel(q) {
  if (q.multi) return state.fun.length ? state.fun.map((f) => q.opts[f][0].split(" ")[0]).join(" ") + ` · ${state.fun.length} picked` : "Nothing picked";
  return q.opts[state[q.key]]?.[0] ?? "—";
}

function renderQuestions() {
  const qs = visibleQs();
  const openIdx = qs.findIndex((q) => q.key === ui.open);
  const done = qs.filter((q) => ui.visited.has(q.key)).length;
  $("progress").style.width = `${(done / qs.length) * 100}%`;
  $("step-count").textContent = openIdx >= 0 ? `Step ${openIdx + 1} of ${qs.length}` : `${done}/${qs.length} answered`;
  $("questions").innerHTML = qs.map((q, i) => {
    const open = q.key === ui.open;
    return `<div class="step ${open ? "open" : ""} ${ui.visited.has(q.key) && !open ? "done" : ""}">
      <button class="step-head" data-step="${q.key}" aria-expanded="${open}">
        <span class="num">${ui.visited.has(q.key) && !open ? "✓" : i + 1}</span>
        <span class="step-title"><strong>${q.title}</strong><small>${esc(optLabel(q))}</small></span>
        <span class="chev">▾</span>
      </button>
      <div class="step-body"><div>
        <div class="opts">${Object.entries(q.opts).map(([v, [label, desc]]) => {
          const on = q.multi ? state.fun.includes(v) : state[q.key] === v;
          return `<button class="opt ${q.multi ? "multi" : ""} ${on ? "on" : ""}" data-q="${q.key}" data-v="${v}" aria-pressed="${on}"><strong>${label}</strong><span>${desc}</span></button>`;
        }).join("")}</div>
        ${q.multi ? `<button class="btn step-next" data-step-done="1">Done ✓</button>` : ""}
      </div></div>
    </div>`;
  }).join("");
}

function renderStats(days) {
  const hrs = days.reduce((a, d) => a + d.hrs, 0);
  const away = days.filter((d) => d.night !== "Home in PHX").length;
  const places = new Set(days.flatMap((d) => d.stops));
  const high = [...places].reduce((a, k) => (PLACES[k].elev > PLACES[a].elev ? k : a), "PHX");
  const tiles = [
    ["Driving", `~${Math.round(hrs * 2) / 2}<small> h</small>`, hrs ? "behind the wheel, roughly" : "only local drives"],
    ["Nights away", `${away}<small> / 5</small>`, `${5 - away} at home in PHX`],
    ["High point", `${PLACES[high].elev.toLocaleString()}<small> ft</small>`, PLACES[high].elev > SNOW_LINE ? `${PLACES[high].name}: snow possible ❄️` : `${PLACES[high].name}: below the snow line`],
    ["Holiday", `Dec 24–25`, "Christmas Eve & Day at home"],
  ];
  $("stats").innerHTML = tiles.map(([l, v, s]) => `<div class="stat"><div class="label">${l}</div><div class="value">${v}</div><div class="sub">${esc(s)}</div></div>`).join("");
}

// --- Map ---
const proj = ([lon, lat]) => [(lon + 114.9) * 50, (37.1 - lat) * 60];
const AZ = [[-114.05, 37], [-109.05, 37], [-109.05, 31.33], [-111.07, 31.33], [-114.81, 32.5], [-114.47, 32.85], [-114.72, 33.4], [-114.5, 34], [-114.15, 34.3],
  [-114.6, 34.9], [-114.75, 35.1], [-114.6, 35.6], [-114.75, 36.1], [-114.05, 36.2]];
const ROADS = [["PHX", "FLG"], ["PHX", "TUC"], ["FLG", "GC"], ["TUC", "TOM"]];
const pt = (k) => proj([PLACES[k].lon, PLACES[k].lat]);

function routePath(seq) {
  if (seq.length < 2) return "";
  let d = `M${pt(seq[0]).map((n) => n.toFixed(1)).join(" ")}`;
  for (let i = 1; i < seq.length; i++) {
    const [x1, y1] = pt(seq[i - 1]), [x2, y2] = pt(seq[i]);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, k = 0.18;
    d += ` Q${(mx - dy * k).toFixed(1)} ${(my + dx * k).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

function renderMap(days) {
  const seq = days.flatMap((d) => d.stops).filter((k, i, a) => k !== a[i - 1]);
  const used = new Set(seq);
  const shown = Object.keys(PLACES).filter((k) => used.has(k) || ["PHX", "SED", "FLG", "GC", "TUC"].includes(k));
  const d = routePath(seq);
  const i40 = [proj([-114.4, 35.2]), proj([-109.05, 35.2])];
  const svg = $("map");
  svg.innerHTML = `
    <polygon class="state" points="${AZ.map(proj).map((p) => p.join(",")).join(" ")}" />
    <line class="road" x1="${i40[0][0]}" y1="${i40[0][1]}" x2="${i40[1][0]}" y2="${i40[1][1]}" />
    ${ROADS.map(([a, b]) => { const [x1, y1] = pt(a), [x2, y2] = pt(b); return `<line class="road" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`; }).join("")}
    <path class="route" id="route" d="${d}" />
    ${shown.map((k) => {
      const [x, y] = pt(k), P = PLACES[k], cls = k === "PHX" ? "home" : used.has(k) ? "on" : "off";
      const tx = P.side === "left" ? x - 11 : x + 11;
      return `<g class="stop ${cls}"><title>${P.name}${k === "PHX" ? " (home base)" : ""}</title>
        ${cls === "on" ? `<circle class="ring" cx="${x}" cy="${y}" r="7" />` : ""}
        <circle cx="${x}" cy="${y}" r="${cls === "off" ? 5 : cls === "home" ? 8 : 7}" />
        <text x="${tx}" y="${y + 4}" text-anchor="${P.side === "left" ? "end" : "start"}">${k === "PHX" ? "🏡 " : ""}${P.name}</text></g>`;
    }).join("")}`;
  const path = $("route");
  if (d && path.getTotalLength) {
    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    if (d !== ui.lastPath && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = len;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        path.classList.add("draw");
        path.style.strokeDashoffset = 0;
      }));
    } else path.style.strokeDashoffset = 0;
  }
  ui.lastPath = d;
  $("route-pill").textContent = seq.length > 1 ? seq.map((k) => PLACES[k].name).join(" → ") : "Home base only";
}

function renderTimeline(days) {
  const keys = days.map((d) => JSON.stringify(d));
  const tl = $("timeline");
  tl.classList.toggle("intro", ui.firstPaint);
  tl.innerHTML = days.map((d, i) => {
    const xmas = d.date.includes("Christmas");
    const changed = !ui.firstPaint && ui.prevDays[i] !== keys[i];
    const home = d.night === "Home in PHX";
    return `<li id="day-${i}" class="day ${d.away ? "away" : ""} ${xmas ? "xmas" : ""} ${changed ? "changed" : ""}" style="--i:${i}">
      <span class="dot">${xmas ? "🎄" : d.away ? "🚗" : "🏡"}</span>
      <div class="day-card">
        <div class="day-top">
          <span class="day-date">${d.date}</span>
          <span class="tags">${d.hrs ? `<span class="tag">🚗 ~${d.hrs}h</span>` : ""}<span class="tag ${home ? "home" : "away"}">🛏️ ${esc(d.night)}</span></span>
        </div>
        <h3>${esc(d.title)}</h3>
        <p class="where">📍 ${esc(d.where)}</p>
        <ul>${d.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        ${d.notes.map((n) => `<p class="note">${esc(n)}</p>`).join("")}
      </div></li>`;
  }).join("");
  ui.prevDays = keys;
}

function renderIfs() {
  $("ifs").innerHTML = contingencies(state).map(([a, b], i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(a)}</summary><p>→ ${esc(b)}</p></details>`).join("");
}

function tallyCounts() {
  const counts = Object.fromEntries(Object.keys(ROUTES).map((k) => [k, []]));
  CREW.forEach((p) => { const v = state.votes[p.name]; if (v && counts[v]) counts[v].push(p.name); });
  return counts;
}

function renderVotes() {
  $("voters").innerHTML = CREW.map((p) => `
    <div class="voter">
      <span class="face" style="--c:${p.c};color:${p.fg}">${p.name[0]}</span>
      <span class="name">${p.name}</span>
      <span class="choices">${Object.entries(ROUTES).map(([k, r]) =>
        `<button class="choice ${state.votes[p.name] === k ? "on" : ""}" data-voter="${p.name}" data-route="${k}" title="${r.label}" aria-label="${p.name} votes ${r.label}" aria-pressed="${state.votes[p.name] === k}">${r.icon}</button>`).join("")}</span>
    </div>`).join("");

  const counts = tallyCounts();
  const total = Object.values(counts).reduce((a, v) => a + v.length, 0);
  const max = Math.max(...Object.values(counts).map((v) => v.length));
  const leaders = Object.keys(counts).filter((k) => max > 0 && counts[k].length === max);
  $("tally").innerHTML = Object.entries(ROUTES).map(([k, r]) => {
    const n = counts[k].length;
    return `<div class="bar-row ${leaders.length === 1 && leaders[0] === k ? "lead" : ""} ${n ? "" : "zero"}" title="${r.label}: ${n} vote${n === 1 ? "" : "s"}${n ? ` (${counts[k].join(", ")})` : ""}">
      <span class="bar-label">${r.icon} ${r.label}</span>
      <span class="bar-track"><span class="bar" style="width:${(n / CREW.length) * 100}%"></span></span>
      <span class="bar-val">${n}</span>
      ${n ? `<span class="bar-who">${counts[k].join(", ")}</span>` : ""}
    </div>`;
  }).join("") + `<div class="tally-foot"><span>${total}/6 voted${leaders.length > 1 ? " · it's a tie!" : leaders.length ? ` · leading: ${ROUTES[leaders[0]].icon} ${ROUTES[leaders[0]].label}` : ""}</span>
    ${leaders.length === 1 && leaders[0] !== state.route ? `<button class="btn" id="apply-vote">Use the crew's pick</button>` : ""}</div>`;
  $("vote-pill").textContent = `${total}/6 voted`;

  if (total === 6 && leaders.length === 1 && !ui.celebrated) { ui.celebrated = true; if (!ui.firstPaint) confetti(); }
  if (total < 6) ui.celebrated = false;
}

// --- Option cards: compare every route with the current settings ---
function summarize(days) {
  const places = new Set(days.flatMap((d) => d.stops));
  return {
    hrs: Math.round(days.reduce((a, d) => a + d.hrs, 0) * 2) / 2,
    away: days.filter((d) => d.night !== "Home in PHX").length,
    high: Math.max(...[...places].map((k) => PLACES[k].elev)),
    places: [...places].filter((k) => k !== "PHX").map((k) => PLACES[k].name),
  };
}
function renderOptions() {
  $("options").innerHTML = Object.entries(ROUTES).map(([k, r]) => {
    const m = summarize(build({ ...state, route: k }).days);
    const on = state.route === k;
    return `<article class="option ${on ? "on" : ""}">
      <div class="option-top"><span class="letter">Option ${r.letter}</span>${on ? `<span class="pill">✓ Current plan</span>` : ""}</div>
      <h3>${r.icon} ${r.name}</h3>
      <p class="option-route">${m.places.length ? esc(m.places.join(" · ")) : "Phoenix only"}</p>
      <dl class="option-stats">
        <div><dt>Driving</dt><dd>~${m.hrs}h</dd></div>
        <div><dt>Nights away</dt><dd>${m.away}</dd></div>
        <div><dt>High point</dt><dd>${m.high.toLocaleString()} ft${m.high > SNOW_LINE ? " ❄️" : ""}</dd></div>
      </dl>
      <p class="pro">👍 ${esc(r.pro)}</p>
      <p class="con">👎 ${esc(r.con)}</p>
      ${on ? "" : `<button class="btn ghost" data-pick="${k}">Choose option ${r.letter}</button>`}
    </article>`;
  }).join("");
}

// --- Elevation profile (single series; tap a point to jump to that day) ---
function renderElevation(days) {
  const pts = [];
  days.forEach((d, di) => d.stops.forEach((k) => { if (!pts.length || pts.at(-1).k !== k) pts.push({ k, di }); }));
  if (pts.length === 1) pts.push({ k: "PHX", di: 5 });
  const W = 640, H = 220, L = 46, R = 16, T = 22, B = 34, MAX = 8000;
  const x = (i) => L + (i * (W - L - R)) / (pts.length - 1);
  const y = (ft) => T + (1 - ft / MAX) * (H - T - B);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(PLACES[p.k].elev).toFixed(1)}`).join(" ");
  const area = `${line} L${x(pts.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const grid = [0, 2000, 4000, 6000, 8000].map((ft) =>
    `<line class="grid" x1="${L}" x2="${W - R}" y1="${y(ft)}" y2="${y(ft)}" /><text class="axis" x="${L - 8}" y="${y(ft) + 4}" text-anchor="end">${ft ? ft / 1000 + "k" : "0"}</text>`).join("");
  const labelled = new Set();
  $("elev").innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Elevation along the route">
      ${grid}
      <line class="snowline" x1="${L}" x2="${W - R}" y1="${y(SNOW_LINE)}" y2="${y(SNOW_LINE)}" />
      <text class="snowlabel" x="${W - R}" y="${y(SNOW_LINE) - 6}" text-anchor="end">❄️ snow possible above ~${SNOW_LINE.toLocaleString()} ft</text>
      <path class="elev-area" d="${area}" />
      <path class="elev-line" d="${line}" />
      ${pts.map((p, i) => {
        const P = PLACES[p.k], first = !labelled.has(p.k); labelled.add(p.k);
        return `<g class="elev-pt" data-day="${p.di}" tabindex="0" role="button" aria-label="${P.name}, ${P.elev.toLocaleString()} ft, jump to ${DATES[p.di]}">
          <title>${P.name} · ${P.elev.toLocaleString()} ft · ${DATES[p.di]}</title>
          <circle class="hit" cx="${x(i)}" cy="${y(P.elev)}" r="16" />
          <circle class="mark ${P.elev > SNOW_LINE ? "cold" : ""}" cx="${x(i)}" cy="${y(P.elev)}" r="5" />
          ${first ? `<text class="pt-label" x="${x(i)}" y="${y(P.elev) - 11}" text-anchor="middle">${P.name}</text>` : ""}
          ${i === 0 || pts[i - 1].di !== p.di ? `<text class="axis" x="${x(i)}" y="${H - 12}" text-anchor="middle">${DATES[p.di].slice(5, 11)}</text>` : ""}
        </g>`;
      }).join("")}
    </svg>`;
}

// --- Booking checklist (ticks saved in the link) ---
function checklist(days) {
  const stops = new Set(days.flatMap((d) => d.stops));
  const items = [
    ["flights", "✈️ Flights BOS ⇄ PHX for all six (Dec 21 out, Dec 26 back)"],
    ["car", "🚙 Rental at PHX: a 7-seater, or 2 cars (6 people + bags). Book early, holiday week."],
  ];
  days.forEach((d, i) => { if (d.night !== "Home in PHX") items.push([`stay-${d.night.split(" ")[0].toLowerCase()}-${i}`, `🛏️ Rooms in ${d.night} for ${DATES[i].split(" ·")[0]}. Holiday week sells out.`]); });
  if (stops.has("GC")) items.push(["gc-pass", "🎟️ Grand Canyon entry, per vehicle and valid 7 days. Buy ahead at recreation.gov, or get an America the Beautiful annual pass if going with 2 cars."]);
  if (stops.has("SED")) items.push(["redrock", "🅿️ Sedona trailhead parking: Red Rock Pass (or the America the Beautiful pass)"]);
  if (state.t.snow && state.snow === "go" && state.route !== "none") items.push(["chains", "⛓️ Confirm AWD on the rental and pick up snow chains"]);
  if (state.fun.includes("balloon")) items.push(["balloon", "🎈 Book the sunrise balloon ride (books up over the holidays)"]);
  items.push(["xmas-food", "🛒 Christmas Day groceries by Dec 23–24 (most shops close early on Christmas Eve)"]);
  return items;
}
function renderChecklist(days) {
  const items = checklist(days);
  const done = items.filter(([id]) => state.done.includes(id)).length;
  $("check-pill").textContent = `${done}/${items.length} done`;
  $("checklist").innerHTML = items.map(([id, label]) => `
    <label class="check ${state.done.includes(id) ? "on" : ""}">
      <input type="checkbox" data-done="${id}" ${state.done.includes(id) ? "checked" : ""} />
      <span class="box"></span><span>${esc(label)}</span>
    </label>`).join("");
}

function renderAll() {
  ["snow", "delay", "split"].forEach((k) => ($("t-" + k).checked = !!state.t[k]));
  const { days } = build(state);
  renderCrew(); renderQuestions(); renderStats(days); renderOptions(); renderMap(days); renderElevation(days); renderTimeline(days); renderChecklist(days); renderIfs(); renderVotes();
  ui.firstPaint = false;
  save();
}

// ---------- Countdown ----------
function tick() {
  const ms = TRIP_START - new Date();
  if (ms <= 0) { $("countdown").innerHTML = `<div class="cd"><b>🎉</b><span>Trip time!</span></div>`; return; }
  const parts = [[Math.floor(ms / 864e5), "days"], [Math.floor(ms / 36e5) % 24, "hrs"], [Math.floor(ms / 6e4) % 60, "min"], [Math.floor(ms / 1e3) % 60, "sec"]];
  $("countdown").innerHTML = parts.map(([n, l]) => `<div class="cd"><b>${String(n).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
}

// ---------- Toast / confetti / copy ----------
function toast(msg) {
  const t = $("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = $("confetti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const colors = CREW.map((p) => p.c);
  const bits = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4,
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const end = performance.now() + 2600;
  (function frame(now) {
    ctx.clearRect(0, 0, c.width, c.height);
    bits.forEach((b) => {
      b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.fillStyle = b.c; ctx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); ctx.restore();
    });
    if (now < end) requestAnimationFrame(frame); else ctx.clearRect(0, 0, c.width, c.height);
  })(performance.now());
}

function planText() {
  const { days } = build(state);
  const r = ROUTES[state.route];
  return `🌵 Crew trip: Boston → Phoenix (Dec 21–26)\nRoute: ${r.icon} ${r.label}\n\n` +
    days.map((d) => `*${d.date}*: ${d.title}\n📍 ${d.where} · 🛏️ ${d.night}\n${d.items.map((i) => "• " + i).join("\n")}`).join("\n\n") +
    `\n\nIf this happens:\n` + contingencies(state).map(([a, b]) => `• ${a} → ${b}`).join("\n") +
    `\n\nPlan & vote: ${location.href}`;
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const ta = Object.assign(document.createElement("textarea"), { value: text }); document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
}

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem("crew-theme", t);
  $("theme").textContent = t === "dark" ? "☀️" : "🌙";
}

// ---------- Events ----------
document.addEventListener("click", async (e) => {
  const opt = e.target.closest(".opt");
  if (opt) {
    const { q, v } = opt.dataset;
    if (q === "fun") state.fun = state.fun.includes(v) ? state.fun.filter((x) => x !== v) : [...state.fun, v];
    else {
      state[q] = v;
      const qs = visibleQs(), next = qs[qs.findIndex((x) => x.key === q) + 1];
      ui.open = next ? next.key : null;
      if (next) ui.visited.add(next.key);
    }
    ui.visited.add(q);
    return renderAll();
  }
  const head = e.target.closest("[data-step]");
  if (head) { const k = head.dataset.step; ui.open = ui.open === k ? null : k; ui.visited.add(k); return renderAll(); }
  if (e.target.closest("[data-step-done]")) { ui.open = null; return renderAll(); }

  const pick = e.target.closest("[data-pick]");
  if (pick) { state.route = pick.dataset.pick; ui.visited.add("route"); renderAll(); return toast(`Switched to option ${ROUTES[state.route].letter} · ${ROUTES[state.route].name}`); }
  const ep = e.target.closest(".elev-pt");
  if (ep) return jumpToDay(ep.dataset.day);

  const ch = e.target.closest(".choice");
  if (ch) {
    const { voter, route } = ch.dataset;
    state.votes[voter] = state.votes[voter] === route ? "" : route;
    return renderAll();
  }
  if (e.target.id === "apply-vote") {
    const counts = tallyCounts();
    state.route = Object.keys(counts).sort((a, b) => counts[b].length - counts[a].length)[0];
    renderAll(); confetti(); return toast("Route updated to the crew's pick 🎉");
  }
  if (e.target.closest("#copy-link")) { save(); await copy(location.href); return toast("Share link copied 🔗"); }
  if (e.target.closest("#copy-text")) { await copy(planText()); return toast("Plan copied, paste it in the group chat 📋"); }
  if (e.target.closest("#theme")) setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.addEventListener("change", (e) => {
  if (e.target.id && e.target.id.startsWith("t-")) { state.t[e.target.id.slice(2)] = e.target.checked; renderAll(); }
  const id = e.target.dataset && e.target.dataset.done;
  if (id) { state.done = e.target.checked ? [...new Set([...state.done, id])] : state.done.filter((x) => x !== id); renderAll(); }
});
document.addEventListener("keydown", (e) => {
  const ep = e.target.closest && e.target.closest(".elev-pt");
  if (ep && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); jumpToDay(ep.dataset.day); }
});
function jumpToDay(i) {
  const el = $("day-" + i);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.remove("changed"); void el.offsetWidth; el.classList.add("changed");
}

setTheme(document.documentElement.dataset.theme || "light");
renderAll();
tick(); setInterval(tick, 1000);
