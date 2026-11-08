// NakshatraMM — Real-Time Astronomical Math & Burmese Ephemeris Engine
import { BURMESE_NAKSHATRAS, BURMESE_ZODIAC_SIGNS } from '@/data/nakshatras';
import type { Nakshatra, ZodiacSign } from '@/data/nakshatras';

export interface ObserverLocation {
  nameMm: string;
  nameEn: string;
  latitude: number;  // degrees North (+), South (-)
  longitude: number; // degrees East (+), West (-)
  elevation: number; // meters
}

export const MYANMAR_CITIES: ObserverLocation[] = [
  { nameMm: "ရန်ကုန်", nameEn: "Yangon", latitude: 16.8661, longitude: 96.1951, elevation: 15 },
  { nameMm: "မန္တလေး", nameEn: "Mandalay", latitude: 21.9588, longitude: 96.0891, elevation: 76 },
  { nameMm: "ပုဂံ", nameEn: "Bagan", latitude: 21.1717, longitude: 94.8585, elevation: 60 },
  { nameMm: "ကလော", nameEn: "Kalaw", latitude: 20.6272, longitude: 96.5645, elevation: 1320 },
  { nameMm: "တောင်ကြီး", nameEn: "Taunggyi", latitude: 20.7888, longitude: 97.0336, elevation: 1436 },
  { nameMm: "နေပြည်တော်", nameEn: "Naypyidaw", latitude: 19.7633, longitude: 96.0785, elevation: 115 },
  { nameMm: "မော်လမြိုင်", nameEn: "Mawlamyine", latitude: 16.4905, longitude: 97.6283, elevation: 20 },
  { nameMm: "စစ်တွေ", nameEn: "Sittwe", latitude: 20.1462, longitude: 92.8983, elevation: 5 },
  { nameMm: "ပြင်ဦးလွင်", nameEn: "Pyin Oo Lwin", latitude: 19.8563, longitude: 96.4868, elevation: 1070 }
];

export interface HorizontalCoord {
  altitude: number; // degrees -90 to +90
  azimuth: number;  // degrees 0 to 360 (0=North, 90=East, 180=South, 270=West)
  isAboveHorizon: boolean;
}

export interface EquatorialCoord {
  raHours: number; // 0 to 24h
  decDeg: number;  // -90 to +90 deg
  distanceAu?: number;
}

export interface PlanetData {
  id: string;
  nameMm: string;
  nameEn: string;
  symbol: string;
  color: string;
  horizontal: HorizontalCoord;
  equatorial: EquatorialCoord;
  magnitude: number;
  siderealLongitudeDeg: number;
  currentNakshatra: Nakshatra;
  currentZodiac: ZodiacSign;
  infoMm: string;
}

export interface MoonTransitInfo {
  nakshatra: Nakshatra;
  pada: number; // 1, 2, 3, or 4 (each 3° 20')
  progressPercent: number; // 0% to 100% through the Nakshatra
  siderealLongitudeDeg: number;
  tropicalLongitudeDeg: number;
  ayanamsaDeg: number;
  phaseNameMm: string;
  phaseNameEn: string;
  illuminationPercent: number;
  moonAgeDays: number;
  tithiNumber: number; // 1 to 30
  tithiNameMm: string;
}

// -------------------------------------------------------------
// FUNDAMENTAL TIME & JULIAN DATE CALCULATIONS
// -------------------------------------------------------------

export function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function julianCenturiesSinceJ2000(date: Date): number {
  const jd = toJulianDate(date);
  return (jd - 2451545.0) / 36525.0;
}

/**
 * High-precision Lahiri Ayanamsa (Chitra Paksha)
 * Formula based on Indian Astronomical Ephemeris standard:
 * At J2000.0 (2000-01-01 12:00 UTC), Ayanamsa = 23° 51' 11" ~ 23.853056°
 * Rate of precession = ~50.29 arcseconds per tropical year.
 */
export function calculateLahiriAyanamsa(date: Date): number {
  const t = julianCenturiesSinceJ2000(date);
  // Ayanamsa in degrees
  const ayanamsa = 23.853056 + 1.39697 * t + 0.000308 * t * t;
  return ayanamsa;
}

/**
 * Greenwich Mean Sidereal Time in degrees (0 to 360)
 */
export function calculateGMST(date: Date): number {
  const jd = toJulianDate(date);
  const d = jd - 2451545.0;
  // GMST in degrees
  let gmst = 280.46061837 + 360.98564736629 * d;
  gmst = ((gmst % 360) + 360) % 360;
  return gmst;
}

/**
 * Local Sidereal Time in degrees for given longitude
 */
export function calculateLST(date: Date, longitudeDeg: number): number {
  const gmst = calculateGMST(date);
  let lst = gmst + longitudeDeg;
  lst = ((lst % 360) + 360) % 360;
  return lst;
}

// -------------------------------------------------------------
// COORDINATE TRANSFORMATION: RA/DEC -> ALT/AZ
// -------------------------------------------------------------

