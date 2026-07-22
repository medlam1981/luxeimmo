import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || '';
  
  const poolConfig: any = {
    connectionString,
  };

  // Vercel Postgres/Supabase requires SSL in production
  if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = {
      rejectUnauthorized: false,
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
