const { Client } = require('pg');
const PG_URL = process.env.PG_URL || 'postgres://localhost:5432/';
const DB_NAME = process.env.DB_NAME || '2004_day_20';
const db = new Client(`${PG_URL}${DB_NAME}`);
//  console.log(chalk.magenta(seed));
db.connect();

//  create all functions and then export

const getAllUsers = async () => {
    const { rows } = await db.query(`
        SELECT id, name, department_id
        FROM users;
    `);
    console.log(rows);
    return rows;
}

const endDb = () => {
    db.end();
}

const seed = async (force = false) => {
    if(force) {
        await db.query(`
            DROP TABLE IF EXISTS users;
        `);
    }
    
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            department_id TEXT NOT NULL
        );
    `);

    console.log('Seeding complete!');
};

module.exports = { seed, endDb, getAllUsers };
