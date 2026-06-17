import FeedbackCarousel from "../FeedbackCarousel";
import { FeedbackCardProps } from "@/app/utils/types";

const dummyFeedbacks: FeedbackCardProps[] = [
  {
    avatar: "/FeadbackAvatars/Ellipse.png",
    name: "عبدالله عبدالخالق1",
    desc: "ورشة تصميم مفروشات",
    content: "ثبات الألوان ممتاز، والقماش يتحمل الغسيل المستمر دون أي مشاكل."
  },
  {
    avatar: "/FeadbackAvatars/Ellipse.png",
    name: "خالد صقر1",
    desc: "مصنع ملابس أطفال",
    content: "الملمس الداخلي ناعم جدًا، والمنتج النهائي يعطي إحساس بالفخامة."
  },
  {
    avatar: "/FeadbackAvatars/Ellipse.png",
    name: "سامي حسن1",
    desc: "مصنع السويس",
    content: "جودة ممتازة ونعومة لا تُصدق، استخدمناه في إنتاج تيشرتات العملاء وكانت النتيجة رائعة!"
  },
  {
    avatar: "/FeadbackAvatars/Ellipse.png",
    name: "عبدالله عبدالخالق2",
    desc: "ورشة تصميم مفروشات",
    content: "ثبات الألوان ممتاز، والقماش يتحمل الغسيل المستمر دون أي مشاكل."
  },
  {
    avatar: "/FeadbackAvatars/Ellipse.png",
    name: "خالد صقر2",
    desc: "مصنع ملابس أطفال",
    content: "الملمس الداخلي ناعم جدًا، والمنتج النهائي يعطي إحساس بالفخامة."
  },
];

const FeedbackSection = () => {
  return (
    <div className="overflow-hidden w-full relative">
      <div className="flex flex-col md:m-28 gap-16 mb-24">
        <h2 className="text-center font-semibold text-5xl ">آراء عملاء <span className='text-accent'>تبارك</span></h2>

        <FeedbackCarousel dummyFeedbacks={dummyFeedbacks} />
      </div>
    </div>
  )
}

export default FeedbackSection