export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  date: Date,
  observer: ObserverLocation
): HorizontalCoord {
  const lstDeg = calculateLST(date, observer.longitude);
  const raDeg = raHours * 15.0;

  // Local Hour Angle in degrees
  let lhaDeg = lstDeg - raDeg;
  lhaDeg = ((lhaDeg % 360) + 360) % 360;

  const latRad = (observer.latitude * Math.PI) / 180.0;
  const decRad = (decDeg * Math.PI) / 180.0;
  const lhaRad = (lhaDeg * Math.PI) / 180.0;

  // Altitude: sin(alt) = sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(LHA)
  const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad);
  const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const altDeg = (altRad * 180.0) / Math.PI;

  // Azimuth: cos(az) = (sin(dec) - sin(lat)*sin(alt)) / (cos(lat)*cos(alt))
  const cosAlt = Math.cos(altRad);
  let azDeg = 0;

  if (Math.abs(cosAlt) > 1e-6) {
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * cosAlt);
    const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
    const az = (Math.acos(clampedCosAz) * 180.0) / Math.PI;

    // If sin(LHA) > 0, the body is in the west, azimuth = 360 - az
    if (Math.sin(lhaRad) > 0) {
      azDeg = 360.0 - az;
    } else {
      azDeg = az;
    }
  }

  return {
    altitude: altDeg,
    azimuth: ((azDeg % 360) + 360) % 360,
    isAboveHorizon: altDeg > 0
  };
}

// -------------------------------------------------------------
// STEREOGRAPHIC PROJECTION FORMULA
// -------------------------------------------------------------

/**
 * Stereographic projection:
 * Radial distance r = R * cos(alt) / (1 + sin(alt))
 * Center (cx, cy) is zenith (alt = +90°, r = 0).
 * Radius R is the horizon (alt = 0°, r = R).
 * Below horizon (alt < 0°): r > R.
 *
 * Canvas orientation:
 * Azimuth: 0° = North (up), 90° = East (left on astronomical sky map), 180° = South (down), 270° = West (right)
 * When looking UP at the sky with North ahead: East is to your left!
 */
export function stereographicProject(
  altitudeDeg: number,
  azimuthDeg: number,
  domeRadius: number,
  cx: number,
  cy: number,
  rotationOffsetDeg: number = 0,
  flipEastWest: boolean = true // Celestial convention: East is left
): { x: number; y: number; r: number; visible: boolean } {
  const altRad = (altitudeDeg * Math.PI) / 180.0;
  const sinAlt = Math.sin(altRad);
  const cosAlt = Math.cos(altRad);

  // Avoid division by zero at nadir (-90°)
  const denom = Math.max(0.001, 1.0 + sinAlt);
  const r = (domeRadius * cosAlt) / denom;

  // Azimuth adjusted for user orientation rotation
  const az = ((azimuthDeg + rotationOffsetDeg) % 360 + 360) % 360;
  const azRad = (az * Math.PI) / 180.0;

  // When flipEastWest is true (standard astronomical sky dome looking up):
  // 0° North is (cx, cy - r)
  // 90° East is (cx - r, cy)
  // 180° South is (cx, cy + r)
  // 270° West is (cx + r, cy)
  let x = cx;
  let y = cy;

  if (flipEastWest) {
    x = cx - r * Math.sin(azRad);
    y = cy - r * Math.cos(azRad);
  } else {
    x = cx + r * Math.sin(azRad);
    y = cy - r * Math.cos(azRad);
  }

  return {
    x,
    y,
    r,
    visible: altitudeDeg >= -15 // Visible or slightly below horizon
  };
}

// -------------------------------------------------------------
// SOLAR & LUNAR EPHEMERIS (TROPICAL & SIDEREAL)
// -------------------------------------------------------------

export function calculateSunPosition(date: Date): {
  raHours: number;
  decDeg: number;
  tropicalLonDeg: number;
  siderealLonDeg: number;
  distanceAu: number;
} {
  const t = julianCenturiesSinceJ2000(date);
  // Mean longitude of the Sun
  let l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  l0 = ((l0 % 360) + 360) % 360;

  // Mean anomaly of the Sun
  let m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  m = ((m % 360) + 360) % 360;
  const mRad = (m * Math.PI) / 180.0;

  // Sun's equation of the center
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mRad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * mRad) +
    0.000289 * Math.sin(3 * mRad);

  // True solar longitude
  let sunLon = l0 + c;
  sunLon = ((sunLon % 360) + 360) % 360;

  // Mean obliquity of ecliptic
  const eps0 = 23.4392911 - 0.013004167 * t - 0.000000164 * t * t + 0.0000005036 * t * t * t;
  const epsRad = (eps0 * Math.PI) / 180.0;
  const sunLonRad = (sunLon * Math.PI) / 180.0;

  // Equatorial coordinates (RA, Dec)
  const sinDec = Math.sin(epsRad) * Math.sin(sunLonRad);
  const decRad = Math.asin(sinDec);
  const decDeg = (decRad * 180.0) / Math.PI;

  const y = Math.cos(epsRad) * Math.sin(sunLonRad);
  const x = Math.cos(sunLonRad);
  const raRad = Math.atan2(y, x);
  const raDeg = ((raRad * 180.0) / Math.PI + 360) % 360;
  const raHours = raDeg / 15.0;

  // Sidereal longitude using Lahiri Ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(date);
  const siderealLonDeg = ((sunLon - ayanamsa + 360) % 360);

  // Approximate distance in AU
  const e = 0.016708634 - 0.000042037 * t;
  const v = m + c;
  const vRad = (v * Math.PI) / 180.0;
  const r = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(vRad));

  return {
    raHours,
    decDeg,
    tropicalLonDeg: sunLon,
    siderealLonDeg,
    distanceAu: r
  };
}

