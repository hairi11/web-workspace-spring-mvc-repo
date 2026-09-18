package com.company.web.fx.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FxPageController {

    @GetMapping({"/fx", "/fx/", "/fx/enquiry"})
    public String enquiry() {
        return "fx/enquiry";
    }

    @GetMapping("/fx/master")
    public String master() {
        return "fx/master";
    }

    @GetMapping("/fx/transaction")
    public String transaction() {
        return "fx/transaction";
    }

    @GetMapping("/fx/enquiry.html")
    public String legacyEnquiry() {
        return "redirect:/fx/enquiry";
    }

    @GetMapping("/fx/master.html")
    public String legacyMaster() {
        return "redirect:/fx/master";
    }

    @GetMapping("/fx/transaction.html")
    public String legacyTransaction() {
        return "redirect:/fx/transaction";
    }
}
