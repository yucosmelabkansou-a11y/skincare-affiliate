import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF優先（WebPより2〜3割小さい）。変換結果のキャッシュを31日保持して
    // Vercelの再変換コストを抑える（商品画像は差し替え時にファイル名が変わる運用）
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      {
        // Vercel デフォルトドメインへのアクセスは独自ドメインへ 301 で寄せる
        // （duplicate content 解消・正規ドメインに SEO 資産集中）
        // プレビューデプロイ（*-{hash}.vercel.app）は対象外
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'skincare-affiliate.vercel.app',
          },
        ],
        destination: 'https://www.yun-skin-care.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
