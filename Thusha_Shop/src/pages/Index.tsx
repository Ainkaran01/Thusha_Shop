
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import FeaturedProducts from "@/components/FeaturedProducts";
import { products } from "@/data/products";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Stylish glasses"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Discover Your Perfect <span className="text-yellow-500">Vision</span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience luxury eyewear that combines style, comfort, and precision craftsmanship for your unique face.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button asChild size="lg" className="text-base bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/catalog">Explore Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-none-500  hover:bg-white hover:text-black">
                <Link to="/face-shape">Try Virtually</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Boxes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div 
              className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-block bg-yellow-500 text-black p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Face Shape Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Discover your face shape and get personalized frame recommendations
                that complement your unique features.
              </p>
              <Link to="/face-shape" className="inline-flex items-center text-yellow-600 hover:underline">
                Analyze Your Face <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
              className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-block bg-yellow-500 text-black p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vision Problem Test</h3>
              <p className="text-muted-foreground mb-4">
                Take our quick vision assessment to identify potential vision problems
                and get lens recommendations.
              </p>
              <Link to="/vision-test" className="inline-flex items-center text-yellow-600 hover:underline">
                Test Your Vision <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
              className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 inline-block bg-yellow-500 text-black p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Selections</h3>
              <p className="text-muted-foreground mb-4">
                Browse our curated collection of high-quality frames and lenses,
                with detailed filtering options.
              </p>
              <Link to="/catalog" className="inline-flex items-center text-yellow-600 hover:underline">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div 
  className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.6 }}
  viewport={{ once: true }}
>
  <div className="mb-4 inline-block bg-yellow-500 text-black p-3 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h1l3 8h11l3-8h1M16 21a2 2 0 11-4 0 2 2 0 014 0zM8 21a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </div>
  <h3 className="text-xl font-semibold mb-2">Track Your Orders</h3>
  <p className="text-muted-foreground mb-4">
    Monitor the status of your orders from processing to delivery in real time. Stay updated every step of the way!
  </p>
  <Link to="/order-tracking" className="inline-flex items-center text-yellow-600 hover:underline">
    Check Order Status <ArrowRight className="ml-2 h-4 w-4" />
  </Link>
</motion.div>

          </div>
        </div>
      </section>

    
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Frames</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular frames, hand-picked for their exceptional
              quality, style, and versatility across different face shapes.
            </p>
          </div>
          <FeaturedProducts products={products.slice(0, 4)} />
          <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link to="/catalog">View All Frames</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Face Shape Guide */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Find Frames for Your Face Shape</h2>
              <p className="text-muted-foreground mb-6">
                Your face shape plays a crucial role in determining which frames will
                look best on you. Our face shape analyzer uses advanced technology to
                identify your face shape and recommend the perfect frames.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="mr-4 bg-yellow-500 text-black rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Accurate Analysis</h4>
                    <p className="text-muted-foreground">Determine if your face is oval, round, square, heart, diamond, or other shapes.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-yellow-500 text-black rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Personalized Recommendations</h4>
                    <p className="text-muted-foreground">Get frame suggestions that complement your facial features.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 bg-yellow-500 text-black rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Easy to Use</h4>
                    <p className="text-muted-foreground">Simple upload or webcam capture process that takes just minutes.</p>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link to="/face-shape">Analyze Your Face Shape</Link>
              </Button>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"  // 12rem = 192px height
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Face shape analysis"
                className="rounded-lg shadow-xl w-[450px] h-[600px]  w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Read reviews from customers who found their perfect frames using our
              face shape analyzer and vision problem recommendations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-900 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "The face shape analyzer was spot on! As someone with a square face,
                I always struggled to find frames that looked good. The recommended
                round frames have completely transformed my look. Couldn't be happier!"
              </p>
              <div className="flex items-center">
                <div className="mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Customer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Michael T.</p>
                  <p className="text-sm text-gray-400">Square Face</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-900 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "The vision test helped me identify my astigmatism and recommended the
                perfect lenses. I've been wearing glasses for years but never had such
                clear vision. The customer service was excellent too!"
              </p>
              <div className="flex items-center">
                <div className="mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Customer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Sarah L.</p>
                  <p className="text-sm text-gray-400">Heart Shape</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-900 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "I love the wishlist feature! I was able to save all my favorite frames
                and compare them before making a decision. The shipping was fast and the
                quality of the frames exceeded my expectations."
              </p>
              <div className="flex items-center">
                <div className="mr-3">
                  <img
                    src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                    alt="Customer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">David R.</p>
                  <p className="text-sm text-gray-400">Diamond Shape</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Frames?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Start by analyzing your face shape or browsing our collection. We're
            committed to helping you find eyewear that looks great and fits perfectly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link to="/face-shape">Analyze Your Face Shape</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              <Link to="/catalog">Shop All Frames</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
