"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = require("pg");
var prismaClientSingleton = function () {
    var connectionString = process.env.DATABASE_URL || '';
    // Use WHATWG URL to parse the database URL to avoid Node.js url.parse() deprecation warnings from pg
    var poolConfig = {};
    if (connectionString) {
        var parsedUrl = new URL(connectionString);
        poolConfig = {
            user: parsedUrl.username,
            password: parsedUrl.password,
            host: parsedUrl.hostname,
            port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
            database: parsedUrl.pathname.slice(1),
            ssl: parsedUrl.searchParams.get('sslmode') !== 'disable' ? true : undefined,
        };
    }
    var pool = new pg_1.Pool(poolConfig);
    var adapter = new adapter_pg_1.PrismaPg(pool);
    return new client_1.PrismaClient({ adapter: adapter });
};
var prisma = (_a = globalThis.prisma) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = prisma;
