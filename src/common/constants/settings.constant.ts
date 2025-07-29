export const SETTINGS = {
    ENABLE_ENCRYPTION: process.env.ENABLE_ENCRYPTION === 'true',
    ENABLE_CORS: process.env.ENABLE_CORS === 'true',
    ENABLE_RATE_LIMIT: process.env.ENABLE_RATE_LIMIT === 'true',
    ENABLE_RATE_LIMIT_WINDOW: process.env.ENABLE_RATE_LIMIT_WINDOW ?? 15 * 60 * 1000,
    ENABLE_RATE_LIMIT_MAX: process.env.ENABLE_RATE_LIMIT_MAX ?? 100,
    ENABLE_RATE_LIMIT_MESSAGE: process.env.ENABLE_RATE_LIMIT_MESSAGE ?? 'Too many requests, please try again later.',
};
