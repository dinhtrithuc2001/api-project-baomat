const express = require('express')
const app = express();

// router

app.get('/', (req, res) => {
    res.send('Hello no api something')
})

app.listen(3001, () => {
    console.log("NODE API APP IS RUNNING ON PORT 3001")
})