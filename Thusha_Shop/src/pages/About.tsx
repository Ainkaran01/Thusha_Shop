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
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
      {/* Title Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-black mb-4">About Thusha Opticals</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Providing exceptional eye care and stylish eyewear since 2010.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-black">Our Story</h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Founded in 2010, Thusha Opticals began with a simple mission: to provide high-quality
            eyewear and exceptional eye care services to our community. What started as a small
            family business has grown into a trusted name in optical care.
          </p>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Our founder, Dr. Thusha Kumar, envisioned a place where customers could receive
            personalized attention from experienced professionals while choosing from a wide
            selection of stylish, affordable frames.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Today, we continue to uphold those values, combining the latest technology in eye care
            with a curated selection of designer frames to ensure you look and see your best.
          </p>
        </div>
        <div>
          <img
            src="/images/about-store.jpg"
            alt="Our Optical Store"
            className="rounded-2xl shadow-lg w-full h-auto hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="mission" className="mb-16">
        <TabsList className="grid w-full grid-cols-3 mb-8 border bg-gray-100 border-gray-300 rounded-xl overflow-hidden">
          <TabsTrigger
            value="mission"
            className="text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-200 data-[state=active]:to-gray-400"
          >
            Our Mission
          </TabsTrigger>
          <TabsTrigger
            value="values"
            className="text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-200 data-[state=active]:to-gray-400"
          >
            Our Values
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-200 data-[state=active]:to-gray-400"
          >
            Our Doctors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mission" className="p-6 bg-white rounded-xl shadow-md border">
          <h3 className="text-xl font-bold mb-4 text-black">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            At Thusha Opticals, our mission is to enhance the quality of life for our customers
            through better vision. We are committed to providing comprehensive eye care services,
            personalized attention, and quality eyewear that meets the unique needs of each
            individual.
          </p>
        </TabsContent>

        <TabsContent value="values" className="p-6 bg-white rounded-xl shadow-md border">
          <h3 className="text-xl font-bold mb-4 text-black">Our Values</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Excellence in customer service and eye care</li>
            <li>Integrity in all our business practices</li>
            <li>Innovation in eye care technology and products</li>
            <li>Accessibility of quality eye care for all</li>
            <li>Education and empowerment of our customers</li>
          </ul>
        </TabsContent>

        <TabsContent value="doctors" className="p-6 bg-white rounded-xl shadow-md border">
          <h3 className="text-xl font-bold mb-6 text-black text-center">Our Doctors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Dr. Sarvanandam Chandrakumar",
                image: "/images/doctors/emily.jpg",
                title: "Optometrist, 8 years experience",
                bio: "Specializes in pediatric optometry and contact lens fitting.",
              },
              {
                name: "Dr. Vathulan Sujanitha",
                image: "/images/doctors/michael.jpg",
                title: "Ophthalmologist, 12 years experience",
                bio: "Specializes in eye surgery and treatment of eye diseases.",
              },
              {
                name: "Dr. Muthusamy Malaravan",
                image: "/images/doctors/thusha.jpg",
                title: "Senior Optometrist, 15 years experience",
                bio: "Founder and specialist in advanced eye examinations and vision therapy.",
              },
            ].map((doctor, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-60 object-contain bg-white p-4"
                />
                <CardHeader className="p-4">
                  <CardTitle className="text-lg text-black">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.title}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-gray-700">
                  {doctor.bio}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievements Section */}
      <div>
        <h2 className="text-2xl font-bold mb-10 text-black text-center">Our Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "15+", label: "Years of Excellence" },
            { value: "10k+", label: "Happy Patients" },
            { value: "5", label: "Expert Doctors" },
            { value: "3", label: "Locations" },
          ].map((item, index) => (
            <Card
              key={index}
              className="border border-gray-300 hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-5xl font-bold text-yellow-600 text-center">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;