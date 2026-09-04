import { createClient } from 'redis';

let redisClient;

const connectRedis = async () => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });
        
        redisClient.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        redisClient.on('connect', () => {
            console.log('****Redis Connected Successfully****');
        });

        await redisClient.connect();
    } catch (error) {
        console.error('Redis connection failed:', error);
        redisClient = null; // Nullify client on failure
    }
};

export { redisClient, connectRedis };