export function calculateMoonPosition(date: Date): {
  raHours: number;
  decDeg: number;
  tropicalLonDeg: number;
  siderealLonDeg: number;
  distanceKm: number;
} {
  const t = julianCenturiesSinceJ2000(date);

  // Moon's mean longitude
  let lPrime = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;
  lPrime = ((lPrime % 360) + 360) % 360;

  // Moon's mean elongation
  let d = 297.8501921 + 445267.1114034 * t - 0.0018819 * t * t;
  d = ((d % 360) + 360) % 360;

  // Sun's mean anomaly
  let m = 357.5291092 + 35999.0502909 * t - 0.0001536 * t * t;
  m = ((m % 360) + 360) % 360;

  // Moon's mean anomaly
  let mPrime = 134.9633964 + 477198.8675055 * t + 0.0087414 * t * t;
  mPrime = ((mPrime % 360) + 360) % 360;

  // Moon's argument of latitude
  let f = 93.272095 + 483202.0175233 * t - 0.0036539 * t * t;
  f = ((f % 360) + 360) % 360;

  const dRad = (d * Math.PI) / 180.0;
  const mRad = (m * Math.PI) / 180.0;
  const mpRad = (mPrime * Math.PI) / 180.0;
  const fRad = (f * Math.PI) / 180.0;

  // Major periodic terms for lunar longitude
  const deltaLon =
    6.288774 * Math.sin(mpRad) +
    1.274027 * Math.sin(2 * dRad - mpRad) +
    0.658314 * Math.sin(2 * dRad) +
    0.213618 * Math.sin(2 * mpRad) -
    0.185116 * Math.sin(mRad) -
    0.114332 * Math.sin(2 * fRad) +
    0.058793 * Math.sin(2 * dRad - 2 * mpRad) +
    0.057066 * Math.sin(2 * dRad - mRad - mpRad) +
    0.053322 * Math.sin(2 * dRad + mpRad) +
    0.045758 * Math.sin(2 * dRad - mRad);

  let moonLon = lPrime + deltaLon;
  moonLon = ((moonLon % 360) + 360) % 360;

  // Major periodic terms for lunar latitude
  const deltaLat =
    5.128154 * Math.sin(fRad) +
    0.280606 * Math.sin(mpRad + fRad) +
    0.277693 * Math.sin(mpRad - fRad) +
    0.173237 * Math.sin(2 * dRad - fRad) +
    0.055413 * Math.sin(2 * dRad - mpRad + fRad) +
    0.046271 * Math.sin(2 * dRad - mpRad - fRad);

  const moonLatRad = (deltaLat * Math.PI) / 180.0;
  const moonLonRad = (moonLon * Math.PI) / 180.0;

  // Obliquity of ecliptic
  const eps0 = 23.4392911 - 0.013004167 * t;
  const epsRad = (eps0 * Math.PI) / 180.0;

  // Convert to Equatorial coordinates (RA, Dec)
  const sinDec =
    Math.sin(moonLatRad) * Math.cos(epsRad) +
    Math.cos(moonLatRad) * Math.sin(epsRad) * Math.sin(moonLonRad);
  const decRad = Math.asin(sinDec);
  const decDeg = (decRad * 180.0) / Math.PI;

  const y =
    Math.sin(moonLonRad) * Math.cos(epsRad) -
    Math.tan(moonLatRad) * Math.sin(epsRad);
  const x = Math.cos(moonLonRad);
  const raRad = Math.atan2(y, x);
  const raDeg = ((raRad * 180.0) / Math.PI + 360) % 360;
  const raHours = raDeg / 15.0;

  // Sidereal Longitude using Lahiri Ayanamsa
  const ayanamsa = calculateLahiriAyanamsa(date);
  const siderealLonDeg = ((moonLon - ayanamsa + 360) % 360);

  // Mean distance in km
  const distanceKm = 385000 - 20905 * Math.cos(mpRad) - 3699 * Math.cos(2 * dRad - mpRad);

  return {
    raHours,
    decDeg,
    tropicalLonDeg: moonLon,
    siderealLonDeg,
    distanceKm
  };
}

