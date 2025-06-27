from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from datetime import datetime
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from doctors.models import DoctorProfile
from doctors.serializers import DoctorProfileSerializer


def send_appointment_emails(appointment, doctor_profile):
    """Send confirmation emails to patient and doctor"""
    doctor = doctor_profile
    patient = appointment.patient
    
    patient_name = patient.name
    doctor_name = doctor.user.name
    
    # Patient email content
    patient_subject = f"Your appointment confirmation with Dr. {doctor_name}"
    patient_context = {
        'patient_name': patient_name,
        'doctor_name': doctor_name,
        'date': appointment.date.strftime('%A, %B %d, %Y'),
        'time': dict(Appointment.TIME_SLOT_CHOICES).get(appointment.time),
        'specialty': doctor.specialization,
        'reason': appointment.reason,
        'clinic_name': "Thusha Optical",
        'clinic_phone': "(123) 456-7890",
        'clinic_address': "Hospital road , Jaffna"
    }
    patient_html_message = render_to_string('emails/patient_confirmation.html', patient_context)

    # Doctor email content
    doctor_subject = f"New appointment: {patient_name}"
    doctor_context = {
        'doctor_name': doctor_name,
        'patient_name': patient_name,
        'patient_email': patient.email,
        'patient_phone': appointment.phone,
        'date': appointment.date.strftime('%A, %B %d, %Y'),
        'time': dict(Appointment.TIME_SLOT_CHOICES).get(appointment.time),
        'reason': appointment.reason
    }
    doctor_html_message = render_to_string('emails/doctor_notification.html', doctor_context)

    # Send email to patient
    send_mail(
        subject=patient_subject,
        message=strip_tags(patient_html_message),
        html_message=patient_html_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[patient.email],
        fail_silently=False
    )

    # Send email to doctor (if email exists)
    if doctor.user.email:
        send_mail(
            subject=doctor_subject,
            message=strip_tags(doctor_html_message),
            html_message=doctor_html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[doctor.user.email],
            fail_silently=False
        )


class DoctorListView(generics.ListAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['specialization']
    search_fields = ['user__name', 'specialization']

    def get_queryset(self):
        date_str = self.request.query_params.get('date')
        queryset = DoctorProfile.objects.all()

        if date_str:
            try:
                date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                weekday = date_obj.strftime('%A').lower()
                from django.db.models import Q

                possible_keys = [
                    weekday,
                    f"{weekday}'",
                    f"{weekday}*",
                    f"'{weekday}'",
                    f'"{weekday}"'
                ]

                query = Q()
                for key in possible_keys:
                    query |= Q(availability__has_key=key) & Q(availability__contains={key: True})

                queryset = queryset.filter(query)

            except ValueError:
                pass

        return queryset


class AvailableDoctorsView(generics.ListAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        date_str = self.request.query_params.get('date')
        queryset = DoctorProfile.objects.all()

        if date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
                weekday = date.strftime('%A').lower()

                queryset = queryset.filter(availability__contains=[weekday])

                appointments = Appointment.objects.filter(
                    date=date,
                    status__in=['confirmed', 'pending']
                )

                booked_doctor_ids = appointments.values_list('doctor', flat=True)

                queryset = queryset.exclude(id__in=booked_doctor_ids)

            except ValueError as e:
                print(f"Date parsing error: {e}")
                return DoctorProfile.objects.none()

        return queryset


class AvailableSlotsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, doctor_id):
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'Date required'}, status=400)

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            doctor = DoctorProfile.objects.get(id=doctor_id)

            booked_slots = Appointment.objects.filter(
                doctor=doctor,
                date=date,
                status__in=['confirmed', 'pending']
            ).values_list('time', flat=True)

            available_slots = [
                slot[0] for slot in Appointment.TIME_SLOT_CHOICES
                if slot[0] not in booked_slots
            ]

            return Response({'available_slots': available_slots})

        except Exception as e:
            return Response({'error': str(e)}, status=400)


class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        appointment = serializer.save(
            patient=self.request.user,
            status='confirmed'  # Or default status you want
        )
        send_appointment_emails(appointment, appointment.doctor)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == status.HTTP_201_CREATED:
            response.data['message'] = 'Appointment booked successfully. Confirmation sent to your email.'
        return response


class AppointmentListView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'doctor', 'date']

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
          return Appointment.objects.select_related('doctor', 'patient', 'doctor__user')
        
        return Appointment.objects.filter(
            Q(patient=user) | Q(doctor__user=user)
        ).select_related('doctor', 'patient', 'doctor__user')

    def perform_create(self, serializer):
        appointment = serializer.save(patient=self.request.user)
        send_appointment_emails(appointment, appointment.doctor)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        appointment = serializer.save()
        if 'status' in serializer.validated_data:
            send_appointment_emails(appointment, appointment.doctor)
