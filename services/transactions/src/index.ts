import { startPublicApiApp } from './interfaces/public-api/public-api.app.js';
import { startPrivateApiApp } from './interfaces/internal-api/private-api.app.js';

await Promise.all([startPublicApiApp(), startPrivateApiApp()]);
