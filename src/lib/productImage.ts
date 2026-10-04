import type { Product } from "@/types/product";

/** Prefer a validated HTTPS publication image, then the existing local asset. */
export function getProductImageSrc(product: Pick<Product, "image_url" | "image_filename">): string {
  const imageUrl = product.image_url?.trim() ?? "";
  if (/^https:\/\/[^\s]+$/i.test(imageUrl)) {
    return imageUrl;
  }

  const filename = product.image_filename?.trim() ?? "";
  return filename ? `/images/${filename}` : "";
}
