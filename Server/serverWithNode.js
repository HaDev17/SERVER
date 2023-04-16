let http = require("http")

let ourApp = http.createServer((req, res)=> {
    console.log(req.url)
    if(req.url == '/'){
        res.end("Hello world! hope you're doing well")
    }else if(req.url == '/aboout'){
        res.end("You're in the about page")
    }else {
        res.end("You're in the "+ req.url.split('/').join("") +" page")
    }
})



ourApp.listen(3000)