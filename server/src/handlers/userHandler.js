const jwt = require("jsonwebtoken");
const userStore = require("../models/userModel");

const JWT_SECRET = "your-secret-key";
const JWT_EXPIRY = "24h";

const COOKIE_OPTIONS = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
};

const register = (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const user = userStore.createUser(username, email, password);

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            access_token: token,
            user: userWithoutPassword,
        });
    } catch (error) {
        if (error.message.includes("already exists")) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: "Registration failed", details: error.message });
    }
};

const user = userStore.createUser("Ashim", "ady.ashim@gmail.com", "111111");

console.log(user)

const login = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Username/email and password are required" });
        }

        const user = userStore.authenticate(email, password);

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

        res.cookie("access_token", token, COOKIE_OPTIONS);

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: "Login successful",
            access_token: token,
            user: userWithoutPassword,
        });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const headerToken = authHeader && authHeader.split(" ")[1];
    const cookieToken = req.cookies.access_token;

    const token = headerToken || cookieToken;

    if (!token) {
        return res.status(401).json({ error: "Authentication token required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        req.user = user;
        next();
    });
};

const getCurrentUser = (req, res) => {
    const user = userStore.getUserById(req.user.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
};

module.exports = {
    register,
    login,
    authenticateToken,
    getCurrentUser,
};
