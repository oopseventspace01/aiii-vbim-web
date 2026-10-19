import type { StructureBuilder, StructureResolver } from 'sanity/structure';
import { LANGUAGES, siteSettingsId } from './lib/i18n';

// 一般內容類型：先選語言，再看該語言的文件列表
function byLanguage(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .title(title)
    .id(type)
    .schemaType(type)
    .child(
      S.list()
        .title(title)
        .id(`${type}-languages`)
        .items([
          ...LANGUAGES.map((lang) =>
            S.listItem()
              .title(lang.title)
              .id(`${type}-${lang.id}`)
              .schemaType(type)
              .child(
                S.documentList()
                  .title(`${title}（${lang.title}）`)
                  .schemaType(type)
                  .apiVersion('2025-02-19')
                  .filter('_type == $type && language == $language')
                  .params({ type, language: lang.id })
                  .initialValueTemplates([S.initialValueTemplateItem(`${type}-${lang.id}`)]),
              ),
          ),
          S.divider(),
          S.listItem()
            .title('全部語言')
            .id(`${type}-all`)
            .schemaType(type)
            .child(S.documentTypeList(type).title(`${title}（全部語言）`)),
        ]),
    );
}

// SPEC 5.9 側欄順序：全站設定 → 最新消息 → 案例 → 認證課程 → 夥伴 → 場域 → 一般頁
export const structure: StructureResolver = (S) =>
  S.list()
    .title('內容')
    .items([
      S.listItem()
        .title('全站設定')
        .id('siteSettings')
        .schemaType('siteSettings')
        .child(
          S.list()
            .title('全站設定')
            .id('siteSettings-languages')
            .items(
              LANGUAGES.map((lang) =>
                S.documentListItem()
                  .schemaType('siteSettings')
                  .id(siteSettingsId(lang.id))
                  .title(`全站設定（${lang.title}）`),
              ),
            )
            .canHandleIntent(
              (intentName, params) =>
                intentName === 'edit' && String(params.id).startsWith('siteSettings'),
            ),
        ),
      S.divider(),
      byLanguage(S, 'news', '最新消息'),
      byLanguage(S, 'caseStudy', '案例'),
      byLanguage(S, 'course', '認證課程'),
      byLanguage(S, 'partner', '夥伴'),
      byLanguage(S, 'solution', '場域'),
      byLanguage(S, 'page', '一般頁'),
    ]);
