import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || '';
  
  // Use WHATWG URL to parse the database URL to avoid Node.js url.parse() deprecation warnings from pg
  let poolConfig = {};
  if (connectionString) {
    const parsedUrl = new URL(connectionString);
    poolConfig = {
      user: parsedUrl.username,
      password: parsedUrl.password,
      host: parsedUrl.hostname,
      port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
      database: parsedUrl.pathname.slice(1),
      ssl: parsedUrl.searchParams.get('sslmode') !== 'disable' ? true : undefined,
    };
  }

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
