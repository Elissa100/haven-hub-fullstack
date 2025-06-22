package com.havenhub.service;

import com.havenhub.entity.Booking;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PdfService {

    public byte[] generatePayslip(Booking booking) {
        log.info("Generating payslip for booking ID: {}", booking.getId());

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header
            document.add(new Paragraph("HAVENHUB HOTEL")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setBold());

            document.add(new Paragraph("PAYMENT INVOICE")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(16)
                    .setBold());

            document.add(new Paragraph("\n"));

            // Booking details table
            Table table = new Table(2);
            table.setWidth(400);

            table.addCell("Invoice Number:");
            table.addCell("INV-" + booking.getId());

            table.addCell("Customer Name:");
            table.addCell(booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName());

            table.addCell("Customer Email:");
            table.addCell(booking.getCustomer().getEmail());

            table.addCell("Room Number:");
            table.addCell(booking.getRoom().getRoomNumber());

            table.addCell("Room Type:");
            table.addCell(booking.getRoom().getType().toString());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            table.addCell("Check-in:");
            table.addCell(booking.getStartDateTime().format(formatter));

            table.addCell("Check-out:");
            table.addCell(booking.getEndDateTime().format(formatter));

            table.addCell("Total Amount:");
            table.addCell("$" + booking.getTotalAmount());

            table.addCell("Status:");
            table.addCell(booking.getStatus().toString());

            document.add(table);

            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Thank you for choosing HavenHub Hotel!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setItalic());

            document.add(new Paragraph("Please complete payment to finalize your checkout.")
                    .setTextAlignment(TextAlignment.CENTER));

            document.close();

            log.info("Payslip generated successfully for booking ID: {}", booking.getId());
            return baos.toByteArray();

        } catch (Exception e) {
            log.error("Error generating payslip for booking ID: {}", booking.getId(), e);
            throw new RuntimeException("Failed to generate payslip: " + e.getMessage());
        }
    }
}