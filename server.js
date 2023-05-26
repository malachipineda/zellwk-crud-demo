const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()


// Database Link
MongoClient.connect(process.env.DB_STRING)
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')
        
        //Middleware
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true}))
        app.use(express.json())
        app.use(express.static('public'))
        
        //Create
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results})
            })
            .catch(error => console.error(error))
        })

        //Read
        app.post('/quotes', (req, res) =>{
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        //Update
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
              { name: 'Yoda' },
              {
                $set: {
                  name: req.body.name,
                  quote: req.body.quote
                }
              },
              {
                upsert: true
              }
            )
              .then(result => res.json('Success'))
              .catch(error => console.error(error))
          })

        //Delete
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
              { name: req.body.name }
            )
              .then(result => {
                if (result.deletedCount === 0) {
                  return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vadar\'s quote')
              })
              .catch(error => console.error(error))
          })



        //Listen
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
        
    })
    .catch(error => console.error(error))
