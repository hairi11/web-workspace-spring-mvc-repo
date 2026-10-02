package com.company.web.fc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FcPageController {

    @GetMapping({"/fc", "/fc/", "/fc/enquiry"})
    public String enquiry() {
        return "fc/enquiry";
    }

    @GetMapping("/fc/transaction/view")
    public String view() {
        return "fc/view";
    }

    @GetMapping({
            "/fc/transaction/create",
            "/fc/transaction/edit"
    })
    public String form() {
        return "fc/form";
    }

    @GetMapping("/fc/enquiry.html")
    public String legacyEnquiry() {
        return "redirect:/fc/enquiry";
    }
}
