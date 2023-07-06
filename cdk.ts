import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CartServiceStack', {
  env: { region: process.env.AWS_REGION as string },
});

const cartServiceLambdaLayer = new lambda.LayerVersion(stack, 'cartServiceLayer', {
  code: lambda.Code.fromAsset('node_modules'),
  compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
});

new NodejsFunction(stack, 'cartServiceLambda', {
  runtime: lambda.Runtime.NODEJS_18_X,
  entry: 'dist/src/handler.js',
  handler: 'handler',
  layers: [cartServiceLambdaLayer],
});
