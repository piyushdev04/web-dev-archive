const { z } = require("zod");

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const validateUser = (req, res, next) => {
    const result = userSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    next();
};

module.exports = validateUser;