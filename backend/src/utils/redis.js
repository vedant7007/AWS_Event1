const { createClient } = require('redis');

let redisClient = null;
let isEnabled = false;

const initializeClient = () => {
  const url = process.env.REDIS_URL;
  
  // Basic validation: must start with redis:// or rediss://
  if (url && (url.startsWith('redis://') || url.startsWith('rediss://'))) {
    try {
      redisClient = createClient({ url });
      
      redisClient.on('error', (err) => {
        if (isEnabled) {
          console.error('[Redis] Runtime Error:', err.message);
        }
      });
    } catch (e) {
      console.error('❌ Redis Client Initialization Failed (Check URL format):', e.message);
      redisClient = null;
    }
  } else if (url && url.startsWith('https://')) {
    console.error('❌ REDIS_URL Error: You used an HTTPS link. Redis clients require a redis:// link.');
    redisClient = null;
  } else if (!url && process.env.NODE_ENV === 'development') {
    // Default to local redis if nothing provided
    redisClient = createClient({ url: 'redis://127.0.0.1:6379' });
    redisClient.on('error', () => {}); // Silence local errors
  }
};

// Initial run
initializeClient();

const connectRedis = async () => {
  if (!redisClient) {
    console.log('⚠️  Redis skipped: Invalid or missing URL.');
    return;
  }

  try {
    await redisClient.connect();
    isEnabled = true;
    console.log('🚀 Redis Connected Successfully');
  } catch (err) {
    console.log('❌ Redis Connection Failed. System will fallback to MongoDB.');
    isEnabled = false;
  }
};

module.exports = {
  redisClient,
  connectRedis,
  isRedisReady: () => isEnabled && redisClient && redisClient.isReady
};
