import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATA_SOURCE_POSTGRES_HOST,
  port: process.env.DATA_SOURCE_POSTGRES_PORT as unknown as number,
  username: process.env.DATA_SOURCE_POSTGRES_USERNAME,
  password: process.env.DATA_SOURCE_POSTGRES_PASSWORD,
  database: process.env.DATA_SOURCE_POSTGRES_DATABASE,
  entities: ["./src/modules/**/infra/typeorm/entities/**/*.{.ts,.js}"],
  migrations: ["./src/shared/infra/typeorm/migrations/**/*.{.ts,.js}"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
