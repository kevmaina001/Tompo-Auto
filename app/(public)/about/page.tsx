import { Shield, Award, Users, Clock, CheckCircle, Wrench } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              About Tompo&apos;s Auto Spare Parts
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed">
              Your trusted partner for quality automotive parts in Kenya
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Our Story
            </h2>
            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700">
              <p className="text-base sm:text-lg leading-relaxed mb-4">
                Tompo&apos;s Auto Spare Parts has been serving the Kenyan automotive industry with dedication and excellence.
                We understand that finding reliable, quality auto parts is crucial for keeping vehicles running smoothly
                and safely on our roads.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Our commitment goes beyond just selling parts – we aim to build lasting relationships with our customers
                by providing expert advice, competitive pricing, and exceptional service. Whether you&apos;re a professional
                mechanic or a car owner looking to maintain your vehicle, we&apos;re here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-blue-600 p-3 sm:p-4 rounded-full mr-4">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                To provide high-quality automotive parts at competitive prices, backed by expert knowledge
                and outstanding customer service. We strive to be the first choice for vehicle owners and
                mechanics throughout Kenya.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-blue-600 p-3 sm:p-4 rounded-full mr-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                To become Kenya&apos;s most trusted and reliable auto parts supplier, known for our integrity,
                quality products, and commitment to customer satisfaction. We envision a future where every
                vehicle owner has access to genuine parts at fair prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
            Why Choose Tompo&apos;s Auto?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Quality Parts */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Quality Guaranteed</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We stock only genuine and high-quality OEM parts from trusted manufacturers, ensuring durability and optimal performance.
              </p>
            </div>

            {/* Expert Advice */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6">
                <Wrench className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Expert Advice</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our knowledgeable staff can help you find the right parts for your vehicle and provide professional guidance.
              </p>
            </div>

            {/* Competitive Pricing */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Competitive Pricing</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Get the best value for your money with our fair and transparent pricing on all automotive parts.
              </p>
            </div>

            {/* Wide Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6">
                <Award className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Wide Selection</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                From engine parts to electrical components, we stock a comprehensive range of parts for various vehicle makes and models.
              </p>
            </div>

            {/* Fast Service */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Fast Service</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Quick response times and efficient service to get you back on the road as soon as possible.
              </p>
            </div>

            {/* Customer Support */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mb-4 sm:mb-6">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Dedicated Support</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our customer service team is always ready to assist you with inquiries and provide after-sales support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Find Your Parts?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              Browse our extensive catalog or get in touch with our team for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 text-sm sm:text-base"
              >
                Browse Products
              </a>
              <a
                href="/contact"
                className="bg-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-900 transition-colors duration-300 border-2 border-white text-sm sm:text-base"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
