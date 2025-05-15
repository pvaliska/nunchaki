package com.nunchaki.api.service;

import com.nunchaki.api.model.Nunchaku;
import com.nunchaki.api.repository.NunchakuRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.stereotype.Service;

@Service
public class NunchakuKafkaConsumer {
    
    private static final Logger logger = LoggerFactory.getLogger(NunchakuKafkaConsumer.class);
    private static final String NUNCHAKU_TOPIC = "nunchaku-topic";
    private static final String CONSUMER_GROUP = "nunchaku-db-group";

    @Autowired
    private NunchakuRepository nunchakuRepository;

    @KafkaListener(
        topics = NUNCHAKU_TOPIC,
        groupId = CONSUMER_GROUP,
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(@Payload(required = false) Nunchaku nunchaku, @Header(KafkaHeaders.RECEIVED_KEY) String key) {
        if (nunchaku == null) {
            // Handle tombstone (delete)
            logger.info("Received delete event for nunchaku with id: {}", key);
            nunchakuRepository.deleteById(key);
        } else {
            // Handle create/update
            logger.info("Received save event for nunchaku with id: {}", nunchaku.getId());
            nunchakuRepository.save(nunchaku);
        }
    }
} 