
const express = require('express');
const app = express();
const cors = require('cors');
const { ObjectId } = require('mongodb');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dakbubs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const db = client.db('virtualBook');
        const bookCollection = db.collection('addBook');
        const reviewCollection = db.collection('reviews');

        app.post('/addBook', async (req, res) => {
            const result = await bookCollection.insertOne(req.body);
            res.send(result);
        });

        app.get('/addBook', async (req, res) => {
            const result = await bookCollection.find().toArray();
            res.send(result);
        });

        app.get('/addBook/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.patch('/addBook/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.updateOne(
                { _id: new ObjectId(id) },
                { $inc: { upvote: 1 } }
            );
            res.send(result);
        });

        app.get('/getuserbook', async (req, res) => {
            const email = req.query.email;
            const result = await bookCollection.find({ user_email: email }).toArray();
            res.send(result);
        });

        app.get('/editBook/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.put('/updateBook/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: req.body }
            );
            res.send(result);
        });

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.get('/popularBook', async (req, res) => {
            const result = await bookCollection.find().sort({ upvote: -1 }).limit(6).toArray();
            res.send(result);
        });

        // 🔥 REVIEW ROUTES 🔥

        app.get('/reviews/:bookId', async (req, res) => {
            const bookId = req.params.bookId;
            const result = await reviewCollection.find({ bookId }).toArray();
            res.send(result);
        });

        app.post('/reviews', async (req, res) => {
            const { bookId, userEmail } = req.body;
            const existing = await reviewCollection.findOne({ bookId, userEmail });
            if (existing) return res.status(400).send({ error: 'Already reviewed' });

            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const { review } = req.body;
            const result = await reviewCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { review } }
            );
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });



        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB!");
    } finally {
        // Optional: client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Virtual Bookshelf Server Running');
});

app.listen(3000, () => {
    console.log(`📚 Server listening on port 3000`);
});