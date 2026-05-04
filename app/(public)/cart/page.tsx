import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Enquiry Cart",
  description: "Review and submit your auto parts enquiry. Send your parts list directly via WhatsApp for quick quotes and availability confirmation.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClient />;
}
