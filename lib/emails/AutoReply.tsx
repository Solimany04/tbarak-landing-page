import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AutoReplyEmailProps {
  firstName: string;
}

export default function AutoReplyEmail({ firstName }: AutoReplyEmailProps) {
  return (
    <Html dir="rtl">
      <Head />
      <Preview>شكراً لتواصلك معنا - تبارك</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>مرحباً {firstName}،</Heading>
          <Text style={text}>
            شكراً لتواصلك معنا. لقد استلمنا رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.
          </Text>
          <Text style={text}>
            أطيب التحيات،<br />
            فريق تبارك
          </Text>
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
