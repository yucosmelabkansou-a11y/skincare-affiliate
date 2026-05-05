import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