// -------------------------------------------------------------
// BURMESE NAKSHATRA & ZODIAC ALIGNMENT (စန်းယှဉ်နက္ခတ်)
// -------------------------------------------------------------

export function getNakshatraFromSiderealLon(siderealDeg: number): {
  nakshatra: Nakshatra;
  pada: number;
  progressPercent: number;
} {
  const normDeg = ((siderealDeg % 360) + 360) % 360;
  const nakshatraSpan = 360.0 / 27.0; // 13° 20' = 13.333333°
  const index = Math.min(26, Math.floor(normDeg / nakshatraSpan));

  const nakshatra = BURMESE_NAKSHATRAS[index];
  const offsetWithin = normDeg - index * nakshatraSpan;
  const progressPercent = Math.min(100, Math.max(0, (offsetWithin / nakshatraSpan) * 100));

  // Pada (ပါဒ် ၁, ၂, ၃, ၄ - each 3° 20' = 3.333333°)
  const padaSpan = nakshatraSpan / 4.0;
  const pada = Math.min(4, Math.floor(offsetWithin / padaSpan) + 1);

  return {
    nakshatra,
    pada,
    progressPercent
  };
}

export function getZodiacFromSiderealLon(siderealDeg: number): ZodiacSign {
  const normDeg = ((siderealDeg % 360) + 360) % 360;
  const index = Math.min(11, Math.floor(normDeg / 30.0));
  return BURMESE_ZODIAC_SIGNS[index];
}

/**
 * Calculates real-time Burmese Moon transit information (စန်းယှဉ်နက္ခတ်)
 */
export function calculateBurmeseMoonTransit(date: Date): MoonTransitInfo {
  const moon = calculateMoonPosition(date);
  const sun = calculateSunPosition(date);
  const ayanamsa = calculateLahiriAyanamsa(date);

  const { nakshatra, pada, progressPercent } = getNakshatraFromSiderealLon(moon.siderealLonDeg);

  // Elongation: Moon tropical longitude - Sun tropical longitude
  const elongation = ((moon.tropicalLonDeg - sun.tropicalLonDeg) % 360 + 360) % 360;

  // Illumination fraction
  const phaseAngle = Math.PI - (elongation * Math.PI) / 180.0;
  const illuminationPercent = Math.round(((1 + Math.cos(phaseAngle)) / 2.0) * 100);

  // Moon age in days (Synodic month ~ 29.530588 days)
  const moonAgeDays = (elongation / 360.0) * 29.530588;

  // Tithi calculation (each 12 degrees of elongation = 1 Tithi)
  const tithiIndex = Math.min(29, Math.floor(elongation / 12.0)); // 0 to 29
  const tithiNumber = tithiIndex + 1;

  let phaseNameMm = "";
  let phaseNameEn = "";
  let tithiNameMm = "";

  if (tithiNumber === 15) {
    phaseNameMm = "လပြည့် (Purnima)";
    phaseNameEn = "Full Moon";
    tithiNameMm = "လပြည့်နေ့ (သုက္ကပက္ခ ၁၅ ရက်)";
  } else if (tithiNumber === 30 || tithiNumber === 1) {
    phaseNameMm = "လကွယ် (Amavasya)";
    phaseNameEn = "New Moon";
    tithiNameMm = tithiNumber === 30 ? "လကွယ်နေ့ (ကဏှပက္ခ ၁၅ ရက်)" : "လဆန်း ၁ ရက်";
  } else if (tithiNumber < 15) {
    phaseNameMm = `လဆန်း (${illuminationPercent}% အလင်း)`;
    phaseNameEn = `Waxing Crescent (${illuminationPercent}%)`;
    tithiNameMm = `လဆန်း ${tithiNumber} ရက်`;
  } else {
    const waningDay = tithiNumber - 15;
    phaseNameMm = `လဆုတ် (${illuminationPercent}% အလင်း)`;
    phaseNameEn = `Waning Gibbous (${illuminationPercent}%)`;
    tithiNameMm = `လဆုတ် ${waningDay} ရက်`;
  }

  return {
    nakshatra,
    pada,
    progressPercent: Math.round(progressPercent * 10) / 10,
    siderealLongitudeDeg: Math.round(moon.siderealLonDeg * 100) / 100,
    tropicalLongitudeDeg: Math.round(moon.tropicalLonDeg * 100) / 100,
    ayanamsaDeg: Math.round(ayanamsa * 100) / 100,
    phaseNameMm,
    phaseNameEn,
    illuminationPercent,
    moonAgeDays: Math.round(moonAgeDays * 10) / 10,
    tithiNumber,
    tithiNameMm
  };
}

// -------------------------------------------------------------
// PLANETARY EPHEMERIS ENGINE
// -------------------------------------------------------------

