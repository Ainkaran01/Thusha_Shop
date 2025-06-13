
import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

// Updated available time slots to include the current date and upcoming days
const today = new Date();
const formattedToday = format(today, "yyyy-MM-dd");
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedTomorrow = format(tomorrow, "yyyy-MM-dd");
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
const formattedDayAfterTomorrow = format(dayAfterTomorrow, "yyyy-MM-dd");

// Mock available time slots with real dates
const availableTimeSlots = {
  [formattedToday]: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"],
  [formattedTomorrow]: ["10:00 AM", "11:30 AM", "02:00 PM"],
  [formattedDayAfterTomorrow]: ["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM"],
};

// Mock doctor data
const doctors = [
  {
    id: 1,
    name: "Dr. Emily Wilson",
    specialty: "Optometrist",
    image: "https://source.unsplash.com/random/?doctor,woman",
    experience: "8 years",
    availability: "Mon-Fri",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Ophthalmologist",
    image: "https://source.unsplash.com/random/?doctor,man",
    experience: "12 years",
    availability: "Mon, Wed, Fri",
    rating: 4.9,
    reviews: 156
  },
  {
    id: 3,
    name: "Dr. Sarah Johnson",
    specialty: "Optometrist",
    image: "https://source.unsplash.com/random/?optometrist,woman",
    experience: "5 years",
    availability: "Tue, Thu, Sat",
    rating: 4.7,
    reviews: 98
  }
];

const DoctorAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  // Form setup
  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      issue: "",
    },
  });

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(null);
    
    if (newDate) {
      const formattedDate = format(newDate, "yyyy-MM-dd");
      const times = availableTimeSlots[formattedDate as keyof typeof availableTimeSlots] || [];
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  // Handle doctor selection
  const handleSelectDoctor = (doctorId: number) => {
    setSelectedDoctor(doctorId);
  };

  // Handle form submission
  const onSubmit = (data: any) => {
    if (!date || !selectedTime || selectedDoctor === null) {
      toast({
        title: "Missing information",
        description: "Please select a date, time and doctor before booking.",
        variant: "destructive",
      });
      return;
    }

    // Format the appointment data
    const appointmentData = {
      ...data,
      date: format(date, "yyyy-MM-dd"),
      time: selectedTime,
      doctorId: selectedDoctor,
      doctorName: doctors.find(d => d.id === selectedDoctor)?.name
    };

    // In a real application, this would be an API call
    console.log("Appointment data:", appointmentData);

    // Show success message
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${appointmentData.doctorName} is scheduled for ${appointmentData.date} at ${appointmentData.time}.`,
    });

    // Redirect to home or confirmation page
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-primary mb-2">Book Your Eye Appointment</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Schedule an appointment with our expert optometrists for comprehensive eye examinations, 
          vision tests, and personalized lens prescriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-muted/30 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <span>Schedule</span>
              </CardTitle>
              <CardDescription>
                Select your preferred date and time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      disabled={(date) => 
                        date < today || 
                        date > new Date(today.getFullYear(), today.getMonth() + 2, 0) ||
                        date.getDay() === 0 // Disable Sundays
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {date && availableTimes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Time Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={cn(
                          "justify-center",
                          selectedTime === time ? "bg-primary text-primary-foreground" : ""
                        )}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {date && availableTimes.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No available slots for this date</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/30 animate-fade-in">
            <CardHeader>
              <CardTitle>Appointment Information</CardTitle>
              <CardDescription>What to expect during your visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-1">
                <h4 className="font-medium">Eye Examination (30 min)</h4>
                <p className="text-muted-foreground">Comprehensive assessment of your vision and eye health</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Vision Test (15 min)</h4>
                <p className="text-muted-foreground">Evaluate your visual acuity and determine prescription needs</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Lens Consultation (15 min)</h4>
                <p className="text-muted-foreground">Discuss lens options based on your prescription and lifestyle</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card 
                key={doctor.id} 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedDoctor === doctor.id ? "border-primary ring-2 ring-primary ring-opacity-50" : ""
                )}
                onClick={() => handleSelectDoctor(doctor.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{doctor.name}</CardTitle>
                      <p className="text-sm text-primary">{doctor.specialty}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4 pt-0">
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Experience:</span> {doctor.experience}</p>
                    <p><span className="font-medium">Available:</span> {doctor.availability}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill={i < Math.floor(doctor.rating) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            className="mr-0.5"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs ml-1">{doctor.rating} ({doctor.reviews})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>
                Tell us about yourself and your eye care needs
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                            <Input placeholder="john@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                    name="issue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Visit</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your eye concerns or the reason for your appointment" 
                            className="min-h-24" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-primary hover:bg-primary/90"
                      disabled={!date || !selectedTime || selectedDoctor === null}
                    >
                      Book Appointment
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
