const { z } = require('zod');

const userSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Age must be 18 or older"),
});

module.exports = { userSchema };