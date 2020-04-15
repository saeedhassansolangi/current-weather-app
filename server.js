const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const fetch = require("node-fetch")
const PORT = process.env.PORT || 2000;
const flag = require('country-flag-emoji');

const api = {
    key: "42103cbe3438aff5f2c20805be56718e",
    base: "https://api.openweathermap.org/data/2.5/"
}

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({
    extended: true
}))


// fetch(`${api.base}weather?q=${query}&appid=${api.key}`)
//     .then(response => response.json())
//     .then(data =>console.log(data))
//     .catch(err => console.log(err)
//     )

app.get("/", (req, res) => {
    res.render("weather")
})

app.get("*", (req, res) => {
    res.render("error")
})


app.post("/", async (req, res) => {
    let searchQuery = req.body.search;
    fetch(`${api.base}weather?q=${searchQuery}&appid=${api.key}`)
        .then(response => response.json())
        .then(data => {
            if (searchQuery !== "") {
                try {
                    // console.log(data);
                    let kelToCal = data.main.temp - 273.15
                    let parseKelToCal = JSON.stringify(kelToCal)
                    let removeSpace = parseKelToCal.substring(0, 4)
                    let temp = removeSpace.trim()
                    let countryEmoji = flag.get(data.sys.country);

                    res.render("weather", {
                        data: data,
                        temps: temp,
                        countryEmoji: countryEmoji
                    })

                } catch (err) {
                    // res.send(data)
                    res.render("error",{data})
                }
            } else {
                res.redirect("back")
            }
        }).catch(err => {
            console.log("Error is FOund",err)
            res.render("error",{err})
        })
})




app.listen(PORT, console.log(`Server is Running on The PORT ${PORT}`))