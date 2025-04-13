const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

// Initialize i18next
i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: "en",
        backend: {
            loadPath: "./locales/{{lng}}/translation.json", // Path to your translation files
        },
    });

// Export both the middleware and the i18next instance
module.exports = {
    i18nMiddleware: middleware.handle(i18next),
    i18nextInstance: i18next,
};
