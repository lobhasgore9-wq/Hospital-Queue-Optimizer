import emailjs from '@emailjs/browser';

/**
 * Generic function to send email via EmailJS
 */
async function sendEmail(templateParams: Record<string, any>) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  console.log('EmailJS Params:', { 
    serviceId: serviceId ? 'Present' : 'MISSING', 
    templateId: templateId ? 'Present' : 'MISSING', 
    publicKey: publicKey ? 'Present' : 'MISSING' 
  });

  if (!serviceId || !templateId || !publicKey) {
    console.error('EmailJS environment variables are missing! Email will not be sent.');
    return;
  }

  try {
    emailjs.init(publicKey);
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log('Email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Sends a welcome email to the user after successful registration.
 */
export async function sendWelcomeEmail(userName: string, userEmail: string, userRole: string = 'User') {
  // Generate a random 6-digit selection code (mocked for the UI registration flow)
  const selectionCode = Math.floor(100000 + Math.random() * 900000).toString();

  const templateParams = {
    email: userEmail, // Matches {{email}} in your EmailJS dashboard
    name: userName, // Common variable name
    to_name: userName,
    user_name: userName,
    user_email: userEmail,
    selection_code: selectionCode, 
    code: selectionCode,
    confirmation_code: selectionCode,
    user_role: userRole,
    subject: `Welcome to Flow Health — ${userRole} Registration Successful!`,
    message: `Hello ${userName}, your account has been successfully created as a ${userRole}. \n\nYour registration confirmation code is: ${selectionCode}. \n\nYou can now access the Flow Health dashboard and manage healthcare logistics efficiently.`,
  };

  return sendEmail(templateParams);
}

/**
 * Sends a test email to verify EmailJS configuration.
 */
export async function sendTestEmail(userEmail: string) {
  const templateParams = {
    to_name: 'HQO Test User',
    to_email: userEmail,
    subject: 'HQO EmailJS Configuration Test',
    message: 'Congratulations! Your EmailJS configuration for Hospital Queue Optimizer is working correctly.',
  };

  return sendEmail(templateParams);
}
