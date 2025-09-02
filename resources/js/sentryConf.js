import * as Sentry from "@sentry/browser";

Sentry.init({
    dsn: "https://b4bdfb3e20eb9dd5a6c00f3b32d8c9a9@o4507669075460096.ingest.de.sentry.io/4509951344574544",
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    tracePropagationTargets: ["lscc.org.sg", /^https:\/\/lscc\.org\.sg\/api/],
});
