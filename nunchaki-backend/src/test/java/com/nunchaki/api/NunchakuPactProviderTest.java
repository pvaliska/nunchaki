package com.nunchaki.api;

import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junitsupport.Provider;
import au.com.dius.pact.provider.junitsupport.State;
import au.com.dius.pact.provider.spring.junit5.PactVerificationSpringProvider;
import au.com.dius.pact.provider.junitsupport.loader.PactFolder;
import au.com.dius.pact.provider.junit5.HttpTestTarget;
import com.nunchaki.api.model.Nunchaku;
import com.nunchaki.api.repository.NunchakuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Provider("NunchakuAPI")
@PactFolder("../nunchaki-table-manager/pacts")
@Testcontainers
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=true",
    "spring.datasource.hikari.max-lifetime=30000",
    "spring.datasource.hikari.connection-timeout=10000",
    "spring.datasource.hikari.validation-timeout=1000"
})
public class NunchakuPactProviderTest {

    @LocalServerPort
    private int port;

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private NunchakuRepository nunchakuRepository;

    private void clearDatabase() {
        nunchakuRepository.deleteAll();
    }

    @TestTemplate
    @ExtendWith(PactVerificationSpringProvider.class)
    void pactVerificationTestTemplate(PactVerificationContext context) {
        context.verifyInteraction();
    }

    @BeforeEach
    void before(PactVerificationContext context) {
        context.setTarget(new HttpTestTarget("localhost", port));
    }

    @State("provider has one nunchaku")
    public void providerHasOneNunchaku() {
        clearDatabase();
        Nunchaku nunchaku = new Nunchaku();
        nunchaku.setId("123e4567-e89b-12d3-a456-426614174000");
        nunchaku.setName("Test Nunchaku");
        nunchaku.setLength(30);
        nunchaku.setMaterial("Wood");
        nunchaku.setWeight(500);
        nunchakuRepository.save(nunchaku);
    }

    @State("provider allows record creation")
    public void providerAllowsRecordCreation() {
        clearDatabase();
        // The repository is already configured to allow record creation
        // No need for any setup as we're using a real database
    }
} 