import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Set public DNS servers to resolve external MongoDB SRV domains properly in local/sandboxed environments
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables immediately on import to ensure variables are present before other dependencies load.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

