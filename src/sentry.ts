import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import { HttpClient } from "@sentry/integrations";

export const initSentry = (vueInstance, routerInstance) => {
    Sentry.init({
        Vue: vueInstance,
        dsn: "https://afeec095c759400a93721758518be67f@dev-sentry.galaxy-immi.com/11",
        integrations: [
          new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(routerInstance),
            tracingOrigins: ["localhost", /workh5\.galaxy-immi\.com\/api/, /^\//],
          }),
          new HttpClient()
        ],
        environment: import.meta.env.VITE_APP_ENV,
        release: '0.0.0',
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        sampleRate: 1.0,
    });
};
