package com.nunchaki.api;

import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junitsupport.Provider;
import au.com.dius.pact.provider.junitsupport.State;
import au.com.dius.pact.provider.junitsupport.loader.PactBroker;
import au.com.dius.pact.provider.spring.junit5.PactVerificationSpringProvider;
import au.com.dius.pact.provider.junitsupport.loader.PactFolder;
import au.com.dius.pact.provider.junit5.HttpTestTarget;
import com.nunchaki.api.model.Nunchaku;
import com.nunchaki.api.repository.NunchakuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@Provider("NunchakuAPI")
@PactFolder("../nunchaki-table-manager/pacts")
public class NunchakuPactProviderTest {

    @MockBean
    private NunchakuRepository nunchakuRepository;

    @TestTemplate
    @ExtendWith(PactVerificationSpringProvider.class)
    void pactVerificationTestTemplate(PactVerificationContext context) {
        context.verifyInteraction();
    }

    @BeforeEach
    void before(PactVerificationContext context) {
        context.setTarget(new HttpTestTarget("localhost", 8080));
    }

    @State("provider has one nunchaku")
    public void providerHasOneNunchaku() {
        Nunchaku nunchaku = new Nunchaku();
        nunchaku.setId(1L);
        nunchaku.setName("Test Nunchaku");
        nunchaku.setLength(30);
        nunchaku.setMaterial("Wood");
        nunchaku.setWeight(500);
        when(nunchakuRepository.findAll()).thenReturn(Arrays.asList(nunchaku));
    }

    @State("provider allows record creation")
    public void providerAllowsRecordCreation() {
        Nunchaku nunchaku = new Nunchaku();
        nunchaku.setId(1L);
        nunchaku.setName("Test Nunchaku");
        nunchaku.setLength(30);
        nunchaku.setMaterial("Wood");
        nunchaku.setWeight(500);
        when(nunchakuRepository.save(any(Nunchaku.class))).thenReturn(nunchaku);
    }
} 