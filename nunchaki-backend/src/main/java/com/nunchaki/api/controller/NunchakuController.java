package com.nunchaki.api.controller;

import com.nunchaki.api.model.Nunchaku;
import com.nunchaki.api.service.NunchakuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nunchaku")
public class NunchakuController {
    
    @Autowired
    private NunchakuService nunchakuService;
    
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Nunchaku> createNunchaku(@RequestBody Nunchaku nunchaku) {
        Nunchaku savedNunchaku = nunchakuService.save(nunchaku);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNunchaku);
    }
    
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Nunchaku>> getAllNunchakus() {
        return ResponseEntity.ok(nunchakuService.findAll());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNunchaku(@PathVariable String id) {
        nunchakuService.deleteNunchaku(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).header("Content-Type", "application/json").build();
    }
} 