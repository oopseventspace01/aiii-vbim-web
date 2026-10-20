// 內文相關的小工具（純函式，方便單元測試）

/** Sanity 圖片編號格式 image-<hash>-<寬>x<高>-<格式>，從中取出尺寸 */
export function dimensionsFromRef(ref: string): { width: number; height: number } | undefined {
  const match = ref.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return undefined;
  return { width: Number(match[1]), height: Number(match[2]) };
}

/** 取出 YouTube 影片 ID（支援 watch?v=、youtu.be/、shorts/、embed/） */
export function youtubeId(url: string): string | undefined {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
    let id: string | null | undefined;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1];
    }
    return id && /^[\w-]{6,20}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

/** http(s) 開頭且不是本站的網址視為外部連結 */
export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?aiiivbim\.com(\/|$)/i.test(href);
}
