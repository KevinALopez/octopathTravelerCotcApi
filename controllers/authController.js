const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.postSignUp = async (req, res, next) => {
    const encryptedPassword = await bcrypt.hash(req.body.password, 12);

    const user = new User({
        email: req.body.email,
        password: encryptedPassword,
    });

    try {
        const newUser = await user.save();
        return res
            .status(200)
            .json({ message: `New user, ${newUser.email} added.` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const isCorrectPassword = await bcrypt.compare(
            req.body.password,
            res.user.password
        );

        if (!isCorrectPassword) {
            return res.status(401).json({
                message: "Login unsuccesful. Invalid password.",
            });
        }

        req.session.isLoggedIn = true;
        req.session.save((err) => {
            console.log(err);
            return res.status(200).json({ message: "Login succesful!" });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getLogout = (req, res, next) => {
    try {
        if (req.session.isLoggedIn === true) {
            req.session.destroy((err) => {
                console.log(err);
                return res.status(200).json({ message: "Logout succesful." });
            });
        } else {
            return res
                .status(500)
                .json({ message: "Logout unsuccesful, please login first." });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getUserByEmail = async (req, res, next) => {
    let user;
    try {
        user = await User.findOne({ email: req.body.email });
        if (user == null) {
            return res
                .status(404)
                .json({ message: `User ${req.body.email} not found.` });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.user = user;
    next();
};
