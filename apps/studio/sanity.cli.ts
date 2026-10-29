import { defineCliConfig } from 'sanity/cli';
import '../../scripts/load-root-env.mjs';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // 後台發布在 https://aiii-vbim.sanity.studio（npm run studio:deploy）；官網 /admin 會跳轉過來
  deployment: {
    appId: 'hyw66kt6lxuv5qk4b6hwlu0m',
  },
});
