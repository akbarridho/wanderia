const User = require("../models/users");

class userController {
    static async findAllUser(req, res, next) {
        try {
            const dataUsers = await User.findAllUser();
            const response = dataUsers.map((user) => {
                return {
                    ...user,

                    password: undefined,
                    created_at: undefined,
                    createdAt: user.created_at,
                    updatedAt: user.updatedAt || null,
                };
            });

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async registerUser(req, res, next) {
        try {
            const { email, password, phoneNumber, address, name, dateOfBirth } =
                req.body;
            const data = await User.createUser({
                name,
                email,
                password,
                phoneNumber,
                dateOfBirth,
                address,
            });

            const newUser = await User.findUserByPk(data.insertedId);

            res.status(201).json({
                _id: data.insertedId,
                name,
                email,
                phoneNumber,
                dateOfBirth,
                address,
                createdAt: newUser.created_at,
                updatedAt: null,
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async findUserByPk(req, res, next) {
        try {
            const { id } = req.params;
            const dataUser = await User.findUserByPk(id);
            if (!dataUser) {
                throw {
                    name: "NotFound",
                };
            }

            const response = {
                ...dataUser,
                password: undefined,
                createdAt: dataUser.created_at,
                updatedAt: dataUser.updated_at || null,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserByPk(req, res, next) {
        try {
            const { id } = req.params;
            const { name, email, phoneNumber, address, dateOfBirth } = req.body;
            const dataUser = await User.findUserByPk(id);
            if (!dataUser) {
                throw {
                    name: "NotFound",
                };
            }
            const data = await User.updateUser(id, {
                name,
                email,
                phoneNumber,
                address,
                dateOfBirth,
            });
            const response = {
                ...dataUser,
                name,
                email,
                phoneNumber,
                address,
                dateOfBirth,
                password: undefined,
                createdAt: dataUser.created_at,
                updatedAt: data.updated_at || null,
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const dataUsers = await User.findUserByPk(id);
            if (!dataUsers) {
                throw {
                    name: "NotFound",
                };
            }
            const data = await User.deleteUser(id);
            res.status(200).json({ message: " Successfully Deleted" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = userController;
