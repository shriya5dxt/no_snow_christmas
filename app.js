"use strict";
/* =====================================================================
   Arizona crew trip · Dec 21–26 · Boston → Phoenix
   All state lives in the URL hash, so a copied link is the plan.
   ===================================================================== */

const CREW = ["Apoorv", "Khushbu", "Sanaa", "Bobby", "Shriya", "Archit"];
const DATES = [["Mon", "Dec 21"], ["Tue", "Dec 22"], ["Wed", "Dec 23"], ["Thu", "Dec 24"], ["Fri", "Dec 25"], ["Sat", "Dec 26"]];

const PLACES = {
  PHX: { name: "Phoenix", elev: 1100 },
  SED: { name: "Sedona", elev: 4350 },
  FLG: { name: "Flagstaff", elev: 6900 },
  GC: { name: "Grand Canyon", elev: 7000 },
  JER: { name: "Jerome", elev: 5200 },
  MON: { name: "Verde Valley", elev: 3200 },
  SUP: { name: "Superstitions", elev: 2000 },
  SALT: { name: "Salt River", elev: 1500 },
};
const SNOW_LINE = 5000;

// Typical late-December highs/lows (°F), rounded from NOAA/NPS normals. Not a forecast.
const WX = {
  GC: { hi: 41, lo: 18, note: "Real winter on the rim. Snow and wind are common, and sunrise often feels like 5°F (−15°C) with wind chill." },
  FLG: { hi: 43, lo: 17, note: "Real winter. Snow is common, and nights are well below freezing." },
  JER: { hi: 50, lo: 32, note: "A hillside town: windier and a little colder than Sedona." },
  SED: { hi: 56, lo: 31, note: "Sunny, mild afternoons and frosty mornings. Snow is rare and usually gone by noon." },
  MON: { hi: 59, lo: 28, note: "Mild days, cold nights." },
  SUP: { hi: 65, lo: 42, note: "Like Phoenix, but it cools quickly once the sun drops behind the mountains." },
  SALT: { hi: 66, lo: 44, note: "Like Phoenix, and cooler by the river at dusk." },
  PHX: { hi: 67, lo: 46, note: "Sunny and dry. Mornings and evenings are jacket weather." },
};
const toC = (f) => Math.round(((f - 32) * 5) / 9);
const temp = (f) => `${f}°F (${toC(f)}°C)`;

/* ---------- stop helper ---------- */
const S = (t, h, p, o = {}) => ({ t, h, p, s: o.s, g: o.g, key: !!o.key });
const NORTH = ["twosun", "sedfirst"]; // routes that climb above the snow line

// The Dec 23–24 road trip (both days off for everyone)
const ROUTES = {
  twosun: { letter: "A", short: "Canyon sunset, then Sedona sunset", name: "Two sunsets", head: "Grand Canyon sunset Dec 23, Sedona sunset Dec 24",
    desc: "Dec 23: up through Flagstaff for Ooh Aah Point, Hermit Road and sunset at Hopi Point, and a night at the canyon. Dec 24: rim sunrise, down Oak Creek Canyon to Sedona, sunset at Airport Mesa, home around 19:15.",
    best: "Both sunsets plus a canyon sunrise, and home for Christmas Eve dinner." },
  sedfirst: { letter: "B", short: "Sedona sunset, then canyon sunset", name: "Two sunsets, reversed", head: "Sedona sunset Dec 23, Grand Canyon sunset Dec 24",
    desc: "Dec 23: an easy start, red rock all afternoon, sunset at Airport Mesa, then a night in Flagstaff. Dec 24: a full day on the rim with Ooh Aah Point and sunset at Hopi Point, home around 21:15.",
    best: "A slower first morning, but a late Christmas Eve and a dark drive home." },
};

// Dec 22: everyone is free from 3 pm Central = 2 pm Arizona
const D22 = {
  dutchman: { short: "Superstitions sunset", nav: "Superstitions", title: "Sunset under the Superstition Mountains", hrs: 1.5, roads: "Loop 202 → US-60 east", places: ["PHX", "SUP", "PHX"], stops: [
    S(870, "Drive to Lost Dutchman State Park", "East to the foot of the Superstition Mountains.", { s: ["~40 mi", "~45 min"] }),
    S(930, "Treasure Loop Trail", "Easy loop on the flank of the Superstitions, with saguaros all around and the cliffs above you. State park day-use fee per vehicle.", { key: 1, s: ["2.4 mi loop", "~500 ft"], g: "Lost Dutchman State Park, AZ" }),
    S(1035, "Sunset over the Superstitions", "Sunset is around 17:25. The cliffs glow red after the sun drops behind you, so stay 15 minutes past it.", { key: 1 }),
    S(1110, "Dinner on the way back", "Mesa or Old Town Scottsdale.")] },
  horses: { short: "Wild horses + Saguaro Lake", nav: "Salt River", title: "Wild horses and Saguaro Lake", hrs: 1.25, roads: "Bush Hwy · Tonto National Forest", places: ["PHX", "SALT", "PHX"], stops: [
    S(870, "Drive to Coon Bluff", "Bush Highway into the Tonto National Forest.", { s: ["~25 mi", "~35 min"] }),
    S(900, "Salt River wild horses", "Herds graze along the river at Coon Bluff and Phon D Sutton. Sightings are likely but not guaranteed. Stay 50 ft back. Parking needs a Tonto Pass.", { key: 1, g: "Coon Bluff Recreation Area, AZ" }),
    S(990, "Sunset at Saguaro Lake", "Butcher Jones beach, with the cliffs reflected in the lake.", { key: 1, g: "Butcher Jones Recreation Site, AZ" }),
    S(1110, "Dinner on the way back", "")] },
  papago: { short: "Botanical garden + Hole-in-the-Rock", nav: "Papago Park", title: "Saguaros and a sunset window, close to home", hrs: 0.5, roads: "15 minutes from Scottsdale", places: ["PHX"], stops: [
    S(870, "Desert Botanical Garden", "The best place to learn the Sonoran Desert in one go: saguaros, chollas, and hummingbirds. Holiday luminaria nights sell out, so check dates.", { key: 1, g: "Desert Botanical Garden, Phoenix AZ" }),
    S(1020, "Sunset at Hole-in-the-Rock", "A short scramble up into a sandstone window next door, looking over the city.", { key: 1, s: ["0.3 mi"], g: "Hole-in-the-Rock, Papago Park, Phoenix AZ" }),
    S(1110, "Dinner in Tempe or Old Town Scottsdale", "")] },
  scottsdale: { short: "Old Town Scottsdale", nav: "Scottsdale", title: "An easy evening in Old Town Scottsdale", hrs: 0.5, roads: "Local drives only", places: ["PHX"], stops: [
    S(900, "Old Town Scottsdale", "Galleries, Western shops and the canal walk.", { g: "Old Town Scottsdale, AZ" }),
    S(1020, "Sunset drinks on a rooftop", ""),
    S(1110, "Dinner in Old Town", "Reserve for six.", { key: 1 })] },
};

// Christmas morning
const XMAS = { sedona: "Sedona, back by 2 pm", hike: "Local hike", slow: "Slow morning at home" };

