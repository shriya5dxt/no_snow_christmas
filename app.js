// Itinerary data — edit or add destinations here.
const ITINERARIES = [
  {
    id: "goa",
    name: "Sun, Sand & Midnight Mass",
    place: "Goa, India",
    region: "Asia",
    emoji: "🏖️",
    color: "#ffd6a5",
    vibes: ["beach", "culture", "food"],
    budget: 1,
    temp: "24–32°C",
    blurb: "Portuguese-era churches lit with stars, beach shacks and a famously lively Christmas season.",
    festive: "Paper star lanterns hang from homes, carol singers roam the villages, and Midnight Mass at the old churches is a highlight. Try bebinca and kulkuls — Goan Christmas sweets.",
    days: [
      ["Arrive & unwind", "Check in near Candolim or Calangute, sunset at Sinquerim beach."],
      ["Old Goa heritage", "Basilica of Bom Jesus & Se Cathedral, then the colourful Latin Quarter of Fontainhas in Panaji."],
      ["Christmas Eve", "Spice plantation tour by day, Midnight Mass at a village church by night."],
      ["Christmas Day", "Long lunch of Goan feast dishes, lazy afternoon in South Goa (Palolem or Agonda)."],
      ["Island hopping", "Dolphin-spotting boat trip and a stop at Butterfly Beach."],
      ["Markets & farewell", "Saturday night market (Arpora) or Anjuna flea market, last beach dinner."],
    ],
    tips: ["Book stays early — late December is peak season.", "Rent a scooter or hire a driver for the day."],
  },
  {
    id: "kerala",
    name: "Backwaters & Fort Kochi Lights",
    place: "Kerala, India",
    region: "Asia",
    emoji: "🛶",
    color: "#caffbf",
    vibes: ["culture", "food", "family"],
    budget: 1,
    temp: "23–32°C",
    blurb: "Houseboats on palm-fringed canals, tea hills and a historic Christmas in Fort Kochi.",
    festive: "Fort Kochi glows with stars and lights through the season, building up to the Cochin Carnival around New Year.",
    days: [
      ["Fort Kochi", "Chinese fishing nets, St. Francis Church, evening Kathakali performance."],
      ["Munnar", "Drive into the hills; tea estate walk and tea museum."],
      ["Munnar → Thekkady", "Spice gardens and an optional bamboo-rafting trip at Periyar."],
      ["Alleppey houseboat", "Overnight houseboat through the backwaters with a Kerala sadya meal."],
      ["Christmas in Kochi", "Christmas services, plum cake and appam with stew, strolling the lit-up streets."],
      ["Varkala", "Cliff-top cafés and beach time before flying home."],
    ],
    tips: ["Houseboats sell out at Christmas — book weeks ahead.", "Pack light layers for the hills."],
  },
  {
    id: "capetown",
    name: "Summer Christmas at the Cape",
    place: "Cape Town, South Africa",
    region: "Africa",
    emoji: "🏔️",
    color: "#a0c4ff",
    vibes: ["adventure", "food", "beach", "city"],
    budget: 2,
    temp: "17–27°C",
    blurb: "Mountains, penguins and winelands in the long, bright days of a southern summer.",
    festive: "Locals celebrate with a braai (barbecue) and picnics. The V&A Waterfront hosts carols and holiday markets.",
    days: [
      ["Table Mountain", "Cable car (or hike Platteklip Gorge) and sunset at Signal Hill."],
      ["Cape Peninsula", "Chapman's Peak drive, Boulders Beach penguins, Cape Point."],
      ["Winelands", "Stellenbosch & Franschhoek wine tram with long lunches."],
      ["Christmas Eve", "Kirstenbosch garden walk; carols and markets at the Waterfront."],
      ["Christmas Day braai", "Beach morning at Camps Bay or Clifton, then a festive braai."],
      ["Bo-Kaap & city", "Colourful Bo-Kaap streets, Cape Malay cooking class."],
      ["Whale coast (optional)", "Day trip to Hermanus or relax before departure."],
    ],
    tips: ["Wind (the 'Cape Doctor') can close the cable car — keep a flexible day.", "Sunscreen — the summer sun is strong."],
  },
  {
    id: "sydney",
    name: "Bondi Christmas & Harbour Lights",
    place: "Sydney, Australia",
    region: "Oceania",
    emoji: "🎆",
    color: "#ffc6ff",
    vibes: ["beach", "city", "family"],
    budget: 3,
    temp: "19–26°C",
    blurb: "Seafood on Christmas Day, beach barbecues and the run-up to the world-famous harbour fireworks.",
    festive: "A prawn-and-pavlova Christmas lunch is classic. Carols by Candlelight events and Martin Place's giant tree set the mood.",
    days: [
      ["Harbour icons", "Opera House, Royal Botanic Garden, ferry to Manly."],
      ["Coastal walk", "Bondi to Coogee coastal walk with ocean-pool swims."],
      ["Blue Mountains", "Day trip to the Three Sisters and Scenic World."],
      ["Christmas Eve", "Fish market feast and a Carols by Candlelight concert."],
      ["Christmas Day", "Beach morning, seafood lunch, sunset harbour cruise."],
      ["Boxing Day", "Watch the Sydney-to-Hobart yacht race leave the harbour."],
    ],
    tips: ["Book harbour cruises and NYE vantage points well in advance.", "Swim between the red-and-yellow flags."],
  },
  {
    id: "tulum",
    name: "Cenotes & Posadas",
    place: "Tulum & Riviera Maya, Mexico",
    region: "Americas",
    emoji: "🌮",
    color: "#fdffb6",
    vibes: ["beach", "adventure", "culture", "food"],
    budget: 2,
    temp: "22–29°C",
    blurb: "Mayan ruins, swimmable sinkholes and Mexican holiday traditions on the Caribbean coast.",
    festive: "Las Posadas re-enact Mary and Joseph's search for shelter through Dec 16–24 with candles, songs, piñatas and ponche.",
    days: [
      ["Tulum ruins", "Clifftop Mayan ruins, then a beach afternoon."],
      ["Cenote day", "Swim at Gran Cenote and Dos Ojos."],
      ["Chichén Itzá", "Day trip to the pyramid with a stop at Valladolid."],
      ["Noche Buena", "Join a posada, then Christmas Eve dinner — try bacalao or tamales."],
      ["Christmas Day", "Snorkel with turtles at Akumal, relaxed seafood lunch."],
      ["Sian Ka'an", "Boat tour through the biosphere reserve's lagoons."],
    ],
    tips: ["Use reef-safe sunscreen in cenotes.", "Carry pesos for smaller towns and cenotes."],
  },
  {
    id: "rio",
    name: "Rio Summer Celebration",
    place: "Rio de Janeiro, Brazil",
    region: "Americas",
    emoji: "🎄",
    color: "#9bf6ff",
    vibes: ["city", "beach", "culture"],
    budget: 2,
    temp: "24–31°C",
    blurb: "Samba, beaches and the giant Christmas tree on Lagoa Rodrigo de Freitas.",
    festive: "Brazilians celebrate on Christmas Eve with a late feast (ceia de Natal). Rio's lagoon-side tree and light shows are a big tradition.",
    days: [
      ["Copacabana & Ipanema", "Beach day, sunset at Arpoador rock."],
      ["Christ the Redeemer", "Corcovado in the morning, Santa Teresa neighbourhood in the afternoon."],
      ["Sugarloaf", "Cable car at sunset, dinner in Urca."],
      ["Ceia de Natal", "Christmas Eve feast and the lagoon Christmas tree lights."],
      ["Christmas Day", "Tijuca Forest waterfalls hike, then a relaxed churrasco."],
      ["Lapa & samba", "Selarón Steps by day, live samba in Lapa by night."],
    ],
    tips: ["Keep valuables minimal on the beach.", "It's the rainy season — afternoon showers are common."],
  },
  {
    id: "tenerife",
    name: "Europe's Winter Sun",
    place: "Tenerife, Canary Islands, Spain",
    region: "Europe",
    emoji: "🌋",
    color: "#ffadad",
    vibes: ["adventure", "beach", "family"],
    budget: 2,
    temp: "18–23°C",
    blurb: "A short hop from Europe for volcano hikes, black-sand beaches and Spanish festive feasts.",
    festive: "Nativity scenes (belenes) fill the towns, and Spanish Nochebuena dinner is the main event — with Three Kings' Day celebrated in January.",
    days: [
      ["Arrive in the south", "Settle in Costa Adeje, sunset at the beach."],
      ["Mount Teide", "Cable car up Spain's highest peak; stargazing tour at night."],
      ["Whales & dolphins", "Boat trip off Los Gigantes cliffs."],
      ["Nochebuena", "Visit La Laguna's old town and belenes, festive dinner."],
      ["Christmas Day", "Natural rock pools at Garachico, relaxed long lunch."],
    ],
    tips: ["Bring a warm layer for Teide's summit.", "The north is greener and cooler; the south is sunnier."],
  },
  {
    id: "phuket",
    name: "Andaman Island Hop",
    place: "Phuket & Krabi, Thailand",
    region: "Asia",
    emoji: "🏝️",
    color: "#bdb2ff",
    vibes: ["beach", "adventure", "food"],
    budget: 1,
    temp: "24–32°C",
    blurb: "Limestone cliffs, turquoise water and street-food feasts in the dry season.",
    festive: "Resorts and Old Phuket Town put on festive lights and beach dinners — a relaxed, tropical take on Christmas.",
    days: [
      ["Old Phuket Town", "Sino-Portuguese streets, cafés and a night market."],
      ["Phi Phi Islands", "Speedboat day to Maya Bay and snorkel stops."],
      ["Ferry to Krabi", "Afternoon at Ao Nang, longtail boat at sunset."],
      ["Railay Christmas Eve", "Rock climbing or kayaking, beach dinner under the stars."],
      ["Christmas Day", "Four-islands tour, Thai cooking class in the evening."],
      ["Relax", "Massage, hot springs and the Emerald Pool near Krabi."],
    ],
    tips: ["Peak season — reserve island tours in advance.", "Cover shoulders and knees at temples."],
  },
  {
    id: "maui",
    name: "Mele Kalikimaka on Maui",
    place: "Maui, Hawaii, USA",
    region: "Americas",
    emoji: "🌺",
    color: "#ffd6e0",
    vibes: ["beach", "adventure", "family"],
    budget: 3,
    temp: "19–27°C",
    blurb: "Whale season, scenic drives and Santa arriving by outrigger canoe.",
    festive: "Hawaiian Christmas features holiday luau feasts, festive lights in town, and Santa sometimes arriving by canoe instead of sleigh.",
    days: [
      ["West Maui", "Kaanapali beach and snorkelling at Black Rock."],
      ["Haleakalā sunrise", "Sunrise above the clouds (reservation required)."],
      ["Road to Hana", "Waterfalls, black-sand beach and bamboo forest."],
      ["Christmas Eve luau", "Whale-watching cruise, then a traditional luau."],
      ["Christmas Day", "Molokini crater snorkel, poke picnic on the beach."],
      ["Upcountry", "Lavender farm, Makawao town, farm-to-table lunch."],
    ],
    tips: ["Haleakalā sunrise permits open ~60 days in advance.", "December is peak humpback whale season."],
  },
  {
    id: "dubai",
    name: "Desert & Skyline Holiday",
    place: "Dubai & Abu Dhabi, UAE",
    region: "Middle East",
    emoji: "🐪",
    color: "#ffe5b4",
    vibes: ["city", "adventure", "family"],
    budget: 3,
    temp: "17–26°C",
    blurb: "Perfect winter temperatures for desert camps, beach clubs and dazzling festive malls.",
    festive: "Hotels host lavish Christmas brunches, and festive markets and giant trees light up the malls and waterfront.",
    days: [
      ["Downtown", "Burj Khalifa observation deck and the Dubai Fountain show."],
      ["Old Dubai", "Abra across the Creek, gold & spice souks, Al Fahidi."],
      ["Desert safari", "Dune bashing, camel ride and dinner under the stars."],
      ["Christmas Eve", "Festive market and a beachfront dinner at JBR."],
      ["Christmas Day", "Classic Christmas brunch, then pool or beach time."],
      ["Abu Dhabi", "Sheikh Zayed Grand Mosque and the Louvre Abu Dhabi."],
    ],
    tips: ["Dress modestly at mosques and in older areas.", "Evenings can be cool in the desert — bring a layer."],
  },
  {
    id: "bali",
    name: "Temples, Terraces & Tropical Christmas",
    place: "Bali, Indonesia",
    region: "Asia",
    emoji: "🌴",
    color: "#b9fbc0",
    vibes: ["culture", "beach", "food"],
    budget: 1,
    temp: "24–31°C",
    blurb: "Rice terraces, cliff temples and wellness retreats with a festive resort feel.",
    festive: "Resorts and villas decorate with tropical trees and offer Christmas Eve dinners; Christian communities in villages like Blimbingsari celebrate with Balinese touches.",
    days: [
      ["Seminyak", "Beach clubs and sunset at Tanah Lot temple."],
      ["Ubud", "Monkey Forest, art market and a Balinese dance show."],
      ["Rice terraces", "Tegallalang terraces and the Tirta Empul water temple."],
      ["Christmas Eve", "Morning yoga, then a festive villa or resort dinner."],
      ["Christmas Day", "Uluwatu cliffs, Kecak fire dance at sunset, seafood at Jimbaran."],
      ["Nusa Penida", "Day trip for Kelingking Beach and manta snorkelling."],
    ],
    tips: ["It's wet season — expect short, heavy afternoon showers.", "Carry a sarong for temple visits."],
  },
  {
    id: "puertorico",
    name: "Parrandas in Puerto Rico",
    place: "San Juan, Puerto Rico",
    region: "Americas",
    emoji: "🎶",
    color: "#ffcad4",
    vibes: ["culture", "beach", "food", "family"],
    budget: 2,
    temp: "22–29°C",
    blurb: "One of the longest Christmas seasons anywhere — music, food and Caribbean beaches.",
    festive: "Parrandas are festive musical 'raids' where friends sing door to door. Try coquito (coconut eggnog) and pernil. Celebrations run through mid-January.",
    days: [
      ["Old San Juan", "Colourful streets, El Morro fort and festive plazas."],
      ["El Yunque", "Rainforest hike to waterfalls."],
      ["Bioluminescent bay", "Luquillo kiosks lunch, night kayak in Fajardo's glowing bay."],
      ["Nochebuena", "Lechón feast in Guavate's 'Pork Highway' & a parranda."],
      ["Christmas Day", "Beach day at Isla Verde or Flamenco Beach (Culebra)."],
    ],
    tips: ["US citizens don't need a passport.", "Book bio-bay tours ahead — they sell out."],
  },
];

