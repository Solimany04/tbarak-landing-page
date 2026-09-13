"use client"
import { useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { makeContactSchema, ContactFormData } from "@/lib/actions/contact/contact-schema";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl";


import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const contactSchema = useMemo(
    () =>
      makeContactSchema({
        firstNameRequired: t("validation.firstNameRequired"),
        firstNameTooLong: t("validation.firstNameTooLong"),
        lastNameRequired: t("validation.lastNameRequired"),
        lastNameTooLong: t("validation.lastNameTooLong"),
        emailInvalid: t("validation.emailInvalid"),
        emailTooLong: t("validation.emailTooLong"),
        phoneInvalid: t("validation.phoneInvalid"),
        messageTooShort: t("validation.messageTooShort"),
        messageTooLong: t("validation.messageTooLong"),
        tokenRequired: t("validation.tokenRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
      token: "",
      company: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setErrorMessage(result.error || t("genericError"));
        turnstileRef.current?.reset();
        setValue("token", "");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(t("genericError"));
      turnstileRef.current?.reset();
      setValue("token", "");
    }
  };

  if (status === "success") {
    return (
      <main className="flex flex-col items-center justify-center w-full">
        <div className="shadow-sm w-full p-8 text-center bg-green-50/10 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold text-green-600 mb-2">{t("successTitle")}</h3>
          <p className="text-white">{t("successBody")}</p>
          <Button onClick={() => setStatus("idle")} className="mt-4 bg-accent hover:bg-white hover:text-primary">
            {t("sendAnother")}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center w-full">
      <div className="shadow-sm w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend className="w-full">
              {/* Honeypot field */}
              <div aria-hidden="true" style={{ position: "absolute", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap" }}>
                <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
              </div>

              <FieldGroup className="gap-3">
                <Field orientation="horizontal" className="">
                  <div className="w-full flex flex-col gap-1">
                    <FieldLabel htmlFor="firstName" className="sr-only">{t("firstName")}</FieldLabel>
                    <Input id="firstName" className="text-white font-normal" placeholder={t("firstName")} {...register("firstName")} />
                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <FieldLabel htmlFor="lastName" className="sr-only">{t("lastName")}</FieldLabel>
                    <Input id="lastName" className="text-white font-normal" placeholder={t("lastName")} {...register("lastName")} />
                    {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
                  </div>
                </Field>
                <Field>
                  <div className="w-full flex flex-col gap-1 ">
                    <FieldLabel htmlFor="email" className="sr-only">{t("email")}</FieldLabel>
                    <Input id="email" type="email" className="text-white font-normal" placeholder={t("email")} {...register("email")} />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                  </div>

                  <div className="w-full flex flex-col gap-1 ">
                    <FieldLabel htmlFor="phone" className="sr-only">{t("phone")}</FieldLabel>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          {...field}
                          id="phone"
                          // The layout of this widget (flag hanging outside the
                          // field on the `dir`-aware side, input at full width)
                          // cannot be expressed with Tailwind arbitrary
                          // variants: the library ships UNLAYERED css from
                          // node_modules, which outranks Tailwind's
                          // `@layer utilities` no matter the specificity.
                          // See the `.phone-field` block in app/globals.css.
                          className="phone-field"
                          placeholder={t("phone")}
                          defaultCountry="EG"
                          numberInputProps={{
                            // Purely cosmetic classes — kept 1:1 with
                            // components/ui/input.tsx so the phone field is
                            // indistinguishable from its siblings. Layout and
                            // text alignment are owned by `.phone-field`.
                            className: cn(
                              "h-13 w-full min-w-0 rounded-xl border border-input/20 bg-white/5 px-3 py-1",
                              "text-base text-white font-normal",
                              "placeholder:text-white/40 placeholder:font-normal placeholder:text-base",
                              "shadow-xs transition-[color,box-shadow] outline-none",
                              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                            ),
                          }}
                        />
                      )}
                    />
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                  </div>

                  <div className="w-full flex flex-col gap-1 mb-3">
                    <FieldLabel htmlFor="message" className="sr-only">{t("message")}</FieldLabel>
                    <Input id="message" className="text-white font-normal min-h-[100px] bg-white/5 placeholder:text-white/40 placeholder:font-normal placeholder:text-base placeholder:justify-start placeholder:align-top" placeholder={t("messagePlaceholder")} {...register("message")} />
                    {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
                  </div>
                </Field>
              </FieldGroup>
            </FieldLegend>
          </FieldSet>

          {status === "error" && (
            <div className="text-red-500 mb-3 text-sm font-medium" aria-live="assertive">
              {errorMessage}
            </div>
          )}

          <Field className="mt-2">
            <Button
              className="bg-accent hover:bg-white hover:text-primary font-normal text-[15px] disabled:opacity-50"
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </Button>
          </Field>

          <div className="my-4 flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
              onSuccess={(token) => {
                setValue("token", token, { shouldValidate: true });
              }}
              onError={() => {
                setErrorMessage(t("turnstileError"));
              }}
              onExpire={() => {
                setValue("token", "");
                setErrorMessage(t("turnstileExpired"));
              }}
            />
          </div>
          {errors.token && <span className="text-red-500 text-sm block mb-3 text-center">{errors.token.message}</span>}
        </form>
      </div>
    </main>
  );
}
