{/*
  

"use client";

// نستخدم useFormState للتعامل مع رد السيرفر و useFormStatus لحالة التحميل
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
// import { redirectToWhatsApp } from "@/lib/actions/actions";
import { MessageCircle, Loader2 } from "lucide-react";

// مكون الزر الداخلي (لفصل حالة الـ pending)
function SubmitButton() {
  const { pending } = useFormStatus(); // لمعرفة هل السيرفر يعمل الآن أم انتهى

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-green-600 hover:bg-green-700 text-white gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          جاري التحويل...
        </>
      ) : (
        <>
          <MessageCircle size={20} />
          تواصل معي عبر واتساب
        </>
      )}
    </Button>
  );
}

// المكون الرئيسي
export default function WhatsAppButton() {
  // ربط الـ Server Action بالواجهة
  const [state, formAction] = useFormState(redirectToWhatsApp, null);

  return (
    <form action={formAction} className="flex flex-col gap-2 items-start">
      <SubmitButton />
      // إذا رد السيرفر بوجود خطأ (تجاوز الحد)، نعرض الرسالة هنا 
      {state?.error && (
        <p className="text-red-500 text-sm font-medium animate-in fade-in">
          {state.error}
        </p>
      )}
    </form>
  );
}
*/}