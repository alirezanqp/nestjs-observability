import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule as PrometheusCustomModule } from './prometheus/prometheus.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-loki',
          options: {
            batching: true,
            interval: 5,
            labels: { application: 'nest-api' },

            // Credentials for our Loki instance
            host: 'http://localhost:3100',
            /*basicAuth: {
              username: 'username',
              password: 'password',
            },*/
          },
        },
      },
    }),
    PrometheusModule.register(),
    ConfigModule.forRoot(),
    PrismaModule,
    ArticlesModule,
    PrometheusCustomModule,
  ],
})
export class AppModule {}
