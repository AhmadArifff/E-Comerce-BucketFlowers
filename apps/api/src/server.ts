import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In development, load .env from monorepo root
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🌸 [Chenille API] Backend engine is running on http://localhost:${port}`);
    console.log(`🩺 Health check available at: http://localhost:${port}/api/health`);
    console.log(`📦 RESTful endpoints active at: http://localhost:${port}/api/v1`);
  });
}

export default app;
