"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock, Star, Award, Users, Sparkles, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { useUser } from "@/context/UserContext"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"

type Availability = {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

type Doctor = {
  id: number
  name: string
  specialization: string
  image: string
  experience_years: string
  availability: Availability | string
}

type AppointmentData = {
  doctor: number
  date: string
  time: string
  reason: string
  phone: string
  patient_id?: number | string
  patient_name: string
  patient_email: string
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  issue: z.string().min(1, "Please select a reason for your visit"),
})

const API_BASE_URL = "http://localhost:8000/api/appointments"

const formatAvailability = (availability: string | Availability): string => {
  let availabilityObj: Record<string, any>
  if (typeof availability === "string") {
    try {
      availabilityObj = JSON.parse(availability)
    } catch (e) {
      console.error("Error parsing availability:", e)
      return "Not available"
    }
  } else {
    availabilityObj = availability
  }

  const days = []
  if (availabilityObj.monday) days.push("Mon")
  if (availabilityObj.tuesday) days.push("Tue")
  if (availabilityObj.wednesday) days.push("Wed")
  if (availabilityObj.thursday) days.push("Thu")
  if (availabilityObj.friday) days.push("Fri")
  if (availabilityObj.saturday) days.push("Sat")
  if (availabilityObj.sunday) days.push("Sun")

  return days.length > 0 ? `Available: ${days.join(", ")}` : "Not available"
}

