import { defineConfig, type DocumentActionComponent } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  documentInternationalization,
  useDeleteTranslationAction,
} from '@sanity/document-internationalization';
import { schemaTypes } from './schemas';
import { structure } from './structure';
import { I18N_TYPES, LANGUAGES, SITE_SETTINGS_ID_PREFIX } from './lib/i18n';

// 專案 ID 與 dataset 由環境變數提供（見根目錄 .env.example），不寫死在程式碼
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

const i18nTypes: readonly string[] = I18N_TYPES;
const isSiteSettings = (templateOrType: string) =>
  templateOrType.startsWith(SITE_SETTINGS_ID_PREFIX);

export default defineConfig({
  name: 'aiii-vbim',
  title: 'Aiii VBIM 官網後台',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure, title: '內容' }),
    documentInternationalization({
      supportedLanguages: [...LANGUAGES],
      schemaTypes: [...I18N_TYPES],
      languageField: 'language',
      weakReferences: true,
    }),
    visionTool({ title: '查詢（工程用）' }),
  ],
  schema: {
    types: schemaTypes,
    // 新增文件時一定要先選語言；全站設定是固定文件，不能新增
    templates: (prev) => prev.filter((t) => !i18nTypes.includes(t.id) && !isSiteSettings(t.id)),
  },
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => !isSiteSettings(item.templateId)),
    actions: (prev, context) => {
      // 全站設定不可刪除或複製
      if (context.schemaType === 'siteSettings') {
        return prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate');
      }
      if (i18nTypes.includes(context.schemaType)) {
        // 外掛的型別與 sanity 6 的 DocumentActionComponent 宣告略有差異，執行上相容
        return [...prev, useDeleteTranslationAction as unknown as DocumentActionComponent];
      }
      return prev;
    },
  },
});
