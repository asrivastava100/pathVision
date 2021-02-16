const express = require("express");
const path = require("path");
const app = express();
const helmet = require("helmet");

app.use(express.static(path.join(__dirname,'public')));

app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["self"],
        scriptSrc: [
            "self", 
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
            "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.1/css/bulma.min.css"
        ],
        objectSrc: ["none"],
        upgradeInsecureRequests: [],
      },
    })
  );

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => console.log(`Server started on port ${PORT}`));