import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { mkdirSync } from 'fs';

// Ensure the logs directory exists
const logsDir = join(__dirname, '..', 'logs');
try { mkdirSync(logsDir, { recursive: true }); } catch {}

const logFilePath = join(logsDir, 'app.log');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            // Console output (pretty in dev, standard JSON in prod)
            ...(process.env.NODE_ENV !== 'production'
              ? [{
                  target: 'pino-pretty',
                  options: { colorize: true, singleLine: true },
                  level: 'debug',
                }]
              : [{
                  target: 'pino/file',
                  options: { destination: 1 }, // stdout
                  level: 'info',
                }]),
            // File output — always writes to logs/app.log
            {
              target: 'pino/file',
              options: { destination: logFilePath, mkdir: true },
              level: 'debug',
            },
          ],
        },
      },
    }),
    DrizzleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