export function calculateAllPlanets(
  date: Date,
  observer: ObserverLocation
): PlanetData[] {
  const sunPos = calculateSunPosition(date);
  const moonPos = calculateMoonPosition(date);

  const sunHoriz = equatorialToHorizontal(sunPos.raHours, sunPos.decDeg, date, observer);
  const moonHoriz = equatorialToHorizontal(moonPos.raHours, moonPos.decDeg, date, observer);

  const t = julianCenturiesSinceJ2000(date);
  const ayanamsa = calculateLahiriAyanamsa(date);

  const results: PlanetData[] = [];

  // Add Sun & Moon first
  results.push({
    id: "sun",
    nameMm: "တနင်္ဂနွေ (နေမင်း)",
    nameEn: "Sun",
    symbol: "☉",
    color: "#FFD700",
    horizontal: sunHoriz,
    equatorial: { raHours: sunPos.raHours, decDeg: sunPos.decDeg, distanceAu: sunPos.distanceAu },
    magnitude: -26.7,
    siderealLongitudeDeg: sunPos.siderealLonDeg,
    currentNakshatra: getNakshatraFromSiderealLon(sunPos.siderealLonDeg).nakshatra,
    currentZodiac: getZodiacFromSiderealLon(sunPos.siderealLonDeg),
    infoMm: "သက်ရှိအားလုံး၏ စွမ်းအင်အရင်းအမြစ်၊ မြန်မာရိုးရာ နက္ခတ်ဗေဒင်တွင် ဇာတာရှင်၏ စွမ်းအားနှင့် ဩဇာတိက္ကမကို ကိုယ်စားပြုသည်။"
  });

  results.push({
    id: "moon",
    nameMm: "တနင်္လာ (စန်းလမင်း)",
    nameEn: "Moon",
    symbol: "☽",
    color: "#F0F4F8",
    horizontal: moonHoriz,
    equatorial: { raHours: moonPos.raHours, decDeg: moonPos.decDeg },
    magnitude: -12.5,
    siderealLongitudeDeg: moonPos.siderealLonDeg,
    currentNakshatra: getNakshatraFromSiderealLon(moonPos.siderealLonDeg).nakshatra,
    currentZodiac: getZodiacFromSiderealLon(moonPos.siderealLonDeg),
    infoMm: "စန်းယှဉ်နက္ခတ်နှင့် ရာသီခွင်ကို ဖြတ်သန်းသွားလာကာ စိတ်ခံစားမှု၊ မေတ္တာနှင့် ကံကြမ္မာ အတက်အကျကို ညွှန်ပြသည်။"
  });

  interface KeplerPlanet {
    id: string;
    nameMm: string;
    nameEn: string;
    symbol: string;
    color: string;
    meanLon: number;
    semiMajor: number;
    eccentricity: number;
    incDeg: number;
    magBase: number;
    infoMm: string;
  }

  const keplerPlanets: KeplerPlanet[] = [
    {
      id: "mercury",
      nameMm: "ဗုဒ္ဓဟူး (ဗုဒ္ဓဟူးဂြိုဟ်)",
      nameEn: "Mercury",
      symbol: "☿",
      color: "#B0C4DE",
      meanLon: 252.2509 + 149474.0722 * t,
      semiMajor: 0.3871,
      eccentricity: 0.2056,
      incDeg: 7.0,
      magBase: -0.4,
      infoMm: "ဉာဏ်ပညာ၊ ဆက်သွယ်ရေး၊ စာပေနှင့် ကူးသန်းရောင်းဝယ်ရေးကို စိုးမိုးသောဂြိုဟ်ဖြစ်သည်။"
    },
    {
      id: "venus",
      nameMm: "သောကြာ (သောကြာဂြိုဟ်)",
      nameEn: "Venus",
      symbol: "♀",
      color: "#FFF2CC",
      meanLon: 181.9798 + 58519.2130 * t,
      semiMajor: 0.7233,
      eccentricity: 0.0068,
      incDeg: 3.39,
      magBase: -4.4,
      infoMm: "မနက်ခင်းကြယ် (Morning Star) သို့မဟုတ် ညနေခင်းကြယ်၊ အလှအပ၊ ချစ်ခြင်းနှင့် အနုပညာ စွမ်းအားရှင်ဖြစ်သည်။"
    },
    {
      id: "mars",
      nameMm: "အင်္ဂါ (အင်္ဂါဂြိုဟ်)",
      nameEn: "Mars",
      symbol: "♂",
      color: "#FF5722",
      meanLon: 355.4330 + 19141.6964 * t,
      semiMajor: 1.5237,
      eccentricity: 0.0934,
      incDeg: 1.85,
      magBase: -1.2,
      infoMm: "နီရဲသော စစ်သည်တော်ဂြိုဟ်၊ ရဲရင့်ခြင်း၊ သတ္တိနှင့် တိုက်ပွဲဝင်စွမ်းအင်ကို ဆောင်သည်။"
    },
    {
      id: "jupiter",
      nameMm: "ကြာသပတေး (ကြာသပတေးဂြိုဟ်)",
      nameEn: "Jupiter",
      symbol: "♃",
      color: "#FFA726",
      meanLon: 34.3515 + 3036.3028 * t,
      semiMajor: 5.2026,
      eccentricity: 0.0485,
      incDeg: 1.30,
      magBase: -2.5,
      infoMm: "နတ်တို့၏ဆရာ၊ ဂြိုဟ်တို့၏ဘုရင်၊ ပညာကြီးမားခြင်း၊ ဓမ္မနှင့် ကြီးပွားချမ်းသာခြင်းကို ယူဆောင်ပေးသည်။"
    },
    {
      id: "saturn",
      nameMm: "စနေ (စနေဂြိုဟ်)",
      nameEn: "Saturn",
      symbol: "♄",
      color: "#E0B354",
      meanLon: 50.0774 + 1223.5099 * t,
      semiMajor: 9.5549,
      eccentricity: 0.0555,
      incDeg: 2.49,
      magBase: 0.2,
      infoMm: "လှပသော ကွင်းကြီးများ ပိုင်ဆိုင်သည့် ဂြိုဟ်မင်း၊ စိတ်ရှည်မှု၊ စည်းကမ်းနှင့် ဘဝသင်ခန်းစာများကို ပေးဆောင်သည်။"
    }
  ];

  // Calculate planetary geocentric coordinates
  const eps0 = 23.4392911 - 0.013004167 * t;
  const epsRad = (eps0 * Math.PI) / 180.0;
  const sunEclipticLonRad = (sunPos.tropicalLonDeg * Math.PI) / 180.0;
  const rSun = sunPos.distanceAu;
  const xSun = rSun * Math.cos(sunEclipticLonRad);
  const ySun = rSun * Math.sin(sunEclipticLonRad);

  for (const p of keplerPlanets) {
    const meanLonRad = ((p.meanLon % 360) * Math.PI) / 180.0;
    const rPlanet = p.semiMajor;

    // Heliocentric coordinates
    const xHelio = rPlanet * Math.cos(meanLonRad);
    const yHelio = rPlanet * Math.sin(meanLonRad);

    // Geocentric coordinates: Planet - Sun
    const xGeo = xHelio + xSun;
    const yGeo = yHelio + ySun;
    const zGeo = rPlanet * Math.sin((p.incDeg * Math.PI) / 180.0) * Math.sin(meanLonRad);

    const geoLonRad = Math.atan2(yGeo, xGeo);
    const geoLonDeg = ((geoLonRad * 180.0) / Math.PI + 360) % 360;
    const geoDist = Math.sqrt(xGeo * xGeo + yGeo * yGeo + zGeo * zGeo);
    const geoLatRad = Math.asin(zGeo / Math.max(0.1, geoDist));

    // Convert to Equatorial (RA, Dec)
    const sinDec =
      Math.sin(geoLatRad) * Math.cos(epsRad) +
      Math.cos(geoLatRad) * Math.sin(epsRad) * Math.sin(geoLonRad);
    const decRad = Math.asin(sinDec);
    const decDeg = (decRad * 180.0) / Math.PI;

    const yEq =
      Math.sin(geoLonRad) * Math.cos(epsRad) -
      Math.tan(geoLatRad) * Math.sin(epsRad);
    const xEq = Math.cos(geoLonRad);
    const raRad = Math.atan2(yEq, xEq);
    const raDeg = ((raRad * 180.0) / Math.PI + 360) % 360;
    const raHours = raDeg / 15.0;

    const horiz = equatorialToHorizontal(raHours, decDeg, date, observer);
    const siderealLonDeg = ((geoLonDeg - ayanamsa + 360) % 360);

    results.push({
      id: p.id,
      nameMm: p.nameMm,
      nameEn: p.nameEn,
      symbol: p.symbol,
      color: p.color,
      horizontal: horiz,
      equatorial: { raHours, decDeg, distanceAu: geoDist },
      magnitude: p.magBase,
      siderealLongitudeDeg: siderealLonDeg,
      currentNakshatra: getNakshatraFromSiderealLon(siderealLonDeg).nakshatra,
      currentZodiac: getZodiacFromSiderealLon(siderealLonDeg),
      infoMm: p.infoMm
    });
  }

  return results;
}

