import emailjs from '@emailjs/browser';

/**
 * Sends a welcome email to the user after successful registration.
 * Note: You will need to set up an EmailJS account at https://www.emailjs.com/
 * and add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your .env
 */
export async function sendWelcomeEmail(userName: string, userEmail: string) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS environment variables are missing. Skipping welcome email.');
    return;
  }

  const templateParams = {
    to_name: userName,
    to_email: userEmail,
    subject: 'Welcome to Hospital Queue Optimizer!',
    message: `Hello ${userName}, your account has been successfully created. You can now access the HQO dashboard and manage hospital queues efficiently.`,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Welcome email sent successfully:', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}
