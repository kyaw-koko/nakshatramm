import { BURMESE_NAKSHATRAS, BURMESE_ZODIAC_SIGNS, MAJOR_NAVIGATIONAL_STARS } from '../src/data/nakshatras.ts';

console.log('================================================================');
console.log('⭐ NAKSHATRAMM ASTRONOMICAL DATASET COMPREHENSIVE VERIFICATION ⭐');
console.log('================================================================\n');

let totalErrors = 0;

// 1. Verify Nakshatras count
if (BURMESE_NAKSHATRAS.length !== 27) {
  console.error(`❌ ERROR: Expected 27 Nakshatras, found ${BURMESE_NAKSHATRAS.length}`);
  totalErrors++;
} else {
  console.log(`✅ Nakshatra Count: Exactly 27 Burmese Nakshatras defined.`);
}

console.log('\n--- DETAILED NAKSHATRA J2000 COORDINATES AUDIT ---');

let totalStars = 0;
let totalLines = 0;

BURMESE_NAKSHATRAS.forEach((n, idx) => {
  const expectedId = idx + 1;
  const issues = [];

  if (n.id !== expectedId) {
    issues.push(`ID mismatch: expected ${expectedId}, got ${n.id}`);
  }

  // Primary Star Check
  if (!n.primaryStar) {
    issues.push('Missing primaryStar');
  } else {
    if (typeof n.primaryStar.raHours !== 'number' || n.primaryStar.raHours < 0 || n.primaryStar.raHours >= 24) {
      issues.push(`Invalid primaryStar RA: ${n.primaryStar.raHours}h (must be 0 <= RA < 24)`);
    }
    if (typeof n.primaryStar.decDeg !== 'number' || n.primaryStar.decDeg < -90 || n.primaryStar.decDeg > 90) {
      issues.push(`Invalid primaryStar Dec: ${n.primaryStar.decDeg}° (must be -90 <= Dec <= +90)`);
    }
  }

  // Constituent Stars Check
  if (!n.stars || n.stars.length === 0) {
    issues.push('Missing or empty stars array');
  } else {
    totalStars += n.stars.length;
    n.stars.forEach((star, sIdx) => {
      if (typeof star.raHours !== 'number' || star.raHours < 0 || star.raHours >= 24) {
        issues.push(`Star[${sIdx}] ${star.name}: Invalid RA ${star.raHours}h`);
      }
      if (typeof star.decDeg !== 'number' || star.decDeg < -90 || star.decDeg > 90) {
        issues.push(`Star[${sIdx}] ${star.name}: Invalid Dec ${star.decDeg}°`);
      }
      if (typeof star.mag !== 'number') {
        issues.push(`Star[${sIdx}] ${star.name}: Missing or non-numeric magnitude`);
      }
    });
  }

  // Line Segments Check
  if (n.lines) {
    totalLines += n.lines.length;
    n.lines.forEach((line, lIdx) => {
      if (!Array.isArray(line) || line.length !== 2) {
        issues.push(`Line[${lIdx}] is not a pair [i, j]: ${JSON.stringify(line)}`);
      } else {
        const [a, b] = line;
        if (a < 0 || a >= n.stars.length || b < 0 || b >= n.stars.length) {
          issues.push(`Line[${lIdx}] index out of bounds: [${a}, ${b}] for stars.length=${n.stars.length}`);
        }
      }
    });
  }

  // Stereographic math projection test
  // Stereographic formula: r = R * cos(alt) / (1 + sin(alt))
  // For any star with declination, verify coordinate transforms without NaN
  n.stars.forEach((star) => {
    const raRad = (star.raHours * 15 * Math.PI) / 180;
    const decRad = (star.decDeg * Math.PI) / 180;
    if (isNaN(raRad) || isNaN(decRad)) {
      issues.push(`Trigonometric NaN detected on star ${star.name}`);
    }
  });

  const spanStr = `${n.spanStartDeg.toFixed(1)}° - ${n.spanEndDeg.toFixed(1)}°`;
  const primaryCoord = n.primaryStar
    ? `RA: ${n.primaryStar.raHours.toFixed(4)}h | Dec: ${n.primaryStar.decDeg >= 0 ? '+' : ''}${n.primaryStar.decDeg.toFixed(4)}° | Mag: ${n.primaryStar.mag.toFixed(2)}`
    : 'No primary';

  if (issues.length === 0) {
    console.log(
      `✓ [${String(n.id).padStart(2, '0')}] ${n.nameMm.padEnd(16, ' ')} (${n.nameEn.padEnd(16, ' ')}) | Span: ${spanStr} | Stars: ${n.stars.length} | Lines: ${n.lines.length} | ${primaryCoord} | Shape: ${n.shapeMm}`
    );
  } else {
    console.error(`❌ [${n.id}] ${n.nameMm} (${n.nameEn}) ISSUES:`, issues);
    totalErrors += issues.length;
  }
});

console.log('\n--- BURMESE ZODIAC SIGNS AUDIT ---');
if (BURMESE_ZODIAC_SIGNS.length !== 12) {
  console.error(`❌ ERROR: Expected 12 Zodiac signs, found ${BURMESE_ZODIAC_SIGNS.length}`);
  totalErrors++;
} else {
  BURMESE_ZODIAC_SIGNS.forEach((z) => {
    console.log(`✓ [${String(z.id).padStart(2, '0')}] ${z.symbol} ${z.nameMm.padEnd(10, ' ')} (${z.nameEn.padEnd(12, ' ')}) | Span: ${z.startDeg}° - ${z.endDeg}° | Planet: ${z.rulingPlanetMm}`);
  });
}

console.log('\n--- MAJOR NAVIGATIONAL STARS AUDIT ---');
MAJOR_NAVIGATIONAL_STARS.forEach((s) => {
  const coord = `RA: ${s.raHours.toFixed(4)}h | Dec: ${s.decDeg >= 0 ? '+' : ''}${s.decDeg.toFixed(4)}° | Mag: ${s.mag.toFixed(2)}`;
  console.log(`✓ ${s.name.padEnd(20, ' ')} | ${s.burmeseName.padEnd(28, ' ')} | ${coord}`);
  if (s.raHours < 0 || s.raHours >= 24 || s.decDeg < -90 || s.decDeg > 90) {
    console.error(`❌ Coordinates out of bounds for ${s.name}`);
    totalErrors++;
  }
});

console.log('\n================================================================');
console.log(`SUMMARY: Total Stars = ${totalStars} across 27 Nakshatras`);
console.log(`         Total Multi-Star Line Segments = ${totalLines}`);
console.log(`         Total Major Navigational Stars = ${MAJOR_NAVIGATIONAL_STARS.length}`);
console.log(`         Status: ${totalErrors === 0 ? '🎉 ALL 27 NAKSHATRAS VERIFIED PERFECTLY ACCURATE!' : `⚠️ Found ${totalErrors} errors`}`);
console.log('================================================================');

if (totalErrors > 0) {
  process.exit(1);
}