// -------------------------------------------------------------
// LAGNA (ASCENDANT / လဂ်) & BIRTH SKY FINDER ENGINE
// -------------------------------------------------------------

export interface LagnaData {
  tropicalLonDeg: number;
  siderealLonDeg: number;
  zodiac: ZodiacSign;
  degreeInZodiac: number;
  nakshatra: Nakshatra;
  pada: number;
  horizontal: HorizontalCoord;
  equatorial: EquatorialCoord;
}

export interface BirthSkyData {
  birthDate: Date;
  observer: ObserverLocation;
  janmaNakshatra: MoonTransitInfo;
  lagna: LagnaData;
  dayOfWeekMm: string;
  dayOfWeekEn: string;
  planetaryRulerMm: string;
  animalMm: string;
  burmeseYear: number;
  mahaboteHouseMm: string;
  mahaboteMeaningMm: string;
  namingSyllablesMm: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  planets: PlanetData[];
}

/**
 * Calculates the exact Ascendant (Lagna / လဂ်) rising on the Eastern Horizon
 */
export function calculateLagna(date: Date, observer: ObserverLocation): LagnaData {
  const lstDeg = calculateLST(date, observer.longitude);
  const lstRad = (lstDeg * Math.PI) / 180.0;
  const t = julianCenturiesSinceJ2000(date);
  const eps0 = 23.4392911 - 0.013004167 * t;
  const epsRad = (eps0 * Math.PI) / 180.0;
  const latRad = (observer.latitude * Math.PI) / 180.0;

  // Standard ascendant spherical geometry:
  // y = cos(LST)
  // x = -sin(LST)*cos(eps) - tan(lat)*sin(eps)
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascRad = Math.atan2(y, x);
  let ascDeg = ((ascRad * 180.0) / Math.PI + 360.0) % 360.0;

  // Convert to Equatorial coordinates to verify horizon point
  let sinDec = Math.sin(epsRad) * Math.sin(ascRad);
  let decRad = Math.asin(Math.max(-1, Math.min(1, sinDec)));
  let decDeg = (decRad * 180.0) / Math.PI;

  let raY = Math.cos(epsRad) * Math.sin(ascRad);
  let raX = Math.cos(ascRad);
  let raDeg = ((Math.atan2(raY, raX) * 180.0) / Math.PI + 360.0) % 360.0;
  let raHours = raDeg / 15.0;

  let horiz = equatorialToHorizontal(raHours, decDeg, date, observer);

  // If the computed point is in the western half (azimuth > 180°), it's the Descendant,
  // so add 180° to obtain the Ascendant rising on the Eastern horizon
  if (horiz.azimuth > 180.0) {
    ascDeg = (ascDeg + 180.0) % 360.0;
    ascRad = (ascDeg * Math.PI) / 180.0;

    sinDec = Math.sin(epsRad) * Math.sin(ascRad);
    decRad = Math.asin(Math.max(-1, Math.min(1, sinDec)));
    decDeg = (decRad * 180.0) / Math.PI;

    raY = Math.cos(epsRad) * Math.sin(ascRad);
    raX = Math.cos(ascRad);
    raDeg = ((Math.atan2(raY, raX) * 180.0) / Math.PI + 360.0) % 360.0;
    raHours = raDeg / 15.0;

    horiz = equatorialToHorizontal(raHours, decDeg, date, observer);
  }

  // Deduct Lahiri Ayanamsa to get Sidereal Ascendant (Lagna)
  const ayanamsa = calculateLahiriAyanamsa(date);
  const siderealLonDeg = ((ascDeg - ayanamsa + 360.0) % 360.0);

  const zodiac = getZodiacFromSiderealLon(siderealLonDeg);
  const degreeInZodiac = siderealLonDeg % 30.0;
  const { nakshatra, pada } = getNakshatraFromSiderealLon(siderealLonDeg);

  return {
    tropicalLonDeg: ascDeg,
    siderealLonDeg,
    zodiac,
    degreeInZodiac,
    nakshatra,
    pada,
    horizontal: horiz,
    equatorial: { raHours, decDeg }
  };
}

