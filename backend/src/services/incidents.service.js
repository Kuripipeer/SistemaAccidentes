"use strict";

const { randomUUID } = require("node:crypto");

const seedIncidents = require("../data/incidents.seed");
const AppError = require("../utils/appError");

class IncidentsService{
    constructor(){
        this.incidents = structuredClone(seedIncidents);
    }

    // Obtener todos y filtrar
    async getAll(filters = {}){
        const{
            search = "",
            category = "",
            status = "all"
        } = filters;

        let result = {...this.incidents};

        const normalizedSearch = this.normalizedSearch(search);

        if(normalizedSearch){
            result = result.filter((incident) =>{
                const searchableContent = this.normalizeText(
                    `${incident.title} ${incident.description} ${incident.category}`
                );

                return searchableContent.includes(normalizedSearch);
            });
        }

        if (category !== "all") {
            result = result.filter(
                (incident) => incident.category === category
            );
        }

        result.sort(
            (first, second) =>
                new Date(second.createdAt) - new Date(first.createdAt)
        );

        return result;
    }

    async getById(id){
        const incident = this.incidents.find((item) => item.id === id);

        if (!incident) {
            throw new AppError(404, `No se encontro el incidente con ID ${id}`);
        }
        
        return incident;
    }

    // CREATE
    async createIncident(body){
        const newIncident = {
            id: randomUUID(),
            title: body.title,
            category: body.category,
            description: body.description,
            status: body.status,
            location:{
                type: "Point",
                coordinates: [data.longitude, data.latitude]
            },
            createdAt: new Date(),
            updateAt: new Date(),
        };

        this.incidents.push(newIncident);

        return newIncident;
    }
}