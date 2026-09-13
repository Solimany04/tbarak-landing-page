import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { ContactFormData } from "@/lib/actions/contact/contact-schema";

interface NotificationEmailProps {
  data: ContactFormData;
  ip: string;
  userAgent: string;
}

export default function NotificationEmail({
  data,
  ip,
  userAgent,
}: NotificationEmailProps) {
  return (
    <Html dir="rtl">
      <Head />
      <Preview>رسالة جديدة من {data.firstName} {data.lastName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>رسالة جديدة من الموقع</Heading>
          <Text style={text}>
            <strong>الاسم:</strong> {data.firstName} {data.lastName}
          </Text>
          <Text style={text}>
            <strong>البريد الإلكتروني:</strong> {data.email}
          </Text>
          <Text style={text}>
            <strong>رقم الهاتف:</strong> {data.phone}
          </Text>
          <Hr style={hr} />
          <Section>
            <Text style={text}><strong>الرسالة:</strong></Text>
            <Text style={{ ...text, whiteSpace: "pre-wrap" }}>{data.message}</Text>
          </Section>
          <Hr style={hr} />
          <Section>
            <Text style={footer}>
              بيانات المرسل:
              <br />
              IP: {ip}
              <br />
              User Agent: {userAgent}
              <br />
              التاريخ: {new Date().toLocaleString()}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 48px",
  margin: "40px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  padding: "0 48px",
};
