// NakshatraMM — Comprehensive Burmese Nakshatras & Celestial Coordinate Dataset
// J2000 Epoch Coordinates: Right Ascension (0-24h) and Declination (-90° to +90°)

export interface CelestialStar {
  id: string;
  name: string;
  burmeseName: string;
  raHours: number; // 0 to 24 hours
  decDeg: number;  // -90 to +90 degrees
  mag: number;     // Apparent magnitude (lower = brighter)
  spectralType?: string; // Color indicator: O/B (blue), A (white), F/G (yellow), K (orange), M (red)
  color?: string;
}

export interface Nakshatra {
  id: number;
  nameMm: string;
  nameEn: string;
  nameSa: string;
  zodiacMm: string;
  zodiacEn: string;
  spanStartDeg: number; // 0° to 360° sidereal
  spanEndDeg: number;
  shapeMm: string;
  shapeEn: string;
  starCount: number;
  deityMm: string;
  planetRulerMm: string;
  symbolMm: string;
  descriptionMm: string;
  descriptionEn: string;
  primaryStar: CelestialStar;
  stars: CelestialStar[];
  lines: [number, number][]; // pairs of indices into stars array
}

export interface ZodiacSign {
  id: number;
  nameMm: string;
  nameEn: string;
  symbol: string;
  startDeg: number;
  endDeg: number;
  rulingPlanetMm: string;
  elementMm: string;
  descriptionMm: string;
}

