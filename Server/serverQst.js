let express = require("express")

let ourApp = express()

ourApp.use(express.urlencoded({extended: false}))

ourApp.get('/', (req, res)=> {
    res.send(`
        <form action="/answer" method="POST">
            <p> What color is the sky on a clear day ?.</p>
            <input name="skyColor" autocomplete="off"/>
            <button>Submit answer </button>
        </form>
    `)
})


ourApp.get('/answer', (req, res)=> {
    res.send("Are you lost? there is nothing to see here.")
})

ourApp.post('/answer', (req, res)=> {
    res.send(`
    <p>${(req.body.skyColor.toUpperCase() == "BLUE")?"The answer is correct.":"The answer is incorrect"} </p>
    <a href="/">Go back to home</a>
    `)
})



ourApp.listen(3000)