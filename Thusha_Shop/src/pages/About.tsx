// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const About = () => {
//   return (
//     <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
//       {/* Title Section */}
//       <div className="text-center mb-16">
//         <h1 className="text-4xl font-bold text-black mb-4">About Thusha Opticals</h1>
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//           Providing exceptional eye care and stylish eyewear since 2010.
//         </p>
//       </div>

//       {/* Our Story Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-center">
//         <div>
//           <h2 className="text-2xl font-bold mb-4 text-black">Our Story</h2>
//           <p className="mb-4 text-gray-700 leading-relaxed">
//             Founded in 2010, Thusha Opticals began with a simple mission: to provide high-quality
//             eyewear and exceptional eye care services to our community. What started as a small
//             family business has grown into a trusted name in optical care.
//           </p>
//           <p className="mb-4 text-gray-700 leading-relaxed">
//             Our founder, Dr. Thusha Kumar, envisioned a place where customers could receive
//             personalized attention from experienced professionals while choosing from a wide
//             selection of stylish, affordable frames.
//           </p>
//           <p className="text-gray-700 leading-relaxed">
//             Today, we continue to uphold those values, combining the latest technology in eye care
//             with a curated selection of designer frames to ensure you look and see your best.
//           </p>
//         </div>
//         <div>
//           <img
//             src="/images/about-store.jpg"
//             alt="Our Optical Store"
//             className="rounded-2xl shadow-lg w-full h-auto hover:scale-105 transition-transform duration-300"
//           />
//         </div>
//       </div>

//       {/* Tabs Section */}
//       <Tabs defaultValue="mission" className="mb-16">
//         <TabsList className="grid w-full grid-cols-3 mb-8 border bg-gray-100 border-gray-300 rounded-xl overflow-hidden">
//           <TabsTrigger
//             value="mission"
//             className="text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-200 data-[state=active]:to-gray-400"
//           >
//             Our Mission
//           </TabsTrigger>
//           <TabsTrigger
//             value="values"
//             className="text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-200 data-[state=active]:to-gray-400"
//           >
//             Our Values
//           </TabsTrigger>
//           <TabsTrigger
//             value="doctors"
//             className="text-black data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-200 data-[state=active]:to-gray-400"
//           >
//             Our Doctors
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="mission" className="p-6 bg-white rounded-xl shadow-md border">
//           <h3 className="text-xl font-bold mb-4 text-black">Our Mission</h3>
//           <p className="text-gray-700 leading-relaxed">
//             At Thusha Opticals, our mission is to enhance the quality of life for our customers
//             through better vision. We are committed to providing comprehensive eye care services,
//             personalized attention, and quality eyewear that meets the unique needs of each
//             individual.
//           </p>
//         </TabsContent>

//         <TabsContent value="values" className="p-6 bg-white rounded-xl shadow-md border">
//           <h3 className="text-xl font-bold mb-4 text-black">Our Values</h3>
//           <ul className="list-disc pl-6 space-y-2 text-gray-700">
//             <li>Excellence in customer service and eye care</li>
//             <li>Integrity in all our business practices</li>
//             <li>Innovation in eye care technology and products</li>
//             <li>Accessibility of quality eye care for all</li>
//             <li>Education and empowerment of our customers</li>
//           </ul>
//         </TabsContent>

//         <TabsContent value="doctors" className="p-6 bg-white rounded-xl shadow-md border">
//           <h3 className="text-xl font-bold mb-6 text-black text-center">Our Doctors</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {[
//               {
//                 name: "Dr. Sarvanandam Chandrakumar",
//                 image: "/images/doctors/emily.jpg",
//                 title: "Optometrist, 8 years experience",
//                 bio: "Specializes in pediatric optometry and contact lens fitting.",
//               },
//               {
//                 name: "Dr. Vathulan Sujanitha",
//                 image: "/images/doctors/michael.jpg",
//                 title: "Ophthalmologist, 12 years experience",
//                 bio: "Specializes in eye surgery and treatment of eye diseases.",
//               },
//               {
//                 name: "Dr. Muthusamy Malaravan",
//                 image: "/images/doctors/thusha.jpg",
//                 title: "Senior Optometrist, 15 years experience",
//                 bio: "Founder and specialist in advanced eye examinations and vision therapy.",
//               },
//             ].map((doctor, index) => (
//               <Card key={index} className="overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
//                 <img
//                   src={doctor.image}
//                   alt={doctor.name}
//                   className="w-full h-60 object-contain bg-white p-4"
//                 />
//                 <CardHeader className="p-4">
//                   <CardTitle className="text-lg text-black">{doctor.name}</CardTitle>
//                   <CardDescription>{doctor.title}</CardDescription>
//                 </CardHeader>
//                 <CardContent className="p-4 pt-0 text-sm text-gray-700">
//                   {doctor.bio}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Achievements Section */}
//       <div>
//         <h2 className="text-2xl font-bold mb-10 text-black text-center">Our Achievements</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[
//             { value: "15+", label: "Years of Excellence" },
//             { value: "10k+", label: "Happy Patients" },
//             { value: "5", label: "Expert Doctors" },
//             { value: "3", label: "Locations" },
//           ].map((item, index) => (
//             <Card
//               key={index}
//               className="border border-gray-300 hover:shadow-lg transition-shadow duration-300"
//             >
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-5xl font-bold text-yellow-600 text-center">
//                   {item.value}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="text-center">
//                 <p className="text-gray-700">{item.label}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;