const sunriseRim = S(440, "Sunrise at Yavapai Point", "Sunrise is around 07:35. Wear every warm layer you brought; it's well below freezing.", { key: 1, g: "Yavapai Point, Grand Canyon AZ" });
const desertView = (t) => S(t, "Desert View Drive", "East along the rim past Grandview and Lipan Points to the Desert View Watchtower.", { s: ["25 mi", "4 overlooks"], g: "Desert View Watchtower, AZ" });
const cameron = (t) => S(t, "Lunch at Cameron Trading Post", "Just outside the east entrance. Get the Navajo taco, and fill the tank.", { g: "Cameron Trading Post, AZ" });
const mather = (t) => S(t, "Mather Point", "Your first look. Park at the visitor center and walk out.", { key: 1, g: "Mather Point, Grand Canyon AZ" });
const rimTrail = (t) => S(t, "Rim Trail to Yavapai Point", "Flat and paved, the best easy walk on the rim. Yavapai Geology Museum has the big windows.", { s: ["~1.5 mi", "flat"], g: "Yavapai Geology Museum" });
const hermit = (t) => S(t, "Hermit Road overlooks", "In winter you can drive Hermit Road yourself (it's shuttle-only the rest of the year). Stop at Powell, Hopi and Mohave Points.", { s: ["7 mi", "winter: open to cars"], g: "Hermit Road, Grand Canyon AZ" });
const hopiSunset = S(990, "Sunset at Hopi Point", "The widest view on the road. Sunset is around 17:15, and it gets cold the moment the sun drops.", { key: 1, g: "Hopi Point, Grand Canyon AZ" });
const airportMesa = S(975, "Sunset at Airport Mesa", "Short scramble to a 360° view of the red rocks. Sunset is around 17:25, and the small lot fills an hour before.", { key: 1, s: ["0.5 mi", "sunset ~17:25"], g: "Airport Mesa, Sedona AZ" });
const redRockHike = (t) => S(t, "Cathedral Rock or Devil's Bridge", "Cathedral Rock is short and steep, with hands-on slickrock. Devil's Bridge is longer and gentler, out to a sandstone arch you can walk across. Both lots need a Red Rock Pass.",
  { key: 1, s: ["1.2 mi RT · 740 ft", "or 4 mi RT · 400 ft"], g: "Cathedral Rock Trailhead, Sedona AZ" });
const tlaq = (t) => S(t, "Lunch at Tlaquepaque", "Arts-and-crafts village under the sycamores by Oak Creek.", { g: "Tlaquepaque Arts & Shopping Village, Sedona AZ" });
const chapel = (t) => S(t, "Chapel of the Holy Cross", "Chapel built into the rock. A 20-minute stop.", { g: "Chapel of the Holy Cross, Sedona AZ" });
const oohAah = (t) => S(t, "Hike to Ooh Aah Point", "The first big viewpoint down the South Kaibab Trail, with the canyon opening up on both sides. The trailhead is shuttle-only: park at the visitor center and take the orange Kaibab Rim shuttle. The top switchbacks are icy in December, so wear microspikes, and allow twice as long coming back up.", { key: 1, s: ["1.8 mi RT", "~790 ft down", "1.5–2 hrs"], g: "South Kaibab Trailhead, Grand Canyon AZ" });
const iceFlag = ["Ice on the rim", "Rim paths ice over in winter. A $20–30 pair of microspikes makes the Rim Trail much safer."];
const altFlag = ["Altitude", "Flagstaff and the South Rim are about 7,000 ft. Expect lows well below freezing and maybe snow, so pack real jackets and gloves."];
const RIM_NIGHT = "In-park lodges (El Tovar, Bright Angel, Maswik) are steps from the rim. Tusayan, 10 minutes outside the gate, has more beds.";

