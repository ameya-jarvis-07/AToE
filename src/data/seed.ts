export type StateRecord = {
  id: string;
  name: string;
  slug: string;
  regionCode: string;
  description: string;
  mapFeatureId: string;
};
const entries: Array<[string, string, string, string, string]> = [
  [
    "IN-AN",
    "Andaman and Nicobar Islands",
    "andaman-and-nicobar-islands",
    "UT",
    "Andaman & Nicobar Islands",
  ],
  ["IN-AP", "Andhra Pradesh", "andhra-pradesh", "AP", "Andhra Pradesh"],
  [
    "IN-AR",
    "Arunachal Pradesh",
    "arunachal-pradesh",
    "AR",
    "Arunachal Pradesh",
  ],
  ["IN-AS", "Assam", "assam", "AS", "Assam"],
  ["IN-BR", "Bihar", "bihar", "BR", "Bihar"],
  ["IN-CH", "Chandigarh", "chandigarh", "UT", "Chandigarh"],
  ["IN-CT", "Chhattisgarh", "chhattisgarh", "CG", "Chhattisgarh"],
  [
    "IN-DN",
    "Dadra and Nagar Haveli and Daman and Diu",
    "dadra-and-nagar-haveli-and-daman-and-diu",
    "UT",
    "Dadra and Nagar Haveli and Daman and Diu",
  ],
  ["IN-DL", "Delhi", "delhi", "UT", "Delhi"],
  ["IN-GA", "Goa", "goa", "GA", "Goa"],
  ["IN-GJ", "Gujarat", "gujarat", "GJ", "Gujarat"],
  ["IN-HR", "Haryana", "haryana", "HR", "Haryana"],
  ["IN-HP", "Himachal Pradesh", "himachal-pradesh", "HP", "Himachal Pradesh"],
  [
    "IN-JK",
    "Jammu and Kashmir",
    "jammu-and-kashmir",
    "UT",
    "Jammu and Kashmir",
  ],
  ["IN-JH", "Jharkhand", "jharkhand", "JH", "Jharkhand"],
  ["IN-KA", "Karnataka", "karnataka", "KA", "Karnataka"],
  ["IN-KL", "Kerala", "kerala", "KL", "Kerala"],
  ["IN-LA", "Ladakh", "ladakh", "UT", "Ladakh"],
  ["IN-LD", "Lakshadweep", "lakshadweep", "UT", "Lakshadweep"],
  ["IN-MP", "Madhya Pradesh", "madhya-pradesh", "MP", "Madhya Pradesh"],
  ["IN-MH", "Maharashtra", "maharashtra", "MH", "Maharashtra"],
  ["IN-MN", "Manipur", "manipur", "MN", "Manipur"],
  ["IN-ML", "Meghalaya", "meghalaya", "ML", "Meghalaya"],
  ["IN-MZ", "Mizoram", "mizoram", "MZ", "Mizoram"],
  ["IN-NL", "Nagaland", "nagaland", "NL", "Nagaland"],
  ["IN-OR", "Odisha", "odisha", "OD", "Odisha"],
  ["IN-PY", "Puducherry", "puducherry", "UT", "Puducherry"],
  ["IN-PB", "Punjab", "punjab", "PB", "Punjab"],
  ["IN-RJ", "Rajasthan", "rajasthan", "RJ", "Rajasthan"],
  ["IN-SK", "Sikkim", "sikkim", "SK", "Sikkim"],
  ["IN-TN", "Tamil Nadu", "tamil-nadu", "TN", "Tamil Nadu"],
  ["IN-TG", "Telangana", "telangana", "TG", "Telangana"],
  ["IN-TR", "Tripura", "tripura", "TR", "Tripura"],
  ["IN-UP", "Uttar Pradesh", "uttar-pradesh", "UP", "Uttar Pradesh"],
  ["IN-UT", "Uttarakhand", "uttarakhand", "UT", "Uttarakhand"],
  ["IN-WB", "West Bengal", "west-bengal", "WB", "West Bengal"],
];
export const states: StateRecord[] = entries.map(
  ([id, name, slug, regionCode, mapFeatureId]) => ({
    id,
    name,
    slug,
    regionCode,
    description: `A field guide to hospitalities and places in ${name}.`,
    mapFeatureId,
  }),
);
export type Cafe = {
  id: string;
  stateId: string;
  name: string;
  slug: string;
  city: string | null;
  description: string;
  ambienceTags: string[];
  specialties: string[];
  priceRange: string | null;
  featured: boolean;
  published: boolean;
  verificationStatus: "draft" | "needs_verification" | "verified";
  sourceNotes: string;
  lastVerifiedAt: string | null;
  coverImagePath: string | null;
};
export let cafes: Cafe[] = [
  {
    id: "matra-cafe",
    stateId: "IN-MH",
    name: "Matra Cafe",
    slug: "matra-cafe",
    city: null,
    description:
      "A personal favourite of SV. Calming atmosphere with a subtle connection to nature; a place to slow down and enjoy stillness.",
    ambienceTags: ["Calm", "Nature"],
    specialties: [],
    priceRange: null,
    featured: true,
    published: true,
    verificationStatus: "needs_verification",
    sourceNotes:
      "Supplied café profiles PDF. Nagpur context is suggested; individual location needs confirmation.",
    lastVerifiedAt: null,
    coverImagePath: null,
  },
  {
    id: "the-jacobs",
    stateId: "IN-MH",
    name: "The Jacobs",
    slug: "the-jacobs",
    city: null,
    description:
      "A distinctly Goan vibe focused on friendship, lingering conversations, shared laughter, and time with friends.",
    ambienceTags: ["Social", "Goan vibe"],
    specialties: [],
    priceRange: null,
    featured: true,
    published: true,
    verificationStatus: "needs_verification",
    sourceNotes:
      "Supplied café profiles PDF. Nagpur context is suggested; individual location needs confirmation.",
    lastVerifiedAt: null,
    coverImagePath: null,
  },
  {
    id: "rachels-cafe",
    stateId: "IN-MH",
    name: "Rachel's Cafe",
    slug: "rachels-cafe",
    city: null,
    description:
      "Designed for people on the move; a convenient place for a quick bite or a short pause between commitments.",
    ambienceTags: ["On the go"],
    specialties: [],
    priceRange: null,
    featured: true,
    published: true,
    verificationStatus: "needs_verification",
    sourceNotes:
      "Supplied café profiles PDF. Nagpur context is suggested; individual location needs confirmation.",
    lastVerifiedAt: null,
    coverImagePath: null,
  },
  {
    id: "apki-dulari",
    stateId: "IN-MH",
    name: "Apki Dulari",
    slug: "apki-dulari",
    city: null,
    description:
      "Its defining atmosphere and signature experience are awaiting confirmation.",
    ambienceTags: [],
    specialties: [],
    priceRange: null,
    featured: false,
    published: false,
    verificationStatus: "draft",
    sourceNotes: "Keep unpublished until editorial character is confirmed.",
    lastVerifiedAt: null,
    coverImagePath: null,
  },
];
