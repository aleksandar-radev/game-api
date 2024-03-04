type Config = {
  server: {
    port: number;
  };
  database: {
    url: string;
    properties: {
      useMongoClient: boolean;
    };
  };
  key: {
    privateKey: string;
    tokenExpireInSeconds: number;
  };
  pagination: {
    defaultPage: number;
    defaultLimit: number;
  };
};

const host: string = process.env.DB_HOST || "localhost";

const configs: { [key: string]: Config } = {
  dev: {
    server: {
      port: 9000,
    },
    database: {
      url: `mongodb://${host}/node-express-skeleton-dev`,
      properties: {
        useMongoClient: true,
      },
    },
    key: {
      privateKey: "37LvDSm4XvjYOh9Y",
      tokenExpireInSeconds: 1440,
    },
    pagination: {
      defaultPage: 1,
      defaultLimit: 10,
    },
  },
};

const env = process.env.ENV || "dev";

const selectedConfig = configs[env];
if (!selectedConfig) {
  throw new Error(`Configuration for environment '${env}' not found.`);
}

export default selectedConfig;