/* ---------- day templates ---------- */
const T = {
  sedonaSunsetToFlag: { nav: "Sedona → Flagstaff", title: "Red rock afternoon, Sedona sunset", hrs: 3.25, roads: "I-17 north → SR-179 · I-17 to Flagstaff after dark", night: "Flagstaff",
    nightNote: "Downtown Flagstaff is walkable, has the most beds, and is 1.5 hours from the rim.", places: ["PHX", "SED", "FLG"],
    flags: [["After dark", "Take SR-179 and I-17 up to Flagstaff, not the 89A switchbacks through Oak Creek Canyon, which can ice up at night."], altFlag], stops: [
      S(510, "Leave Phoenix", "No dawn start: Sedona is two hours up I-17, and the light gets good in the afternoon.", { s: ["116 mi", "~2 hrs"] }),
      S(645, "Bell Rock Pathway", "An easy walk on the way into town, with big views of Bell Rock and Courthouse Butte for little effort.", { s: ["~2 mi", "flat"], g: "Bell Rock Trailhead, Sedona AZ" }),
      tlaq(750),
      S(825, "Cathedral Rock", "Short and steep, with hands-on slickrock to a saddle between the spires. If it's frosty or wet, skip it, because the rock gets slippery.", { key: 1, s: ["1.2 mi RT", "740 ft"], g: "Cathedral Rock Trailhead, Sedona AZ" }),
      chapel(930), airportMesa,
      S(1080, "Dinner in Sedona", "Eat before you drive on. Reserve for six."),
      S(1170, "Drive to Flagstaff", "Up I-17 to 7,000 ft. Expect it to be below freezing when you arrive.", { s: ["~50 mi", "~1h15"] })] },
  sedonaSunsetHome: { nav: "Sedona", title: "Plan B: red rock afternoon, Sedona sunset, home", hrs: 4, roads: "I-17 ⇄ SR-179", night: "Home", places: ["PHX", "SED", "PHX"], stops: [
      S(510, "Leave Phoenix", "No dawn start: Sedona is two hours up I-17, and the light gets good in the afternoon.", { s: ["116 mi", "~2 hrs"] }),
      S(645, "Bell Rock Pathway", "An easy walk on the way into town, with big views of Bell Rock and Courthouse Butte for little effort.", { s: ["~2 mi", "flat"], g: "Bell Rock Trailhead, Sedona AZ" }),
      tlaq(750),
      S(825, "Cathedral Rock", "Short and steep, with hands-on slickrock to a saddle between the spires. If it's frosty or wet, skip it, because the rock gets slippery.", { key: 1, s: ["1.2 mi RT", "740 ft"], g: "Cathedral Rock Trailhead, Sedona AZ" }),
      chapel(930), airportMesa,
      S(1080, "Dinner in Sedona", "Eat before you drive on. Reserve for six."),
      S(1170, "Drive home", "Back down I-17.", { s: ["116 mi", "~2 hrs"] })] },
  rimSunsetHome: { nav: "Grand Canyon", title: "A full day on the rim, sunset at Hopi Point", hrs: 5.25, roads: "US-180 north · park fee per vehicle · I-17 home after dark", night: "Home", places: ["FLG", "GC", "PHX"],
    flags: [iceFlag, ["Late Christmas Eve", "Leaving after sunset puts you home around 21:15, and the first hour back to Flagstaff is dark and can be icy. Eat at the rim, or plan a late, easy Christmas Eve dinner at home."]], stops: [
      S(480, "Flagstaff to the South Rim", "Through ponderosa forest past the San Francisco Peaks. Check AZ511 before leaving.", { s: ["80 mi", "~1.5 hrs"] }),
      mather(570), oohAah(615),
      S(765, "Lunch in the Village", "Bright Angel Lodge, or the Market Plaza deli."),
      rimTrail(825), hermit(900), hopiSunset,
      S(1050, "Drive home", "Back through Flagstaff and down I-17. Swap drivers.", { s: ["230 mi", "~3.75 hrs"] }),
      S(1275, "Home for Christmas Eve", "A late, low-key dinner at home.", { key: 1 })] },

  sedonaToFlag: (fromPhx) => ({ nav: "Sedona → Flagstaff", title: fromPhx ? "Phoenix to red rock to the pines" : "Red rock morning, up to the pines",
    hrs: fromPhx ? 3 : 1, roads: fromPhx ? "I-17 → SR-179 → SR-89A" : "SR-89A through Oak Creek Canyon", night: "Flagstaff",
    nightNote: "Downtown Flagstaff is walkable and has the most choice. Nights are well below freezing.",
    places: fromPhx ? ["PHX", "SED", "FLG"] : ["SED", "FLG"], flags: [altFlag], stops: [
      ...(fromPhx ? [S(420, "Leave Phoenix", "Out early, so you have the red rocks in morning light.", { s: ["116 mi", "~2 hrs"] })] : []),
      redRockHike(fromPhx ? 570 : 480), tlaq(735), chapel(840),
      S(930, "Oak Creek Canyon to Flagstaff", "SR-89A climbs 2,500 ft up a narrow canyon of switchbacks to the Oak Creek Vista overlook. If it's icy, take I-17 instead.", { key: 1, s: ["30 mi", "~50 min"], g: "Oak Creek Vista, AZ" }),
      S(1110, "Dinner in downtown Flagstaff", "A Route 66 brewery town, so it's easy to find a table for six. Lowell Observatory runs telescope nights; check its holiday schedule.", { g: "Downtown Flagstaff, AZ" })] }),

  canyonFromPhx: { nav: "Grand Canyon", title: "Straight up to the Grand Canyon", hrs: 3.75, roads: "I-17 → US-180 · park fee per vehicle", night: "Grand Canyon",
    nightNote: RIM_NIGHT, places: ["PHX", "FLG", "GC"], flags: [iceFlag], stops: [
      S(360, "Leave Phoenix", "Out at 06:00 to get the most daylight on the rim.", { s: ["230 mi", "~3.75 hrs"] }),
      S(495, "Breakfast in Flagstaff", "Halfway, and the last cheap coffee."),
      mather(630), oohAah(675), hermit(840), hopiSunset,
      S(1110, "Dinner in Tusayan", "Simple, and 10 minutes from the gate.")] },

  canyonHome: { nav: "Rim → home", title: "Canyon sunrise, home for Christmas Eve", hrs: 4.5, roads: "Desert View Dr → US-89 → I-17 south", night: "Home", places: ["GC", "FLG", "PHX"], stops: [
      sunriseRim, desertView(540), cameron(690),
      S(780, "Down to Phoenix", "US-89 to Flagstaff, then I-17. About 3.5 hours with a stop.", { s: ["~200 mi"] }),
      S(1020, "Home for Christmas Eve", "Unpack, shower, Christmas Eve dinner.", { key: 1 })] },

  canyonViaSedonaHome: { nav: "Rim → Sedona → home", title: "Canyon sunrise to Sedona sunset, home for Christmas Eve", hrs: 4.5, roads: "US-180 → SR-89A → I-17", night: "Home", places: ["GC", "FLG", "SED", "PHX"], stops: [
      sunriseRim,
      S(540, "Back to Flagstaff", "Same road you came in on, in morning light.", { s: ["80 mi", "~1.5 hrs"] }),
      S(660, "Lunch in downtown Flagstaff", "Route 66 diners and brewpubs."),
      S(765, "Down Oak Creek Canyon", "Steep and winding, with a red rock reveal at the bottom. Take I-17 if it's icy.", { key: 1, s: ["30 mi", "~50 min"], g: "Oak Creek Vista, AZ" }),
      chapel(855),
      S(900, "Bell Rock Pathway", "A short, flat walk under Bell Rock before sunset.", { s: ["~1.5 mi", "flat"], g: "Bell Rock Trailhead, Sedona AZ" }),
      airportMesa,
      S(1035, "Drive home", "Down I-17 in the dark. Swap drivers.", { s: ["116 mi", "~2 hrs"] }),
      S(1155, "Home for Christmas Eve", "Christmas Eve dinner around 19:30.", { key: 1 })] },

  flagCanyonHome: { nav: "Rim → home", title: "Rim day, then down to Phoenix", hrs: 5.25, roads: "US-180 → I-17", night: "Home", places: ["FLG", "GC", "PHX"], stops: [
      S(450, "Up to the South Rim", "Through the pines past the San Francisco Peaks.", { s: ["80 mi", "~1.5 hrs"] }),
      mather(570), oohAah(600),
      S(720, "Lunch in the Village", "Bright Angel Lodge, or the Market Plaza deli."),
      S(780, "Head home", "Back through Flagstaff and down I-17. Home around 17:30.", { s: ["230 mi", "~3.75 hrs"] }),
      S(1050, "Home", "", { key: 1 })] },

  canyonToSedona: { nav: "Rim → Sedona", title: "The rim by day, Sedona by night", hrs: 6, roads: "I-17 → US-180 → I-17 → SR-179 · park fee per vehicle", night: "Sedona",
    nightNote: "West Sedona and the Village of Oak Creek are cheaper than Uptown.", places: ["PHX", "FLG", "GC", "FLG", "SED"], flags: [iceFlag], stops: [
      S(360, "Leave Phoenix", "Out at 06:00. It's a long day, so share the driving.", { s: ["230 mi", "~3.75 hrs"] }),
      mather(600), oohAah(630),
      S(765, "Lunch at the rim", "Bright Angel Lodge, or the Market Plaza deli."),
      S(840, "Leave the rim", "Back to Flagstaff, then down to Sedona. After dark or in ice, take I-17 rather than 89A.", { s: ["~2.5 hrs"] }),
      S(1080, "Dinner in Sedona", "Reserve for six.")] },

  sedonaHome: { nav: "Sedona → home", title: "Red rock morning, home by dinner", hrs: 2, roads: "SR-179 → I-17 south", night: "Home", places: ["SED", "PHX"], stops: [
      redRockHike(480), tlaq(735),
      S(840, "Off-road Jeep tour (optional)", "Two hours over Broken Arrow's slickrock with a local guide. Book ahead.", { s: ["~2 hrs"] }),
      airportMesa,
      S(1035, "Drive home", "Down I-17.", { s: ["116 mi", "~2 hrs"] })] },

  sedonaSnowDay: { nav: "Sedona", title: "Plan B: a Sedona day trip", hrs: 4, roads: "I-17 ⇄ SR-179", night: "Home", places: ["PHX", "SED", "PHX"], stops: [
      S(480, "Leave Phoenix", "No dawn start needed. Sedona sits below most of the snow.", { s: ["116 mi", "~2 hrs"] }),
      S(615, "Bell Rock Pathway", "Wide, easy trail around Bell Rock and Courthouse Butte. Sedona at its least icy.", { key: 1, s: ["3.6 mi loop", "flat"], g: "Bell Rock Trailhead, Sedona AZ" }),
      tlaq(750), chapel(840), airportMesa,
      S(1035, "Drive home", "Down I-17.", { s: ["~2 hrs"] })] },
  sedA1: { nav: "Sedona", title: "Plan B: red rocks, low and clear", hrs: 2, roads: "I-17 north", night: "Sedona", places: ["PHX", "SED"], stops: [
      S(600, "Leave Phoenix", "No rush. Sedona sits below most of the snow.", { s: ["116 mi", "~2 hrs"] }),
      S(750, "Bell Rock Pathway", "Wide, easy trail around Bell Rock and Courthouse Butte. Sedona at its least icy.", { key: 1, s: ["3.6 mi loop", "flat"], g: "Bell Rock Trailhead, Sedona AZ" }),
      chapel(900), airportMesa,
      S(1110, "Dinner in Uptown", "")] },
  sedA2: { nav: "Jerome", title: "Plan B: Jerome and Verde Valley wine", hrs: 1.5, roads: "SR-89A west", night: "Sedona", places: ["SED", "JER", "SED"], stops: [
      S(540, "Up to Jerome", "An old copper-mining town on the side of Cleopatra Hill, 45 minutes away. Steep streets.", { s: ["30 mi"], g: "Jerome, AZ" }),
      S(720, "Lunch in Jerome", ""),
      S(870, "Old Town Cottonwood tasting rooms", "A cluster of Verde Valley wine rooms within a few blocks. Pick a driver.", { g: "Old Town Cottonwood, AZ" }),
      S(1110, "Dinner back in Sedona", "")] },
  sedA3: { nav: "Verde Valley", title: "Plan B: cliff dwellings and wildlife", hrs: 1, roads: "I-17 · Camp Verde", night: "Sedona", places: ["SED", "MON", "SED"], stops: [
      S(540, "Montezuma Castle", "An 800-year-old Sinagua cliff dwelling set into a limestone wall. Short paved loop.", { key: 1, s: ["0.3 mi loop"], g: "Montezuma Castle National Monument" }),
      S(630, "Montezuma Well", "A sinkhole lake ringed with cliff dwellings, 15 minutes away.", { g: "Montezuma Well" }),
      S(780, "Out of Africa Wildlife Park", "Safari bus tour and predator feeding in Camp Verde.", { g: "Out of Africa Wildlife Park, Camp Verde AZ" }),
      S(1140, "Stargazing tour", "Sedona is an International Dark Sky Community.")] },
  sedHome: { nav: "Sedona → home", title: "Back down to Phoenix", hrs: 2, roads: "I-17 south", night: "Home", places: ["SED", "MON", "PHX"], stops: [
      S(540, "Slow breakfast in Sedona", ""),
      S(660, "Montezuma Castle on the way", "Right off I-17, if you didn't make it yet.", { g: "Montezuma Castle National Monument" }),
      S(840, "Home", "", { key: 1 })] },
};

