"use strict";

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "resume-service"],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || "",
  logging: {
    level: "info",
  },
  allow_all_headers: true,
  distributed_tracing: {
    enabled: true,
  },
  span_events: {
    enabled: true,
    sample_rate: 1.0,
  },
  transaction_tracer: {
    enabled: true,
  },
  attributes: {
    exclude: [
      "request.headers.cookie",
      "request.headers.authorization",
      "request.headers.proxyAuthorization",
      "request.headers.setCookie*",
      "request.headers.x*",
      "response.headers.cookie",
      "response.headers.authorization",
      "response.headers.proxyAuthorization",
      "response.headers.setCookie*",
      "response.headers.x*",
    ],
  },
};
