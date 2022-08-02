const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config();
//middleware
app.use(express.json())
app.use(cors())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ortxu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('todo').collection('task');
        const commentCollection = client.db('todo').collection('comment');

        app.get('/task', async (req, res) => {
            const query = {}
            const cursor = taskCollection.find(query)
            const tasks = await cursor.toArray()
            res.send(tasks)
        })
        app.post('/task', async (req, res) => {
            const newTask = req.body
            const result = await taskCollection.insertOne(newTask)
            res.send(result)
        })
        app.post('/addcomment', async (req, res) => {
            const newComment = req.body
            const result = await commentCollection.insertOne(newComment)
            res.send(result)
        })
        app.get('/comment', async (req, res) => {
            const query = {}
            const cursor = commentCollection.find(query)
            const comment = await cursor.toArray()
            res.send(comment)
        })
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id
            // const complete = req.body
            const filter = { _id: ObjectId(id) }
            // const options = { upsert: true }
            const updatedoc = {
                $set: {
                    isCompleted: true
                }
            }
            const result = await taskCollection.updateOne(filter, updatedoc)
            res.send(result)
        })
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})