import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Tompo's Auto Spare Parts. Contact us for inquiries about auto spare parts, pricing, and availability. We're here to help you find the right parts for your vehicle.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
