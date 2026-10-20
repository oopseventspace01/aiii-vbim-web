// 預約／申請／登記表單設定檔（SPEC 6.4 步驟 B、P5 決定 2026-10-20）
// 題目與選項文字逐字取自設計稿：Contact、Partners、Academy（含 en- 版本）。
// 之後增減題目或選項只改這個檔案；改了題目請把 FORM_VERSION 加一。
import type { Locale } from '../lib/i18n';

export const FORM_VERSION = '2026-10-20.1';

type Text = Record<Locale, string>;
export interface Option {
  id: string;
  label: Text;
}

/** 表單出現在哪一頁：聯絡我們（可切換身分）、生態夥伴申請、認證學院登記 */
export type FormVariant = 'contact' | 'partner' | 'academy';
export type Role = 'owner' | 'partner' | 'talent';

export const ROLES: { id: Role; label: Text; message: Text }[] = [
  {
    id: 'owner',
    label: { 'zh-Hant': '業主／企業', en: 'Owner / enterprise' },
    message: { 'zh-Hant': '想解決的問題', en: 'What would you like to solve?' },
  },
  {
    id: 'partner',
    label: { 'zh-Hant': '設備商／SI／技術夥伴', en: 'Vendor / SI / tech partner' },
    message: {
      'zh-Hant': '想接入的產品或技術',
      en: 'What product or technology would you like to integrate?',
    },
  },
  {
    id: 'talent',
    label: { 'zh-Hant': '想取得認證的人才', en: 'Professional seeking certification' },
    message: { 'zh-Hant': '想了解的內容', en: 'What would you like to learn?' },
  },
];

export const SITE_TYPES: Option[] = [
  { id: 'hospital', label: { 'zh-Hant': '醫院／醫療園區', en: 'Hospital / medical campus' } },
  { id: 'retail', label: { 'zh-Hant': '商場／零售', en: 'Retail / mall' } },
  { id: 'factory', label: { 'zh-Hant': '工廠／科技廠', en: 'Factory / fab' } },
  { id: 'office', label: { 'zh-Hant': '辦公／商辦', en: 'Office' } },
  { id: 'energy', label: { 'zh-Hant': '能源／資料中心', en: 'Energy / data center' } },
  { id: 'architect', label: { 'zh-Hant': '建築師事務所', en: 'Architecture firm' } },
  { id: 'other', label: { 'zh-Hant': '其他', en: 'Other' } },
];

export const PARTNER_TYPES: Option[] = [
  { id: 'power', label: { 'zh-Hant': '重電／機電', en: 'Power / MEP' } },
  { id: 'hvac', label: { 'zh-Hant': 'HVAC／ESCO', en: 'HVAC / ESCO' } },
  { id: 'energy', label: { 'zh-Hant': '能源廠商', en: 'Energy' } },
  { id: 'ai-hardware', label: { 'zh-Hant': 'AI 硬體', en: 'AI hardware' } },
  { id: 'security', label: { 'zh-Hant': '資安／Identity', en: 'Security / Identity' } },
  { id: 'si', label: { 'zh-Hant': 'SI／MSP', en: 'SI / MSP' } },
  { id: 'consultant', label: { 'zh-Hant': '工程顧問／建築師', en: 'Consultant / Architect' } },
];

export const MODULES: Option[] = [
  { id: 'bim', label: { 'zh-Hant': 'BIM／PMIS', en: 'BIM / PMIS' } },
  { id: 'energy', label: { 'zh-Hant': 'Energy', en: 'Energy' } },
  { id: 'hvac', label: { 'zh-Hant': 'HVAC', en: 'HVAC' } },
  { id: 'vision', label: { 'zh-Hant': 'Vision', en: 'Vision' } },
  { id: 'aiot', label: { 'zh-Hant': 'AIoT', en: 'AIoT' } },
  { id: 'edge-ai', label: { 'zh-Hant': 'Edge AI', en: 'Edge AI' } },
];

export const JOB_ROLES: Option[] = [
  { id: 'architect', label: { 'zh-Hant': '建築師／設計師', en: 'Architect / designer' } },
  {
    id: 'consultant',
    label: { 'zh-Hant': '工程顧問／機電顧問', en: 'Engineering / MEP consultant' },
  },
  { id: 'contractor', label: { 'zh-Hant': '營造／工程師', en: 'Contractor / engineer' } },
  { id: 'si', label: { 'zh-Hant': '系統整合／IT', en: 'System integration / IT' } },
  {
    id: 'facility',
    label: { 'zh-Hant': '物業／設施管理', en: 'Facility / property management' },
  },
  { id: 'student', label: { 'zh-Hant': '學生', en: 'Student' } },
  { id: 'other', label: { 'zh-Hant': '其他', en: 'Other' } },
];

