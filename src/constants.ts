export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Helper: convert seconds to frames
export const s = (seconds: number): number => Math.round(seconds * FPS);

// ─── Color Palette ────────────────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  darkBg: '#060810',
  deepBlue: '#0a1628',
  navyBlue: '#0d1b2a',
  deepPurple: '#1a0a2e',
  midPurple: '#2d1b69',
  brightPurple: '#4a2c8a',

  // Accent / Gold
  gold: '#f59e0b',
  goldBright: '#fbbf24',
  goldLight: '#fcd34d',
  goldPale: '#fef3c7',

  // Light / Glory
  white: '#ffffff',
  offWhite: '#f8f4e3',
  gloryYellow: '#fffde7',
  divineWhite: '#fffde7',

  // Dramatic
  crimson: '#8b0000',
  warmOrange: '#ea580c',
  dawn: '#ff8c42',
  skyBlue: '#1e3a5f',
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const FONTS = {
  hook: '"Impact", "Arial Black", sans-serif',
  body: '"Inter", "Helvetica Neue", Arial, sans-serif',
  scripture: '"Playfair Display", "Georgia", serif',
  number: '"Impact", "Arial Black", sans-serif',
};

// ─── Scene Timings (seconds) ─────────────────────────────────────────────────
export const TIMING = {
  coldOpen:   { start: 0,   dur: 15  },
  title:      { start: 15,  dur: 15  },
  signs: [
    { start: 30,  dur: 100 }, // Sign 1
    { start: 130, dur: 100 }, // Sign 2
    { start: 230, dur: 100 }, // Sign 3
    { start: 330, dur: 100 }, // Sign 4
    { start: 430, dur: 100 }, // Sign 5
  ],
  conclusion: { start: 530, dur: 90 },
  total: 620, // ~10 min 20 sec
};

// ─── Sign Data ────────────────────────────────────────────────────────────────
export const SIGNS = [
  {
    number: 1,
    title: 'Constant Conviction',
    subtitle: '& Restlessness',
    description: 'That quiet unease after certain songs isn\'t just in your head',
    scripture: 'The mind governed by the flesh is death, but the mind governed by the Spirit is life and peace.',
    scriptureRef: 'Romans 8:6',
    primaryColor: '#1a0a2e',
    accentColor: '#4a2c8a',
    glowColor: '#7c3aed',
    narratorLines: [
      "Have you ever noticed...",
      "...that after listening to certain music,",
      "something inside you just doesn't feel right?",
      "That quiet unease isn't just in your head.",
      "It's the Holy Spirit saying —",
      "this isn't where I dwell.",
      "Conviction is God's kindness.",
      "He's not condemning you.",
      "He's calling you higher.",
    ],
    // Midjourney / Grok Imagine prompt for this scene's hero image:
    imagePrompt:
      'Cinematic dark bedroom 3am, person lying awake, blue glow of smartphone illuminating troubled face, headphones around neck, restless expression, moody chiaroscuro lighting, photorealistic, 8k, cinematic color grading, deep shadow',
  },
  {
    number: 2,
    title: 'Worship Music',
    subtitle: 'Feels Distant',
    description: 'When Sunday mornings leave your spirit unmoved',
    scripture: 'He put a new song in my mouth, a hymn of praise to our God.',
    scriptureRef: 'Psalm 40:3',
    primaryColor: '#0a1628',
    accentColor: '#1e3a5f',
    glowColor: '#2563eb',
    narratorLines: [
      "When was the last time",
      "a worship song moved you to tears?",
      "If the answer is...",
      "...you can't even remember —",
      "ask yourself:",
      "what have you been feeding your spirit?",
      "The ear gets accustomed",
      "to what it hears most.",
    ],
    imagePrompt:
      'Cinematic church congregation in warm golden light, everyone worshipping with raised hands, one person in crowd standing still disconnected looking down at phone, emotional contrast, photorealistic, 8k, shallow depth of field, bokeh',
  },
  {
    number: 3,
    title: 'Lyrics Shape',
    subtitle: 'Your Thoughts',
    description: 'What you hear becomes what you think',
    scripture:
      'Whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely — think about such things.',
    scriptureRef: 'Philippians 4:8',
    primaryColor: '#1a0518',
    accentColor: '#6b21a8',
    glowColor: '#9333ea',
    narratorLines: [
      "Science confirms what scripture has always said —",
      "the words we consume",
      "become the thoughts we think.",
      "When lyrics celebrate lust, rage, or hopelessness...",
      "...your inner world begins to mirror those words.",
      "What soundtrack is playing",
      "in the theatre of your mind?",
    ],
    imagePrompt:
      'Cinematic split screen: left side dark storm clouds made of musical notes and lyrics swirling into a person\'s mind, right side golden light musical notes becoming flowers and light beams entering a peaceful mind, symbolic surreal, photorealistic, 8k',
  },
  {
    number: 4,
    title: 'The Holy Spirit',
    subtitle: 'Brings Songs to Mind',
    description: "Heaven places specific songs in your heart",
    scripture:
      'The Holy Spirit will teach you all things and will remind you of everything I have said to you.',
    scriptureRef: 'John 14:26',
    primaryColor: '#0d1b2a',
    accentColor: '#d97706',
    glowColor: '#f59e0b',
    narratorLines: [
      "Has a worship song",
      "ever just... appeared in your thoughts?",
      "Not randomly —",
      "but at exactly the right moment?",
      "The Holy Spirit speaks through music.",
      "He is a divine composer.",
      "But if your playlist drowns Him out —",
      "how will you hear?",
    ],
    imagePrompt:
      'Cinematic close-up of person\'s face, eyes closed looking upward, golden divine light shafts falling on face, musical notes made of pure light floating in air, spiritual ethereal atmosphere, photorealistic, 8k, cinematic glow',
  },
  {
    number: 5,
    title: 'No Spiritual Peace',
    subtitle: 'or Breakthrough',
    description: "When prayers feel like they hit the ceiling",
    scripture:
      'You will keep in perfect peace those whose minds are steadfast, because they trust in you.',
    scriptureRef: 'Isaiah 26:3',
    primaryColor: '#0a0a1a',
    accentColor: '#ea580c',
    glowColor: '#f97316',
    narratorLines: [
      "You're praying —",
      "but heaven feels silent.",
      "You're reading the Bible —",
      "but nothing is sticking.",
      "Could it be...",
      "...that your spiritual atmosphere",
      "is being polluted",
      "by what you're listening to?",
    ],
    imagePrompt:
      'Cinematic split transformation: left person kneeling in prayer in dark cracked earth, right same person arms raised in golden sunrise light over open Bible on grass, dramatic sky, photorealistic, 8k, emotional contrast',
  },
];
