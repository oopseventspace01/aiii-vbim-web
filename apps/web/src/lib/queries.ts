// GROQ 查詢（Sanity 的查詢語法）
const IMAGE = `{ alt, asset->{ _id, url, metadata { dimensions { width, height } } } }`;

const NEWS_CARD = `{
  title,
  "slug": slug.current,
  category,
  source,
  externalUrl,
  internalPath,
  publishedAt,
  displayDate,
  excerpt,
  cover ${IMAGE}
}`;

/** 首頁：全站設定＋產品發表、媒體報導各最多 5 則（實際顯示幾則由全站設定決定） */
export const HOME_QUERY = `{
  "settings": *[_type == "siteSettings" && language == $lang][0]{
    heroTitle,
    heroSubtitle,
    heroBody,
    heroVideoUrl,
    heroPoster ${IMAGE},
    proofItems[]{ label, value },
    commandCenterImage ${IMAGE},
    companyName,
    address,
    phone,
    email,
    appStoreUrl,
    googlePlayUrl,
    lineOfficialUrl,
    lineQrCode ${IMAGE},
    socialLinks[]{ platform, url },
    footerTagline,
    homeNewsCount,
    seo { metaTitle, metaDescription }
  },
  "product": *[_type == "news" && category == "product" && language == $lang && publishedAt <= now()]
    | order(publishedAt desc)[0...5] ${NEWS_CARD},
  "media": *[_type == "news" && category == "media" && language == $lang && publishedAt <= now()]
    | order(publishedAt desc)[0...5] ${NEWS_CARD}
}`;

/** 頁尾等共用：只抓全站設定 */
export const SETTINGS_QUERY = `*[_type == "siteSettings" && language == $lang][0]{
  companyName, address, phone, email, appStoreUrl, googlePlayUrl,
  lineOfficialUrl, lineQrCode ${IMAGE}, socialLinks[]{ platform, url }, footerTagline
}`;
