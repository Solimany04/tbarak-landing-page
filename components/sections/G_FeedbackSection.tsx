import FeedbackCarousel from "../FeedbackCarousel";
import { getFeedbacks } from "@/lib/content/feedbacks";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

const FeedbackSection = async () => {
  const locale = (await getLocale()) as Locale;
  const items = await getFeedbacks(locale);
  const t = await getTranslations("feedback");

  return (
    <div className="overflow-hidden w-full relative scroll-mt-21" id='feedback-section'>
      <div className="flex flex-col lg:mt-28 md:mt-12 mt-16 gap-16 mb-24 w-400 mx-auto">
        <h2 className="text-center font-semibold text-5xl ">{t("heading")} <span className='text-accent'>{t("brand")}</span></h2>
        <FeedbackCarousel dummyFeedbacks={items} />
      </div>
    </div>
  )
}

export default FeedbackSection