/**
 * Calculates full traditional Burmese Birth Sky & Astrology Data
 */
export function calculateBirthSky(date: Date, observer: ObserverLocation): BirthSkyData {
  const janmaNakshatra = calculateBurmeseMoonTransit(date);
  const lagna = calculateLagna(date, observer);
  const planets = calculateAllPlanets(date, observer);
  const sunPos = calculateSunPosition(date);
  const moonPos = calculateMoonPosition(date);

  const sunSign = getZodiacFromSiderealLon(sunPos.siderealLonDeg);
  const moonSign = getZodiacFromSiderealLon(moonPos.siderealLonDeg);

  const dayIndex = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const hour = date.getHours();

  let dayMm = "";
  let dayEn = "";
  let rulerMm = "";
  let animalMm = "";

  switch (dayIndex) {
    case 0:
      dayMm = "တနင်္ဂနွေ (Sunday)";
      dayEn = "Sunday";
      rulerMm = "တနင်္ဂနွေ (နေမင်း)";
      animalMm = "ဂဠုန်မင်း (Garuda)";
      break;
    case 1:
      dayMm = "တနင်္လာ (Monday)";
      dayEn = "Monday";
      rulerMm = "တနင်္လာ (စန်းလမင်း)";
      animalMm = "ကျားမင်း (Tiger)";
      break;
    case 2:
      dayMm = "အင်္ဂါ (Tuesday)";
      dayEn = "Tuesday";
      rulerMm = "အင်္ဂါ (Mars)";
      animalMm = "ခြင်္သေ့မင်း (Lion)";
      break;
    case 3:
      if (hour >= 18) {
        dayMm = "ရာဟု (Wednesday Night)";
        dayEn = "Wednesday Evening (Rahu)";
        rulerMm = "ရာဟု (Rahu)";
        animalMm = "ဆင်ဟိုင်း / ဟိုင်းဆင် (Tuskless Elephant)";
      } else {
        dayMm = "ဗုဒ္ဓဟူး (Wednesday)";
        dayEn = "Wednesday Daytime";
        rulerMm = "ဗုဒ္ဓဟူး (Mercury)";
        animalMm = "ဆင်မင်း (Elephant)";
      }
      break;
    case 4:
      dayMm = "ကြာသပတေး (Thursday)";
      dayEn = "Thursday";
      rulerMm = "ကြာသပတေး (Jupiter)";
      animalMm = "ကြွက်မင်း (Rat)";
      break;
    case 5:
      dayMm = "သောကြာ (Friday)";
      dayEn = "Friday";
      rulerMm = "သောကြာ (Venus)";
      animalMm = "ပူးမင်း (Guinea Pig)";
      break;
    case 6:
      dayMm = "စနေ (Saturday)";
      dayEn = "Saturday";
      rulerMm = "စနေ (Saturn)";
      animalMm = "နဂါးမင်း (Dragon / Naga)";
      break;
  }

  // Myanmar Era (ME) approximation: Year - 638 (if before mid-April Thingyan, Year - 639)
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let burmeseYear = date.getFullYear() - 638;
  if (month < 4 || (month === 4 && day < 17)) {
    burmeseYear -= 1;
  }

  // Mahabote House: (Burmese Year + Day Number) % 7
  // Day numbers: Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6, Sat=0
  const dayNumForMahabote = dayIndex === 6 ? 0 : dayIndex + 1;
  const remainder = (burmeseYear + dayNumForMahabote) % 7;
  const mahaboteHouses: Record<number, { name: string; meaning: string }> = {
    1: { name: "ဘင်္ဂ (Binga)", meaning: "စိတ်ပြောင်းလဲလွယ်ခြင်း၊ ခရီးသွားလာမှု၊ ဖောက်ထွက်တီထွင်နိုင်စွမ်း" },
    2: { name: "အထွန်း (Atun)", meaning: "ထွန်းတောက်အောင်မြင်ခြင်း၊ ကျော်ကြားမှု၊ စည်းစိမ်ဥစ္စာ ကြွယ်ဝခြင်း" },
    3: { name: "ရာဇ (Raza)", meaning: "မင်းစိုးရာဇာနှင့် တူသော အာဏာ၊ ခေါင်းဆောင်မှု၊ ဂုဏ်သိက္ခာကြီးမားမှု" },
    4: { name: "အဓိပတိ (Adipati)", meaning: "အကြီးအကဲဖြစ်ခြင်း၊ အများအကျိုးဆောင်ရွက်နိုင်မှု၊ အောင်မြင်မှု အထွတ်အထိပ်" },
    5: { name: "မရဏ (Marana)", meaning: "နက်နဲသောအသိဉာဏ်၊ လျှို့ဝှက်ချက်များကို သိမြင်နိုင်စွမ်း၊ စိတ်ဓာတ်ကြံ့ခိုင်မှု" },
    6: { name: "သိုက် (Thaik)", meaning: "စည်းစိမ်ဥစ္စာ သိုမှီးသိမ်းဆည်းနိုင်ခြင်း၊ ကူညီစောင့်ရှောက်သူပေါများခြင်း" },
    0: { name: "ပုတိ (Puti)", meaning: "ပရိယာယ်ကြွယ်ဝခြင်း၊ သတိဝီရိယရှိခြင်း၊ ခက်ခဲသောအခြေအနေများကို ကျော်လွှားနိုင်စွမ်း" }
  };
  const mahabote = mahaboteHouses[remainder] || { name: "အထွန်း", meaning: "ထွန်းတောက်ခြင်း" };

  // Naming Syllables from Day of Week
  const daySyllables: Record<number, string> = {
    0: "အ၊ အာ၊ ဣ၊ ဤ၊ ဥ၊ ဦ၊ ဧ၊ ဩ (သရသံများ)",
    1: "က၊ ခ၊ ဂ၊ ဃ၊ င",
    2: "စ၊ ဆ၊ ဇ၊ ဈ၊ ည",
    3: hour >= 18 ? "လ၊ ဝ" : "ယ၊ ရ",
    4: "ပ၊ ဖ၊ ဗ၊ ဘ၊ မ",
    5: "သ၊ ဟ",
    6: "တ၊ ထ၊ ဒ၊ ဓ၊ န"
  };
  const namingSyllablesMm = daySyllables[dayIndex] || "အ၊ က၊ စ";

  return {
    birthDate: date,
    observer,
    janmaNakshatra,
    lagna,
    dayOfWeekMm: dayMm,
    dayOfWeekEn: dayEn,
    planetaryRulerMm: rulerMm,
    animalMm,
    burmeseYear,
    mahaboteHouseMm: mahabote.name,
    mahaboteMeaningMm: mahabote.meaning,
    namingSyllablesMm,
    sunSign,
    moonSign,
    planets
  };
}
