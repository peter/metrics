import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export function setup(server: any) {
    const swaggerOptions = {
        swagger: {
            info: {
                title: "Metrics APIs",
                description: "REST API for metric time series data",
                version: "1.0.0",
            },
            host: "localhost",
            schemes: ["http", "https"],
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: [
                { name: "metric" },
                { name: "metric-value" }
            ],
        },
    };
    
    const swaggerUiOptions = {
        routePrefix: "/docs",
        exposeRoute: true,
    };
    
    server.register(fastifySwagger, swaggerOptions);
    server.register(fastifySwaggerUi, swaggerUiOptions);    
}
