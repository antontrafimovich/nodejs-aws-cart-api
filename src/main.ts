import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import 'dotenv/config';

import { AppModule } from './app.module';
import helmet from 'helmet';

let server: any;

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event: any, context: any) => {
  server = server ?? (await bootstrap());
  return server(event, context);
};