package com.nunchaki.api.service;

import com.nunchaki.api.model.Nunchaku;
import com.nunchaki.api.repository.NunchakuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NunchakuService {
    
    @Autowired
    private NunchakuRepository nunchakuRepository;
    
    public Nunchaku createNunchaku(Nunchaku nunchaku) {
        return nunchakuRepository.save(nunchaku);
    }
    
    public List<Nunchaku> getAllNunchakus() {
        return nunchakuRepository.findAll();
    }
    
    public void deleteNunchaku(Long id) {
        nunchakuRepository.deleteById(id);
    }

    public Nunchaku save(Nunchaku nunchaku) {
        return nunchakuRepository.save(nunchaku);
    }

    public List<Nunchaku> findAll() {
        return nunchakuRepository.findAll();
    }
} 