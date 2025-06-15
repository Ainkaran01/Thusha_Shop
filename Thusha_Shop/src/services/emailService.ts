
export interface EmailNotificationData {
  to: string;
  subject: string;
  orderNumber?: string;
  customerName?: string;
  orderTotal?: number;
  deliveryDate?: string;
  trackingNumber?: string;
  appointmentDate?: string;
  doctorName?: string;
  appointmentTime?: string;
}

export const sendOrderConfirmationEmail = async (data: EmailNotificationData) => {
  console.log("Sending order confirmation email:", data);
  
  // In a real application, this would integrate with an email service like SendGrid, Mailgun, etc.
  // For now, we'll simulate the email sending
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Order confirmation email sent to ${data.to} for order ${data.orderNumber}`);
    return { success: true, message: "Order confirmation email sent successfully" };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { success: false, message: "Failed to send email" };
  }
};

export const sendShippingUpdateEmail = async (data: EmailNotificationData) => {
  console.log("Sending shipping update email:", data);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Shipping update email sent to ${data.to} for order ${data.orderNumber}`);
    return { success: true, message: "Shipping update email sent successfully" };
  } catch (error) {
    console.error("Failed to send shipping update email:", error);
    return { success: false, message: "Failed to send email" };
  }
};

export const sendAppointmentConfirmationEmail = async (data: EmailNotificationData) => {
  console.log("Sending appointment confirmation email:", data);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Appointment confirmation email sent to ${data.to} for appointment with ${data.doctorName}`);
    return { success: true, message: "Appointment confirmation email sent successfully" };
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    return { success: false, message: "Failed to send email" };
  }
};
