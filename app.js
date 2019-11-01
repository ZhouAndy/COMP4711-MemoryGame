let express = require('express');
let app = express();
let bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use('/', express.static(__dirname));
app.listen(port, () => console.log("Server ready at 3000"));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:amazingru@comp4711assignment1-rswlo.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const assert = require("assert"); 

app.post('/add', (req, res) => {
    console.log("received post request to add user");
    client.connect((err) => {
        assert.equal(null, err);
        const collection = client.db("leaderboard").collection("users");
        collection.insertOne(req.body, err => {
            if (err) {
                console.log("error adding user");
            } else {
                console.log("user successfully added");
            }
        })
    });
})

app.get('/topUsers', (req, res) => {
    const collection = client.db("leaderboard").collection("users");
    collection.find({}, { sort: { score: -1} }).limit(5).toArray((err, data) => {
        if (err) {
            console.log("error querying leaderboard: " + err);
        } else {
            console.log("leaderboard successfully queried");
            res.json(data);
        }
    })
})

app.get('/currentUser', (req, res) => {
    const collection = client.db("leaderboard").collection("users");
    collection.find().sort( { _id : -1 } ).limit(1).toArray((err, data) => {
        if (err) {
            console.log("error querying leaderboard: " + err);
        } else {
            console.log("leaderboard successfully queried");
            res.json(data);
        }
    });
});





