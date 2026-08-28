import { ProductCarousel } from "../ProductCarousel";
import { getProducts } from "@/lib/content/products";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

const Products = async () => {
  const locale = (await getLocale()) as Locale;
  const items = await getProducts(locale);
  const t = await getTranslations("products");

  return (
    <div className=" w-full overflow-hidden mb-16 scroll-mt-16" id="products-section">
      <h1 className=" font-semibold text-5xl mx-auto my-16 w-fit">
        {t("heading")} <span className="text-secondary">{t("brand")}</span>
      </h1>
      <ProductCarousel items={items} dir={locale === "ar" ? "rtl" : "ltr"} />
    </div>
  );
};

export default Products;
