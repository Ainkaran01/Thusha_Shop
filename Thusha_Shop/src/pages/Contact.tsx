

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/contact/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message. We'll get back to you soon!",
        });
        form.reset();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData?.detail || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Network Error",
        description: "Unable to send message. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          We'd love to hear from you! Reach out for appointments, information, or feedback.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Phone */}
        <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <Phone className="mx-auto h-8 w-8 text-gold-600 mb-2" />
            <CardTitle className="text-xl text-black">Call Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700">
            <p className="mb-1">Main Office: (123) 456-7890</p>
            <p>Customer Service: (123) 456-7891</p>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <Mail className="mx-auto h-8 w-8 text-gold-600 mb-2" />
            <CardTitle className="text-xl text-black">Email Us</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700">
            <p className="mb-1">info@thushaopticals.com</p>
            <p>support@thushaopticals.com</p>
          </CardContent>
        </Card>

        {/* Hours */}
        <Card className="border border-gold-200 hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-2">
            <Clock className="mx-auto h-8 w-8 text-gold-600 mb-2" />
            <CardTitle className="text-xl text-black">Opening Hours</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-700">
            <p className="mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Form & Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-black">Send Us A Message</h2>
          <Card className="border border-gold-200">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Appointment Request" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide details about your inquiry..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Location Card */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-black">Visit Our Locations</h2>
          <div className="space-y-6">
            <Card className="border border-gold-200 hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-40 bg-[url('/public/thusha.jpg')] bg-center bg-cover"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <MapPin className="h-5 w-5 mr-2 text-gold-600" />
                  Main Branch - Jaffna
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">123 Hospital Road, Jaffna</p>
                <p className="text-gray-700 mb-2">Northern Province, Sri Lanka</p>
                <p className="text-gray-700">Phone: (123) 456-7890</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Embed */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-black text-center">Find Us On Map</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63152.321187866!2d79.99542445!3d9.6682678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe53fd7be66aa5%3A0xc7da0d9203baf512!2sJaffna%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            title="Thusha Opticals Location Map - Jaffna, Sri Lanka"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
