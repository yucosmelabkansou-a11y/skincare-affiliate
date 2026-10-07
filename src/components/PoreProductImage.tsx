import Image from 'next/image'

// 毛穴診断専用の表示用復旧。商品DB・元の商品情報・購入リンクは変更しない。
const RESTORED_IMAGES: Record<string, string> = {
  'https://www.yun-skin-care.com/写真入れ/クリーム/KISO アゼライン酸15クリーム.jpg': '/images/pore-diagnosis/kiso-balancing-cream-az-15.jpg',
  'https://www.yun-skin-care.com/写真入れ/美容液/メラノCC 薬用しみ集中対策プレミアム美容液.jpg': '/images/pore-diagnosis/melano-cc-premium-essence.jpg',
  'https://www.yun-skin-care.com/写真入れ/化粧水/ONE BY KOSÉ セラムチューナー.jpg': '/images/pore-diagnosis/one-by-kose-balancing-tuner.png',

  // 旧「写真入れ」参照を、既存画像または同じ元画像を復旧した公開パスへ対応付ける。
  'https://www.yun-skin-care.com/写真入れ/クリーム/エリクシール レチノパワー リンクルクリームS.jpg': '/images/pore-diagnosis/elixir-retinopower-wrinkle-cream-s.jpg',
  'https://www.yun-skin-care.com/写真入れ/クリーム/トゥヴェール レチノショット 0.1.jpg': '/images/pore-diagnosis/tout-vert-retinoshot-01.jpg',
  'https://www.yun-skin-care.com/写真入れ/クレンジング/ソフティモ クリアプロ クッションクレンジングオイル.jpg': '/images/pore-diagnosis/softymo-clear-pro-cushion-cleansing-oil.jpg',
  'https://www.yun-skin-care.com/写真入れ/化粧水/トゥヴェール スキンピーリングローション.jpg': '/images/pore-diagnosis/tout-vert-skin-peeling-lotion.jpg',
  'https://www.yun-skin-care.com/写真入れ/化粧水/IMG_1059.jpg': '/images/IMG_1059.jpg',
  'https://www.yun-skin-care.com/写真入れ/化粧水/IMG_1062.jpg': '/images/IMG_1062.jpg',
  'https://www.yun-skin-care.com/写真入れ/導入美容液/IMG_1167.jpg': '/images/IMG_1167.jpg',
  'https://www.yun-skin-care.com/写真入れ/日焼け止め/IMG_0873.jpg': '/images/IMG_0873.jpg',
  'https://www.yun-skin-care.com/写真入れ/洗顔料/IMG_1494.jpg': '/images/IMG_1494.jpg',
  'https://www.yun-skin-care.com/写真入れ/美容液/HAKU メラノフォーカスIV.webp': '/images/pore-diagnosis/haku-melanofocus-iv.webp',
  'https://www.yun-skin-care.com/写真入れ/美容液/IMG_1173.jpg': '/images/IMG_1173.jpg',
  'https://www.yun-skin-care.com/写真入れ/美容液/IMG_1179.jpg': '/images/IMG_1179.jpg',
  'https://www.yun-skin-care.com/写真入れ/美容液/IMG_1185.jpg': '/images/IMG_1185.jpg',
}

export default function PoreProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={RESTORED_IMAGES[src] ?? src}
      alt={alt}
      width={240}
      height={240}
      unoptimized
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  )
}
