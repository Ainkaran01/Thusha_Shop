
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const About = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">About Thusha Opticals</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Providing exceptional eye care and stylish eyewear since 2010.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-black">Our Story</h2>
          <p className="mb-4 text-gray-700">
            Founded in 2010, Thusha Opticals began with a simple mission: to provide 
            high-quality eyewear and exceptional eye care services to our community. What 
            started as a small family business has grown into a trusted name in optical care.
          </p>
          <p className="mb-4 text-gray-700">
            Our founder, Dr. Thusha Kumar, envisioned a place where customers could receive 
            personalized attention from experienced professionals while choosing from a wide 
            selection of stylish, affordable frames.
          </p>
          <p className="text-gray-700">
            Today, we continue to uphold those values, combining the latest technology in 
            eye care with a curated selection of designer frames to ensure you look and see 
            your best.
          </p>
        </div>
        <div className="bg-[url('https://source.unsplash.com/random/?opticalstore')] bg-center bg-cover rounded-lg h-80"></div>
      </div>

      <Tabs defaultValue="mission" className="mb-12">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-gold-100/20 border border-gold-300">
          <TabsTrigger value="mission" className="text-black">Our Mission</TabsTrigger>
          <TabsTrigger value="values" className="text-black">Our Values</TabsTrigger>
          <TabsTrigger value="doctors" className="text-black">Our Doctors</TabsTrigger>
        </TabsList>
        <TabsContent value="mission" className="p-6 bg-white rounded-lg shadow-lg border border-gold-200">
          <h3 className="text-xl font-bold mb-4 text-black">Our Mission</h3>
          <p className="text-gray-700">
            At Thusha Opticals, our mission is to enhance the quality of life for our customers 
            through better vision. We are committed to providing comprehensive eye care services, 
            personalized attention, and quality eyewear that meets the unique needs of each individual.
          </p>
        </TabsContent>
        <TabsContent value="values" className="p-6 bg-white rounded-lg shadow-lg border border-gold-200">
          <h3 className="text-xl font-bold mb-4 text-black">Our Values</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Excellence in customer service and eye care</li>
            <li>Integrity in all our business practices</li>
            <li>Innovation in eye care technology and products</li>
            <li>Accessibility of quality eye care for all</li>
            <li>Education and empowerment of our customers</li>
          </ul>
        </TabsContent>
        <TabsContent value="doctors" className="p-6 bg-white rounded-lg shadow-lg border border-gold-200">
          <h3 className="text-xl font-bold mb-4 text-black">Our Doctors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <div className="h-40 bg-[url('https://source.unsplash.com/random/?doctor,woman')] bg-center bg-cover"></div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-black">Dr. Emily Wilson</CardTitle>
                <CardDescription>Optometrist, 8 years experience</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-700">
                Specializes in pediatric optometry and contact lens fitting.
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-40 bg-[url('https://source.unsplash.com/random/?doctor,man')] bg-center bg-cover"></div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-black">Dr. Michael Chen</CardTitle>
                <CardDescription>Ophthalmologist, 12 years experience</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-700">
                Specializes in eye surgery and treatment of eye diseases.
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="h-40 bg-[url('https://source.unsplash.com/random/?optometrist')] bg-center bg-cover"></div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg text-black">Dr. Thusha Kumar</CardTitle>
                <CardDescription>Senior Optometrist, 15 years experience</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-gray-700">
                Founder and specialist in advanced eye examinations and vision therapy.
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <h2 className="text-2xl font-bold mb-8 text-black text-center">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-5xl font-bold text-gold-600 text-center">15+</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Years of Excellence</p>
            </CardContent>
          </Card>
          <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-5xl font-bold text-gold-600 text-center">10k+</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Happy Patients</p>
            </CardContent>
          </Card>
          <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-5xl font-bold text-gold-600 text-center">5</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Expert Doctors</p>
            </CardContent>
          </Card>
          <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-5xl font-bold text-gold-600 text-center">3</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700">Locations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
