include .env
export $(shell sed 's/=.*//' .env)

.PHONY: up down logs bash build wp-install composer composer-update wp wp-setup

# Set dir of Makefile to a variable to use later

MAKEPATH := $(abspath $(lastword $(MAKEFILE_LIST)))
PWD := $(dir $(MAKEPATH))

# APP DETAILS

DEV_YML_FILES :=  -f docker-compose.development.yml
PROD_YML_FILES :=  -f docker-compose.yml


devps:
	docker-compose  ${DEV_YML_FILES} ps

prodps:
	docker-compose -f docker-compose.yml -f prod.yml ps

dev: ## Creates and starts the docker containers with development settings
	docker-compose  ${DEV_YML_FILES} up -d
	docker-compose  ${DEV_YML_FILES} ps
	
prod: ## Creates and starts the docker containers with production settings
	docker-compose  ${PROD_YML_FILES} up -d
	docker-compose  ${PROD_YML_FILES} ps

devdown:
	docker-compose  ${DEV_YML_FILES} down
	
proddown:
	docker-compose  ${PROD_YML_FILES} down

builddev:
	docker-compose ${DEV_YML_FILES} build

buildprod:
	docker-compose ${PROD_YML_FILES} build

logs:
	docker-compose ${DEV_YML_FILES} logs -f
	
logsprod:
	docker-compose ${PROD_YML_FILES} logs -f

shell:
	docker-compose  ${DEV_YML_FILES} exec wordpress1 sh

shellnode:
	docker-compose exec nodejs1 sh
	
shellnodeapi:
	docker-compose ${DEV_YML_FILES} exec nodejsapi sh

shellnodeadmin:
	docker-compose ${DEV_YML_FILES} exec nodejsadmin sh

shellnginx:
	docker-compose exec nginx1 sh

devconfig:
	docker-compose  ${DEV_YML_FILES} config

prodconfig:
	docker-compose  ${PROD_YML_FILES} config

#############################
# Argument fix workaround
#############################
%:
	@: