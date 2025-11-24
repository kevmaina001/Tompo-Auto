import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Phone, Mail, MapPin, Wrench } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Company Info */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">{"Tompo's Auto"}</div>
                  <div className="text-xs text-gray-400 leading-tight">
                    Where quality<br />Meets Experience 🚘
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your trusted partner for quality automotive parts in Kenya. We provide genuine parts at competitive prices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                    Enquiry Cart
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                    Tompos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories (can be populated dynamically later) */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Engine Parts</li>
                <li className="hover:text-white transition-colors cursor-pointer">Brake Systems</li>
                <li className="hover:text-white transition-colors cursor-pointer">Suspension</li>
                <li className="hover:text-white transition-colors cursor-pointer">Electrical</li>
                <li className="hover:text-white transition-colors cursor-pointer">Body Parts</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-400" />
                  <a href={`tel:${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} className="text-gray-400 hover:text-white transition-colors">
                    +{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
                  </a>
                </li>
                <li className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-400" />
                  <a href="mailto:info@tomposauto.com" className="text-gray-400 hover:text-white transition-colors break-all">
                    info@tomposauto.com
                  </a>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-400" />
                  <span className="text-gray-400">
                    Nairobi, Kenya
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-6 sm:mt-10 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
              <p className="mb-2 sm:mb-0">
                © {new Date().getFullYear()} {"Tompo's Auto Spare Parts. All rights reserved."}
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span>
                  Developed by{" "}
                  <a
                    href="https://kevmaina001.github.io/myportfolio1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Kelvin
                  </a>
                </span>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
