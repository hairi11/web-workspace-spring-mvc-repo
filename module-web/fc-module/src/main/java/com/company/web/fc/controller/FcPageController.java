package com.company.web.fc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FcPageController {

    @GetMapping({"/fc", "/fc/", "/fc/enquiry"})
    public String enquiry() {
        return "fc/enquiry";
    }

    @GetMapping("/fc/transaction")
    public String transaction() {
        return "fc/transaction";
    }

    @GetMapping("/fc/enquiry.html")
    public String legacyEnquiry() {
        return "redirect:/fc/enquiry";
    }

    @GetMapping("/fc/transaction.html")
    public String legacyTransaction() {
        return "redirect:/fc/transaction";
    }
}
