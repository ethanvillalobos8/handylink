import db from '@/lib/db';

// CRUD Operations

// Create a new user
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { Name, Email, PhoneNumber, Address, Username, Password, RegistrationDate, Description, PhotoImage, Rating } = req.body;

        if (!Name || !Email || !Username || !Password || !RegistrationDate) {
            return res.status(400).json({ error: 'Name, Email, Username, Password, and RegistrationDate are required' });
        }

        try {
            const result = await db.query(
                'INSERT INTO User (Name, Email, PhoneNumber, Address, Username, Password, RegistrationDate, Description, PhotoImage, Rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [Name, Email, PhoneNumber, Address, Username, Password, RegistrationDate, Description, PhotoImage, Rating]
            );
            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'GET') {
        try {
            const [rows, fields] = await db.query('SELECT * FROM User');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}