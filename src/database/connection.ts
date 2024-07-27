import { DataSource } from 'typeorm';
import { config, testConfig } from '../../ormconfig';

let AppDataSource: DataSource;

if (process.env.NODE_ENV === 'test') {
  AppDataSource = new DataSource(testConfig);
  console.log('Test Data Source config');
} else {
  AppDataSource = new DataSource(config);
  console.log('Data Source config:', config);
}

export { AppDataSource };
