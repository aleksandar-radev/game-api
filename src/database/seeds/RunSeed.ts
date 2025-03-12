import readline from 'readline';
import { AppDataSource } from '../connection';
import { UserSeeder } from './UserSeeder';
import { GameDataSeeder } from './GameDataSeeder';

async function runSeed() {
  try {
    if (process.env.ENV !== 'local') {
      if (process.env.ENV !== 'development') {
        throw new Error('Seeding not allowed in environment other than local/development.');
      }
      // development env check
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question(
          'This is the development environment. Do you still want to proceed with seeding? (deletes all entries and recreates) (yes/no) ',
          (ans) => {
            rl.close();
            resolve(ans);
          },
        );
      });

      if (answer.toLowerCase() !== 'yes') {
        throw new Error('Seeding aborted by the user.');
      }
    }

    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // ask if all migrations should be run again
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Do you want to run all migrations again? This deletes all data. (y/n): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('Running all migrations again...');

        // Delete all tables and truncate migrations table
        await AppDataSource.query(`TRUNCATE "${process.env.DB_SCHEMA}".migrations;`);
        await AppDataSource.query(`DROP TABLE IF EXISTS "${process.env.DB_SCHEMA}".user_data;`);
        await AppDataSource.query(`DROP TABLE IF EXISTS "${process.env.DB_SCHEMA}".users;`);

        console.log('All tables deleted and migrations table truncated.');

        // Run migrations
        await AppDataSource.runMigrations();

        console.log('Migrations completed.');
      } else {
        console.log('Skipping migrations.');
      }

      // Start seeding
      const userSeeder = new UserSeeder(AppDataSource);
      await userSeeder.seed();
      // Start seeding
      const gameDataSeeder = new GameDataSeeder(AppDataSource);
      await gameDataSeeder.seed();
      console.log('Seeding completed successfully!');

      await AppDataSource.destroy();
      rl.close();
    });
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

runSeed();
