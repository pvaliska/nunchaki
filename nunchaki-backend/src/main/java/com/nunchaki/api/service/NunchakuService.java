package com.nunchaki.api.service;

import com.nunchaki.api.model.Nunchaku;
import com.nunchaki.api.repository.NunchakuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NunchakuService {
    
    private static final String NUNCHAKU_TOPIC = "nunchaku-topic";
    
    @Autowired
    private NunchakuRepository nunchakuRepository;
    
    @Autowired
    private KafkaTemplate<String, Nunchaku> nunchakuKafkaTemplate;
    
    public Nunchaku createNunchaku(Nunchaku nunchaku) {
        return save(nunchaku);
    }
    
    public List<Nunchaku> getAllNunchakus() {
        return nunchakuRepository.findAll();
    }
    
    public void deleteNunchaku(String id) {
        nunchakuKafkaTemplate.send(NUNCHAKU_TOPIC, id, null);
    }

    public Nunchaku save(Nunchaku nunchaku) {
        if (nunchaku.getId() == null || nunchaku.getId().isEmpty()) {
            nunchaku.setId(UUID.randomUUID().toString());
        }
        nunchakuKafkaTemplate.send(NUNCHAKU_TOPIC, nunchaku.getId(), nunchaku);
        return nunchaku;
    }

    public List<Nunchaku> findAll() {
        return nunchakuRepository.findAll();
    }
} 