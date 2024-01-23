const sqlite3 = require('sqlite3').verbose();

// Open a database handle
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create Users Table with user_id

db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, user_id TEXT, accountNumber TEXT, accountType TEXT, balance INTEGER, UNIQUE(user_id, accountNumber))', (err) => {

    if (err) {
        return console.error(err);
    }
    console.log('Users table created.');

    // Insert sample data
    const insert = 'INSERT INTO users (user_id, accountNumber,accountType, balance) VALUES (?, ?, ?, ?)';
    db.run(insert, ['auth0|65a83f97ae9356a77308cd03', '123456789','saving', 100000]);
    db.run(insert, ['auth0|65a83f97ae9356a77308cd03', '987654321','checking', 25000]);
    console.log('Sample data inserted into users table.');
});

module.exports = db;

