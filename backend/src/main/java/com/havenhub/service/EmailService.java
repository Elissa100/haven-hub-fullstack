package com.havenhub.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@havenhub.com}")
    private String fromEmail;

    public void sendBookingConfirmation(String toEmail, String customerName, String roomNumber, String startTime, String endTime) {
        try {
            log.info("Sending booking confirmation email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Booking Confirmation - HavenHub");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                            "Your booking has been confirmed!\n\n" +
                            "Booking Details:\n" +
                            "Room: %s\n" +
                            "Check-in: %s\n" +
                            "Check-out: %s\n\n" +
                            "Thank you for choosing HavenHub!\n\n" +
                            "Best regards,\n" +
                            "HavenHub Team",
                    customerName, roomNumber, startTime, endTime
            ));

            mailSender.send(message);
            log.info("Booking confirmation email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to: {}", toEmail, e);
        }
    }

    public void sendBookingStatusUpdate(String toEmail, String customerName, String roomNumber, String status) {
        try {
            log.info("Sending booking status update email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Booking Status Update - HavenHub");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                            "Your booking status has been updated.\n\n" +
                            "Room: %s\n" +
                            "Status: %s\n\n" +
                            "Thank you for choosing HavenHub!\n\n" +
                            "Best regards,\n" +
                            "HavenHub Team",
                    customerName, roomNumber, status
            ));

            mailSender.send(message);
            log.info("Booking status update email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking status update email to: {}", toEmail, e);
        }
    }

    public void sendUserCreationEmail(String toEmail, String userName, String password, String role) {
        try {
            log.info("Sending user creation email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to HavenHub - Your Account Details");
            message.setText(String.format(
                    "Dear %s,\n\n" +
                            "Welcome to HavenHub! Your account has been created by the administrator.\n\n" +
                            "Account Details:\n" +
                            "Email: %s\n" +
                            "Password: %s\n" +
                            "Role: %s\n\n" +
                            "Please log in to the system and change your password immediately for security purposes.\n\n" +
                            "Login URL: http://localhost:5173/login\n\n" +
                            "Best regards,\n" +
                            "HavenHub Team",
                    userName, toEmail, password, role
            ));

            mailSender.send(message);
            log.info("User creation email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send user creation email to: {}", toEmail, e);
        }
    }

    public void sendCheckoutNotificationWithPayslip(String toEmail, String customerName, String roomNumber, 
                                                   String totalAmount, byte[] payslipPdf) {
        try {
            log.info("Sending checkout notification with payslip to: {}", toEmail);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Checkout Required - Payment Due - HavenHub");
            
            String emailBody = String.format(
                    "Dear %s,\n\n" +
                            "Your booking period has ended and checkout is now required.\n\n" +
                            "Booking Details:\n" +
                            "Room: %s\n" +
                            "Total Amount Due: $%s\n\n" +
                            "Please complete payment to finalize your checkout. " +
                            "Your detailed invoice is attached to this email.\n\n" +
                            "You can complete payment and checkout through your HavenHub account.\n\n" +
                            "Thank you for choosing HavenHub!\n\n" +
                            "Best regards,\n" +
                            "HavenHub Team",
                    customerName, roomNumber, totalAmount
            );
            
            helper.setText(emailBody);
            
            // Attach payslip PDF
            helper.addAttachment("HavenHub_Invoice.pdf", new ByteArrayResource(payslipPdf));
            
            mailSender.send(message);
            log.info("Checkout notification with payslip sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send checkout notification with payslip to: {}", toEmail, e);
        }
    }
}