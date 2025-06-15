
import { useState } from 'react';
import { sendOrderConfirmationEmail, sendShippingUpdateEmail, sendAppointmentConfirmationEmail, EmailNotificationData } from '@/services/emailService';
import { useToast } from './use-toast';

export const useEmailNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendOrderConfirmation = async (data: EmailNotificationData) => {
    setIsLoading(true);
    try {
      const result = await sendOrderConfirmationEmail(data);
      if (result.success) {
        toast({
          title: "Email Sent",
          description: "Order confirmation email has been sent successfully.",
        });
      } else {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send order confirmation email.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendShippingUpdate = async (data: EmailNotificationData) => {
    setIsLoading(true);
    try {
      const result = await sendShippingUpdateEmail(data);
      if (result.success) {
        toast({
          title: "Email Sent",
          description: "Shipping update email has been sent successfully.",
        });
      } else {
        throw new Error(result.message);
      }
      return result;
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send shipping update email.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendAppointmentConfirmation = async (data: EmailNotificationData) => {
    setIsLoading(true);
    try {
      const result = await sendAppointmentConfirmationEmail(data);
      if (result.success) {
        toast({
          title: "Email Sent",
          description: "Appointment confirmation email has been sent successfully.",
        });
      } else {
        throw new Error(result.message);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendOrderConfirmation,
    sendShippingUpdate,
    sendAppointmentConfirmation,
    isLoading
  };
};
