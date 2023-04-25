import express from "express";
import logger from "morgan";
import * as loadHomeLoggedIn from "./homeloggedin.js"
// import postRouter from "./routes/postsRouter.js";

const app = express();
const port = 3000;

// Use the logger middleware to easily log every HTTP request to our server
app.use(logger("dev"));

// Support JSON on requests
app.use(express.json());

// Use the routes created for posts, stored neatly in it's own file in routes/posts.js
// app.use(postRouter);
app.use(loadHomeLoggedIn);

// Use static middleware to serve our client files. This allows the server to attach our index.html file, as well as it's associated css and js files when making a GET request to "/"
app.use(express.static("src/client"));

// Use static middleware to serve our post html page and associated script when making a GET request to "/post"
// app.use("/post", express.static("src/client/post"));
app.use("/homeloggedin", express.static("homeloggedin.html"));


// Send the post html when accessing a post with a specific id through "/post/:postId"
// app.get("/post/:postId", (req, res) => {
//   res.sendFile("./src/client/post/index.html", { root: "./" });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
