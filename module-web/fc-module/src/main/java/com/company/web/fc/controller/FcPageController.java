package com.company.web.fc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FcPageController {

    @GetMapping({"/fc", "/fc/", "/fc/home"})
    public String home() {
        return "fc/home";
    }

    @GetMapping("/fc/home.html")
    public String legacyHome() {
        return "redirect:/fc/home";
    }
}
