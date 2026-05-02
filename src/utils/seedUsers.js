import bcrypt from 'bcryptjs';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
    const existing = await userRepository.findByEmail('admin@admin.com');
    if (!existing) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash('Admin123#', saltRounds);

        const roleDoc = await roleRepository.findByName('admin');

        await userRepository.create({
            email: 'admin@admin.com',
            password: hashed,
            name: 'Admin',
            lastName: 'Principal',
            phoneNumber: '12345678',
            birthdate: new Date('1990-01-01'),
            roles: [roleDoc._id]
        });

        console.log('Seeded user: admin@admin.com / Admin123#');
    }
}