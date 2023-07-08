import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CartServiceStack', {
  env: { region: process.env.AWS_REGION as string },
});

new NodejsFunction(stack, 'cartServiceLambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: 'dist/main.js',
  handler: 'handler',
  environment: {
    PGUSER: process.env.PGUSER as string,
    PGHOST: process.env.PGHOST as string,
    PGPASSWORD: process.env.PGPASSWORD as string,
    PGDATABASE: process.env.PGDATABASE as string,
    PGPORT: process.env.PGPORT as string,
  },
});