"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Eye, Award, Users, MapPin, Star, Heart, Shield, Lightbulb } from "lucide-react"

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl">
        {/* Enhanced Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <Eye className="h-10 w-10 text-primary mr-4 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              About Thusha Opticals
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Providing exceptional eye care and stylish eyewear since 2010 with passion, precision, and personalized
            service.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-2 text-primary" />
              <span>Award Winning</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              <span>Expert Team</span>
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span>Patient Care</span>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Our Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center"
        >
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-4 h-4 bg-gradient-to-r from-primary to-primary/70 rounded-full mr-4 shadow-lg"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Our Story
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl p-6 border border-accent/30"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2010, Thusha Opticals began with a simple mission: to provide high-quality eyewear and
                exceptional eye care services to our community. What started as a small family business has grown into a
                trusted name in optical care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our founder, Dr. Thusha Kumar, envisioned a place where customers could receive personalized attention
                from experienced professionals while choosing from a wide selection of stylish, affordable frames.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl p-6 border border-accent/30"
            >
              <p className="text-muted-foreground leading-relaxed">
                Today, we continue to uphold those values, combining the latest technology in eye care with a curated
                selection of designer frames to ensure you look and see your best.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <img
              src="/images/about-store.jpg"
              alt="Our Optical Store"
              
              className="relative rounded-3xl shadow-2xl w-full min-h-[500px] hover:scale-105 transition-transform duration-500 border-2 border-primary/20"

            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl"></div>
          </motion.div>
        </motion.div>

        {/* Enhanced Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-10 h-16 bg-background/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg">
              <TabsTrigger
                value="mission"
                className="h-14 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Shield className="mr-2 h-5 w-5" />
                Our Mission
              </TabsTrigger>
              <TabsTrigger
                value="values"
                className="h-14 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Heart className="mr-2 h-5 w-5" />
                Our Values
              </TabsTrigger>
              <TabsTrigger
                value="doctors"
                className="h-14 text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Users className="mr-2 h-5 w-5" />
                Our Doctors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mission">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-background/80 to-accent/5 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-primary/10 overflow-hidden p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-full p-4 mr-6">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Our Mission
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Thusha Opticals, our mission is to enhance the quality of life for our customers through better
                  vision. We are committed to providing comprehensive eye care services, personalized attention, and
                  quality eyewear that meets the unique needs of each individual.
                </p>
              </motion.div>
            </TabsContent>

            <TabsContent value="values">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-background/80 to-accent/5 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-primary/10 overflow-hidden p-8"
              >
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-full p-4 mr-6">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Our Values
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: Award, text: "Excellence in customer service and eye care" },
                    { icon: Shield, text: "Integrity in all our business practices" },
                    { icon: Lightbulb, text: "Innovation in eye care technology and products" },
                    { icon: Users, text: "Accessibility of quality eye care for all" },
                    { icon: Star, text: "Education and empowerment of our customers" },
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className="flex items-start bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-full p-2 mr-4 mt-1">
                        <value.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-muted-foreground leading-relaxed">{value.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="doctors">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-background/80 to-accent/5 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-primary/10 overflow-hidden p-8"
              >
                <div className="flex items-center justify-center mb-10">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-full p-4 mr-6">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Our Expert Doctors
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Dr. Sarvanandam Chandrakumar",
                      image: "/images/doctors/emily.jpg",
                      title: "Optometrist, 8 years experience",
                      bio: "Specializes in pediatric optometry and contact lens fitting.",
                      specialty: "Pediatric Care",
                    },
                    {
                      name: "Dr. Vathulan Sujanitha",
                      image: "/images/doctors/michael.jpg",
                      title: "Ophthalmologist, 12 years experience",
                      bio: "Specializes in eye surgery and treatment of eye diseases.",
                      specialty: "Eye Surgery",
                    },
                    {
                      name: "Dr. Muthusamy Malaravan",
                      image: "/images/doctors/thusha.jpg",
                      title: "Senior Optometrist, 15 years experience",
                      bio: "Founder and specialist in advanced eye examinations and vision therapy.",
                      specialty: "Vision Therapy",
                    },
                  ].map((doctor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="group"
                    >
                      <Card className="overflow-hidden border-2 border-border/30 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-accent/5">
                        <div className="relative overflow-hidden">
                          <img
                            src={doctor.image || "/placeholder.svg"}
                            alt={doctor.name}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="absolute top-4 right-4">
                            <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              {doctor.specialty}
                            </div>
                          </div>
                        </div>
                        <CardHeader className="p-6">
                          <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {doctor.name}
                          </CardTitle>
                          <CardDescription className="text-primary font-medium">{doctor.title}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Enhanced Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
              Our Achievements
            </h2>
            <p className="text-muted-foreground text-lg">Numbers that reflect our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Years of Excellence", icon: Award, color: "from-primary to-primary/70" },
              { value: "10k+", label: "Happy Patients", icon: Users, color: "from-primary to-primary/70" },
              { value: "5", label: "Expert Doctors", icon: Eye, color: "from-primary to-primary/70" },
              { value: "3", label: "Locations", icon: MapPin, color: "from-primary to-primary/70" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="border-2 border-border/30 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-background to-accent/5 overflow-hidden">
                  <CardHeader className="pb-4 text-center">
                    <div className="mx-auto mb-4 relative">
                      <div
                        className={`bg-gradient-to-r ${item.color} rounded-full p-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary/30 rounded-full animate-ping group-hover:animate-pulse"></div>
                    </div>
                    <CardTitle className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                      {item.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-6">
                    <p className="text-muted-foreground font-medium">{item.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
