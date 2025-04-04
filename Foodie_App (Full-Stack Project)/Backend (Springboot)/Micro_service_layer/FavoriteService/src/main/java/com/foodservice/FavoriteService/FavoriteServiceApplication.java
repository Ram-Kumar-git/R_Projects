package com.foodservice.FavoriteService;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.foodservice.FavoriteService")
@EnableMongoRepositories("com.foodservice.FavoriteService.Repository")  // ✅ Ensure repository scanning
@EnableFeignClients(basePackages = "com.foodservice.FavoriteService.Feign")
public class FavoriteServiceApplication {

	public static void main(String[] args) {

		SpringApplication.run(FavoriteServiceApplication.class, args);

	}

}