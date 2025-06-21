package com.havenhub.dto;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String reason;
    private Boolean isEarlyCheckout = false;
}