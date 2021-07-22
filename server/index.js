const express = require("express");
const app = express()
const cors = require("cors")
const pool = require("./db");


//middleware
app.use(cors());
app.use(express.json())


//ROUTES//

//create

app.post("/posts", async(req, res)=>{
    try {
        const respo = req.body
        console.log(respo);
        console.log(respo[0].body);
        const newposts = await pool.query("INSERT INTO posts (body, username, ctime, likes) VALUES($1, $2, $3, $4) RETURNING *",
         [respo[0].body, respo[1].name, new Date().toLocaleString(), respo[2].likes]);
        console.log(newposts);
        res.json(newposts.rows[0])
    } catch (error) {
        console.log(error);
    }
})

//get all

app.get("/posts", async (req, res) => {
    try {
      const allposts = await pool.query("SELECT * FROM posts");
      res.json(allposts.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  

//get one

app.get("/posts/:id", async(req, res)=>{
    try {
        const {id} = req.params
        const posts = await pool.query("SELECT * FROM posts WHERE id = $1", [id])
        
        res.json(posts.rows[0])
    } catch (error) {
        console.log(error);
    }
})

//update 

app.put("/posts/:id", async(req, res)=>{
    try {
        const {id} = req.params
        const respo = req.body
        console.log(respo);

        const updateposts = await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [id]);
        
        res.json("post was updated")
    } catch (error) {
        console.log(error);
    }
})

//delete

app.delete("/posts/:id", async(req, res)=>{
    try {
        const {id} = req.params
        const deleteposts = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
        res.json("post was deleted!");
    } catch (error) {
        console.log(error);
    }
})

const port = process.env.port || 4001

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})