const DoctorAppointment = () => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone_number || "",
      issue: "",
    },
  })

  // Fetch doctors when date changes
  useEffect(() => {
    const fetchDoctors = async () => {
      const token = sessionStorage.getItem("access_token")
      if (!token) {
        console.error("No token found")
        return
      }
      setLoadingDoctors(true)
      try {
        const params = date ? { date: format(date, "yyyy-MM-dd") } : {}
        const response = await axios.get(`${API_BASE_URL}/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        })
        setDoctors(response.data)
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoadingDoctors(false)
      }
    }
    fetchDoctors()
  }, [date, toast])

  // Fetch time slots when doctor or date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!date || !selectedDoctor) {
        setAvailableTimes([])
        return
      }
      const token = sessionStorage.getItem("access_token")
      if (!token) return
      setLoadingSlots(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const response = await axios.get(`${API_BASE_URL}/doctors/${selectedDoctor}/slots/`, {
          params: { date: formattedDate },
          headers: { Authorization: `Bearer ${token}` },
        })
        setAvailableTimes(response.data.available_slots)
      } catch (error) {
        console.error("Error fetching time slots:", error)
        toast({
          title: "Error",
          description: "Failed to load available time slots.",
          variant: "destructive",
        })
        setAvailableTimes([])
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchTimeSlots()
  }, [date, selectedDoctor, toast])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    setSelectedTime(null)
  }

  const handleSelectDoctor = (doctorId: number) => {
    setSelectedDoctor(doctorId)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!date || !selectedTime || selectedDoctor === null) {
      toast({
        title: "Missing information",
        description: "Please select a date, time and doctor before booking.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const formatTimeTo24h = (timeStr: string) => {
        const [time, modifier] = timeStr.split(" ")
        const [hours, minutes] = time.split(":")
        let adjustedHours = hours
        if (modifier === "PM" && hours !== "12") {
          adjustedHours = String(Number.parseInt(hours, 10) + 12)
        }
        if (modifier === "AM" && hours === "12") {
          adjustedHours = "00"
        }

        return `${adjustedHours.padStart(2, "0")}:${minutes}`
      }

      const time24h = formatTimeTo24h(selectedTime)
      const appointmentData: AppointmentData = {
        doctor: selectedDoctor,
        date: format(date, "yyyy-MM-dd"),
        time: time24h,
        reason: data.issue,
        phone: data.phone,
        patient_id: user?.id,
        patient_name: data.name,
        patient_email: data.email,
      }

      const token = sessionStorage.getItem("access_token")
      const response = await axios.post(`${API_BASE_URL}/appointments/`, appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      toast({
        title: "Appointment Booked!",
        description: `Your appointment is scheduled for ${appointmentData.date} at ${selectedTime}. Confirmation sent to your email.`,
      })
      setTimeout(() => navigate("/user-dashboard"), 3000)
    } catch (error) {
      console.error("Booking failed:", error)
      let errorMessage = "An error occurred while booking your appointment."

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || JSON.stringify(error.response.data) || errorMessage
      }
      toast({
        title: "Booking failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl relative">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium animate-bounce">
            <Sparkles className="h-4 w-4" />
            Premium Eye Care Services
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent leading-tight">
            Book Your Eye Appointment
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience world-class eye care with our expert optometrists. From comprehensive examinations to
            personalized lens prescriptions, we've got your vision covered.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Expert Optometrists</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Latest Technology</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Personalized Care</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Schedule Card */}
            <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Schedule Your Visit
                  </span>
                </CardTitle>
                <CardDescription className="text-base">Choose your perfect date and time slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 border-2 hover:border-primary/50 transition-all duration-200",
                          !date && "text-muted-foreground",
                          date && "border-primary/30 bg-primary/5",
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                        {date ? (
                          <span className="font-medium">{format(date, "PPP")}</span>
                        ) : (
                          <span>Pick your preferred date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 shadow-xl border-2" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          date < new Date() ||
                          date > new Date(new Date().setDate(new Date().getDate() + 60)) ||
                          date.getDay() === 0
                        }
                        initialFocus
                        className="rounded-lg"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {loadingSlots ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading available slots...</p>
                  </div>
                ) : date && availableTimes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <label className="text-sm font-semibold text-primary">Available Time Slots</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "h-11 transition-all duration-200 hover:scale-105",
                            selectedTime === time
                              ? "bg-primary hover:bg-primary/90 shadow-lg"
                              : "hover:border-primary/50 hover:bg-primary/5",
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : date && !loadingSlots ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">
                      {selectedDoctor
                        ? "No available slots for this doctor and date"
                        : "Please select a doctor to see available time slots"}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="h-5 w-5" />
                  What to Expect
                </CardTitle>
                <CardDescription>Your comprehensive eye care journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Eye Examination",
                    duration: "30 min",
                    description: "Comprehensive assessment of your vision and eye health",
                    icon: "👁️",
                  },
                  {
                    title: "Vision Test",
                    duration: "15 min",
                    description: "Evaluate your visual acuity and determine prescription needs",
                    icon: "🔍",
                  },
                  {
                    title: "Lens Consultation",
                    duration: "15 min",
                    description: "Discuss lens options based on your prescription and lifestyle",
                    icon: "👓",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-primary/10"
                  >
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          {item.duration}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Doctors Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2">Choose Your Expert</h2>
                <p className="text-muted-foreground">Select from our team of experienced optometrists</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loadingDoctors ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Finding the best doctors for you...</p>
                  </div>
                ) : doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className={cn(
                        "cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border-2",
                        selectedDoctor === doctor.id
                          ? "border-primary ring-4 ring-primary/20 shadow-xl bg-primary/5"
                          : "border-border hover:border-primary/50",
                      )}
                      onClick={() => handleSelectDoctor(doctor.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                              <img
                                src="doctor.jpg"
                                alt={doctor.name}
                                className="w-full h-full object-cover bg-gradient-to-br from-primary/10 to-primary/20"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "doctor.jpg"
                                }}
                              />
                            </div>
                            {selectedDoctor === doctor.id && (
                              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {doctor.name}
                            </CardTitle>
                            <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="h-4 w-4 text-primary" />
                            <span className="font-medium">Experience:</span>
                            <span>{doctor.experience_years}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <Users className="h-4 w-4 text-primary mt-0.5" />
                            <span className="text-muted-foreground">{formatAvailability(doctor.availability)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No doctors available for selected date</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Section */}
            <Card className="shadow-xl border-2 border-primary/10 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  Complete Your Booking
                </CardTitle>
                <CardDescription className="text-base">
                  Just a few more details and you're all set for your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                className="h-11 border-2 focus:border-primary/50 transition-colors"
                                {...field}
                              />
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
                            <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="your.email@example.com"
                                type="email"
                                className="h-11 border-2 focus:border-primary/50 transition-colors"
                                {...field}
                              />
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
                          <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(123) 456-7890"
                              className="h-11 border-2 focus:border-primary/50 transition-colors"
                              {...field}
                            />
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
                          <FormLabel className="text-sm font-semibold">Reason for Visit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 border-2 focus:border-primary/50 transition-colors">
                                <SelectValue placeholder="What brings you in today?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Eye Examination (30 min) - Comprehensive assessment of your vision and eye health">
                                👁️ Eye Examination (30 min)
                              </SelectItem>
                              <SelectItem value="Vision Test (15 min) - Evaluate your visual acuity and determine prescription needs">
                                🔍 Vision Test (15 min)
                              </SelectItem>
                              <SelectItem value="Lens Consultation (15 min) - Discuss lens options based on your prescription and lifestyle">
                                👓 Lens Consultation (15 min)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <CardFooter className="px-0 pt-6">
                      <Button
                        type="submit"
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] group"
                        disabled={!date || !selectedTime || selectedDoctor === null || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Booking Your Appointment...
                          </>
                        ) : (
                          <>
                            Book My Appointment
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointment
