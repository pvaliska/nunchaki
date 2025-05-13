package com.nunchaki.api.repository;

import com.nunchaki.api.model.Nunchaku;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NunchakuRepository extends JpaRepository<Nunchaku, Long> {
} 