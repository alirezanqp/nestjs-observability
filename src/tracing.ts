import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import * as process from 'process';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import * as dotenv from 'dotenv';

// deprecated package
/*const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});*/

const traceRatio = process.env.NODE_ENV === 'production' ? 0.1 : 1.0;

const jaegerExporter = new OTLPTraceExporter();

const traceExporter = jaegerExporter;

const spanProcessor =
  process.env.NODE_ENV === `development`
    ? new SimpleSpanProcessor(traceExporter)
    : new BatchSpanProcessor(traceExporter);

export const otelSDK = new NodeSDK({
  spanProcessor,
  sampler: new TraceIdRatioBasedSampler(traceRatio),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `nestjs-otel`,
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
    new PrismaInstrumentation(),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
