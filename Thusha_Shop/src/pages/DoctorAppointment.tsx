import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

type Availability = {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
};

type Doctor = {
  id: number;
  name: string;
  specialization: string;
  image: string;
  experience_years: string;
  availability: Availability | string;
};

type AppointmentData = {
  doctor: number;
  date: string;
  time: string;
  reason: string;
  phone: string;
  patient_id?: number | string;
  patient_name: string;
  patient_email: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  issue: z.string().min(1, "Please select a reason for your visit"),
});

const API_BASE_URL = "http://localhost:8000/api/appointments";

const formatAvailability = (availability: string | Availability): string => {
  let availabilityObj: Record<string, any>;
  if (typeof availability === 'string') {
    try {
      availabilityObj = JSON.parse(availability);
    } catch (e) {
      console.error("Error parsing availability:", e);
      return "Not available";
    }
  } else {
    availabilityObj = availability;
  }

  
  const days = [];
  if (availabilityObj.monday) days.push("Mon");
  if (availabilityObj.tuesday) days.push("Tue");
  if (availabilityObj.wednesday) days.push("Wed");
  if (availabilityObj.thursday) days.push("Thu");
  if (availabilityObj.friday) days.push("Fri");
  if (availabilityObj.saturday) days.push("Sat");
  if (availabilityObj.sunday) days.push("Sun");
  
  return days.length > 0 ? `Available: ${days.join(", ")}` : "Not available";
};

const DoctorAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone_number || "",
      issue: "",
    },
  });

  // Fetch doctors when date changes
  useEffect(() => {
    const fetchDoctors = async () => {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        console.error("No token found");
        return;
      }

      setLoadingDoctors(true);
      try {
        const params = date ? { date: format(date, "yyyy-MM-dd") } : {};
        const response = await axios.get(`${API_BASE_URL}/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
          params
        });
        setDoctors(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [date, toast]);

  // Fetch time slots when doctor or date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!date || !selectedDoctor) {
        setAvailableTimes([]);
        return;
      }

      const token = sessionStorage.getItem("access_token");
      if (!token) return;

      setLoadingSlots(true);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await axios.get(
          `${API_BASE_URL}/doctors/${selectedDoctor}/slots/`,
          { 
            params: { date: formattedDate },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAvailableTimes(response.data.available_slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots.",
          variant: "destructive",
        });
        setAvailableTimes([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchTimeSlots();
  }, [date, selectedDoctor, toast]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedTime(null);
  };

  const handleSelectDoctor = (doctorId: number) => {
    setSelectedDoctor(doctorId);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!date || !selectedTime || selectedDoctor === null) {
      toast({
        title: "Missing information",
        description: "Please select a date, time and doctor before booking.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formatTimeTo24h = (timeStr: string) => {
        const [time, modifier] = timeStr.split(" ");
        const [hours, minutes] = time.split(":");
        let adjustedHours = hours;

        if (modifier === "PM" && hours !== "12") {
          adjustedHours = String(parseInt(hours, 10) + 12);
        }
        if (modifier === "AM" && hours === "12") {
          adjustedHours = "00";
        }
        
        return `${adjustedHours.padStart(2, '0')}:${minutes}`;
      };

      const time24h = formatTimeTo24h(selectedTime);

      const appointmentData: AppointmentData = {
        doctor: selectedDoctor,
        date: format(date, "yyyy-MM-dd"),
        time: time24h,
        reason: data.issue,
        phone: data.phone,
        patient_id: user?.id,
        patient_name: data.name,
        patient_email: data.email
      };

      const token = sessionStorage.getItem('access_token');
      const response = await axios.post(
        `${API_BASE_URL}/appointments/`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    
      toast({
        title: "Appointment Booked!",
        description: `Your appointment is scheduled for ${appointmentData.date} at ${selectedTime}. Confirmation sent to your email.`,
      });

      setTimeout(() => navigate('/user-dashboard'), 3000);
    } catch (error) {
      console.error("Booking failed:", error);
      let errorMessage = "An error occurred while booking your appointment.";
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || JSON.stringify(error.response.data) || errorMessage;
      }

      toast({
        title: "Booking failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                        date < new Date() || 
                        date > new Date(new Date().setDate(new Date().getDate() + 60)) ||
                        date.getDay() === 0 // Disable Sundays
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {loadingSlots ? (
                <div className="text-center py-4">Loading time slots...</div>
              ) : date && availableTimes.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Time Slots</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : date && !loadingSlots ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">
                    {selectedDoctor 
                      ? "No available slots for this doctor and date" 
                      : "Please select a doctor to see available time slots"}
                  </p>
                </div>
              ) : null}
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
            {loadingDoctors ? (
              <div className="col-span-3 text-center py-8">
                <p>Loading doctors...</p>
              </div>
            ) : doctors.length > 0 ? (
              doctors.map((doctor) => (
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
                        <img 
                          src="doctor.jpg"
                          alt={doctor.name} 
                          className="w-full h-full object-cover bg-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/doctor.jpg";
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base">{doctor.name}</CardTitle>
                        <p className="text-sm text-primary">{doctor.specialization}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4 pt-0">
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Experience:</span> {doctor.experience_years}</p>
                      <p>{formatAvailability(doctor.availability)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p>No doctors available for selected date</p>
              </div>
            )}
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a reason for your visit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Eye Examination (30 min) - Comprehensive assessment of your vision and eye health">
                              Eye Examination (30 min)
                            </SelectItem>
                            <SelectItem value="Vision Test (15 min) - Evaluate your visual acuity and determine prescription needs">
                              Vision Test (15 min)
                            </SelectItem>
                            <SelectItem value="Lens Consultation (15 min) - Discuss lens options based on your prescription and lifestyle">
                              Lens Consultation (15 min)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <CardFooter className="px-0 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-primary hover:bg-primary/90"
                      disabled={!date || !selectedTime || selectedDoctor === null || isLoading}
                    >
                      {isLoading ? "Booking..." : "Book Appointment"}
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