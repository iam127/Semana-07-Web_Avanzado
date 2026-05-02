import userRepository from '../repositories/UserRepository.js';

class UserService {
    async getAll() {
        return userRepository.getAll();
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            roles: user.roles.map(r => r.name),
            url_profile: user.url_profile,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            address: user.address
        };
    }

    async update(id, data) {
        const user = await userRepository.updateById(id, data);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            roles: user.roles.map(r => r.name),
            url_profile: user.url_profile,
            phoneNumber: user.phoneNumber,
            birthdate: user.birthdate,
            address: user.address
        };
    }
}

export default new UserService();