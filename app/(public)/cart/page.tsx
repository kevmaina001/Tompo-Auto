import { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Enquiry Cart | Tompo's Auto Spare Parts",
  description: "Review and submit your auto parts enquiry. Send your parts list directly via WhatsApp for quick quotes and availability confirmation.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartPage() {
  return <CartClient />;
}