/* ---------- Phoenix downtime picks ---------- */
const FUN = {
  hike: { short: "Sunrise hike", stop: S(405, "Sunrise hike: Piestewa Peak", "Steep, rocky summit trail with the whole valley at your feet. Camelback's Echo Canyon is the harder alternative, and its lot fills early.", { s: ["2.4 mi RT", "1,200 ft"], g: "Piestewa Peak Summit Trail, Phoenix AZ" }) },
  balloon: { short: "Balloon ride", stop: S(390, "Hot-air balloon at sunrise", "Pickup is before dawn. Flights cancel for wind, so book early in the week to leave a backup day.", { s: ["~1 hr aloft"], g: "Hot air balloon rides Phoenix" }) },
  lake: { short: "Canyon Lake", stop: S(600, "Canyon Lake & Tortilla Flat", "Up the Apache Trail to a desert lake ringed by cliffs, with a boat cruise and the old-west stop at Tortilla Flat.", { s: ["~1 hr each way"], g: "Canyon Lake, AZ" }) },
  food: { short: "Lunch crawl", stop: S(720, "Lunch crawl", "Sonoran hot dogs, Mexican food, and Pizzeria Bianco if you can stand the wait.", { g: "Pizzeria Bianco, Phoenix AZ" }) },
  pool: { short: "Pool day", stop: S(780, "Pool afternoon", "Home pool, or a resort day pass. Highs are around 19°C / 66°F, so make sure the pool is heated.") },
  tempe: { short: "Tempe & Topgolf", stop: S(900, "Tempe Town Lake & Topgolf", "Walk the lake and Mill Ave, then a Topgolf bay for six.", { g: "Topgolf Scottsdale, AZ" }) },
  dbg: { short: "Botanical garden", stop: S(960, "Desert Botanical Garden", "Saguaro and cactus trails in late-afternoon light. Holiday luminaria nights sell out, so check dates.", { g: "Desert Botanical Garden, Phoenix AZ" }) },
  scottsdale: { short: "Old Town Scottsdale", stop: S(1050, "Old Town Scottsdale", "Walkable blocks of galleries, bars and restaurants. Reserve dinner for six.", { g: "Old Town Scottsdale, AZ" }) },
  games: { short: "Games night", stop: S(1170, "Games night at home", "Takeout, board games and a movie.") },
};

/* ---------- state + URL hash ---------- */
const OPTS = { route: Object.keys(ROUTES), d22: Object.keys(D22), xmas: Object.keys(XMAS), snow: ["go", "sedona"] };
const DEFAULT = { route: "twosun", d22: "dutchman", xmas: "slow", snow: "sedona", fun: ["hike", "scottsdale", "games"], t: {}, shift: {}, done: [], votes: {} };
let state = JSON.parse(JSON.stringify(DEFAULT));

