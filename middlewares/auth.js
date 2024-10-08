exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).json({ message: "Unauthorized access." });
    }

    next();
};
