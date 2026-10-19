import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

// 專案 ID 與 dataset 由環境變數提供（見根目錄 .env.example），不寫死在程式碼
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'aiii-vbim',
  title: 'Aiii VBIM 官網後台',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
