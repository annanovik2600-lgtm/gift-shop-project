// server/services/authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
require('dotenv').config();

const AuthService = {
    register: async (userData) => {
        const { username, email, password, role, company_name } = userData;

        // 1. Проверяем, существует ли уже такой email
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // 2. Хешируем пароль (соль 10 раундов)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Создаем пользователя в БД
        const userId = await UserModel.createUser(username, email, passwordHash, role);

        // 4. Если это поставщик, создаем запись в таблице suppliers
        if (role === 'supplier') {
            if (!company_name) throw new Error('Для поставщика необходимо указать название компании');
            await UserModel.createSupplierProfile(userId, company_name);
        }

        return { message: 'Пользователь успешно зарегистрирован', userId };
    },

    login: async (email, password) => {
        // 1. Ищем пользователя
        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        // 2. Проверяем, не заблокирован ли он
        if (user.is_blocked) {
            throw new Error('Ваш аккаунт заблокирован администратором');
        }

        // 3. Сверяем пароли
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Неверный email или пароль');
        }

        // 4. Генерируем JWT токен (внутрь кладем ID и роль)
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // Токен живет 1 день
        );

        return {
            message: 'Авторизация успешна',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }
};

module.exports = AuthService;