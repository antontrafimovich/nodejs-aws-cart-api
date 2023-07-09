import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import 'dotenv/config';

import { AppModule } from './app.module';
import helmet from 'helmet';

// let server: any;

// async function bootstrap(): Promise<any> {
//   const app = await NestFactory.create(AppModule);
//   await app.init();

//   const expressApp = app.getHttpAdapter().getInstance();
//   return serverlessExpress({ app: expressApp });
// }

// export const handler = async (event: any, context: any, callback: any) => {
//   server = server ?? (await bootstrap());
//   return server(event, context, callback);
// };

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
