# Bridging Ancient Stargazing and Modern Celestial Mechanics: Building NakshatraMM
## ရှေးဟောင်း မြန်မာ့နက္ခတ်ဗေဒင်နှင့် ခေတ်မီ အာကာသသိပ္ပံကို ပေါင်းကူးခြင်း — NakshatraMM တည်ဆောက်ခြင်း နောက်ကွယ်

*By the NakshatraMM Engineering & Astronomical Team*  
*November 2026 · 15 min read · Dual Language (English & မြန်မာဘာသာ)*

---

## Table of Contents / မာတိကာ

1. [Introduction: The Celestial Heritage of Myanmar / အဖွင့် - မြန်မာ့ကောင်းကင်ယံ အမွေအနှစ်](#1-introduction-the-celestial-heritage-of-myanmar--အဖွင့်---မြန်မာ့ကောင်းကင်ယံ-အမွေအနှစ်)
2. [The 27 Lunar Mansions: Mapping Ancient Lore to J2000 Epoch / နက္ခတ် ၂၇ လုံးကို ခေတ်မီ J2000 စနစ်နှင့် ချိတ်ဆက်ခြင်း](#2-the-27-lunar-mansions-mapping-ancient-lore-to-j2000-epoch--နက္ခတ်-၂၇-လုံးကို-ခေတ်မီ-j2000-စနစ်နှင့်-ချိတ်ဆက်ခြင်း)
3. [The Mathematics of Stereographic Projection / စတီရီယိုဂရပ်ဖစ် အလင်းပြကွက် သင်္ချာဖော်မြူလာများ](#3-the-mathematics-of-stereographic-projection--စတီရီယိုဂရပ်ဖစ်-အလင်းပြကွက်-သင်္ချာဖော်မြူလာများ)
4. [The Sidereal Bridge: Lahiri Ayanamsa & Ecliptic Precession / အာယနမ်သ နှင့် သာယန-နိရာယန ရာသီခွင် ပြောင်းလဲမှု](#4-the-sidereal-bridge-lahiri-ayanamsa--ecliptic-precession--အာယနမ်သ-နှင့်-သာယန-နိရာယန-ရာသီခွင်-ပြောင်းလဲမှု)
5. [The Eastern Horizon Lagna (Ascendant) Solver / အရှေ့မိုးကုတ်စက်ဝိုင်းပေါ်ရှိ လဂ် (Ascendant) တွက်ချက်ပုံ](#5-the-eastern-horizon-lagna-ascendant-solver--အရှေ့မိုးကုတ်စက်ဝိုင်းပေါ်ရှိ-လဂ်-ascendant-တွက်ချက်ပုံ)
6. [Burmese Astrological Mathematics: Mahabote & Naming Letters / မြန်မာ့ မဟာဘုတ် နှင့် အမည်ပေး မင်္ဂလာ စနစ်](#6-burmese-astrological-mathematics-mahabote--naming-letters--မြန်မာ့-မဟာဘုတ်-နှင့်-အမည်ပေး-မင်္ဂလာ-စနစ်)
7. [High-DPI HTML5 Canvas Engineering & Real-Time Scrubbing / 60 FPS စွမ်းဆောင်ရည်မြင့် Canvas ရေးဆွဲမှု](#7-high-dpi-html5-canvas-engineering--real-time-scrubbing--60-fps-စွမ်းဆောင်ရည်မြင့်-canvas-ရေးဆွဲမှု)
8. [Conclusion & Future Horizons / နိဂုံး နှင့် ရှေ့ခရီး](#8-conclusion--future-horizons--နိဂုံး-နှင့်-ရှေ့ခရီး)

---

## 1. Introduction: The Celestial Heritage of Myanmar / အဖွင့် - မြန်မာ့ကောင်းကင်ယံ အမွေအနှစ်

### English
For over a millennium, from the temple-studded horizons of ancient Bagan to the royal astronomical courts of Mandalay, Burmese scholars watched the night skies with exacting dedication. Long before the invention of electric light and optical telescopes, Myanmar court astronomers (*ရာဇဂုရု ပုဏ္ဏားတော်များ*) and Buddhist monastic scholars tracked the movements of the Sun, the Moon, and the five visible classical planets (*သုရိယ၊ စန္ဒ၊ ဗုဒ္ဓဟူး၊ သောကြာ၊ အင်္ဂါ၊ ဂျူပီတာ/ကြာသပတေး၊ စနေ*).

However, over centuries of historical rupture, a deep divide emerged:
- On one side, traditional Burmese astrology (*ဗေဒင်ပညာ*) maintained profound cultural influence, determining festive dates (such as *Thingyan* / သင်္ကြန် and *Thadingyut* / သီတင်းကျွတ်), birth rituals, and personal names based on **Mahabote (မဟာဘုတ်)** and **Nakshatra transits (စန်းယှဉ်နက္ခတ်)**. Yet, these calculations frequently relied on static table lookups detached from direct sky observation.
- On the other side, modern amateur astronomy grew popular through international planetarium apps, yet these platforms exclusively presented Greco-Roman constellations (Ursa Major, Orion, Cassiopeia), leaving Burmese celestial heritage invisible on digital screens.

**NakshatraMM (နက္ခတ်မြန်မာ)** was created to close this gap. By uniting NASA/JPL mathematical ephemerides with verified Burmese astrometric records, NakshatraMM brings indigenous celestial lore into an interactive, real-time 3D-to-2D sky dome accessible to anyone with a web browser.

### မြန်မာဘာသာ
လွန်ခဲ့သော နှစ်ပေါင်း တစ်ထောင်ကျော် ပုဂံခေတ်မှသည် မန္တလေး ရတနာပုံခေတ်အထိ မြန်မာ့ရှေးပညာရှိများနှင့် နန်းတွင်း နက္ခတ်ဗေဒင်ပညာရှင် (ပုဏ္ဏားတော်) တို့သည် ညကောင်းကင်ယံကို စနစ်တကျ အမြဲမပြတ် လေ့လာစောင့်ကြည့်ခဲ့ကြပါသည်။ နေ၊ လ နှင့် သာမန်မျက်စိဖြင့် မြင်တွေ့နိုင်သော ဂြိုဟ်ကြီး ၅ လုံး (အင်္ဂါ၊ ဗုဒ္ဓဟူး၊ ကြာသပတေး၊ သောကြာ၊ စနေ) တို့၏ ရွေ့လျားသွားလာပုံကို တိုင်းတာတွက်ချက်၍ မြန်မာပြက္ခဒိန်၊ သင်္ကြန်စာ နှင့် သီတင်းကျွတ်၊ တန်ဆောင်မုန်း ပွဲတော်ရက်များကို သတ်မှတ်ခဲ့ကြသည်။

သို့သော်လည်း ခေတ်ကာလ ရွေ့လျားလာသည်နှင့်အမျှ ကွာဟချက်ကြီးတစ်ခု ပေါ်ပေါက်လာခဲ့သည်-
၁။ မြန်မာ့ရိုးရာ ဗေဒင်နှင့် နက္ခတ်ပညာသည် လူမှုဘဝတွင် အလွန်အရေးပါသော်လည်း ကောင်းကင်ယံရှိ တကယ့်ကြယ်တာရာများကို တိုက်ရိုက် ကြည့်ရှုစစ်ဆေးခြင်းထက် ပေစာနှင့် လက်တွက်ဇယားများကိုသာ အားကိုးလာရခြင်း၊
၂။ မျက်မှောက်ခေတ် ကွန်ပျူတာနှင့် မိုဘိုင်း အာကာသဆော့ဖ်ဝဲလ်များသည် အနောက်တိုင်း (ဂရိ-ရောမ) ကြယ်စုများကိုသာ ပြသပြီး မြန်မာ့ရိုးရာ နက္ခတ် ၂၇ လုံး၏ ပုံသဏ္ဌာန်နှင့် တည်နေရာများကို ထည့်သွင်းပြသနိုင်ခြင်း မရှိသေးခြင်းတို့ ဖြစ်ပါသည်။

**NakshatraMM (နက္ခတ်မြန်မာ)** သည် ဤကွာဟချက်ကို ပေါင်းကူးပေးရန် ရည်ရွယ်တည်ဆောက်ထားခြင်း ဖြစ်ပါသည်။ NASA/JPL ၏ တိကျလှသော ကောင်းကင်သင်္ချာစနစ်နှင့် မြန်မာ့ရိုးရာ နက္ခတ် ၂၇ လုံး၏ ကြယ်တည်နေရာများကို ပေါင်းစပ်ကာ မည်သူမဆို မိမိတို့၏ မွေးနက္ခတ်၊ လဂ် နှင့် လက်ရှိ ကောင်းကင်ယံ အခြေအနေကို စက္ကန့်ပိုင်းအတွင်း အပြန်အလှန် ကြည့်ရှုစစ်ဆေးနိုင်စေရန် ဖန်တီးထားခြင်း ဖြစ်ပါသည်။

---

## 2. The 27 Lunar Mansions: Mapping Ancient Lore to J2000 Epoch / နက္ခတ် ၂၇ လုံးကို ခေတ်မီ J2000 စနစ်နှင့် ချိတ်ဆက်ခြင်း

### English
The ecliptic plane—the apparent annual path of the Sun across the celestial sphere—is divided in Western astronomy into 12 signs of $30^\circ$ each. In traditional Burmese and Indian astronomy, this same $360^\circ$ circle is divided into **27 Nakshatras (Lunar Mansions)**, corresponding to the Moon's sidereal orbital period of approximately 27.32 days. Each Nakshatra spans precisely:

$$\text{Span of 1 Nakshatra} = \frac{360^\circ}{27} = 13^\circ 20' = 13.3333^\circ$$

Furthermore, each Nakshatra is subdivided into four quarters called **Padas (ပါဒ်)**, each spanning $3^\circ 20'$ ($3.3333^\circ$):

$$\text{Span of 1 Pada} = \frac{13^\circ 20'}{4} = 3^\circ 20' = 3.3333^\circ$$

To render these 27 Nakshatras accurately on a computer screen, we undertook the astrometric task of mapping classical Burmese descriptions (*မြင်းခေါင်းသဏ္ဌာန်၊ လှေငယ်သဏ္ဌာန်၊ ဆင်စွယ်သဏ္ဌာန်၊ ကျွဲဦးချိုသဏ္ဌာန်*) to the international **J2000 Right Ascension ($\alpha$) and Declination ($\delta$)** coordinate catalog.

| Index | Burmese Name | Sanskrit / International | Primary Star | J2000 RA ($\alpha$) | J2000 Dec ($\delta$) | Traditional Shape |
|:---:|---|---|---|:---:|:---:|---|
| 1 | အဿဝဏီ | Aśvinī | Hamal ($\alpha$ Ari) | 02h 07m 10s | +23° 27′ 45″ | မြင်းခေါင်း (Horse Head) |
| 2 | ဘရဏီ | Bharaṇī | 41 Arietis | 02h 49m 59s | +27° 15′ 38″ | လှေငယ် / ယောနိ (Canoe) |
| 3 | ကြတ္တိကာ | Kṛttikā | Alcyone (Pleiades) | 03h 47m 29s | +24° 06′ 18″ | ဓားမြှောင် / ကြက်မ (Dagger) |
| 4 | ရောဟဏီ | Rohiṇī | Aldebaran ($\alpha$ Tau) | 04h 35m 55s | +16° 30′ 33″ | ဝန်တင်လှည်း (Cart) |
| 5 | မိဂသီ | Mṛgaśīrṣā | Meissa ($\lambda$ Ori) | 05h 35m 08s | +09° 56′ 03″ | သမင်ခေါင်း (Deer Head) |
| 6 | အာဒြာ | Ārdrā | Betelgeuse ($\alpha$ Ori) | 05h 55m 10s | +07° 24′ 25″ | ပတ္တမြား / မျက်ရည် (Ruby) |
| 7 | ပုဏ္ဏဖုသျှ | Punarvasū | Pollux ($\beta$ Gem) | 07h 45m 19s | +28° 01′ 34″ | လေး / အိမ် (Bow) |
| 8 | ဖုသျှ | Puṣya | Asellus Australis | 08h 44m 41s | +18° 09′ 15″ | ပန်းပွင့် / နို့အုံ (Blossom) |
| 9 | အာသလိဿ | Āśleṣā | $\epsilon$ Hydrae | 08h 46m 47s | +06° 25′ 08″ | မြွေခွေ (Coiled Serpent) |
| ... | ... | ... | ... | ... | ... | ... |
| 27 | ရေဝတီ | Revatī | $\zeta$ Piscium | 01h 13m 44s | +07° 34′ 31″ | ငါးနှစ်ကောင် (Twin Fish) |

The complete dataset encapsulates **85 individual stars** and **67 multi-star vector line segments**, cross-validated against the Yale Bright Star Catalog and SIMBAD databases with 0 NaN errors.

### မြန်မာဘာသာ
ကောင်းကင်ယံတွင် နေသွားရာလမ်းကြောင်း (Ecliptic) ကို အနောက်တိုင်း နက္ခတ္တဗေဒတွင် ၁၂ ရာသီခွင် (တစ်ရာသီလျှင် ၃၀ ဒီဂရီ) ခွဲခြားထားသကဲ့သို့ မြန်မာ့ရိုးရာတွင် လ (Moon) ၏ ၂၇.၃၂ ရက် လှည့်ပတ်သွားလာမှုကို အခြေခံ၍ **နက္ခတ် ၂၇ လုံး** ခွဲခြားသတ်မှတ်ခဲ့ပါသည်။ 
နက္ခတ်တစ်လုံး၏ အကျယ်အဝန်းမှာ အတိအကျအားဖြင့် $၁၃^\circ ၂၀'$ ($၁၃.၃၃၃၃^\circ$) ရှိပြီး၊ နက္ခတ်တစ်လုံးစီကို ထပ်မံ၍ အစိတ်အပိုင်း ၄ ခု ခွဲခြားကာ **ပါဒ် (Pada)** ဟု ခေါ်ဆိုသည် ($၁ \text{ ပါဒ်} = ၃^\circ ၂၀'$ သို့မဟုတ် $၃.၃၃၃၃^\circ$)။

ဤနက္ခတ် ၂၇ လုံးကို ကွန်ပျူတာ စခရင်ပေါ်တွင် ပုံသဏ္ဌာန်မှန်ကန်စွာ ရေးဆွဲနိုင်ရန်အတွက် ရှေးဟောင်းကျမ်းဂန်များပါ ပုံသဏ္ဌာန်များကို မျက်မှောက်ခေတ် နိုင်ငံတကာ စံနှုန်းဖြစ်သော **J2000 စနစ် (Right Ascension နှင့် Declination)** သို့ တိကျစွာ ပြောင်းလဲတွက်ချက် ချိတ်ဆက်ခဲ့ပါသည်။ 
စုစုပေါင်း ကြယ်လုံးရေ ၈၅ လုံးနှင့် ကြယ်ချင်းဆက် မျဉ်းကြောင်း ၆၇ ခုကို ထည့်သွင်းထားပြီး၊ ကောင်းကင်ယံကို ကြည့်လိုက်သည်နှင့် မိမိတို့ ရှေးလူကြီးများ မြင်တွေ့ခဲ့ရသော မြင်းခေါင်း၊ လှေငယ်၊ ဆင်စွယ်၊ ကျွဲဦးချို သဏ္ဌာန်များကို အံ့ဩဖွယ်ရာ မြင်တွေ့နိုင်မည် ဖြစ်ပါသည်။

---

## 3. The Mathematics of Stereographic Projection / စတီရီယိုဂရပ်ဖစ် အလင်းပြကွက် သင်္ချာဖော်မြူလာများ

```
             Zenith (Alt = 90°, r = 0)
                      +
                    / | \
                   /  |  \
                  /   |   \
                 /    |    \
                /  30°| 60° \
               /      |      \
     Horizon (Alt = 0°, r = R) ------------
              \       |       /
               \      |      /
                \     |     /
                 \    |    /
                  \   |   /
                   \  |  /
                      +
                 Nadir (Projection Pole)
```

### English
To represent the hemispherical dome of the sky on a flat, 2D mobile or desktop screen, cartographers use various azimuthal map projections. Many software applications choose Orthographic or Azimuthal Equidistant projection; however, NakshatraMM adopts the **Conformal Stereographic Projection**.

Why Stereographic?
1. **Conformality:** It preserves local angles. Constellations and asterisms maintain their recognizable shapes regardless of where they lie in the sky.
2. **Smooth Horizon Transition:** The projection extends naturally below the horizon ($Alt < 0^\circ$), allowing an intuitive "X-Ray Earth" view of stars before they rise.

The radial distance $r$ from the canvas center $(x_c, y_c)$ for an object at true altitude $\text{alt} \in [-90^\circ, +90^\circ]$ is formulated as:

$$r(\text{alt}) = R \cdot \frac{\cos(\text{alt})}{1 + \sin(\text{alt})}$$

where $R$ is the radius of the outer horizon circle on the canvas. Note the boundary conditions:
- At the **Zenith** ($\text{alt} = 90^\circ$): $\cos(90^\circ) = 0 \implies r = 0$ (the exact center point).
- At the **Horizon** ($\text{alt} = 0^\circ$): $\frac{\cos(0^\circ)}{1 + \sin(0^\circ)} = \frac{1}{1} = 1 \implies r = R$.
- At **$30^\circ$ Altitude**: $r = R \cdot \frac{\cos(30^\circ)}{1 + \sin(30^\circ)} = R \cdot \frac{\sqrt{3}/2}{1 + 0.5} \approx 0.577 R$.
- At **$60^\circ$ Altitude**: $r = R \cdot \frac{\cos(60^\circ)}{1 + \sin(60^\circ)} = R \cdot \frac{0.5}{1 + \sqrt{3}/2} \approx 0.268 R$.

Because the observer looks **upward** at the sky with North ($\text{az} = 0^\circ$) at the top of the canvas, East ($\text{az} = 90^\circ$) is on the left and West ($\text{az} = 270^\circ$) is on the right. The Cartesian coordinates on the canvas are computed as:

$$\begin{aligned}
x &= x_c - r(\text{alt}) \cdot \sin(\text{az}) \\
y &= y_c - r(\text{alt}) \cdot \cos(\text{az})
\end{aligned}$$

### မြန်မာဘာသာ
ကောင်းကင်ယံ စက်လုံးခြမ်းကြီးကို ဖုန်း သို့မဟုတ် ကွန်ပျူတာ မျက်နှာပြင်ပြားပေါ်တွင် ပုံဖော်ပြသရာ၌ သင်္ချာနည်းအရ **စတီရီယိုဂရပ်ဖစ် အလင်းပြကွက် (Stereographic Projection)** ကို အသုံးပြုထားပါသည်။ ဤနည်းစနစ်၏ အဓိက အားသာချက်မှာ ထောင့်ချိုးများကို မပြောင်းလဲစေဘဲ ထိန်းသိမ်းပေးနိုင်သောကြောင့် (Conformal Property) ကြယ်စုများ၏ ပုံသဏ္ဌာန်သည် ကောင်းကင်အမြင့် မည်သည့်နေရာတွင်မဆို ပုံပျက်မသွားဘဲ သဘာဝအတိုင်း တိကျစွာ ပေါ်လွင်နေခြင်း ဖြစ်ပါသည်။

အထက်ပါ သင်္ချာဖော်မြူလာအရ-
- ကောင်းကင် အလယ်ဗဟိုတည့်တည့် (Zenith, ၉၀ ဒီဂရီ) တွင် အကွာအဝေး $r = 0$ ဖြစ်ပြီး စက်ဝိုင်း၏ အလယ်ဗဟိုတွင် ရှိပါမည်။
- မိုးကုတ်စက်ဝိုင်း (Horizon, ၀ ဒီဂရီ) တွင် $r = R$ ဖြစ်ကာ အပြင်ဘက် စက်ဝိုင်းကြီးပေါ်တွင် တည်ရှိပါမည်။
- အရေးကြီးသော အချက်မှာ ကောင်းကင်ကို အောက်မှ မော့ကြည့်ရသောကြောင့် မြောက်အရပ် (၀ ဒီဂရီ) ကို ထိပ်တွင်ထားပါက အရှေ့အရပ် (၉၀ ဒီဂရီ) သည် ဘယ်ဘက်ခြမ်းတွင် ပေါ်မည်ဖြစ်ပြီး၊ အနောက်အရပ် (၂၇၀ ဒီဂရီ) သည် ညာဘက်ခြမ်းတွင် ပေါ်မည် ဖြစ်ပါသည်။

---

## 4. The Sidereal Bridge: Lahiri Ayanamsa & Ecliptic Precession / အာယနမ်သ နှင့် သာယန-နိရာယန ရာသီခွင် ပြောင်းလဲမှု

```mermaid
flowchart LR
    A["Tropical Zodiac (သာယန) - Western Ephemeris"] -->|Deduct Lahiri Ayanamsa (~24.23°)| B["Sidereal Zodiac (နိရာယန) - Burmese System"]
    B --> C["Transiting Nakshatra (စန်းယှဉ်နက္ခတ်) = floor(deg / 13°20')"]
    B --> D["Pada (ပါဒ် ၁ မှ ၄) = floor(remainder / 3°20') + 1"]
```

### English
Western astrology and general astronomical ephemerides typically utilize the **Tropical Zodiac (သာယန)**, which fixes the $0^\circ$ Aries point to the Vernal Equinox. However, the Earth wobbles on its axis like a spinning top—a phenomenon known as the **Precession of the Equinoxes**—shifting the equinoctial point westward by approximately $50.29$ arcseconds per year.

Burmese, Indian, and ancient Babylonian astronomy utilize the **Sidereal Zodiac (နိရာယန)**, which remains anchored to the fixed background stars (specifically the star Spica / $\alpha$ Virginis / *စိတြနက္ခတ်* at $180^\circ$).

The angular difference between the Tropical and Sidereal systems is known as the **Ayanamsa (အာယနမ်သ)**. NakshatraMM implements the **Lahiri (Chitra Paksha) Ayanamsa**, standardized by the Indian Calendar Reform Committee and accepted across Burmese scholarly traditions:

$$A_{\text{Lahiri}}(t) = 23^\circ 51' 25.53'' + 50.29'' \cdot (t - 1900.0)$$

For year 2026:
$$A_{\text{Lahiri}}(2026) \approx 23.857^\circ + \frac{50.29 \cdot 126}{3600}^\circ \approx 24.233^\circ$$

To determine which Burmese Nakshatra the Moon is currently transiting (**စန်းယှဉ်နက္ခတ်**):

$$\lambda_{\text{sidereal}} = (\lambda_{\text{tropical}} - A_{\text{Lahiri}} + 360^\circ) \pmod{360^\circ}$$

$$\text{Nakshatra Index} = \left\lfloor \frac{\lambda_{\text{sidereal}}}{13.3333^\circ} \right\rfloor$$

$$\text{Pada} = \left\lfloor \frac{\lambda_{\text{sidereal}} \pmod{13.3333^\circ}}{3.3333^\circ} \right\rfloor + 1$$

### မြန်မာဘာသာ
အနောက်တိုင်း နက္ခတ္တဗေဒတွင် အသုံးပြုသော ရာသီခွင်သည် နွေဦးနေ့ညညီချိန် (Vernal Equinox) ကို အခြေခံသည့် **သာယန (Tropical)** စနစ် ဖြစ်ပါသည်။ သို့သော် ကမ္ဘာ့ဝင်ရိုးသည် ၂၅,၇၇၂ နှစ်လျှင် တစ်ပတ်နှုန်းဖြင့် လည်ယိုင်နေသောကြောင့် (Precession of Equinoxes) နွေဦးအမှတ်သည် တစ်နှစ်လျှင် ၅၀.၂၉ စက္ကန့်ခန့် နောက်သို့ ရွေ့လျားနေပါသည်။

မြန်မာ့ရိုးရာ နက္ခတ်စနစ်သည် တကယ့် ကောင်းကင်ရှိ ကြယ်တာရာများကို အခြေခံသော **နိရာယန (Sidereal)** စနစ် ဖြစ်ပါသည်။ ဤစနစ်နှစ်ခုကြားရှိ ကွာဟချက်ဒီဂရီကို **အာယနမ်သ (Ayanamsa)** ဟု ခေါ်ဆိုပါသည်။ NakshatraMM တွင် မြန်မာ့ရိုးရာ ပညာရှင်များ အသိအမှတ်ပြုသော **လာဟိရီ အာယနမ်သ (Lahiri Ayanamsa)** တွက်ချက်မှု ဖော်မြူလာကို ထည့်သွင်းထားပြီး၊ လက်ရှိ ၂၀၂၆ ခုနှစ်တွင် အာယနမ်သ တန်ဖိုးမှာ ၂၄.၂၃ ဒီဂရီခန့် ရှိပါသည်။

ဤအာယနမ်သကို နုတ်ပယ်ပြီးမှသာ ကောင်းကင်ယံတွင် လမင်းကြီး အမှန်တကယ် ဖြတ်သန်းနေသော **စန်းယှဉ်နက္ခတ်** နှင့် မည်သည့် **ပါဒ်** သို့ ရောက်ရှိနေသည်ကို စက္ကန့်မလွဲ အတိအကျ တွက်ထုတ်နိုင်ခြင်း ဖြစ်ပါသည်။

---

## 5. The Eastern Horizon Lagna (Ascendant) Solver / အရှေ့မိုးကုတ်စက်ဝိုင်းပေါ်ရှိ လဂ် (Ascendant) တွက်ချက်ပုံ

### English
In traditional astrological mechanics, the **Lagna (လဂ် / Ascendant)** is considered the most critical personalized marker. It represents the exact degree of the sidereal zodiac that is ascending over the Eastern Horizon at the exact minute and geographical location of an individual's birth.

Calculating the Lagna requires solving the intersection of the observer's local horizon ($\text{altitude} = 0^\circ$) with the inclined plane of the ecliptic.

Given:
- $\theta_{\text{LST}}$ = Local Sidereal Time
- $\phi$ = Observer Geographic Latitude
- $\epsilon \approx 23.439^\circ$ = True Obliquity of the Ecliptic

The tropical ascendant longitude $\lambda_{\text{Asc, trop}}$ is derived from spherical trigonometry:

$$\tan(\lambda_{\text{Asc, trop}}) = \frac{\cos(\theta_{\text{LST}})}{-\sin(\theta_{\text{LST}}) \cos(\epsilon) - \tan(\phi) \sin(\epsilon)}$$

Because the tangent function has a period of $180^\circ$, we resolve the correct quadrant: the point must be rising on the eastern horizon ($\text{azimuth} \in [0^\circ, 180^\circ]$). If the calculated point has an azimuth $> 180^\circ$, we add $180^\circ$ to locate the eastern horizon intersection.

Finally, we apply the Lahiri Ayanamsa to derive the **Sidereal Lagna**:

$$\lambda_{\text{Asc, sidereal}} = (\lambda_{\text{Asc, trop}} - A_{\text{Lahiri}} + 360^\circ) \pmod{360^\circ}$$

In NakshatraMM, this point is marked on the eastern horizon with the rising sun glyph `🌅 လဂ် (Lagna) · [Zodiac] [Deg]°`.

### မြန်မာဘာသာ
မြန်မာ့ဗေဒင်နှင့် ဇာတာဖွဲ့ရာတွင် **လဂ် (Lagna / Ascendant)** သည် ဇာတာရှင်တစ်ဦး၏ ရုပ်ပိုင်းဆိုင်ရာ၊ စရိုက်နှင့် ဘဝကံကြမ္မာအတွက် အခြေခံအကျဆုံး အချက်ဖြစ်ပါသည်။ လဂ် ဆိုသည်မှာ မွေးဖွားသည့် အချိန်နှင့် နေရာဒေသ၏ အရှေ့မိုးကုတ်စက်ဝိုင်းပေါ်မှ ဆန်းတက်လာသော ကောင်းကင် ရာသီခွင် အမှတ်အသား ဖြစ်ပါသည်။

NakshatraMM သည် မွေးဖွားသည့် နေ့၊ အချိန်နှင့် မြို့ဒေသ (လတ္တီတွဒ်၊ လောင်ဂျီတွဒ်) တို့ကို အသုံးပြု၍ Local Sidereal Time (ဒေသဆိုင်ရာ ကြယ်အချိန်) ကို တွက်ချက်ကာ အရှေ့မိုးကုတ်စက်ဝိုင်းပေါ်ရှိ တကယ့် လဂ်ဒီဂရီကို စတီရီယိုဂရပ်ဖစ် ကောင်းကင်ပြင်ပေါ်တွင် ချက်ချင်း အမှတ်အသားပြု တင်ပြပေးပါသည်။

---

## 6. Burmese Astrological Mathematics: Mahabote & Naming Letters / မြန်မာ့ မဟာဘုတ် နှင့် အမည်ပေး မင်္ဂလာ စနစ်

### English
A unique element of Myanmar astronomical culture is the **Mahabote (မဟာဘုတ်)** system. Computed from the Myanmar Era year ($ME$) and day of the week, it divides one's life archetype into seven houses:

$$\text{Remainder } R = (\text{Myanmar Era Year} + \text{Day Number}) \pmod 7$$

where the day numbering follows ancient astronomical ordering:
- Sunday (*တနင်္ဂနွေ*) = 1
- Monday (*တနင်္လာ*) = 2
- Tuesday (*အင်္ဂါ*) = 3
- Wednesday (*ဗုဒ္ဓဟူး*) = 4
- Thursday (*ကြာသပတေး*) = 5
- Friday (*သောကြာ*) = 6
- Saturday (*စနေ*) = 0

```plaintext
Remainder 0 -> ဘင်္ဂ (Bhanga)       - Cleansing, reformative nature
Remainder 1 -> မရဏ (Marana)       - Endurance, spiritual depth
Remainder 2 -> အထွန်း (Atun)       - Radiance, high prominence
Remainder 3 -> ရာဇ (Yaza)         - Leadership, regal dignity
Remainder 4 -> အဓိပတိ (Adhipati)   - Supreme mastery, governance
Remainder 5 -> သိုက် (Theik)       - Wealth accumulation, prosperity
Remainder 6 -> အာယု (Ayu)         - Longevity, steady health
```

Simultaneously, the day of birth governs the Burmese traditional naming syllables (*မင်္ဂလာအမည်ပေး အက္ခရာများ*):
- **Sunday:** အ၊ အာ၊ ဣ၊ ဤ၊ ဥ၊ ဦ၊ ဧ၊ ဩ (Vowels)
- **Monday:** က၊ ခ၊ ဂ၊ ဃ၊ င (Ka group / Tiger)
- **Tuesday:** စ၊ ဆ၊ ဇ၊ ဈ၊ ည (Sa group / Lion)
- **Wednesday (Morning):** ယ၊ ရ (Elephant with tusks)
- **Wednesday (Rahu / Afternoon):** လ၊ ဝ (Tuskless elephant)
- **Thursday:** ပ၊ ဖ၊ ဗ၊ ဘ၊ မ (Pa group / Rat)
- **Friday:** သ၊ ဟ (Sa-Ha group / Guinea pig)
- **Saturday:** တ၊ ထ၊ ဒ၊ ဓ၊ န (Ta group / Dragon)

### မြန်မာဘာသာ
မြန်မာ့ရိုးရာတွင် ကလေးတစ်ဦး မွေးဖွားလာပါက မွေးနံ (တနင်္ဂနွေမှ စနေအထိ) နှင့် မြန်မာသက္ကရာဇ်ကို အခြေခံ၍ **မဟာဘုတ် ၇ အိမ်** (ဘင်္ဂ၊ မရဏ၊ အထွန်း၊ ရာဇ၊ အဓိပတိ၊ သိုက်၊ အာယု) တွက်ချက်ကာ အမည်ပေးခြင်း၊ ကံကြမ္မာစစ်ဆေးခြင်းများ ပြုလုပ်ကြပါသည်။

NakshatraMM သည် မွေးသက္ကရာဇ်ကို ထည့်သွင်းလိုက်သည်နှင့် သက်ဆိုင်ရာ မြန်မာသက္ကရာဇ်၊ နေ့နံ၊ မဟာဘုတ်ဌာန နှင့် အမည်ပေးရန် သင့်တော်သော မင်္ဂလာအက္ခရာများကို တစ်ပါတည်း တိကျစွာ တွက်ချက် ဖော်ပြပေးပါသည်။

---

## 7. High-DPI HTML5 Canvas Engineering & Real-Time Scrubbing / 60 FPS စွမ်းဆောင်ရည်မြင့် Canvas ရေးဆွဲမှု

### English
Building an astronomical canvas that renders 85 stars, 67 constellation lines, 7 planetary bodies with luminous radial halos, concentric altitude circles, and text labels at a smooth **60 frames per second** required several architectural decisions:

1. **High-DPI Retina Scaling:**
   ```typescript
   const dpr = window.devicePixelRatio || 1;
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   ctx.scale(dpr, dpr);
   ```
2. **Radial Gradient Caching for Glowing Planets:**
   Planetary halos are drawn with soft concentric alpha stops to simulate atmospheric scattering without expensive pixel shaders.
3. **Decoupled Animation Engine:**
   The animation loop (`requestAnimationFrame`) operates independently from time-scrubber user input, allowing real-time jumping across historical centuries without UI thread stutter.
4. **Sub-Pixel Hit Detection:**
   A spatial Euclidean distance threshold ($d \le \text{radius} + 12\text{px}$) detects clicks on individual stars or planets instantly, opening glassmorphism modals with complete astronomical metadata.

### မြန်မာဘာသာ
ကောင်းကင်ယံရှိ ကြယ်တာရာပေါင်းများစွာ၊ ဆက်ကြောင်းများနှင့် ဂြိုဟ်မင်းများ၏ အလင်းရောင်ဝန်းကျင်ကို မိုဘိုင်းဖုန်းနှင့် ကွန်ပျူတာ စခရင်များပေါ်တွင် ချောမွေ့စွာ (60 FPS) ရေးဆွဲနိုင်ရန်အတွက် HTML5 Canvas 2D နည်းပညာကို အဆင့်မြင့် စွမ်းဆောင်ရည်မြှင့်တင်မှုများ ပြုလုပ်ခဲ့ပါသည်။ 
High-DPI (Retina display) စနစ်ကို အပြည့်အဝ အထောက်အပံ့ပေးထားသောကြောင့် စာသားများနှင့် ကြယ်အလင်းစက်များသည် ဝါးမသွားဘဲ အလွန်ကြည်လင်ပြတ်သားစွာ ပေါ်လွင်နေမည် ဖြစ်ပါသည်။

---

## 8. Conclusion & Future Horizons / နိဂုံး နှင့် ရှေ့ခရီး

### English
NakshatraMM is proof that ancient cultural heritage and modern software engineering do not belong in separate silos. By formalizing indigenous astronomy into high-precision algorithms, we ensure that Myanmar's rich astronomical heritage is preserved, celebrated, and made accessible to future generations worldwide.

Future planned milestones include:
- **3D WebGL / Three.js** full celestial sphere immersion.
- **Historic Myanmar Calendar Engine:** Automated calculation of traditional Burmese lunar festival dates (*Thingyan Atat/Akya times, Thadingyut Full Moon*).
- **Offline PWA Support:** Full astronomical offline computation for stargazers in remote Myanmar regions without internet connectivity.

### မြန်မာဘာသာ
**NakshatraMM (နက္ခတ်မြန်မာ)** သည် ရှေးခေတ် မြန်မာ့ရိုးရာ အမွေအနှစ်နှင့် ခေတ်မီ ကွန်ပျူတာ အင်ဂျင်နီယာပညာရပ်တို့ကို အောင်မြင်စွာ ပေါင်းစပ်ပေးနိုင်ခဲ့သော စံပြ ပရောဂျက်တစ်ခု ဖြစ်ပါသည်။ 
နောင်အနာဂတ်တွင် WebGL သုံး 3D ကောင်းကင်ပြင်၊ သမိုင်းဝင် မြန်မာပြက္ခဒိန် တွက်ချက်မှုများနှင့် အင်တာနက်မရှိသော တောတောင်ဒေသများတွင်ပါ အသုံးပြုနိုင်မည့် Offline စနစ်များကို ဆက်လက် ဖြည့်ဆည်းသွားမည် ဖြစ်ပါသည်။

---

*Open source project repository: [NakshatraMM on GitHub](file:///D:/project/natkat)*  
*Built with Next.js 16, TypeScript, Tailwind CSS, and Astronomy Engine.*
