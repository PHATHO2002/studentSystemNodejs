const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis').default;
const redisClient = redis.createClient();
const sessionRedis = async (app) => {
    try {
        await redisClient.connect();
        redisClient.on('error', (err) => {
            console.log('Redis error: ', err);
        });
        await app.use(
            session({
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: true, // Tạm thời để true để chắc chắn session được lưu
                cookie: {
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: false, // Tạm thời để false trong môi trường phát triển
                    httpOnly: false, // Tạm thời để false để kiểm tra
                    sameSite: 'lax', // Đặt giá trị đơn giản để kiểm tra
                },
                store: new redisStore({ host: 'localhost', port: 6379, client: redisClient }),
            }),
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = sessionRedis;
