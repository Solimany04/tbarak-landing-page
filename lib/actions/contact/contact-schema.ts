import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

export type ContactMessages = {
  firstNameRequired: string;
  firstNameTooLong: string;
  lastNameRequired: string;
  lastNameTooLong: string;
  emailInvalid: string;
  emailTooLong: string;
  phoneInvalid: string;
  messageTooShort: string;
  messageTooLong: string;
  tokenRequired: string;
};

export function makeContactSchema(m: ContactMessages) {
  return z.object({
    firstName: z.string().trim().min(1, m.firstNameRequired).max(60, m.firstNameTooLong),
    lastName: z.string().trim().min(1, m.lastNameRequired).max(60, m.lastNameTooLong),
    email: z.string().trim().email(m.emailInvalid).max(254, m.emailTooLong),
    phone: z.string().trim().refine((val) => isValidPhoneNumber(val), {
      message: m.phoneInvalid,
    }),
    message: z.string().trim().min(10, m.messageTooShort).max(2000, m.messageTooLong),
    token: z.string().min(1, m.tokenRequired),
    company: z.string().max(0, "Invalid").optional(), // honeypot
  });
}

// Default schema used server-side (app/api/contact/route.ts). The API returns a
// generic error and never surfaces these messages to users, so English is fine.
const serverMessages: ContactMessages = {
  firstNameRequired: "First name is required",
  firstNameTooLong: "First name is too long",
  lastNameRequired: "Last name is required",
  lastNameTooLong: "Last name is too long",
  emailInvalid: "Invalid email address",
  emailTooLong: "Email address is too long",
  phoneInvalid: "Invalid phone number",
  messageTooShort: "Message is too short (minimum 10 characters)",
  messageTooLong: "Message is too long (maximum 2000 characters)",
  tokenRequired: "Verification token is required",
};

export const contactSchema = makeContactSchema(serverMessages);

export type ContactFormData = z.infer<typeof contactSchema>;
