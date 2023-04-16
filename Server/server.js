let express = require("express")
let ourApp = express()
let { MongoClient, ObjectId } = require("mongodb")
let db
let sanitizeHTML = require("sanitize-html")

ourApp.use(express.static("public"))

async function startOurServer() {
  let client = new MongoClient('mongodb+srv://AppUser:todoAppServer@cluster0.e4w7yxn.mongodb.net/TodoApp?retryWrites=true&w=majority')

  await client.connect()
  db = client.db()

  ourApp.listen(3000, () => {
    console.log(`server is running on 3000 port`)
  })
}

startOurServer()
ourApp.use(express.json())
ourApp.use(express.urlencoded({ extended: false }))
ourApp.use(passwordProtected)

function passwordProtected(req, res, next){
  res.set('www-Authenticate', 'Basic realm="Simple Todo App"')
  //console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic aGFiaWIuYmVndWE6YmFjMjAyMQ==") {
    next()
  }
  else{
    res.status(401).send("Authentication required")
  }
}

ourApp.get('/', async (req, res) => {
  const items = await db.collection('items').find().toArray()
  //console.log(items)
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>  
      <style>
        li {
          transition: .2s ease-in;
        }
      </style>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form" action="create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="input-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
        </ul>
        
      </div>

      <script>
        let items = ${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>
    `) 
})



ourApp.post('/add-item', async (req, res) => {
  let saveText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes:{}})
  const info = await db.collection("items").insertOne({ text: saveText })
  //let item = await db.collection("items").findOne({text :saveText})
  //res.send(info)
  res.json({_id: info.insertedId, text: saveText})
})

ourApp.post('/update-item', async (req, res) => {
  let saveText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes:{}})
  await db.collection('items').findOneAndUpdate({ _id: new ObjectId(req.body.id) }, { $set: { text: saveText } })
  res.send("seccess")
})

ourApp.post('/delete-item', async (req, res) => {
  let saveText = sanitizeHTML(req.body.text, {allowedTags:[], allowedAttributes:{}})
  await db.collection('items').deleteOne({ text: saveText})
  res.send("seccess")
})
 