function readHash() {
  const h = location.hash.replace(/^#/, "");
  if (!h) return;
  try {
    const p = new URLSearchParams(h);
    Object.keys(OPTS).forEach((k) => { const v = p.get(k); if (v && OPTS[k].includes(v)) state[k] = v; });
    if (p.has("fun")) state.fun = p.get("fun").split(",").filter((f) => FUN[f]);
    (p.get("if") || "").split(",").filter((k) => ["snow", "split"].includes(k)).forEach((k) => (state.t[k] = true));
    (p.get("shift") || "").split(",").filter(Boolean).forEach((s) => { const [d, m] = s.split(":"); const n = parseInt(m, 10); if (d >= 0 && d < 6 && n) state.shift[d] = n; });
    state.done = (p.get("done") || "").split(",").filter(Boolean);
    (p.get("vote") || "").split(",").forEach((x) => { const [n, r] = x.split(":"); if (CREW.includes(n) && ROUTES[r]) state.votes[n] = r; });
  } catch (e) { /* ignore a malformed link */ }
}
function writeHash() {
  const p = new URLSearchParams();
  Object.keys(OPTS).forEach((k) => p.set(k, state[k]));
  p.set("fun", state.fun.join(","));
  const t = Object.keys(state.t).filter((k) => state.t[k]); if (t.length) p.set("if", t.join(","));
  const sh = Object.keys(state.shift).filter((k) => state.shift[k]).map((k) => `${k}:${state.shift[k]}`); if (sh.length) p.set("shift", sh.join(","));
  if (state.done.length) p.set("done", state.done.join(","));
  const v = CREW.filter((n) => state.votes[n]).map((n) => `${n}:${state.votes[n]}`); if (v.length) p.set("vote", v.join(","));
  history.replaceState(null, "", "#" + p.toString());
}

/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (min) => { min = ((min % 1440) + 1440) % 1440; const h = Math.floor(min / 60), m = min % 60; return `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}`; };
const clone = (tpl) => ({ ...tpl, stops: tpl.stops.map((s) => ({ ...s })), flags: [...(tpl.flags || [])], places: [...tpl.places] });
const label = (i) => `${DATES[i][0]} ${DATES[i][1]}`;

/* ---------- build the six days ---------- */
function build(s) {
  const days = DATES.map(() => ({ nav: "Phoenix", title: "Phoenix downtime", hrs: 0, roads: "", night: "Home", nightNote: "", places: ["PHX"], stops: [], flags: [], away: false, free: 2, min: 0, max: 1440 }));

  // Dec 21 and Dec 26 are travel days only
  Object.assign(days[0], { nav: "Fly in", title: "Travel day: Boston to Phoenix", roads: "BOS → PHX", free: 0, stops: [
    S(0, "Fly Boston → Phoenix", "About 5.5 hours nonstop. Arizona is 2 hours behind Boston, so you gain two hours today.", { key: 1 }),
    S(1, "Land at Sky Harbor", ""),
    S(2, "Pick up the car at Avis", "9120 E Talking Stick Wy, Scottsdale. Booked Dec 21–26.", { g: "Avis, 9120 E Talking Stick Wy, Scottsdale, AZ 85250" }),
    S(3, "Groceries and dinner near home", "Stock up for the week, then an easy dinner and an early night."),
  ], flags: [["Travel only", "No plans today beyond getting everyone in. If a flight is delayed, nothing else moves."]] });
  Object.assign(days[5], { nav: "Fly home", title: "Travel day: Phoenix to Boston", roads: "PHX → BOS", free: 0, stops: [
    S(0, "Pack up and tidy the house", ""),
    S(1, "Return the car at Avis", "9120 E Talking Stick Wy, Scottsdale.", { g: "Avis, 9120 E Talking Stick Wy, Scottsdale, AZ 85250" }),
    S(2, "Head to Sky Harbor", "Be there 2 hours before the flight."),
    S(3, "Fly Phoenix → Boston", "About 4.5 hours nonstop, and you lose the two hours back.", { key: 1 }),
  ] });
  days[0].untimed = days[5].untimed = true;

  // Dec 22: work until 2 pm Arizona time, then a short outing
  const a = D22[s.d22], d22 = days[1];
  Object.assign(d22, { nav: a.nav, title: a.title, hrs: a.hrs, roads: a.roads, places: [...a.places], free: 0,
    stops: [S(840, "Done with work", "3 pm Central is 2 pm in Arizona. Arizona doesn't change its clocks, so in December it's one hour behind Central.", { key: 1 }), ...a.stops.map((x) => ({ ...x }))],
    flags: [["Half day", "Everyone works until 2 pm Arizona time, which leaves about 3½ hours of daylight. Keep it within an hour of home."]] });

  // Dec 23–24: the road trip
  let seq = [];
  seq = s.route === "sedfirst" ? [T.sedonaSunsetToFlag, T.rimSunsetHome] : [T.canyonFromPhx, T.canyonViaSedonaHome];
  const snowAlt = s.t.snow && s.snow !== "go" && NORTH.includes(s.route);
  if (snowAlt) seq = [T.sedonaSunsetHome];

  seq.forEach((tpl, i) => {
    const idx = 2 + i, d = clone(tpl);
    Object.assign(days[idx], d, { away: true, free: 0, flags: d.flags || [] });
    if (s.t.snow && s.snow === "go" && d.places.some((k) => PLACES[k].elev > SNOW_LINE)) days[idx].flags.push(["Snow plan: go carefully", "Check AZ511 before every drive and add buffer time. Skip any road that's closed rather than wait it out."]);
    if (s.t.split) days[idx].flags.push(["Split crew", "Part of the crew takes this trip, the rest stay in Phoenix on the downtime plan. Meet back up for Christmas Eve."]);
  });
  if (snowAlt) days[2].flags.unshift(["Plan B is on", "Snow is forecast up north, so this version skips the canyon, does Sedona with its sunset on Dec 23, and has Christmas Eve in Phoenix."]);

  // Christmas Eve
  const eve = days[3];
  if (!eve.away) {
    eve.nav = "Christmas Eve"; eve.title = "Christmas Eve in Phoenix"; eve.free = 1; eve.min = 660; eve.max = 1080;
    eve.stops.push(S(600, "Christmas groceries", "Most shops close early today and nearly everything is shut tomorrow.", { key: 1 }),
      S(1110, "Christmas Eve dinner", "At home, all six.", { key: 1 }),
      S(1230, "Neighbourhood lights", "A slow drive around to see the holiday lights."));
  } else {
    d22.stops.push(S(1200, "Christmas grocery run", "You're away until the evening of Christmas Eve, and almost everything is closed on Christmas Day, so stock up tonight."));
  }

  // Christmas Day
  const xmas = days[4];
  const sawSedona = true; // every plan now has Sedona on Dec 23
  Object.assign(xmas, { nav: "Christmas", title: "Christmas at home", free: 0 });
  if (s.xmas === "sedona") {
    Object.assign(xmas, { nav: "Christmas · Sedona", title: "Christmas morning in Sedona, home by 2 pm", hrs: 4, roads: "I-17 ⇄ SR-179", places: ["PHX", "SED", "PHX"] });
    xmas.stops.push(
      S(360, "Leave for Sedona", "Empty Christmas-morning roads up I-17. Pack breakfast and coffee, because most of Sedona is closed today.", { s: ["116 mi", "~2 hrs"] }),
      redRockHike(495),
      S(645, "Red Rock Scenic Byway", "SR-179 past Bell Rock and Courthouse Butte on the way out, with pullouts for photos.", { g: "Red Rock Scenic Byway, Sedona AZ" }),
      S(705, "Head home", "Back down I-17.", { s: ["~2 hrs"] }),
      S(825, "Home", "", { key: 1 }),
      S(900, "Christmas lunch, late", "The big meal of the trip.", { key: 1 }),
      S(1020, "Gifts", ""), S(1170, "Movie night", ""));
    xmas.flags.push(["Christmas morning in Sedona", "Trails and viewpoints are open, but most cafés and shops are closed, so bring food. Most trailhead lots need a Red Rock Pass."]);
    xmas.flags.push(["Frosty start", "Expect around 31°F (−1°C) at the trailhead at 08:15, warming to the mid-50s by noon. Frost makes Cathedral Rock's slickrock slippery. If it's white or wet, walk the Bell Rock Pathway instead."]);
    if (sawSedona) xmas.flags.push(["Sedona twice?", "You'll already have had a Sedona sunset, so a local hike or a slow morning might make a better Christmas."]);
  } else {
    if (s.xmas === "hike") xmas.stops.push(S(450, "Christmas-morning hike", "Piestewa Peak, or the gentler Gateway Loop in the McDowell Sonoran Preserve. Trails are empty today.", { g: "Gateway Trailhead, Scottsdale AZ" }));
    xmas.stops.push(S(600, "Gifts and a slow breakfast", "", { key: 1 }), S(810, "Christmas lunch", "The big meal of the trip.", { key: 1 }),
      S(930, "Out in the sun", "About 19°C / 66°F. A walk, the pool or lawn games."), S(1170, "Movie night", ""));
  }
  xmas.flags.push(["Christmas Day", "Most restaurants and attractions are closed. Plan to eat at home."]);

  // Fill Phoenix free time with the crew's picks
  const pool = [...s.fun];
  days.forEach((d) => {
    for (let k = 0; k < d.free; k++) {
      const i = pool.findIndex((f) => FUN[f].stop.t >= d.min && FUN[f].stop.t <= d.max && !d.stops.some((x) => x.t === FUN[f].stop.t));
      if (i >= 0) d.stops.push({ ...FUN[pool.splice(i, 1)[0]].stop });
      else if (!d.stops.some((x) => x.h === "Free time")) d.stops.push(S(Math.min(Math.max(d.min, 840), d.max), "Free time", "Nap, pool or wander. Pick another downtime activity above to fill this."));
    }
    if (!d.away && d.title === "Phoenix downtime") d.roads = "Local drives only";
    d.stops.sort((a, b) => a.t - b.t);
  });
  return days;
}

function contingencies(s) {
  const out = [];
  if (NORTH.includes(s.route)) {
    out.push(["If it snows up north", { go: "Go carefully", sedona: "Sedona only" }[s.snow],
      { go: "Check AZ511 and the Grand Canyon NPS alerts each morning, drive in daylight, and skip any closed road.",
        sedona: "Keep the Sedona afternoon and sunset (about 4,300 ft, usually clear), drive home that night, and spend Christmas Eve in Phoenix." }[s.snow]]);
    out.push(["If a road closes mid-trip", "Stay put", "I-17, I-40, US-180 and AZ-64 all close for storms now and then. Stay where you are and wait for AZ511 to clear it. Avoid 89A through Oak Creek Canyon in ice."]);
  }
  out.push(["If work runs late on Dec 22", "Stay close", "Swap to the Botanical Garden and Hole-in-the-Rock, 15 minutes away, and still catch the sunset."]);
  if (s.xmas === "sedona") out.push(["If Christmas morning feels too early", "Hike locally", "After two days on the road, a 6 am start may be too much. Swap Sedona for a local hike and keep the whole day at home."]);
  out.push(["If a flight is delayed", "Nothing moves", "Dec 21 and Dec 26 are travel days only, so a late landing or a late departure doesn't touch the plan."]);
  out.push(["If some want to rest", "Split the crew", "One group does the drive, the other stays on the Phoenix plan. Everyone meets for Christmas Eve."]);
  out.push(["If it rains in Phoenix", "Go indoors", "Musical Instrument Museum, Heard Museum, or Scottsdale Fashion Square."]);
  return out;
}

function checklist(days) {
  const pl = new Set(days.flatMap((d) => d.places));
  const items = [
    ["flights", "Flights BOS → PHX Dec 21, PHX → BOS Dec 26, all six", "Holiday-week fares climb fast."],
  ];
  const why = { Sedona: "Pricey, so book early.", Flagstaff: "The most choice and the cheapest beds up north.", "Grand Canyon": "Closest beds to the rim, and not many of them." };
  days.forEach((d, i) => { if (d.night !== "Home") items.push([`stay-${d.night.toLowerCase().replace(/\W+/g, "")}-${i}`, `Rooms in ${d.night}, ${label(i)}, for six`, why[d.night] || ""]); });
  if (pl.has("GC") || pl.has("FLG")) items.push(["layers", "Warm layers for everyone", "An insulated or down jacket, hat, gloves and wool socks. The rim at sunrise is often around 18°F (−8°C) before wind chill, and hand warmers help."]);
  if (pl.has("GC")) items.push(["microspikes", "Microspikes for everyone", "For Ooh Aah Point. The top of the South Kaibab Trail is packed ice in December. About $20–30 a pair."]);
  if (pl.has("GC")) items.push(["gc-pass", "Grand Canyon entry", "Charged per vehicle and valid for 7 days. Buy ahead at recreation.gov or pay at the gate."]);
  if (pl.has("SED")) items.push(["redrock", "Red Rock Pass for Sedona trailheads", "Required at most trailhead lots. An America the Beautiful pass also counts."]);
  if (pl.has("SALT")) items.push(["tonto", "Tonto Pass for Coon Bluff / Saguaro Lake parking", "Day pass per vehicle. Buy online or at a local gas station before you go."]);
  if ([...pl].some((k) => k !== "PHX" && PLACES[k].elev > SNOW_LINE)) items.push(["offline", "Download offline maps for northern Arizona", "Coverage drops out on 89A and along parts of the rim."]);
  if (state.fun.includes("balloon")) items.push(["balloon", "Sunrise balloon ride", "Holiday weeks book up. Pick an early date to leave a backup day."]);
  if (state.fun.includes("scottsdale")) items.push(["scottsdale", "Scottsdale dinner reservation for six", "Old Town gets busy over the holidays."]);
  items.push(["groceries", "Christmas groceries by the 24th", "Most shops close early on Christmas Eve and stay shut on Christmas Day."]);
  return items;
}

function summarize(days) {
  const pl = new Set(days.flatMap((d) => d.places));
  const high = [...pl].reduce((a, k) => (PLACES[k].elev > PLACES[a].elev ? k : a), "PHX");
  return { hrs: Math.round(days.reduce((a, d) => a + d.hrs, 0) * 2) / 2, away: days.filter((d) => d.night !== "Home").length, high, places: [...pl].filter((k) => k !== "PHX") };
}

/* ---------- render ---------- */
let lastTrace = "";
let observer = null;

function zoneOf(d, i) {
  if (!d.away && (i === 3 || i === 4)) return "var(--pine)";
  if (!d.away) return "var(--juniper)";
  if (d.places.some((k) => PLACES[k].elev > SNOW_LINE)) return "var(--high)";
  return "var(--sandstone)";
}

function renderHero(days) {
  const r = ROUTES[state.route], m = summarize(days);
  $("lede").textContent = `Option ${r.letter}, ${r.name.toLowerCase()}: ${r.desc}`;
  $("facts").innerHTML = [
    ["Driving", m.hrs ? `~${m.hrs} hrs` : "Local only"],
    ["Nights away", `${m.away} of 5`],
    ["High point", `${PLACES[m.high].elev.toLocaleString()} ft`],
    ["Holiday", "Christmas at home"],
  ].map(([k, v]) => `<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join("");
}

function renderProfile(days) {
  const W = 900, H = 200, base = 168, top = 34, MAX = 8000, bw = W / 6;
  const y = (ft) => base - (ft / MAX) * (base - top);
  const pts = [];
  days.forEach((d, i) => {
    const x0 = i * bw + 10, x1 = (i + 1) * bw - 10, n = d.places.length;
    if (n === 1) pts.push({ x: (x0 + x1) / 2, k: d.places[0], d: i });
    else d.places.forEach((k, j) => pts.push({ x: x0 + ((x1 - x0) * j) / (n - 1), k, d: i }));
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${y(PLACES[p.k].elev).toFixed(1)}`).join(" ");
  const fill = `${line} L${pts.at(-1).x.toFixed(1)},${base} L${pts[0].x.toFixed(1)},${base} Z`;
  const seen = new Set(), labelX = {};
  const highest = pts.reduce((a, p) => (PLACES[p.k].elev > PLACES[a.k].elev ? p : a), pts[0]).k;
  let lastX = -999, below = false;
  const labels = pts.map((p) => {
    // label each place once, or again if it reappears far along the route (e.g. Flagstaff on the way home)
    if (labelX[p.k] !== undefined && p.x - labelX[p.k] < 260) return "";
    if (p.k === "PHX" && labelX.PHX !== undefined) return "";
    labelX[p.k] = p.x;
    seen.add(p.k);
    const P = PLACES[p.k], yy = y(P.elev), cold = P.elev > SNOW_LINE;
    below = p.x - lastX < 95 ? !below : false; // alternate above/below when labels crowd
    lastX = p.x;
    const anchor = p.x < 40 ? "start" : p.x > W - 40 ? "end" : "middle";
    const ly = below ? yy + 17 : yy - 10;
    return `<circle class="peak ${cold ? "cold" : ""}" cx="${p.x}" cy="${yy}" r="${cold ? 3.5 : 3}"/>
      <text class="plabel" x="${p.x}" y="${ly}" text-anchor="${anchor}">${P.name.toUpperCase()}</text>
      ${p.k === highest || p.k === "PHX" ? `<text class="pnum" x="${p.x}" y="${below ? ly + 11 : ly - 10}" text-anchor="${anchor}">${P.elev.toLocaleString()} ft</text>` : ""}`;
  }).join("");
  const bands = days.map((d, i) => `<rect class="seg-hit" data-day="${i}" x="${i * bw}" y="0" width="${bw}" height="${H}" tabindex="0" role="link" aria-label="Jump to ${label(i)}: ${esc(d.title)}"></rect><rect class="band" x="${i * bw}" y="0" width="${bw}" height="${H}"></rect>`).join("");
  const dayLabels = days.map((d, i) => `<text class="pday" x="${i * bw + bw / 2}" y="${H - 6}" text-anchor="middle">${DATES[i][0].toUpperCase()} ${DATES[i][1].slice(4)}</text>`).join("");
  $("profile").innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Elevation along the route, from Phoenix at 1,100 ft${seen.has("GC") ? " up to the Grand Canyon rim at 7,000 ft" : ""}.">
    <line class="baseline" x1="0" y1="${base}" x2="${W}" y2="${base}"/>
    <line class="snowline" x1="0" y1="${y(SNOW_LINE)}" x2="${W}" y2="${y(SNOW_LINE)}"/>
    <text class="snowtxt" x="${W}" y="${y(SNOW_LINE) - 5}" text-anchor="end">SNOW POSSIBLE ABOVE ~5,000 FT</text>
    <path class="trace-fill" d="${fill}"/>
    <path class="trace" id="trace" d="${line}"/>
    ${labels}${dayLabels}${bands}</svg>`;
  const tr = $("trace");
  if (tr && tr.getTotalLength && line !== lastTrace) {
    const len = Math.ceil(tr.getTotalLength());
    tr.style.setProperty("--len", len); tr.style.strokeDasharray = len; tr.classList.add("draw");
  }
  lastTrace = line;
}

function seg(key, opts, { multi = false, cls = "", get, set } = {}) {
  return `<div class="seg ${multi ? "multi" : ""} ${cls}" role="group">${opts.map(([v, l]) => {
    const on = get ? get(v) : state[key] === v;
    return `<button data-set="${key}" data-val="${v}" aria-pressed="${on}">${esc(l)}</button>`;
  }).join("")}</div>`;
}

function renderControls() {
  const rows = [
    ["Dec 23–24 trip", "Which sunset comes first. Pick one, or vote below", seg("route", Object.entries(ROUTES).map(([k, r]) => [k, `${r.letter} · ${r.short}`]))],
  ];
  rows.unshift(["Tue Dec 22, after 2 pm", "Free from 3 pm Central = 2 pm here", seg("d22", Object.entries(D22).map(([k, d]) => [k, d.short]))]);
  rows.push(["Christmas morning", "Back by 2–3 pm", seg("xmas", Object.entries(XMAS))]);
  if (NORTH.includes(state.route)) rows.push(["If it snows up north", "Used when the snow switch is on", seg("snow", [["go", "Go carefully"], ["sedona", "Sedona only, home that night"]])]);
  rows.push(["What if", "Switch on to see the plan change", seg("t", [["snow", "Snow forecast"], ["split", "Some skip the drive"]], { multi: true, cls: "whatif", get: (v) => !!state.t[v] })]);
  $("controls").innerHTML = rows.map(([l, sub, c]) => `<div class="ctrl"><div class="seg-label">${l}${sub ? `<small>${sub}</small>` : ""}</div>${c}</div>`).join("");
}

function renderDays(days) {
  $("days").innerHTML = days.map((d, i) => {
    const sh = state.shift[i] || 0;
    const meta = [d.hrs ? `<b>~${d.hrs} hrs driving</b>` : `<b>${d.away ? "short drives" : "at home"}</b>`, d.roads].filter(Boolean).join(" · ");
    const stops = d.stops.map((s) => {
      const t = s.t + sh;
      return `<li class="stop${s.key ? " key" : ""}">${d.untimed ? "" : `<span class="time${t >= 1260 ? " late" : ""}">${fmt(t)}</span>`}<h3>${esc(s.h)}</h3>${s.p ? `<p>${esc(s.p)}</p>` : ""}
        ${(s.s || []).map((x) => `<span class="stat">${esc(x)}</span>`).join("")}
        ${s.g ? `<a class="gm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.g)}" target="_blank" rel="noopener">Open in Maps ↗</a>` : ""}</li>`;
    }).join("");
    const night = i < 5 ? `<div class="night"><b>Night ${i + 1}</b>${d.night === "Home" ? "Home in Phoenix" : esc(d.night)}${d.nightNote ? `. ${esc(d.nightNote)}` : ""}</div>` : "";
    const flags = d.flags.map(([h, p]) => `<div class="flag"><b>${esc(h)}</b><p>${esc(p)}</p></div>`).join("");
    return `<section class="day" id="d${i}" style="--zone:${zoneOf(d, i)}">
      <div class="dayhead"><span class="daynum">${label(i)}</span>${i === 3 ? `<span class="tag">Christmas Eve</span>` : i === 4 ? `<span class="tag">Christmas</span>` : ""}<h2>${esc(d.title)}</h2></div>
      <p class="daymeta">${meta}</p>
      ${wxLine(d, i)}
      ${d.untimed ? "" : `<div class="ctrls"><div class="shift"><span>Running late</span><button data-shift="${i}" data-by="-15" aria-label="15 minutes earlier">−</button><span class="val">${sh > 0 ? "+" : ""}${sh}m</span><button data-shift="${i}" data-by="15" aria-label="15 minutes later">+</button></div></div>`}
      <ul class="stops">${stops}</ul>${night}${flags}</section>`;
  }).join("");

  $("nav").innerHTML = days.map((d, i) => `<a href="#d${i}">${DATES[i][0]} · ${esc(d.nav)}</a>`).join("") +
    `<a href="#weather">Weather</a><a href="#alt">Options</a><a href="#book">Book now</a><a href="#vote">Vote</a>`;
  markNav();
}

// typical weather for a day: the coldest place you'll be, plus Phoenix if you also pass through it
function wxLine(d, i) {
  if (i === 0 || i === 5) return `<p class="wx">Typical in Phoenix · high ${temp(WX.PHX.hi)} · low ${temp(WX.PHX.lo)}</p>`;
  const pl = [...new Set(d.places)].sort((a, b) => PLACES[b].elev - PLACES[a].elev).slice(0, 2);
  return `<p class="wx">Typical · ${pl.map((k) => `${PLACES[k].name} high ${temp(WX[k].hi)}, low ${temp(WX[k].lo)}`).join(" · ")}</p>`;
}

function renderWeather(days) {
  const pl = [...new Set(days.flatMap((d) => d.places))].sort((a, b) => PLACES[b].elev - PLACES[a].elev);
  $("wxtable").innerHTML = `<thead><tr><th>Place</th><th>Elevation</th><th>Typical high</th><th>Typical low</th><th>What to expect</th></tr></thead><tbody>` +
    pl.map((k) => `<tr class="${PLACES[k].elev > SNOW_LINE ? "cold" : ""}"><td>${esc(PLACES[k].name)}</td><td>${PLACES[k].elev.toLocaleString()} ft</td><td>${temp(WX[k].hi)}</td><td>${temp(WX[k].lo)}</td><td>${esc(WX[k].note)}</td></tr>`).join("") + `</tbody>`;
}

function renderAlt() {
  $("options").innerHTML = Object.entries(ROUTES).map(([k, r]) => {
    const m = summarize(build({ ...state, route: k }));
    const on = state.route === k;
    return `<div class="altcard ${on ? "on" : ""}"><p class="t">Option ${r.letter} · ${esc(r.name)}</p><h3>${esc(r.head)}</h3>
      <p>${esc(r.desc)}</p><p class="nums">${m.hrs ? `~${m.hrs} hrs driving` : "local drives"} · ${m.away} night${m.away === 1 ? "" : "s"} away · high ${PLACES[m.high].elev.toLocaleString()} ft</p>
      <p>${esc(r.best)}</p>
      ${on ? `<span class="current">Current plan</span>` : `<button data-set="route" data-val="${k}">Choose option ${r.letter}</button>`}</div>`;
  }).join("");
  $("ifs").innerHTML = contingencies(state).map(([t, h, p]) => `<div class="altcard"><p class="t">${esc(t)}</p><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join("");
}

function renderChecks(days) {
  const items = checklist(days);
  $("checks").innerHTML = items.map(([id, t, why]) => `<li><label><input type="checkbox" data-check="${id}"${state.done.includes(id) ? " checked" : ""}><span class="txt">${esc(t)}${why ? `<span class="why">${esc(why)}</span>` : ""}</span></label></li>`).join("");
  const n = items.filter(([id]) => state.done.includes(id)).length;
  $("prog").style.width = `${(n / items.length) * 100}%`;
}

function renderVotes() {
  $("votes").innerHTML = CREW.map((name) => `<li><span class="who">${name}</span>${seg("vote:" + name, Object.entries(ROUTES).map(([k, r]) => [k, r.letter]), { get: (v) => state.votes[name] === v })}</li>`).join("");
  const counts = Object.fromEntries(Object.keys(ROUTES).map((k) => [k, CREW.filter((n) => state.votes[n] === k)]));
  const total = CREW.filter((n) => state.votes[n]).length;
  const max = Math.max(...Object.values(counts).map((v) => v.length));
  const leaders = Object.keys(counts).filter((k) => max && counts[k].length === max);
  $("tally").innerHTML = Object.entries(ROUTES).map(([k, r]) => {
    const n = counts[k].length;
    return `<div class="row" title="${esc(r.name)}: ${n ? counts[k].join(", ") : "no votes"}"><span class="${leaders.length === 1 && leaders[0] === k ? "lead" : ""}">${r.letter} · ${esc(r.short)}</span><span class="bar"><i style="width:${(n / 6) * 100}%"></i></span><span class="n">${n}</span></div>`;
  }).join("") + `<div class="foot"><span>${total} of 6 voted${leaders.length > 1 ? " · tied" : leaders.length ? ` · leading: option ${ROUTES[leaders[0]].letter}` : ""}</span>
    ${leaders.length === 1 && leaders[0] !== state.route ? `<button data-set="route" data-val="${leaders[0]}">Use option ${ROUTES[leaders[0]].letter}</button>` : ""}</div>`;
}

function render() {
  const days = build(state);
  renderHero(days); renderProfile(days); renderControls(); renderDays(days); renderWeather(days); renderAlt(); renderChecks(days); renderVotes();
  writeHash();
}

function markNav() {
  if (!("IntersectionObserver" in window)) return;
  if (observer) observer.disconnect();
  const links = document.querySelectorAll("#nav a");
  observer = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["d0", "d1", "d2", "d3", "d4", "d5", "weather", "alt", "book", "vote"].forEach((id) => { const el = $(id); if (el) observer.observe(el); });
}

function jump(i) {
  const el = $("d" + i);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
}

function planText() {
  const days = build(state), r = ROUTES[state.route];
  return `Arizona crew trip · Dec 21–26\nOption ${r.letter}: ${r.name}\n\n` +
    days.map((d, i) => `${label(i)}: ${d.title}\n` + d.stops.map((s) => `  ${d.untimed ? "•" : fmt(s.t + (state.shift[i] || 0))}  ${s.h}`).join("\n") + (i < 5 ? `\n  Night: ${d.night === "Home" ? "home in Phoenix" : d.night}` : "")).join("\n\n") +
    `\n\nPlan, options & vote: ${location.href}`;
}

function share(text, okMsg) {
  const msg = $("sharemsg"), orig = "Your choices, what-ifs, delays, votes and ticked boxes are all in the page's link. Copy it and send it to the group so everyone opens the same plan.";
  const done = (ok) => { msg.textContent = ok ? okMsg : "Couldn't copy automatically. Select the address bar and copy the URL."; setTimeout(() => (msg.textContent = orig), 4000); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
  else done(false);
}

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest && e.target.closest("[data-set],[data-shift],[data-day],#copy,#copytext");
  if (!t) return;
  if (t.dataset.set) {
    const k = t.dataset.set, v = t.dataset.val;
    if (k === "fun") state.fun = state.fun.includes(v) ? state.fun.filter((x) => x !== v) : [...state.fun, v];
    else if (k === "t") state.t[v] = !state.t[v];
    else if (k.startsWith("vote:")) { const n = k.slice(5); state.votes[n] = state.votes[n] === v ? "" : v; }
    else state[k] = v;
    const y = window.scrollY; render(); window.scrollTo(0, y);
  } else if (t.dataset.shift) {
    const i = t.dataset.shift;
    state.shift[i] = Math.max(-120, Math.min(240, (state.shift[i] || 0) + parseInt(t.dataset.by, 10)));
    const y = window.scrollY; render(); window.scrollTo(0, y);
  } else if (t.dataset.day) jump(t.dataset.day);
  else if (t.id === "copy") share(location.href, "Link copied. Everyone who opens it sees these exact settings.");
  else if (t.id === "copytext") share(planText(), "Plan copied as text. Paste it in the group chat.");
});
document.addEventListener("keydown", (e) => {
  const t = e.target.closest && e.target.closest("[data-day]");
  if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); jump(t.dataset.day); }
});
document.addEventListener("change", (e) => {
  const id = e.target.dataset && e.target.dataset.check;
  if (!id) return;
  state.done = e.target.checked ? [...new Set([...state.done, id])] : state.done.filter((x) => x !== id);
  renderChecks(build(state)); writeHash();
});

readHash();
render();