/** 欄位標籤（設計稿原文，不含必填星號；星號由元件依必填與否加上） */
export const LABELS: Record<string, Text> = {
  role: { 'zh-Hant': '我是', en: 'I am' },
  company: { 'zh-Hant': '公司名稱', en: 'Company' },
  name: { 'zh-Hant': '姓名', en: 'Name' },
  contactName: { 'zh-Hant': '聯絡人', en: 'Contact name' },
  email: { 'zh-Hant': 'Email', en: 'Email' },
  phone: { 'zh-Hant': '電話', en: 'Phone' },
  website: { 'zh-Hant': '公司網站', en: 'Website' },
  siteType: { 'zh-Hant': '場域類型', en: 'Site type' },
  partnerType: { 'zh-Hant': '夥伴類型', en: 'Partner type' },
  module: { 'zh-Hant': '有興趣的模組', en: 'Module of interest' },
  modules: { 'zh-Hant': '有興趣的模組（可複選）', en: 'Modules of interest (select any)' },
  organization: { 'zh-Hant': '服務單位', en: 'Organization' },
  jobRole: { 'zh-Hant': '目前職務', en: 'Role' },
  partnerMessage: { 'zh-Hant': '想接入的產品或技術', en: 'Product or technology to integrate' },
  consent: {
    'zh-Hant': '我同意依隱私權政策處理我提供的資料',
    en: 'I agree to the processing of my data under the privacy policy',
  },
  selectPlaceholder: { 'zh-Hant': '請選擇', en: 'Select' },
};

/** 送出按鈕與成功訊息（設計稿原文） */
export const VARIANT_TEXT: Record<FormVariant, { submit: Text; success: Text }> = {
  contact: {
    submit: { 'zh-Hant': '送出', en: 'Send' },
    success: {
      'zh-Hant': '已收到！我們會盡快與你聯繫，並寄一封確認信到你的信箱。',
      en: 'Thank you! We’ll be in touch soon and have sent a confirmation to your inbox.',
    },
  },
  partner: {
    submit: { 'zh-Hant': '送出申請', en: 'Submit application' },
    success: {
      'zh-Hant': '申請已送出，我們會盡快與你聯繫。',
      en: 'Application received — we’ll be in touch shortly.',
    },
  },
  academy: {
    submit: { 'zh-Hant': '登記', en: 'Register' },
    success: {
      'zh-Hant': '登記完成，開放報名時會通知你。',
      en: 'You’re registered — we’ll let you know when enrollment opens.',
    },
  },
};

/**
 * 程式另外加的介面文字（設計稿沒有；不在逐字比對範圍）
 * 英文為 Claude 翻譯，[EN 待確認]
 */
export const FORM_UI: Record<Locale, Record<string, string>> = {
  'zh-Hant': {
    sending: '送出中…',
    leadCode: '預約編號',
    leadCodeHint:
      '確認信也會附上這個編號。想詢問進度時，回覆確認信或在 LINE 官方帳號提供編號即可。',
    checklistTitle: '填寫需求表，讓我們更快了解你的需求',
    checklistLead: '不確定的項目可以先略過。確認信裡也有這個連結和 PDF 版本。',
    checklistButton: '線上填寫需求表',
    optional: '（選填）',
    newTab: '（另開新視窗）',
    errorValidation: '有欄位需要修正，請檢查標示的欄位。',
    errorTurnstile: '請先完成驗證後再送出。',
    errorRateLimit: '送出次數太多，請稍後再試。',
    errorGeneric: '目前無法送出，請稍後再試，或直接來信：',
    fieldRequired: '這一欄必填',
    fieldEmail: '請填寫正確的 Email',
    fieldUrl: '請填寫完整網址，例如 https://example.com',
    fieldTooLong: '內容太長了',
    fieldConsent: '請勾選同意隱私權政策',
    privacyLink: '隱私權政策',
  },
  en: {
    sending: 'Sending…',
    leadCode: 'Reference number',
    leadCodeHint:
      'We’ve included this number in your confirmation email. To check on progress, reply to that email or send the number to our LINE Official Account.',
    checklistTitle: 'Fill in the requirements checklist so we can understand your needs faster',
    checklistLead:
      'You can skip anything you’re unsure of. The checklist is in Traditional Chinese; the link and a PDF version are also in your confirmation email.',
    checklistButton: 'Open the checklist',
    optional: ' (optional)',
    newTab: '(opens in a new tab)',
    errorValidation: 'Some fields need attention. Please check the highlighted fields.',
    errorTurnstile: 'Please complete the verification before sending.',
    errorRateLimit: 'Too many submissions. Please try again later.',
    errorGeneric: 'We couldn’t send your form right now. Please try again later or email us at ',
    fieldRequired: 'This field is required',
    fieldEmail: 'Please enter a valid email address',
    fieldUrl: 'Please enter a full URL, e.g. https://example.com',
    fieldTooLong: 'This is too long',
    fieldConsent: 'Please agree to the privacy policy',
    privacyLink: 'Privacy Policy',
  },
};

/** 各頁面表單固定的身分（聯絡我們可切換，預設業主） */
export const VARIANT_ROLE: Record<FormVariant, Role> = {
  contact: 'owner',
  partner: 'partner',
  academy: 'talent',
};

/** 需求表（Andy 設計的 4 份；網址放在 .env，不進 repo） */
export type ChecklistKey = 'building' | 'manufacturing' | 'medical' | 'retail';

/** 場域 → 需求表（2026-10-20 業主確認） */
export const SITE_CHECKLIST: Record<string, ChecklistKey> = {
  hospital: 'medical',
  retail: 'retail',
  factory: 'manufacturing',
  office: 'building',
  energy: 'building',
  architect: 'building',
  other: 'building',
};

export const CHECKLIST_NAMES: Record<ChecklistKey, string> = {
  building: '智慧建築需求檢查表',
  manufacturing: '智慧製造需求檢查表',
  medical: '智慧醫療長照需求檢查表',
  retail: '智慧零售需求檢查表',
};

export const LIMITS = { short: 100, long: 200, phone: 40, message: 2000 } as const;
