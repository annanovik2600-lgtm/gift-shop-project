// server/models/userModel.js
const db = require('../config/db');

const UserModel = {
    // Поиск пользователя по email (для проверки при регистрации и входе)
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Создание нового пользователя
    createUser: async (username, email, passwordHash, role) => {
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, passwordHash, role]
        );
        return result.insertId; // Возвращаем ID нового пользователя
    },

    // Создание профиля поставщика (если роль supplier)
    createSupplierProfile: async (userId, companyName) => {
        const [result] = await db.query(
            'INSERT INTO suppliers (user_id, company_name) VALUES (?, ?)',
            [userId, companyName]
        );
        return result.insertId;
    }
};

module.exports = UserModel;