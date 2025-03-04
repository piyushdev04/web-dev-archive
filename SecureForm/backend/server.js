const express = require('express');
const cors = require('cors');
const path = require('path');
const { logMiddleware, globalErrorHandler } = require('./middleware');
const { userSchema } = require('./validation');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logMiddleware);

app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/create-user', (req, res, next) => {
    console.log('Recived data:', req.body);
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
        return next(result.error);
    }

    res.json({ success: true, message: "User created successfully!", data: req.body});
});

app.use(globalErrorHandler);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));