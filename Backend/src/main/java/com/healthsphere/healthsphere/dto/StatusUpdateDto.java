package com.healthsphere.healthsphere.dto;

import lombok.Data;

// Body for PATCH .../status endpoints — { "active": true|false }
@Data
public class StatusUpdateDto {
    private Boolean active;
}
