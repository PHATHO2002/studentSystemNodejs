const sessionMiddleware = session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Thời hạn cookie 1 ngày
        secure: false, // Tạm thời để false trong môi trường phát triển
        httpOnly: true, // Ngăn không cho JavaScript truy cập cookie
        sameSite: 'lax', // Chống CSRF
    },
});
