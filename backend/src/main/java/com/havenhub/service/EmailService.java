package com.havenhub.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@havenhub.com}")
    private String fromEmail;

    public void sendBookingConfirmation(String toEmail, String customerName, String roomNumber, String checkIn, String checkOut) {
        try {
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
                    customerName, roomNumber, checkIn, checkOut
            ));

            mailSender.send(message);
            log.info("Booking confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email to: {}", toEmail, e);
        }
    }

    public void sendBookingStatusUpdate(String toEmail, String customerName, String roomNumber, String status) {
        try {
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
            log.info("Booking status update email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send booking status update email to: {}", toEmail, e);
        }
    }
}