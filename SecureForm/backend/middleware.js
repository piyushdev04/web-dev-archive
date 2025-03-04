const logMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

const globalErrorHandler = (err, req, res, next) => {
    res.status(400).json({ success: false, error: err.message });
};

module.exports = { logMiddleware, globalErrorHandler};