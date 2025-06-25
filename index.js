const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const { ObjectId } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dakbubs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db('virtualBook')
        const bookCollection = database.collection('addBook')

        // database post
        app.post('/addBook', async (req, res) => {
            console.log('hello', req.body)
            const addBook = req.body
            const result = await bookCollection.insertOne(addBook)
            res.send(result)

        })
        // all book find
        app.get('/addBook', async (req, res) => {
            const result = await bookCollection.find().toArray()
            res.send(result)
        })



        // ✅ PATCH method
        app.patch('/addBook/:id', async (req, res) => {
            const id = req.params.id;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ error: "Invalid book ID format" });
            }

            try {
                const result = await bookCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $inc: { upvote: 1 } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: "Book not found" });
                }

                res.send(result);
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });





        // app.get('/addBook/:id', async (req, res) => {
        //     const id = req.params.id;

        //     // 🛑 যদি invalid ObjectId পাঠায়
        //     if (!ObjectId.isValid(id)) {
        //         return res.status(400).send({ error: "Invalid book ID format" });
        //     }

        //     const query = { _id: new ObjectId(id) };

        //     try {
        //         const result = await bookCollection.findOne(query);

        //         if (!result) {
        //             return res.status(404).send({ message: "Book not found" });
        //         }

        //         res.send(result);
        //     } catch (err) {
        //         res.status(500).send({ error: err.message });
        //     }
        // });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})