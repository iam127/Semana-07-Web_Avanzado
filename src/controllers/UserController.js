import userService from '../services/UserService.js';

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userService.update(id, req.body);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();