export const BURMESE_NAKSHATRAS: Nakshatra[] = [
  {
    id: 1,
    nameMm: "အဿဝဏီ",
    nameEn: "Ashwini",
    nameSa: "Aśvinī",
    zodiacMm: "မိဿ",
    zodiacEn: "Aries",
    spanStartDeg: 0.0,
    spanEndDeg: 13.3333,
    shapeMm: "မြင်းခေါင်းသဏ္ဌာန်",
    shapeEn: "Horse's Head",
    starCount: 3,
    deityMm: "အသွင်ညီနောင် (နတ်သမားတော်)",
    planetRulerMm: "ကိတ် (Ketu)",
    symbolMm: "မြင်းဦးခေါင်း",
    descriptionMm: "နက္ခတ် ၂၇ လုံး၏ အဦးအစ ဖြစ်သည်။ လျင်မြန်ခြင်း၊ ကုသခြင်းနှင့် စွမ်းအင်သစ် စတင်ခြင်း၏ သင်္ကေတဖြစ်သည်။",
    descriptionEn: "The first Nakshatra, symbolized by a horse's head. Associated with speed, divine healing, vitality, and beginnings.",
    primaryStar: {
      id: "ash-1",
      name: "Hamal (α Arietis)",
      burmeseName: "အဿဝဏီ ကြယ်မင်း",
      raHours: 2.1195,
      decDeg: 23.4625,
      mag: 2.01,
      spectralType: "K2III",
      color: "#FFB066"
    },
    stars: [
      { id: "ash-1", name: "Hamal (α Ari)", burmeseName: "ဟာမလ်", raHours: 2.1195, decDeg: 23.4625, mag: 2.01, color: "#FFB066" },
      { id: "ash-2", name: "Sheratan (β Ari)", burmeseName: "ရှာရာတန်", raHours: 1.9106, decDeg: 20.8081, mag: 2.64, color: "#CFE3FF" },
      { id: "ash-3", name: "Mesarthim (γ Ari)", burmeseName: "မီဆာတင်", raHours: 1.8922, decDeg: 19.2944, mag: 3.88, color: "#E0ECFF" }
    ],
    lines: [[2, 1], [1, 0]]
  },
  {
    id: 2,
    nameMm: "ဘရဏီ",
    nameEn: "Bharani",
    nameSa: "Bharaṇī",
    zodiacMm: "မိဿ",
    zodiacEn: "Aries",
    spanStartDeg: 13.3333,
    spanEndDeg: 26.6667,
    shapeMm: "ဗျိုင်းသဏ္ဌာန် / ဖိုခနောက်သဏ္ဌာန်",
    shapeEn: "Hearth Triangle / Crane",
    starCount: 3,
    deityMm: "ယမမင်း (သေမင်းနတ်)",
    planetRulerMm: "သောကြာ (Venus)",
    symbolMm: "ဖိုခနောက် / ယောနိ",
    descriptionMm: "မိဿရာသီတွင် တည်ရှိပြီး ဖိုခနောက်သဏ္ဌာန် သုံးမြှောင့်ပုံ တည်ရှိသည်။ ခံနိုင်ရည်ရှိခြင်းနှင့် အသွင်ကူးပြောင်းခြင်းကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Represented by a triangle or hearth, ruled by Yama. Associated with perseverance, transformation, and rebirth.",
    primaryStar: {
      id: "bha-1",
      name: "41 Arietis (Bharani)",
      burmeseName: "ဘရဏီ ၄၁ ကြယ်",
      raHours: 2.8331,
      decDeg: 27.2606,
      mag: 3.61,
      spectralType: "B8V",
      color: "#D6E5FF"
    },
    stars: [
      { id: "bha-1", name: "41 Arietis", burmeseName: "၄၁ အာရီအက်တစ်", raHours: 2.8331, decDeg: 27.2606, mag: 3.61, color: "#D6E5FF" },
      { id: "bha-2", name: "39 Arietis", burmeseName: "၃၉ အာရီအက်တစ်", raHours: 2.7983, decDeg: 29.2475, mag: 4.52, color: "#FFF4E8" },
      { id: "bha-3", name: "35 Arietis", burmeseName: "၃၅ အာရီအက်တစ်", raHours: 2.7242, decDeg: 27.7128, mag: 4.65, color: "#FFE8D6" }
    ],
    lines: [[2, 0], [0, 1], [1, 2]]
  },
  {
    id: 3,
    nameMm: "ကြတ္တိကာ",
    nameEn: "Krittika",
    nameSa: "Kṛttikā",
    zodiacMm: "ပြိဿ",
    zodiacEn: "Taurus",
    spanStartDeg: 26.6667,
    spanEndDeg: 40.0,
    shapeMm: "ကြက်မသဏ္ဌာန် / မီးတိုင်သဏ္ဌာန်",
    shapeEn: "Pleiades / Hen & Chicks / Razor",
    starCount: 6,
    deityMm: "အဂ္ဂနိ (မီးနတ်)",
    planetRulerMm: "တနင်္ဂနွေ (Sun)",
    symbolMm: "မီးတောက် / ဓားငယ်",
    descriptionMm: "ကမ္ဘာကျော် ကြတ္တိကာကြယ်စု (Pleiades/ခုနစ်စဉ်ကြယ်မွှာ) ဖြစ်သည်။ တောက်ပစူးရှသော မီးလျှံကဲ့သို့ သန့်စင်စွမ်းအားရှိသည်။",
    descriptionEn: "The famous Pleiades open star cluster (M45). Ruled by Agni, representing sacred fire, purification, and razor sharpness.",
    primaryStar: {
      id: "kri-1",
      name: "Alcyone (η Tauri)",
      burmeseName: "ကြတ္တိကာ အယ်လ်စီယိုနီ",
      raHours: 3.7907,
      decDeg: 24.1051,
      mag: 2.85,
      spectralType: "B7III",
      color: "#C2DFFF"
    },
    stars: [
      { id: "kri-1", name: "Alcyone (η Tau)", burmeseName: "အယ်လ်စီယိုနီ", raHours: 3.7907, decDeg: 24.1051, mag: 2.85, color: "#C2DFFF" },
      { id: "kri-2", name: "Atlas (27 Tau)", burmeseName: "အက်တလပ်စ်", raHours: 3.8208, decDeg: 24.0531, mag: 3.63, color: "#C8E1FF" },
      { id: "kri-3", name: "Electra (17 Tau)", burmeseName: "အီလက်ထရာ", raHours: 3.7478, decDeg: 24.1102, mag: 3.70, color: "#D2E7FF" },
      { id: "kri-4", name: "Maia (20 Tau)", burmeseName: "မေယာ", raHours: 3.7633, decDeg: 24.3678, mag: 3.87, color: "#CCE4FF" },
      { id: "kri-5", name: "Merope (23 Tau)", burmeseName: "မေရိုပီ", raHours: 3.7717, decDeg: 23.9483, mag: 4.18, color: "#D7E9FF" },
      { id: "kri-6", name: "Taygeta (19 Tau)", burmeseName: "တေဂီတာ", raHours: 3.7544, decDeg: 24.4672, mag: 4.30, color: "#DBECFF" }
    ],
    lines: [[2, 5], [5, 3], [3, 0], [0, 1], [0, 4], [4, 2]]
  },
  {
    id: 4,
    nameMm: "ရောဟဏီ",
    nameEn: "Rohini",
    nameSa: "Rohiṇī",
    zodiacMm: "ပြိဿ",
    zodiacEn: "Taurus",
    spanStartDeg: 40.0,
    spanEndDeg: 53.3333,
    shapeMm: "လှည်းသဏ္ဌာန် / ရထားသဏ္ဌာန်",
    shapeEn: "Cart / Chariot / Hyades V",
    starCount: 5,
    deityMm: "ဗြဟ္မာ (ဖန်ဆင်းရှင်)",
    planetRulerMm: "တနင်္လာ (Moon)",
    symbolMm: "လှည်း / နွားလှည်း",
    descriptionMm: "ပြိဿရာသီရှိ နီဝါရောင် အယ်ဒီဘရန် (Aldebaran) မျက်လုံးကြယ်ကြီး ပါဝင်သည်။ ကြွယ်ဝချမ်းသာခြင်းနှင့် အလှအပကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Centered on brilliant red giant Aldebaran in the Hyades V-formation. Symbolizes beauty, growth, abundance, and devotion.",
    primaryStar: {
      id: "roh-1",
      name: "Aldebaran (α Tauri)",
      burmeseName: "ရောဟဏီ ကြယ်မင်း (အယ်ဒီဘရန်)",
      raHours: 4.5987,
      decDeg: 16.5093,
      mag: 0.85,
      spectralType: "K5III",
      color: "#FF8C42"
    },
    stars: [
      { id: "roh-1", name: "Aldebaran (α Tau)", burmeseName: "အယ်ဒီဘရန်", raHours: 4.5987, decDeg: 16.5093, mag: 0.85, color: "#FF8C42" },
      { id: "roh-2", name: "Ain (ε Tau)", burmeseName: "အိန်း", raHours: 4.4772, decDeg: 19.1803, mag: 3.53, color: "#FFE2B8" },
      { id: "roh-3", name: "Hyadum I (γ Tau)", burmeseName: "ဂါမာ တောရီ", raHours: 4.3300, decDeg: 15.6261, mag: 3.65, color: "#FFDFAB" },
      { id: "roh-4", name: "Secunda Hyadum (δ1 Tau)", burmeseName: "ဒယ်လ်တာ တောရီ", raHours: 4.3819, decDeg: 17.5422, mag: 3.77, color: "#FFE5BD" },
      { id: "roh-5", name: "Theta2 Tauri", burmeseName: "သီတာ တောရီ", raHours: 4.4767, decDeg: 15.8694, mag: 3.41, color: "#F0F4FF" }
    ],
    lines: [[2, 3], [3, 1], [2, 4], [4, 0], [1, 0]]
  },
  {
    id: 5,
    nameMm: "မိဂသီ",
    nameEn: "Mrigashira",
    nameSa: "Mṛgaśīrṣā",
    zodiacMm: "မေထုန်",
    zodiacEn: "Gemini",
    spanStartDeg: 53.3333,
    spanEndDeg: 66.6667,
    shapeMm: "သမင်ခေါင်းသဏ္ဌာန်",
    shapeEn: "Deer's Head",
    starCount: 3,
    deityMm: "စန္ဒြား (လနတ်)",
    planetRulerMm: "အင်္ဂါ (Mars)",
    symbolMm: "သမင်ဦးခေါင်း",
    descriptionMm: "မုဆိုးကြယ်စု (Orion) ၏ ဦးခေါင်းပိုင်းဖြစ်သော Meissa ကြယ်စုဖြစ်သည်။ ရှာဖွေစူးစမ်းလိုစိတ်နှင့် နူးညံ့သိမ်မွေ့ခြင်းကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Forms the head of Orion the hunter, centered on Meissa (λ Orionis). Symbolizes curiosity, quest, and gentle wandering spirit.",
    primaryStar: {
      id: "mri-1",
      name: "Meissa (λ Orionis)",
      burmeseName: "မေဆာ (မိဂသီဦးခေါင်း)",
      raHours: 5.5856,
      decDeg: 9.9342,
      mag: 3.39,
      spectralType: "O8III",
      color: "#9BB0FF"
    },
    stars: [
      { id: "mri-1", name: "Meissa (λ Ori)", burmeseName: "မေဆာ", raHours: 5.5856, decDeg: 9.9342, mag: 3.39, color: "#9BB0FF" },
      { id: "mri-2", name: "Phi1 Orionis", burmeseName: "ဖိုင်-၁ အိုရီယွန်နစ်", raHours: 5.5908, decDeg: 9.4897, mag: 4.39, color: "#B8CCFF" },
      { id: "mri-3", name: "Phi2 Orionis", burmeseName: "ဖိုင်-၂ အိုရီယွန်နစ်", raHours: 5.6133, decDeg: 9.2894, mag: 4.09, color: "#FFE8CA" }
    ],
    lines: [[0, 1], [1, 2], [2, 0]]
  },
  {
    id: 6,
    nameMm: "အာဒြာ",
    nameEn: "Ardra",
    nameSa: "Ārdrā",
    zodiacMm: "မေထုန်",
    zodiacEn: "Gemini",
    spanStartDeg: 66.6667,
    spanEndDeg: 80.0,
    shapeMm: "ပတ္တမြားသဏ္ဌာန် / မျက်ရည်စက်",
    shapeEn: "Ruby Gem / Teardrop",
    starCount: 1,
    deityMm: "ရုဒြ (မုန်တိုင်းနတ်)",
    planetRulerMm: "ရာဟု (Rahu)",
    symbolMm: "မျက်ရည်ပေါက် / ပတ္တမြား",
    descriptionMm: "ကောင်းကင်တွင် အထင်ရှားဆုံး နီဝါရောင် ကြယ်ဧရာကြီး ဘီတယ်လ်ဂျူးစ် (Betelgeuse) ဖြစ်သည်။ စိတ်လှုပ်ရှားဖွယ် ပြောင်းလဲမှုနှင့် စွမ်းအားကြီးမားခြင်းကို ဖော်ဆောင်သည်။",
    descriptionEn: "Identified with the red supergiant Betelgeuse in Orion. Symbol of storm, divine tears, passion, and turbulent breakthrough.",
    primaryStar: {
      id: "ard-1",
      name: "Betelgeuse (α Orionis)",
      burmeseName: "ဘီတယ်လ်ဂျူးစ် (အာဒြာပတ္တမြားကြယ်)",
      raHours: 5.9195,
      decDeg: 7.4071,
      mag: 0.50,
      spectralType: "M1-2Ia-ab",
      color: "#FF5E36"
    },
    stars: [
      { id: "ard-1", name: "Betelgeuse (α Ori)", burmeseName: "ဘီတယ်လ်ဂျူးစ်", raHours: 5.9195, decDeg: 7.4071, mag: 0.50, color: "#FF5E36" }
    ],
    lines: []
  },
  {
    id: 7,
    nameMm: "ပုဏ္ဏဖုသျှ",
    nameEn: "Punarvasu",
    nameSa: "Punarvasū",
    zodiacMm: "မေထုန် / ကရကဋ်",
    zodiacEn: "Gemini / Cancer",
    spanStartDeg: 80.0,
    spanEndDeg: 93.3333,
    shapeMm: "စာကလေးသဏ္ဌာန် / လေးသဏ္ဌာန်",
    shapeEn: "Bow & Quiver / Twin Stars",
    starCount: 2,
    deityMm: "အဒိတိ (နတ်တို့၏မယ်တော်)",
    planetRulerMm: "ကြာသပတေး (Jupiter)",
    symbolMm: "လေးနှင့်မြား / မိုးအိမ်",
    descriptionMm: "မေထုန်ကြယ်တာရာရှိ နာမည်ကျော် အမြွှာကြယ်နှစ်စင်းဖြစ်သော Castor နှင့် Pollux တို့ဖြစ်သည်။ အလင်းပြန်လည်ရရှိခြင်းနှင့် အိမ်ပြန်ရောက်ခြင်းကို ရည်ညွှန်းသည်။",
    descriptionEn: "Comprising Castor and Pollux in Gemini. Signifies the return of the light, renewal, abundance, and maternal safety.",
    primaryStar: {
      id: "pun-1",
      name: "Pollux (β Geminorum)",
      burmeseName: "ပေါလပ်စ် (ပုဏ္ဏဖုသျှ မင်းကြယ်)",
      raHours: 7.7553,
      decDeg: 28.0262,
      mag: 1.14,
      spectralType: "K0III",
      color: "#FFC875"
    },
    stars: [
      { id: "pun-1", name: "Pollux (β Gem)", burmeseName: "ပေါလပ်စ်", raHours: 7.7553, decDeg: 28.0262, mag: 1.14, color: "#FFC875" },
      { id: "pun-2", name: "Castor (α Gem)", burmeseName: "ကက်စတာ", raHours: 7.5767, decDeg: 31.8883, mag: 1.58, color: "#EBF1FF" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 8,
    nameMm: "ဖုသျှ",
    nameEn: "Pushya",
    nameSa: "Puṣya",
    zodiacMm: "ကရကဋ်",
    zodiacEn: "Cancer",
    spanStartDeg: 93.3333,
    spanEndDeg: 106.6667,
    shapeMm: "ပန်းပွင့်သဏ္ဌာန် / စပါးကျီသဏ္ဌာန်",
    shapeEn: "Flower Blossom / Cow's Udder",
    starCount: 3,
    deityMm: "ဗြိဟသ္ပတိ (နတ်တို့၏ဆရာ)",
    planetRulerMm: "စနေ (Saturn)",
    symbolMm: "ပန်းပွင့် / နို့အုံ",
    descriptionMm: "ကရကဋ်ရာသီ၏ အလယ်ဗဟို Beehive cluster အနီးတွင် တည်ရှိသည်။ နက္ခတ်အားလုံးတွင် အမွန်မြတ်ဆုံး မင်္ဂလာရှိသော နက္ခတ်ဟု သတ်မှတ်ကြသည်။",
    descriptionEn: "Located in Cancer near the Beehive Cluster (M44). Considered the most auspicious, nurturing, and spiritually generous of all Nakshatras.",
    primaryStar: {
      id: "pus-1",
      name: "Delta Cancri (Asellus Australis)",
      burmeseName: "ဖုသျှ ဒယ်လ်တာကြယ်",
      raHours: 8.7447,
      decDeg: 18.1544,
      mag: 3.94,
      spectralType: "K0III",
      color: "#FFD085"
    },
    stars: [
      { id: "pus-1", name: "Delta Cancri", burmeseName: "ဒယ်လ်တာ ကန်ခရီ", raHours: 8.7447, decDeg: 18.1544, mag: 3.94, color: "#FFD085" },
      { id: "pus-2", name: "Gamma Cancri", burmeseName: "ဂါမာ ကန်ခရီ", raHours: 8.7225, decDeg: 21.4683, mag: 4.66, color: "#FAF6FF" },
      { id: "pus-3", name: "Theta Cancri", burmeseName: "သီတာ ကန်ခရီ", raHours: 8.5272, decDeg: 18.0903, mag: 5.33, color: "#FAF6FF" }
    ],
    lines: [[2, 0], [0, 1]]
  },
  {
    id: 9,
    nameMm: "အာသလိဿ",
    nameEn: "Ashlesha",
    nameSa: "Āśleṣā",
    zodiacMm: "ကရကဋ်",
    zodiacEn: "Cancer",
    spanStartDeg: 106.6667,
    spanEndDeg: 120.0,
    shapeMm: "မြွေသဏ္ဌာန်",
    shapeEn: "Coiled Serpent / Hydra's Head",
    starCount: 5,
    deityMm: "နာဂမင်း (နဂါးနတ်မင်း)",
    planetRulerMm: "ဗုဒ္ဓဟူး (Mercury)",
    symbolMm: "ခွေနေသောမြွေ",
    descriptionMm: "ဟိုက်ဒရာ (Hydra) ရေမြွေနတ်ကြယ်စု၏ ဦးခေါင်းပိုင်းတွင် ခွေလျက်တည်ရှိသည်။ နက်နဲသော အသိဉာဏ်နှင့် လျှို့ဝှက်နက်ရှိုင်းသော စွမ်းအားကို ဆောင်သည်။",
    descriptionEn: "Forms the head of Hydra the serpent. Represents Kundalini awakening, intuition, esoteric wisdom, and hypnotic depth.",
    primaryStar: {
      id: "ashl-1",
      name: "Epsilon Hydrae",
      burmeseName: "အာသလိဿ အက်ပစီလွန်ကြယ်",
      raHours: 8.7797,
      decDeg: 6.4192,
      mag: 3.38,
      spectralType: "G5III",
      color: "#FFE7A0"
    },
    stars: [
      { id: "ashl-1", name: "Epsilon Hydrae", burmeseName: "အက်ပစီလွန် ဟိုက်ဒရေး", raHours: 8.7797, decDeg: 6.4192, mag: 3.38, color: "#FFE7A0" },
      { id: "ashl-2", name: "Delta Hydrae", burmeseName: "ဒယ်လ်တာ ဟိုက်ဒရေး", raHours: 8.6278, decDeg: 5.7111, mag: 4.14, color: "#D7E6FF" },
      { id: "ashl-3", name: "Zeta Hydrae", burmeseName: "ဇီတာ ဟိုက်ဒရေး", raHours: 8.9233, decDeg: 5.9458, mag: 3.11, color: "#FFE094" },
      { id: "ashl-4", name: "Eta Hydrae", burmeseName: "အီတာ ဟိုက်ဒရေး", raHours: 8.7203, decDeg: 3.3986, mag: 4.30, color: "#CADFFF" },
      { id: "ashl-5", name: "Sigma Hydrae", burmeseName: "ဆစ်ဂမာ ဟိုက်ဒရေး", raHours: 8.6461, decDeg: 3.3403, mag: 4.45, color: "#FFCE85" }
    ],
    lines: [[1, 0], [0, 2], [2, 3], [3, 4], [4, 1]]
  },
  {
    id: 10,
    nameMm: "မာဃ",
    nameEn: "Magha",
    nameSa: "Maghā",
    zodiacMm: "သိဟ်",
    zodiacEn: "Leo",
    spanStartDeg: 120.0,
    spanEndDeg: 133.3333,
    shapeMm: "ထီးဖြူသဏ္ဌာန် / ရဟတ်သဏ္ဌာန်",
    shapeEn: "Royal White Umbrella / Sickle of Leo",
    starCount: 6,
    deityMm: "ပီတိရ် (ဘိုးဘေးနတ်ဘုရားများ)",
    planetRulerMm: "ကိတ် (Ketu)",
    symbolMm: "ထီးဖြူတော် / ပလ္လင်တော်",
    descriptionMm: "သိဟ်ရာသီ၏ အဓိက ခြင်္သေ့နှလုံးကြယ် ရီဂူးလပ်စ် (Regulus) ပါဝင်သော Sickle ပုံသဏ္ဌာန်ဖြစ်သည်။ မင်းစိုးရာဇာ အာဏာနှင့် ဘိုးဘေးအစဉ်အဆက် ဂုဏ်သရေကို ဖော်ဆောင်သည်။",
    descriptionEn: "Centered on Regulus, the heart of the Lion. Symbol of royalty, noble heritage, authoritative leadership, and traditional dignity.",
    primaryStar: {
      id: "mag-1",
      name: "Regulus (α Leonis)",
      burmeseName: "မာဃ မင်းကြယ် (ရီဂူးလပ်စ်)",
      raHours: 10.1395,
      decDeg: 11.9672,
      mag: 1.36,
      spectralType: "B8IVn",
      color: "#BCD6FF"
    },
    stars: [
      { id: "mag-1", name: "Regulus (α Leo)", burmeseName: "ရီဂူးလပ်စ်", raHours: 10.1395, decDeg: 11.9672, mag: 1.36, color: "#BCD6FF" },
      { id: "mag-2", name: "Eta Leonis", burmeseName: "အီတာ လီယွန်နစ်", raHours: 10.1231, decDeg: 16.7628, mag: 3.48, color: "#ECEFFF" },
      { id: "mag-3", name: "Algieba (γ Leo)", burmeseName: "အယ်ဂျီဘာ", raHours: 10.3331, decDeg: 19.8417, mag: 2.01, color: "#FFCE75" },
      { id: "mag-4", name: "Zeta Leonis", burmeseName: "ဇီတာ လီယွန်နစ်", raHours: 10.2831, decDeg: 23.4172, mag: 3.43, color: "#DFEBFF" },
      { id: "mag-5", name: "Mu Leonis", burmeseName: "မျူ လီယွန်နစ်", raHours: 9.8781, decDeg: 26.0069, mag: 3.88, color: "#FFD895" },
      { id: "mag-6", name: "Epsilon Leonis", burmeseName: "အက်ပစီလွန် လီယွန်နစ်", raHours: 9.7644, decDeg: 23.7742, mag: 2.97, color: "#FFE8B8" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]
  },
  {
    id: 11,
    nameMm: "ပြုဗ္ဗာဖလဂုဏီ",
    nameEn: "Purva Phalguni",
    nameSa: "Pūrva Phālgunī",
    zodiacMm: "သိဟ်",
    zodiacEn: "Leo",
    spanStartDeg: 133.3333,
    spanEndDeg: 146.6667,
    shapeMm: "ပုခက်သဏ္ဌာန် / ဖောင်သဏ္ဌာန်",
    shapeEn: "Hammock / Front of Couch",
    starCount: 2,
    deityMm: "ဘဂ (ကံကြမ္မာနှင့် ကြွယ်ဝမှုနတ်)",
    planetRulerMm: "သောကြာ (Venus)",
    symbolMm: "ပုခက် / ကုတင်ရှေ့ပိုင်း",
    descriptionMm: "သိဟ်ရာသီ၏ နောက်ကျောပိုင်းရှိ Zosma နှင့် Chertan ကြယ်နှစ်လုံးဖြစ်သည်။ ချစ်ခြင်းမေတ္တာ၊ အနုပညာ၊ အပန်းဖြေခြင်းနှင့် ပျော်ရွှင်ချမ်းမြေ့မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Composed of Zosma and Chertan in Leo. Signifies relaxed luxury, love, prosperity, artistic bliss, and good fortune.",
    primaryStar: {
      id: "pph-1",
      name: "Zosma (δ Leonis)",
      burmeseName: "ဇော့စ်မာ",
      raHours: 11.2353,
      decDeg: 20.5236,
      mag: 2.56,
      spectralType: "A4V",
      color: "#EFF3FF"
    },
    stars: [
      { id: "pph-1", name: "Zosma (δ Leo)", burmeseName: "ဇော့စ်မာ", raHours: 11.2353, decDeg: 20.5236, mag: 2.56, color: "#EFF3FF" },
      { id: "pph-2", name: "Chertan (θ Leo)", burmeseName: "ချာတန်", raHours: 11.2372, decDeg: 15.4294, mag: 3.33, color: "#E8F0FF" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 12,
    nameMm: "ဥတ္တရာဖလဂုဏီ",
    nameEn: "Uttara Phalguni",
    nameSa: "Uttara Phālgunī",
    zodiacMm: "သိဟ် / ကန်",
    zodiacEn: "Leo / Virgo",
    spanStartDeg: 146.6667,
    spanEndDeg: 160.0,
    shapeMm: "အိပ်ရာသဏ္ဌာန် / လှည်းဦးသဏ္ဌာန်",
    shapeEn: "Back of Bed / Front of Chariot",
    starCount: 2,
    deityMm: "အရျမန် (သစ္စာနှင့် မဟာမိတ်နတ်)",
    planetRulerMm: "တနင်္ဂနွေ (Sun)",
    symbolMm: "မင်္ဂလာကုတင် / သလွန်",
    descriptionMm: "ခြင်္သေ့မြီးပိုင်းရှိ ဒယ်နီဘိုလာ (Denebola) ကြယ်မင်း ပါဝင်သည်။ သစ္စာရှိခြင်း၊ ကူညီဖေးမခြင်းနှင့် တာဝန်ယူမှုရှိသော ခေါင်းဆောင်မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Centered on Denebola (β Leonis). Represents alliance, enduring friendship, patronage, integrity, and generous service.",
    primaryStar: {
      id: "uph-1",
      name: "Denebola (β Leonis)",
      burmeseName: "ဒယ်နီဘိုလာ (ဥတ္တရာဖလဂုဏီ)",
      raHours: 11.8178,
      decDeg: 14.5722,
      mag: 2.14,
      spectralType: "A3V",
      color: "#E2EDFF"
    },
    stars: [
      { id: "uph-1", name: "Denebola (β Leo)", burmeseName: "ဒယ်နီဘိုလာ", raHours: 11.8178, decDeg: 14.5722, mag: 2.14, color: "#E2EDFF" },
      { id: "uph-2", name: "93 Leonis", burmeseName: "၉၃ လီယွန်နစ်", raHours: 11.7997, decDeg: 20.2181, mag: 4.50, color: "#FFDB9F" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 13,
    nameMm: "ဟဿတ",
    nameEn: "Hasta",
    nameSa: "Hasta",
    zodiacMm: "ကန်",
    zodiacEn: "Virgo",
    spanStartDeg: 160.0,
    spanEndDeg: 173.3333,
    shapeMm: "လက်ဝါးသဏ္ဌာန် / ဆင်လက်သဏ္ဌာန်",
    shapeEn: "Open Hand / Corvus Trapezoid",
    starCount: 5,
    deityMm: "သဝိတြ (နေနတ်ဘုရား)",
    planetRulerMm: "တနင်္လာ (Moon)",
    symbolMm: "ဖြန့်ထားသော လက်ဝါး",
    descriptionMm: "ကျီးကန်းကြယ်စု (Corvus) ၏ ကြယ် ၅ လုံးဖြင့် လက်ဝါးသဏ္ဌာန် ဖြစ်ပေါ်သည်။ လက်မှုပညာ၊ အတတ်ပညာနှင့် ဖန်တီးတီထွင်နိုင်စွမ်းကို ဖော်ဆောင်သည်။",
    descriptionEn: "Formed by the Corvus constellation resembling a hand. Symbol of craftsmanship, dexterous skill, healing, and manifest creativity.",
    primaryStar: {
      id: "has-1",
      name: "Gienah (γ Corvi)",
      burmeseName: "ဂီယဲနား (ဟဿတမင်းကြယ်)",
      raHours: 12.2633,
      decDeg: -17.5419,
      mag: 2.59,
      spectralType: "B8III",
      color: "#BBD5FF"
    },
    stars: [
      { id: "has-1", name: "Gienah (γ Crv)", burmeseName: "ဂီယဲနား", raHours: 12.2633, decDeg: -17.5419, mag: 2.59, color: "#BBD5FF" },
      { id: "has-2", name: "Algorab (δ Crv)", burmeseName: "အယ်လ်ဂိုရက်ဘ်", raHours: 12.4981, decDeg: -16.5153, mag: 2.94, color: "#EFF4FF" },
      { id: "has-3", name: "Kraz (β Crv)", burmeseName: "ခရက်ဇ်", raHours: 12.5731, decDeg: -23.3969, mag: 2.65, color: "#FFE19A" },
      { id: "has-4", name: "Minkar (ε Crv)", burmeseName: "မင်ခါ", raHours: 12.1689, decDeg: -22.6197, mag: 3.02, color: "#FFCD85" },
      { id: "has-5", name: "Alchiba (α Crv)", burmeseName: "အယ်လ်ချီဘာ", raHours: 12.1403, decDeg: -24.7289, mag: 4.02, color: "#F7F9FF" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4]]
  },
  {
    id: 14,
    nameMm: "စိတြ",
    nameEn: "Chitra",
    nameSa: "Citrā",
    zodiacMm: "ကန် / တူ",
    zodiacEn: "Virgo / Libra",
    spanStartDeg: 173.3333,
    spanEndDeg: 186.6667,
    shapeMm: "ပုလဲသဏ္ဌာန် / ကျားသဏ္ဌာန်",
    shapeEn: "Bright Pearl / Gem",
    starCount: 1,
    deityMm: "ဝိသုကမ္မ (ဗိသုကာနတ်မင်း)",
    planetRulerMm: "အင်္ဂါ (Mars)",
    symbolMm: "တောက်ပသော ပုလဲရတနာ",
    descriptionMm: "ကန်ရာသီရှိ အလွန်တောက်ပသော အပြာရောင်ကြယ်မင်း စပိုက်ကာ (Spica) ဖြစ်သည်။ ဗိသုကာပညာ၊ တီထွင်ဖန်တီးမှုနှင့် အနုပညာလက်ရာ စွမ်းရည်တို့ကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Centered on the brilliant blue-white primary star Spica (α Virginis). Governed by divine architect Vishwakarma; symbol of sparkling elegance and mastercraft.",
    primaryStar: {
      id: "chi-1",
      name: "Spica (α Virginis)",
      burmeseName: "စပိုက်ကာ (စိတြကြယ်မင်း)",
      raHours: 13.4199,
      decDeg: -11.1614,
      mag: 0.98,
      spectralType: "B1III-IV",
      color: "#9EB8FF"
    },
    stars: [
      { id: "chi-1", name: "Spica (α Vir)", burmeseName: "စပိုက်ကာ", raHours: 13.4199, decDeg: -11.1614, mag: 0.98, color: "#9EB8FF" }
    ],
    lines: []
  },
  {
    id: 15,
    nameMm: "သွာတိ",
    nameEn: "Swati",
    nameSa: "Svātī",
    zodiacMm: "တူ",
    zodiacEn: "Libra",
    spanStartDeg: 186.6667,
    spanEndDeg: 200.0,
    shapeMm: "သန္တာသဏ္ဌာန် / မိုးရေပေါက်",
    shapeEn: "Coral Gem / Sword / Pearl",
    starCount: 1,
    deityMm: "ဝါယု (လေနတ်မင်း)",
    planetRulerMm: "ရာဟု (Rahu)",
    symbolMm: "နုနယ်သော အညွန့် / ဓား",
    descriptionMm: "မြောက်ဘက်ကောင်းကင်တွင် အတောက်ပဆုံး ရွှေဝါရောင် ကြယ်ကြီး အာ့တူးရပ်စ် (Arcturus) ဖြစ်သည်။ လွတ်လပ်မှု၊ လိုက်လျောညီထွေရှိမှုနှင့် စိတ်ဓာတ်ကြံ့ခိုင်မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Identified with the bright golden giant Arcturus (α Boötis). Ruled by Vayu (wind); embodies independence, adaptability, and boundless freedom.",
    primaryStar: {
      id: "swa-1",
      name: "Arcturus (α Boötis)",
      burmeseName: "အာ့တူးရပ်စ် (သွာတိကြယ်ကြီး)",
      raHours: 14.2608,
      decDeg: 19.1822,
      mag: -0.05,
      spectralType: "K1.5IIIFe-0.5",
      color: "#FFAE5E"
    },
    stars: [
      { id: "swa-1", name: "Arcturus (α Boo)", burmeseName: "အာ့တူးရပ်စ်", raHours: 14.2608, decDeg: 19.1822, mag: -0.05, color: "#FFAE5E" }
    ],
    lines: []
  },
  {
    id: 16,
    nameMm: "ဝိသာခါ",
    nameEn: "Vishakha",
    nameSa: "Viśākhā",
    zodiacMm: "တူ / ဗြိစ္ဆာ",
    zodiacEn: "Libra / Scorpio",
    spanStartDeg: 200.0,
    spanEndDeg: 213.3333,
    shapeMm: "ကျွဲချိုသဏ္ဌာန် / တံခွန်စိုက်",
    shapeEn: "Triumphal Arch / Buffalo Horns",
    starCount: 4,
    deityMm: "ဣန္ဒြာနှင့် အဂ္ဂနိ",
    planetRulerMm: "ကြာသပတေး (Jupiter)",
    symbolMm: "မုခ်ဦးကွေ့ / အောင်ပွဲတံခွန်",
    descriptionMm: "တူရာသီ၏ အဓိကကြယ်များဖြစ်ပြီး ကျွဲချိုကဲ့သို့ ခုံးသောသဏ္ဌာန်ရှိသည်။ စွဲမြဲသော ရည်မှန်းချက်၊ အောင်ပွဲနှင့် အာရုံစူးစိုက်မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Formed by the primary stars of Libra in an archway motif. Symbolizes purposeful focus, triumph, and unwavering determination.",
    primaryStar: {
      id: "vis-1",
      name: "Zubeneschamali (β Librae)",
      burmeseName: "ဇူဘင်နက်ရှာမာလီ",
      raHours: 15.2833,
      decDeg: -9.3828,
      mag: 2.61,
      spectralType: "B8V",
      color: "#CEE2FF"
    },
    stars: [
      { id: "vis-1", name: "Zubeneschamali (β Lib)", burmeseName: "ဇူဘင်နက်ရှာမာလီ", raHours: 15.2833, decDeg: -9.3828, mag: 2.61, color: "#CEE2FF" },
      { id: "vis-2", name: "Zubenelgenubi (α2 Lib)", burmeseName: "ဇူဘင်နယ်လ်ဂီနူဘီ", raHours: 14.8481, decDeg: -16.0417, mag: 2.75, color: "#EFF4FF" },
      { id: "vis-3", name: "Gamma Librae", burmeseName: "ဂါမာ လစ်ဘရေး", raHours: 15.5922, decDeg: -14.7894, mag: 3.91, color: "#FFE29F" },
      { id: "vis-4", name: "Iota Librae", burmeseName: "အိုင်အိုတာ လစ်ဘရေး", raHours: 15.2039, decDeg: -19.7858, mag: 4.54, color: "#EFF3FF" }
    ],
    lines: [[1, 0], [0, 2], [2, 3], [3, 1]]
  },
  {
    id: 17,
    nameMm: "အနုရာဓ",
    nameEn: "Anuradha",
    nameSa: "Anurādhā",
    zodiacMm: "ဗြိစ္ဆာ",
    zodiacEn: "Scorpio",
    spanStartDeg: 213.3333,
    spanEndDeg: 226.6667,
    shapeMm: "ပုစွန်လက်သဏ္ဌာန် / နှင်းပန်းသဏ္ဌာန်",
    shapeEn: "Lotus / Lobster Claw / Staff",
    starCount: 3,
    deityMm: "မိတြ (ချစ်ကြည်ရေးနတ်မင်း)",
    planetRulerMm: "စနေ (Saturn)",
    symbolMm: "ကြာပန်း / အောင်ပွဲတံခွန်",
    descriptionMm: "ဗြိစ္ဆာရာသီ ကင်းမြီးကောက်ဦးခေါင်းပိုင်းရှိ မျဉ်းဖြောင့်ကြယ် ၃ လုံးဖြစ်သည်။ သစ္စာရှိသော မိတ်ဆွေဖွဲ့မှု၊ အဖွဲ့အစည်းနှင့် စိတ်နှလုံးတည်ကြည်မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Formed by the three forehead stars of Scorpius (δ, β, π Scorpii). Symbolizes deep friendship, devotion, collaboration, and resilience.",
    primaryStar: {
      id: "anu-1",
      name: "Dschubba (δ Scorpii)",
      burmeseName: "ဂျူးဘာ (အနုရာဓကြယ်)",
      raHours: 16.0056,
      decDeg: -22.6217,
      mag: 2.29,
      spectralType: "B0.2IVe",
      color: "#AEC8FF"
    },
    stars: [
      { id: "anu-1", name: "Dschubba (δ Sco)", burmeseName: "ဂျူးဘာ", raHours: 16.0056, decDeg: -22.6217, mag: 2.29, color: "#AEC8FF" },
      { id: "anu-2", name: "Acrab (β1 Sco)", burmeseName: "အာခရက်ဘ်", raHours: 16.0906, decDeg: -19.8056, mag: 2.56, color: "#B8D0FF" },
      { id: "anu-3", name: "Pi Scorpii", burmeseName: "ပိုင် စကော်ပီယိုင်", raHours: 15.9808, decDeg: -26.1142, mag: 2.89, color: "#BCD4FF" }
    ],
    lines: [[1, 0], [0, 2]]
  },
  {
    id: 18,
    nameMm: "ဇေဋ္ဌ",
    nameEn: "Jyeshtha",
    nameSa: "Jyeṣṭhā",
    zodiacMm: "ဗြိစ္ဆာ",
    zodiacEn: "Scorpio",
    spanStartDeg: 226.6667,
    spanEndDeg: 240.0,
    shapeMm: "ဆင်စွယ်သဏ္ဌာန် / နားကပ်သဏ္ဌာန်",
    shapeEn: "Elephant Tusk / Circular Talisman",
    starCount: 3,
    deityMm: "ဣန္ဒြာ (သိကြားမင်း)",
    planetRulerMm: "ဗုဒ္ဓဟူး (Mercury)",
    symbolMm: "နားကပ် / အဆောင်လက်ဖွဲ့",
    descriptionMm: "ဗြိစ္ဆာရာသီ၏ အသည်းနှလုံး နီရဲတောက်ပသော ဧရာမကြယ်ကြီး အန်တာရက်စ် (Antares) ပါဝင်သည်။ အကြီးအကဲဖြစ်ခြင်း၊ ရဲရင့်ခြင်းနှင့် ကာကွယ်စောင့်ရှောက်ခြင်းကို ဖော်ဆောင်သည်။",
    descriptionEn: "Anchored by brilliant red supergiant Antares (α Scorpii). Signifies seniority, courage, protective mastery, and veteran status.",
    primaryStar: {
      id: "jye-1",
      name: "Antares (α Scorpii)",
      burmeseName: "အန်တာရက်စ် (ဇေဋ္ဌကင်းနှလုံးကြယ်)",
      raHours: 16.4901,
      decDeg: -26.4319,
      mag: 1.06,
      spectralType: "M1.5Iab-b",
      color: "#FF4928"
    },
    stars: [
      { id: "jye-1", name: "Antares (α Sco)", burmeseName: "အန်တာရက်စ်", raHours: 16.4901, decDeg: -26.4319, mag: 1.06, color: "#FF4928" },
      { id: "jye-2", name: "Al Niyat (σ Sco)", burmeseName: "အယ်လ်နီယက် (ဆစ်ဂမာ)", raHours: 16.3531, decDeg: -25.5928, mag: 2.88, color: "#BDD3FF" },
      { id: "jye-3", name: "Tau Scorpii", burmeseName: "တော စကော်ပီယိုင်", raHours: 16.5981, decDeg: -28.2161, mag: 2.82, color: "#ADC6FF" }
    ],
    lines: [[1, 0], [0, 2]]
  },
  {
    id: 19,
    nameMm: "မူလ",
    nameEn: "Mula",
    nameSa: "Mūla",
    zodiacMm: "ဓနု",
    zodiacEn: "Sagittarius",
    spanStartDeg: 240.0,
    spanEndDeg: 253.3333,
    shapeMm: "ခြင်္သေ့မြီးသဏ္ဌာန် / အမြစ်သဏ္ဌာန်",
    shapeEn: "Roots / Lion's Tail / Stinger",
    starCount: 5,
    deityMm: "နိရတိ (ပျက်စီးခြင်းနှင့် အမှောင်နတ်)",
    planetRulerMm: "ကိတ် (Ketu)",
    symbolMm: "ချည်နှောင်ထားသော အမြစ်တွဲ",
    descriptionMm: "နဂါးငွေ့တန်း ဗဟိုချက် အနီးရှိ ကင်းမြီးကောက် အမြီးပိုင်း ကြယ်စုဖြစ်သည်။ အရင်းအမြစ်သို့ စူးစမ်းရောက်ရှိခြင်းနှင့် နက်ရှိုင်းသော အပြောင်းအလဲကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Located in the stinger of Scorpius directly facing the Galactic Center. Associated with root origins, truth seeking, and foundational transformation.",
    primaryStar: {
      id: "mul-1",
      name: "Shaula (λ Scorpii)",
      burmeseName: "ရှောလာ (မူလကြယ်)",
      raHours: 17.5601,
      decDeg: -37.1039,
      mag: 1.62,
      spectralType: "B2IV",
      color: "#AFC8FF"
    },
    stars: [
      { id: "mul-1", name: "Shaula (λ Sco)", burmeseName: "ရှောလာ", raHours: 17.5601, decDeg: -37.1039, mag: 1.62, color: "#AFC8FF" },
      { id: "mul-2", name: "Lesath (υ Sco)", burmeseName: "လီဆက်သ်", raHours: 17.5128, decDeg: -37.2958, mag: 2.70, color: "#B3CCFF" },
      { id: "mul-3", name: "Sargas (θ Sco)", burmeseName: "ဆာဂတ်စ်", raHours: 17.6222, decDeg: -42.9978, mag: 1.86, color: "#FFF1C4" },
      { id: "mul-4", name: "Kappa Scorpii", burmeseName: "ကာပါ စကော်ပီယိုင်", raHours: 17.7081, decDeg: -39.0300, mag: 2.39, color: "#B0CAFF" },
      { id: "mul-5", name: "Iota 1 Scorpii", burmeseName: "အိုင်အိုတာ စကော်ပီယိုင်", raHours: 17.7931, decDeg: -40.1269, mag: 2.99, color: "#FFF9DF" }
    ],
    lines: [[2, 4], [4, 3], [3, 0], [0, 1]]
  },
  {
    id: 20,
    nameMm: "ပြုဗ္ဗာသဠ်",
    nameEn: "Purva Ashadha",
    nameSa: "Pūrva Aṣāḍhā",
    zodiacMm: "ဓနု",
    zodiacEn: "Sagittarius",
    spanStartDeg: 253.3333,
    spanEndDeg: 266.6667,
    shapeMm: "ဆင်လက်သဏ္ဌာန် / ဖျာသဏ္ဌာန်",
    shapeEn: "Elephant Tusk / Winnowing Fan",
    starCount: 2,
    deityMm: "အာပ (ရေနတ်ဘုရား)",
    planetRulerMm: "သောကြာ (Venus)",
    symbolMm: "ဆန်ကော / ရေခရား",
    descriptionMm: "ဓနုရာသီ လေးပုံသဏ္ဌာန်ရှိ Kaus Australis နှင့် Kaus Media ကြယ်များဖြစ်သည်။ အောင်နိုင်ခြင်း၊ မဆုတ်မနစ် ဇွဲနှင့် စိတ်အားထက်သန်မှုကို ရည်ညွှန်းသည်။",
    descriptionEn: "Comprises Kaus Australis and Kaus Media in the archer's bow. Symbolizes invincibility, purity of water, and early victory.",
    primaryStar: {
      id: "pas-1",
      name: "Kaus Australis (ε Sagittarii)",
      burmeseName: "ကောက်စ် အော်စထရာလစ်",
      raHours: 18.4028,
      decDeg: -34.3847,
      mag: 1.79,
      spectralType: "B9.5III",
      color: "#CFE0FF"
    },
    stars: [
      { id: "pas-1", name: "Kaus Australis (ε Sgr)", burmeseName: "ကောက်စ် အော်စထရာလစ်", raHours: 18.4028, decDeg: -34.3847, mag: 1.79, color: "#CFE0FF" },
      { id: "pas-2", name: "Kaus Media (δ Sgr)", burmeseName: "ကောက်စ် မီဒီယာ", raHours: 18.3500, decDeg: -29.8281, mag: 2.72, color: "#FFE29C" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 21,
    nameMm: "ဥတ္တရာသဠ်",
    nameEn: "Uttara Ashadha",
    nameSa: "Uttara Aṣāḍhā",
    zodiacMm: "ဓနု / မကာရ",
    zodiacEn: "Sagittarius / Capricorn",
    spanStartDeg: 266.6667,
    spanEndDeg: 280.0,
    shapeMm: "ပုခက်သဏ္ဌာန် / ဆင်စွယ်သဏ္ဌာန်",
    shapeEn: "Elephant Tusk / Cot / Final Victory",
    starCount: 2,
    deityMm: "ဝိသွေဒေဝ (စကြဝဠာ နတ်မင်းအပေါင်း)",
    planetRulerMm: "တနင်္ဂနွေ (Sun)",
    symbolMm: "ဆင်စွယ် / သလွန်",
    descriptionMm: "ဓနုရာသီ လက်ဖက်ရည်ကရား (Teapot) ၏ အဖုံးပိုင်းရှိ Nunki နှင့် Ascella ကြယ်များဖြစ်သည်။ နောက်ဆုံး အပြီးသတ်အောင်ပွဲနှင့် စကြဝဠာတရားကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Formed by Nunki (σ Sgr) and Ascella (ζ Sgr). Signifies universal virtue, enduring structure, and decisive final victory.",
    primaryStar: {
      id: "uas-1",
      name: "Nunki (σ Sagittarii)",
      burmeseName: "နွန်ကီ (ဥတ္တရာသဠ်)",
      raHours: 18.9211,
      decDeg: -26.2967,
      mag: 2.05,
      spectralType: "B2.5V",
      color: "#B2CAFF"
    },
    stars: [
      { id: "uas-1", name: "Nunki (σ Sgr)", burmeseName: "နွန်ကီ", raHours: 18.9211, decDeg: -26.2967, mag: 2.05, color: "#B2CAFF" },
      { id: "uas-2", name: "Ascella (ζ Sgr)", burmeseName: "အက်စကဲလား", raHours: 19.0431, decDeg: -29.8800, mag: 2.60, color: "#EFF3FF" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 22,
    nameMm: "သရဝဏ်",
    nameEn: "Shravana",
    nameSa: "Śravaṇa",
    zodiacMm: "မကာရ",
    zodiacEn: "Capricorn",
    spanStartDeg: 280.0,
    spanEndDeg: 293.3333,
    shapeMm: "မတ်ရပ်လူသဏ္ဌာန် / မြားသုံးစင်း",
    shapeEn: "3 Footsteps / Arrow / Walking Figure",
    starCount: 3,
    deityMm: "ဗိဿနိုး (လောကထိန်းနတ်)",
    planetRulerMm: "တနင်္လာ (Moon)",
    symbolMm: "နားရွက် / ခြေလှမ်းသုံးလှမ်း",
    descriptionMm: "လင်းယုန်ကြယ်စု (Aquila) ၏ အလယ်ဗဟို အယ်လ်တဲယား (Altair) ကြယ်နှင့် ဝဲယာကြယ်နှစ်လုံးဖြစ်သည်။ ကြားနာသင်ယူခြင်း၊ ပညာဗဟုသုတနှင့် တရားဓမ္မ နာယူခြင်းကို ဖော်ဆောင်သည်။",
    descriptionEn: "Identified with Altair and its flanking stars Tarazed and Alshain in Aquila. Represents listening, oral wisdom, education, and dharma.",
    primaryStar: {
      id: "shr-1",
      name: "Altair (α Aquilae)",
      burmeseName: "အယ်လ်တဲယား (သရဝဏ်ကြယ်မင်း)",
      raHours: 19.8464,
      decDeg: 8.8683,
      mag: 0.77,
      spectralType: "A7V",
      color: "#E2EBFF"
    },
    stars: [
      { id: "shr-1", name: "Altair (α Aql)", burmeseName: "အယ်လ်တဲယား", raHours: 19.8464, decDeg: 8.8683, mag: 0.77, color: "#E2EBFF" },
      { id: "shr-2", name: "Tarazed (γ Aql)", burmeseName: "တာရာဇတ်ဒ်", raHours: 19.7708, decDeg: 10.6133, mag: 2.72, color: "#FFD993" },
      { id: "shr-3", name: "Alshain (β Aql)", burmeseName: "အယ်လ်ရှာအင်း", raHours: 19.9222, decDeg: 6.4067, mag: 3.71, color: "#FFE8BD" }
    ],
    lines: [[1, 0], [0, 2]]
  },
  {
    id: 23,
    nameMm: "ဓနသိဒ္ဓိ",
    nameEn: "Dhanishta",
    nameSa: "Dhaniṣṭhā",
    zodiacMm: "မကာရ / ကုမ်",
    zodiacEn: "Capricorn / Aquarius",
    spanStartDeg: 293.3333,
    spanEndDeg: 306.6667,
    shapeMm: "စည်သဏ္ဌာန် / လင်းပိုင်သဏ္ဌာန်",
    shapeEn: "Musical Drum / Delphinus Diamond",
    starCount: 4,
    deityMm: "အဌဝသု (ဝသုနတ် ၈ ပါး)",
    planetRulerMm: "အင်္ဂါ (Mars)",
    symbolMm: "စည်မောင်း / တူရိယာ",
    descriptionMm: "လင်းပိုင်ကြယ်စု (Delphinus) ၏ စိန်တုံးသဏ္ဌာန် စည်ပုံစံဖြစ်သည်။ ဂီတအနုပညာ၊ စည်းစိမ်ဥစ္စာ ကြွယ်ဝမှုနှင့် စည်းလုံးညီညွတ်မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "The diamond asterism of Delphinus the dolphin. Associated with rhythmic music, celebration, abundant wealth, and community harmony.",
    primaryStar: {
      id: "dha-1",
      name: "Rotanev (β Delphini)",
      burmeseName: "ရိုတာနက်ဗ်",
      raHours: 20.6264,
      decDeg: 14.5953,
      mag: 3.63,
      spectralType: "F5III",
      color: "#F6F9FF"
    },
    stars: [
      { id: "dha-1", name: "Rotanev (β Del)", burmeseName: "ရိုတာနက်ဗ်", raHours: 20.6264, decDeg: 14.5953, mag: 3.63, color: "#F6F9FF" },
      { id: "dha-2", name: "Sualocin (α Del)", burmeseName: "ဆွာလိုဆင်", raHours: 20.6608, decDeg: 15.9119, mag: 3.77, color: "#D1E2FF" },
      { id: "dha-3", name: "Gamma 2 Delphini", burmeseName: "ဂါမာ ဒယ်လ်ဖီနီ", raHours: 20.7772, decDeg: 16.1242, mag: 4.27, color: "#FFE4A6" },
      { id: "dha-4", name: "Delta Delphini", burmeseName: "ဒယ်လ်တာ ဒယ်လ်ဖီနီ", raHours: 20.7242, decDeg: 15.0783, mag: 4.43, color: "#EEF3FF" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },
  {
    id: 24,
    nameMm: "သတဘိသျှ",
    nameEn: "Shatabhisha",
    nameSa: "Śatabhiṣā",
    zodiacMm: "ကုမ်",
    zodiacEn: "Aquarius",
    spanStartDeg: 306.6667,
    spanEndDeg: 320.0,
    shapeMm: "လိပ်သဏ္ဌာန် / ပန်းခိုင်သဏ္ဌာန်",
    shapeEn: "Hundred Healers / Circle / Turtle",
    starCount: 4,
    deityMm: "ဝရုဏ (သမုဒ္ဒရာနှင့် မိုးနတ်မင်း)",
    planetRulerMm: "ရာဟု (Rahu)",
    symbolMm: "စက်ဝိုင်းကွင်း / ရေစုပ်ခွက်",
    descriptionMm: "ကုမ်ရာသီ ရေအိုးပုံသဏ္ဌာန် Sadachbia ကြယ်စုဖြစ်သည်။ ဆေးဝါးကုသစွမ်းအား ၁၀၀၊ လျှို့ဝှက်နက်နဲမှုနှင့် အာကာသကျယ်ပြောမှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Centered on Sadachbia (γ Aquarii) in the water urn. Represents '100 physicians', esoteric healing, oceans, and cosmic mysteries.",
    primaryStar: {
      id: "sha-1",
      name: "Sadachbia (γ Aquarii)",
      burmeseName: "ဆာဒက်ချ်ဘီယာ",
      raHours: 22.3608,
      decDeg: -1.3872,
      mag: 3.84,
      spectralType: "A0V",
      color: "#E5EEFF"
    },
    stars: [
      { id: "sha-1", name: "Sadachbia (γ Aqr)", burmeseName: "ဆာဒက်ချ်ဘီယာ", raHours: 22.3608, decDeg: -1.3872, mag: 3.84, color: "#E5EEFF" },
      { id: "sha-2", name: "Pi Aquarii", burmeseName: "ပိုင် အေကွာရီ", raHours: 22.4214, decDeg: 1.3775, mag: 4.66, color: "#B8D0FF" },
      { id: "sha-3", name: "Zeta 1 Aquarii", burmeseName: "ဇီတာ အေကွာရီ", raHours: 22.4806, decDeg: -0.0200, mag: 4.42, color: "#FAF6FF" },
      { id: "sha-4", name: "Eta Aquarii", burmeseName: "အီတာ အေကွာရီ", raHours: 22.5892, decDeg: 0.1192, mag: 4.04, color: "#B9D1FF" }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]]
  },
  {
    id: 25,
    nameMm: "ပြုဗ္ဗာဘဒြပိုဒ်",
    nameEn: "Purva Bhadrapada",
    nameSa: "Pūrva Bhādrapadā",
    zodiacMm: "ကုမ် / မိန်",
    zodiacEn: "Aquarius / Pisces",
    spanStartDeg: 320.0,
    spanEndDeg: 333.3333,
    shapeMm: "မြင်းခြေသဏ္ဌာန် / ဖိုခနောက်",
    shapeEn: "Front Legs of Pegasus / Winged Horse",
    starCount: 2,
    deityMm: "အဇဧကပါဒ (တစ်ချောင်းထောက် မိုးကြိုးနတ်)",
    planetRulerMm: "ကြာသပတေး (Jupiter)",
    symbolMm: "ဓားနှစ်လက် / သလွန်ရှေ့ပိုင်း",
    descriptionMm: "ပီဂါဆပ်စ် (Pegasus) စတုရန်းကြီး၏ အနောက်ဘက်စွန်း Markab နှင့် Scheat ကြယ်နှစ်စင်းဖြစ်သည်။ ဝိညာဉ်ရေးရာ အပြောင်းအလဲနှင့် လေးနက်သော သစ္စာတရားကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Comprising Markab and Scheat on the western side of the Great Square of Pegasus. Represents fierce spiritual aspiration and transformative sacrifice.",
    primaryStar: {
      id: "pbh-1",
      name: "Markab (α Pegasi)",
      burmeseName: "မာကပ်ဘ် (ပြုဗ္ဗာဘဒြပိုဒ်)",
      raHours: 23.0792,
      decDeg: 15.2053,
      mag: 2.49,
      spectralType: "B9III",
      color: "#CEDEFF"
    },
    stars: [
      { id: "pbh-1", name: "Markab (α Peg)", burmeseName: "မာကပ်ဘ်", raHours: 23.0792, decDeg: 15.2053, mag: 2.49, color: "#CEDEFF" },
      { id: "pbh-2", name: "Scheat (β Peg)", burmeseName: "ရှီးယက်တ်", raHours: 23.0661, decDeg: 28.0828, mag: 2.42, color: "#FF8C5A" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 26,
    nameMm: "ဥတ္တရာဘဒြပိုဒ်",
    nameEn: "Uttara Bhadrapada",
    nameSa: "Uttara Bhādrapadā",
    zodiacMm: "မိန်",
    zodiacEn: "Pisces",
    spanStartDeg: 333.3333,
    spanEndDeg: 346.6667,
    shapeMm: "ဖောင်သဏ္ဌာန် / သလွန်သဏ္ဌာန်",
    shapeEn: "Raft / Back Legs of Pegasus",
    starCount: 2,
    deityMm: "အဟိရ်ဗုဓ်နျ (သမုဒ္ဒရာကြမ်းပြင် နဂါးနတ်)",
    planetRulerMm: "စနေ (Saturn)",
    symbolMm: "ဖောင် / နတ်ကုတင်",
    descriptionMm: "ပီဂါဆပ်စ် စတုရန်း အရှေ့ဘက်စွန်း Algenib နှင့် အန်ဒရိုမီဒါ Alpheratz ကြယ်တို့ဖြစ်သည်။ နက်နဲသော တရားရှုမှတ်မှု၊ မေတ္တာကရုဏာနှင့် အေးချမ်းတည်ငြိမ်မှုကို ကိုယ်စားပြုသည်။",
    descriptionEn: "Formed by Algenib (γ Peg) and Alpheratz (α And) on the eastern boundary. Signifies deep meditation, ocean depths, compassion, and serene restraint.",
    primaryStar: {
      id: "ubh-1",
      name: "Alpheratz (α Andromedae)",
      burmeseName: "အယ်လ်ဖရက်ဇ်",
      raHours: 0.1397,
      decDeg: 29.0906,
      mag: 2.06,
      spectralType: "B8IV-VHgMn",
      color: "#C5DAFF"
    },
    stars: [
      { id: "ubh-1", name: "Alpheratz (α And)", burmeseName: "အယ်လ်ဖရက်ဇ်", raHours: 0.1397, decDeg: 29.0906, mag: 2.06, color: "#C5DAFF" },
      { id: "ubh-2", name: "Algenib (γ Peg)", burmeseName: "အယ်လ်ဂျီးနစ်ဘ်", raHours: 0.2206, decDeg: 15.1836, mag: 2.83, color: "#BED3FF" }
    ],
    lines: [[0, 1]]
  },
  {
    id: 27,
    nameMm: "ရေဝတီ",
    nameEn: "Revati",
    nameSa: "Revatī",
    zodiacMm: "မိန်",
    zodiacEn: "Pisces",
    spanStartDeg: 346.6667,
    spanEndDeg: 360.0,
    shapeMm: "ငါးသဏ္ဌာန် / ဗုံသဏ္ဌာန်",
    shapeEn: "Fish / Drum",
    starCount: 3,
    deityMm: "ပူသျှန် (ခရီးသွားတို့ကို စောင့်ရှောက်သောနတ်)",
    planetRulerMm: "ဗုဒ္ဓဟူး (Mercury)",
    symbolMm: "ငါးနှစ်ကောင် / ခရီးသည်တောင်ဝှေး",
    descriptionMm: "နက္ခတ် ၂၇ လုံး၏ နောက်ဆုံး နက္ခတ်ဖြစ်ပြီး မိန်ရာသီ ငါးကြယ်စုတွင် တည်ရှိသည်။ အဆုံးစွန်သော လွတ်မြောက်မှု (မောက္ခ)၊ ခရီးစဉ်အောင်မြင်ခြင်းနှင့် ကြွယ်ဝချမ်းသာခြင်းကို ဖော်ဆောင်သည်။",
    descriptionEn: "The 27th and concluding Nakshatra in Pisces, marked by Zeta Piscium. Symbolizes spiritual culmination, safe voyage, guidance, and ultimate liberation.",
    primaryStar: {
      id: "rev-1",
      name: "Zeta Piscium (Revati)",
      burmeseName: "ဇီတာ ပိုင်စီယမ် (ရေဝတီမင်းကြယ်)",
      raHours: 1.2289,
      decDeg: 7.5753,
      mag: 5.21,
      spectralType: "A7IV",
      color: "#EBF1FF"
    },
    stars: [
      { id: "rev-1", name: "Zeta Piscium", burmeseName: "ဇီတာ ပိုင်စီယမ်", raHours: 1.2289, decDeg: 7.5753, mag: 5.21, color: "#EBF1FF" },
      { id: "rev-2", name: "Epsilon Piscium", burmeseName: "အက်ပစီလွန် ပိုင်စီယမ်", raHours: 1.0494, decDeg: 7.8900, mag: 4.28, color: "#FFE39F" },
      { id: "rev-3", name: "Delta Piscium", burmeseName: "ဒယ်လ်တာ ပိုင်စီယမ်", raHours: 0.8119, decDeg: 7.5850, mag: 4.43, color: "#FFE29C" }
    ],
    lines: [[2, 1], [1, 0]]
  }
];

export const BURMESE_ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: 1,
    nameMm: "မိဿ",
    nameEn: "Aries",
    symbol: "♈",
    startDeg: 0,
    endDeg: 30,
    rulingPlanetMm: "အင်္ဂါ (Mars)",
    elementMm: "တေဇော (မီးဓာတ်)",
    descriptionMm: "သိုးထီးသဏ္ဌာန်၊ ရဲရင့်တက်ကြွခြင်း၊ ရှေ့ဆောင်ဦးစီးလိုစိတ်"
  },
  {
    id: 2,
    nameMm: "ပြိဿ",
    nameEn: "Taurus",
    symbol: "♉",
    startDeg: 30,
    endDeg: 60,
    rulingPlanetMm: "သောကြာ (Venus)",
    elementMm: "ပထဝီ (မြေဓာတ်)",
    descriptionMm: "နွားသိုးသဏ္ဌာန်၊ တည်ငြိမ်ခိုင်ခံ့ခြင်း၊ စည်းစိမ်ဥစ္စာ ကြွယ်ဝမှု"
  },
  {
    id: 3,
    nameMm: "မေထုန်",
    nameEn: "Gemini",
    symbol: "♊",
    startDeg: 60,
    endDeg: 90,
    rulingPlanetMm: "ဗုဒ္ဓဟူး (Mercury)",
    elementMm: "ဝါယော (လေဓာတ်)",
    descriptionMm: "မောင်နှံစုံသဏ္ဌာန်၊ ဉာဏ်ရည်ထက်မြက်ခြင်း၊ ဆက်သွယ်ပေါင်းသင်းမှု"
  },
  {
    id: 4,
    nameMm: "ကရကဋ်",
    nameEn: "Cancer",
    symbol: "♋",
    startDeg: 90,
    endDeg: 120,
    rulingPlanetMm: "တနင်္လာ (Moon)",
    elementMm: "အာပေါ (ရေဓာတ်)",
    descriptionMm: "ပုစွန် / ပုစွန်တုပ်သဏ္ဌာန်၊ ကြင်နာနွေးထွေးခြင်း၊ မိသားစုချစ်ခင်မှု"
  },
  {
    id: 5,
    nameMm: "သိဟ်",
    nameEn: "Leo",
    symbol: "♌",
    startDeg: 120,
    endDeg: 150,
    rulingPlanetMm: "တနင်္ဂနွေ (Sun)",
    elementMm: "တေဇော (မီးဓာတ်)",
    descriptionMm: "ခြင်္သေ့သဏ္ဌာန်၊ ခေါင်းဆောင်မှု၊ ဂုဏ်သိက္ခာနှင့် အာဏာ"
  },
  {
    id: 6,
    nameMm: "ကန်",
    nameEn: "Virgo",
    symbol: "♍",
    startDeg: 150,
    endDeg: 180,
    rulingPlanetMm: "ဗုဒ္ဓဟူး (Mercury)",
    elementMm: "ပထဝီ (မြေဓာတ်)",
    descriptionMm: "အပျိုစင်သဏ္ဌာန်၊ သပ်ရပ်စေ့စပ်ခြင်း၊ ခွဲခြမ်းစိတ်ဖြာတတ်မှု"
  },
  {
    id: 7,
    nameMm: "တူ",
    nameEn: "Libra",
    symbol: "♎",
    startDeg: 180,
    endDeg: 210,
    rulingPlanetMm: "သောကြာ (Venus)",
    elementMm: "ဝါယော (လေဓာတ်)",
    descriptionMm: "ချိန်ခွင်သဏ္ဌာန်၊ တရားမျှတခြင်း၊ ဟန်ချက်ညီမှုနှင့် အနုပညာ"
  },
  {
    id: 8,
    nameMm: "ဗြိစ္ဆာ",
    nameEn: "Scorpio",
    symbol: "♏",
    startDeg: 210,
    endDeg: 240,
    rulingPlanetMm: "အင်္ဂါ (Mars)",
    elementMm: "အာပေါ (ရေဓာတ်)",
    descriptionMm: "ကင်းမြီးကောက်သဏ္ဌာန်၊ လျှို့ဝှက်နက်နဲခြင်း၊ စိတ်ဓာတ်ပြင်းပြမှု"
  },
  {
    id: 9,
    nameMm: "ဓနု",
    nameEn: "Sagittarius",
    symbol: "♐",
    startDeg: 240,
    endDeg: 270,
    rulingPlanetMm: "ကြာသပတေး (Jupiter)",
    elementMm: "တေဇော (မီးဓာတ်)",
    descriptionMm: "လေးကိုင်လူသဏ္ဌာန်၊ အမှန်တရားမြတ်နိုးခြင်း၊ ခရီးရှည်သွားလာမှု"
  },
  {
    id: 10,
    nameMm: "မကာရ",
    nameEn: "Capricorn",
    symbol: "♑",
    startDeg: 270,
    endDeg: 300,
    rulingPlanetMm: "စနေ (Saturn)",
    elementMm: "ပထဝီ (မြေဓာတ်)",
    descriptionMm: "မကန်း / ဆိတ်ငါးသဏ္ဌာန်၊ စိတ်ရှည်ဇွဲရှိခြင်း၊ ရည်မှန်းချက်ကြီးမားမှု"
  },
  {
    id: 11,
    nameMm: "ကုမ်",
    nameEn: "Aquarius",
    symbol: "♒",
    startDeg: 300,
    endDeg: 330,
    rulingPlanetMm: "စနေ (Saturn)",
    elementMm: "ဝါယော (လေဓာတ်)",
    descriptionMm: "ရေအိုးကိုင်လူသဏ္ဌာန်၊ လူသားအကျိုးပြုခြင်း၊ ဆန်းသစ်တီထွင်မှု"
  },
  {
    id: 12,
    nameMm: "မိန်",
    nameEn: "Pisces",
    symbol: "♓",
    startDeg: 330,
    endDeg: 360,
    rulingPlanetMm: "ကြာသပတေး (Jupiter)",
    elementMm: "အာပေါ (ရေဓာတ်)",
    descriptionMm: "ငါးနှစ်ကောင်သဏ္ဌာန်၊ မေတ္တာကရုဏာ၊ စိတ်ကူးဉာဏ်နှင့် လွတ်မြောက်မှု"
  }
];

export const MAJOR_NAVIGATIONAL_STARS: CelestialStar[] = [
  {
    id: "nav-sirius",
    name: "Sirius (α CMa)",
    burmeseName: "သုဝဏ္ဏကြယ် (ခွေးကြယ်ကြီး)",
    raHours: 6.7525,
    decDeg: -16.7161,
    mag: -1.46,
    spectralType: "A1V",
    color: "#DAE8FF"
  },
  {
    id: "nav-canopus",
    name: "Canopus (α Car)",
    burmeseName: "ကနိုပပ်စ် (လှေဦးကြယ်)",
    raHours: 6.3992,
    decDeg: -52.6958,
    mag: -0.74,
    spectralType: "F0II",
    color: "#F6F8FF"
  },
  {
    id: "nav-rigel",
    name: "Rigel (β Ori)",
    burmeseName: "ရီဂျယ် (မုဆိုးခြေထောက်ကြယ်)",
    raHours: 5.2422,
    decDeg: -8.2017,
    mag: 0.13,
    spectralType: "B8Ia",
    color: "#BBD5FF"
  },
  {
    id: "nav-vega",
    name: "Vega (α Lyr)",
    burmeseName: "ဗီဂါ (စောင်းကြယ်မင်း)",
    raHours: 18.6156,
    decDeg: 38.7836,
    mag: 0.03,
    spectralType: "A0Va",
    color: "#DDE9FF"
  },
  {
    id: "nav-capella",
    name: "Capella (α Aur)",
    burmeseName: "ကာပယ်လာ (ရထားထိန်းကြယ်)",
    raHours: 5.2781,
    decDeg: 45.9981,
    mag: 0.08,
    spectralType: "G3III",
    color: "#FFE9B3"
  },
  {
    id: "nav-polaris",
    name: "Polaris (α UMi)",
    burmeseName: "ဓူဝံကြယ် (မြောက်ကြယ်)",
    raHours: 2.5303,
    decDeg: 89.2642,
    mag: 1.98,
    spectralType: "F7Ib",
    color: "#FFF5E3"
  },
  {
    id: "nav-procyon",
    name: "Procyon (α CMi)",
    burmeseName: "ပရိုစီယွန် (ခွေးငယ်ကြယ်)",
    raHours: 7.6528,
    decDeg: 5.2250,
    mag: 0.38,
    spectralType: "F5IV-V",
    color: "#FFF3DC"
  },
  {
    id: "nav-achernar",
    name: "Achernar (α Eri)",
    burmeseName: "အာခါနာ (မြစ်စွန်းကြယ်)",
    raHours: 1.6286,
    decDeg: -57.2367,
    mag: 0.46,
    spectralType: "B6Vep",
    color: "#BDD5FF"
  },
  {
    id: "nav-acrux",
    name: "Acrux (α Cru)",
    burmeseName: "တောင်ဘက်ကြက်ခြေခတ်ကြယ်",
    raHours: 12.4433,
    decDeg: -63.0992,
    mag: 0.77,
    spectralType: "B0.5IV",
    color: "#A8C4FF"
  },
  {
    id: "nav-deneb",
    name: "Deneb (α Cyg)",
    burmeseName: "ဒယ်နက်ဘ် (ငန်းမြီးကြယ်)",
    raHours: 20.6903,
    decDeg: 45.2803,
    mag: 1.25,
    spectralType: "A2Ia",
    color: "#E2ECFF"
  },
  {
    id: "nav-fomalhaut",
    name: "Fomalhaut (α PsA)",
    burmeseName: "ဖိုမဲလ်ဟော့ (တောင်ငါးပါးစပ်ကြယ်)",
    raHours: 22.9608,
    decDeg: -29.6222,
    mag: 1.17,
    spectralType: "A3V",
    color: "#EAF0FF"
  }
];