const BUDGET = ["", "$", "$$", "$$$"];
const VIBE_LABEL = { beach: "🏖️ Beach", adventure: "🧗 Adventure", culture: "🎭 Culture", city: "🌆 City", food: "🍽️ Food", family: "👨‍👩‍👧 Family" };

const $ = (id) => document.getElementById(id);
const els = {
  search: $("search"), vibe: $("vibe"), region: $("region"), budget: $("budget"), days: $("days"),
  grid: $("grid"), count: $("count"), dialog: $("detail"), body: $("detail-body"),
  favs: $("favs"), favsSection: $("favs-section"),
};

let favorites = new Set(JSON.parse(localStorage.getItem("nsc-favs") || "[]"));

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function filtered() {
  const q = els.search.value.trim().toLowerCase();
  const vibe = els.vibe.value, region = els.region.value;
  const budget = Number(els.budget.value), maxDays = Number(els.days.value);
  return ITINERARIES.filter((it) => {
    if (vibe && !it.vibes.includes(vibe)) return false;
    if (region && it.region !== region) return false;
    if (budget && it.budget !== budget) return false;
    if (maxDays && it.days.length > maxDays) return false;
    if (q) {
      const hay = [it.name, it.place, it.blurb, it.festive, ...it.vibes, ...it.days.flat()].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function render() {
  const list = filtered();
  els.count.textContent = `${list.length} itinerar${list.length === 1 ? "y" : "ies"} found`;
  els.grid.innerHTML = list.length
    ? list.map((it) => `
      <article class="card">
        <div class="card-banner" style="background:${it.color}">
          <span aria-hidden="true">${it.emoji}</span>
          <button class="fav" data-fav="${it.id}" aria-label="Toggle shortlist">${favorites.has(it.id) ? "⭐" : "☆"}</button>
        </div>
        <div class="card-body">
          <h3>${esc(it.name)}</h3>
          <p class="place">📍 ${esc(it.place)}</p>
          <div class="meta">
            <span class="chip warm">🌡️ ${it.temp}</span>
            <span class="chip">${it.days.length} days</span>
            <span class="chip">${BUDGET[it.budget]}</span>
          </div>
          <p class="blurb">${esc(it.blurb)}</p>
          <button class="btn btn-sea" data-open="${it.id}">View itinerary</button>
        </div>
      </article>`).join("")
    : `<p class="empty">No matches — try loosening your filters. 🌞</p>`;
  renderFavs();
}

function renderFavs() {
  const items = ITINERARIES.filter((it) => favorites.has(it.id));
  els.favsSection.hidden = items.length === 0;
  els.favs.innerHTML = items.map((it) => `<li><a data-open="${it.id}">${it.emoji} ${esc(it.name)}</a> — ${esc(it.place)}</li>`).join("");
}

function open(id) {
  const it = ITINERARIES.find((x) => x.id === id);
  if (!it) return;
  els.body.innerHTML = `
    <div class="detail-head">
      <h2>${it.emoji} ${esc(it.name)}</h2>
      <p class="place">📍 ${esc(it.place)} · ${it.region}</p>
      <div class="meta">
        <span class="chip warm">🌡️ ${it.temp} in late Dec</span>
        <span class="chip">${it.days.length} days</span>
        <span class="chip">${BUDGET[it.budget]}</span>
        ${it.vibes.map((v) => `<span class="chip">${VIBE_LABEL[v]}</span>`).join("")}
      </div>
    </div>
    <div class="festive"><strong>🎄 How Christmas is celebrated here</strong><br>${esc(it.festive)}</div>
    <h3>Day-by-day</h3>
    <ol class="days">${it.days.map(([t, d]) => `<li><strong>${esc(t)}</strong>${esc(d)}</li>`).join("")}</ol>
    <div class="tips"><h3>Tips</h3><ul>${it.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>
    <p><button class="btn btn-sea" data-fav="${it.id}">${favorites.has(it.id) ? "⭐ On your shortlist" : "☆ Add to shortlist"}</button></p>`;
  if (!els.dialog.open) els.dialog.showModal();
}

function toggleFav(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  localStorage.setItem("nsc-favs", JSON.stringify([...favorites]));
  render();
  if (els.dialog.open) open(id);
}

document.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) return toggleFav(fav.dataset.fav);
  const o = e.target.closest("[data-open]");
  if (o) return open(o.dataset.open);
});

[els.search, els.vibe, els.region, els.budget, els.days].forEach((el) => el.addEventListener("input", render));
$("reset").addEventListener("click", () => {
  [els.search, els.vibe, els.region, els.budget, els.days].forEach((el) => (el.value = ""));
  render();
});
$("surprise").addEventListener("click", () => {
  const pool = filtered().length ? filtered() : ITINERARIES;
  open(pool[Math.floor(Math.random() * pool.length)].id);
});
$("close").addEventListener("click", () => els.dialog.close());
els.dialog.addEventListener("click", (e) => { if (e.target === els.dialog) els.dialog.close(); });

render();
