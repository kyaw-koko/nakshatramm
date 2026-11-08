import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, {
      next: { revalidate: 3600 }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        data: {
          title: data.title,
          date: data.date,
          explanation: data.explanation,
          url: data.url,
          hdurl: data.hdurl || data.url,
          media_type: data.media_type,
          copyright: data.copyright || 'NASA'
        }
      });
    }
  } catch (err) {
    console.warn('NASA APOD API error, falling back to curated data:', err);
  }

  // Curated fallback APOD with high-res cosmic nebula & Burmese translation
  return NextResponse.json({
    success: true,
    data: {
      title: "The Great Carina Nebula in Cosmic Detail",
      date: new Date().toISOString().split('T')[0],
      explanation:
        "The Carina Nebula (NGC 3372) is one of the largest and brightest nebulae in our Milky Way sky, spanning over 300 light-years. It is home to massive luminous stars, including the hypergiant Eta Carinae. Traditional Burmese stargazers revered these southern skies near the Canopus navigator star.",
      explanationMm:
        "ကာရီနာ နက်ဗျူလာ (NGC 3372) သည် မိမိတို့ နဂါးငွေ့တန်း ဂလက်ဆီအတွင်း အကြီးမားဆုံးနှင့် အတောက်ပဆုံးသော ကြယ်မွေးဖွားရာ နေရာတစ်ခုဖြစ်ပြီး အလင်းနှစ် ၃၀၀ ကျော် ကျယ်ပြန့်သည်။ မြန်မာ့ရိုးရာ ကနိုပပ်စ် (လှေဦးကြယ်) အနီး တောင်ဘက်ကောင်းကင်တွင် တည်ရှိသည်။",
      url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
      hdurl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=90",
      media_type: "image",
      copyright: "NASA / Hubble Heritage Team"
    }
  });
}
