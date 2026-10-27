package com.example.PaseoAPP;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

//Perfil "test": usa H2 en memoria (application-test.properties) en lugar de PostgreSQL
@SpringBootTest
@ActiveProfiles("test")
class PaseoAppApplicationTests {

	@Test
	void contextLoads() {
	}

}
