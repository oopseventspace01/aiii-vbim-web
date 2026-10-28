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

/** 最新媒體報導（VBIM 頁等） */
export const LATEST_MEDIA_QUERY = `*[_type == "news" && category == "media" && language == $lang && publishedAt <= now()]
  | order(publishedAt desc)[0...6] ${NEWS_CARD}`;

/** 最新消息頁：所有已發布消息（兩種語言），在網站端依語言挑選版本 */
export const ALL_NEWS_QUERY = `*[_type == "news" && publishedAt <= now()] | order(publishedAt desc){
  _id,
  language,
  title,
  "slug": slug.current,
  category,
  source,
  externalUrl,
  internalPath,
  publishedAt,
  displayDate,
  excerpt,
  featured,
  eventDate,
  eventLocation,
  registerUrl,
  cover ${IMAGE},
  body,
  seo { metaTitle, metaDescription, noIndex, ogImage ${IMAGE} },
  "group": *[_type == "translation.metadata" && references(^._id)][0]._id
}`;

/** 案例：只抓「公開顯示」的案例（兩種語言），在網站端依語言挑選版本 */
export const PUBLIC_CASES_QUERY = `*[_type == "caseStudy" && isPublic == true]{
  _id,
  language,
  title,
  "slug": slug.current,
  clientDisplayName,
  pain,
  modules,
  results[]{ metric, value, note },
  gallery[]{ alt, asset->{ _id, url, metadata { dimensions { width, height } } } },
  body,
  "solution": solution->{ name, "slug": slug.current },
  "group": *[_type == "translation.metadata" && references(^._id)][0]._id
}`;

/** 已授權、可顯示的夥伴 Logo */
export const APPROVED_PARTNERS_QUERY = `*[_type == "partner" && logoApproved == true && language == $lang] | order(name asc){
  name, type, tier, website, showOnHome, logo ${IMAGE}
}`;

/** 認證課程（含梯次） */
export const COURSES_QUERY = `*[_type == "course" && language == $lang] | order(title asc){
  title, "slug": slug.current, level, summary, registerMode, externalUrl,
  sessions[]{ startDate, endDate, location, seats, price, status }
}`;

/** 一般頁（關於、隱私權等） */
export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug && language in [$lang, "zh-Hant"]]{
  _id, language, title, body, seo { metaTitle, metaDescription, noIndex, ogImage ${IMAGE} }
}`;
