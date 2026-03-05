{/*
  
  "use server";
  
  import { redirect } from "next/navigation";
  import { headers } from "next/headers";
  // نستخدم مكتبة Upstash الافتراضية للـ Rate Limiting في Next.js
  import { Ratelimit } from "@upstash/ratelimit";
  import { Redis } from "@upstash/redis";
  
  // إنشاء الـ Rate Limiter: يسمح بـ 3 محاولات فقط كل دقيقة للـ IP الواحد
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 m"),
  });
  
  // لاحظ: أضفنا prevState لأننا سنستخدمها مع useFormState في الواجهة
  export async function redirectToWhatsApp(prevState: any, formData: FormData) {
    // 1. الحصول على عنوان الـ IP للمستخدم
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  
    // 2. فحص هل هذا الـ IP تجاوز الحد المسموح؟
    const { success } = await ratelimit.limit(ip);
  
    if (!success) {a
      // إذا ضغط أكثر من 3 مرات في الدقيقة، نرفض التحويل ونرسل رسالة خطأ
      return { error: "لقد حاولت عدة مرات. يرجى الانتظار دقيقة ثم المحاولة مرة أخرى." };
    }
  
    // 3. إذا كان المستخدم سليماً، نقوم بتجهيز الرابط
    const myPhoneNumber = process.env.WHATSAPP_NUMBER || "201012345678"; 
    const message = encodeURIComponent("أهلاً، أنا مهتم بخدماتك المعروضة على الموقع.");
    
    // 4. التحويل بأمان
    redirect(`https://wa.me/${myPhoneNumber}?text=${message}`);
  }
  */}