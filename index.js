require('dotenv').config();
const express = require('express');
const { expressjwt: jwt, } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: [process.env.AUTH0_AUDIENCE1,process.env.AUTH0_AUDIENCE2],
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

// Endpoint to get user's accounts
app.get('/getUserAccounts',checkJwt, (req, res) => {
    console.log(req.auth);
    const userId = req.auth.sub;

    db.all('SELECT * FROM users WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.json(rows);
    });
});



// Transfer endpoint
app.post('/transfer', checkJwt, (req, res) => {
    const { from, to, amount } = req.body;
    const fromUserId = req.auth.sub;
    db.serialize(() => {
        db.get('SELECT balance FROM users WHERE accountNumber = ? AND user_id=?', [from, fromUserId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!row || row.balance < amount) {
                return res.status(400).send('Invalid transaction');
            }

            // Update balances
            const fromBalance = row.balance - amount;
            db.run('UPDATE users SET balance = ? WHERE accountNumber = ?', [fromBalance, from], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                db.run('UPDATE users SET balance = balance + ? WHERE accountNumber = ?', [amount, to], (err) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.send({ message: 'Transfer successful', balance: fromBalance });
                });
            });
        });
    });
});

// Add User endpoint
app.post('/addUserAccount', (req, res) => {
    const { user_id, accountNumber,accountType, balance } = req.body;
    const sql = 'INSERT INTO users (user_id, accountNumber,accountType, balance) VALUES (?, ?, ?, ?)';
    db.run(sql, [user_id, accountNumber,accountType, balance], (err) => {
        if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
                return res.status(400).json({ error: "User ID and Account Number combination already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.send({ message: 'User and account added successfully' });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
