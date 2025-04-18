const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const path = require("path");
const app = express();
const {i18nMiddleware} = require("./middlewares/i18n");
const validateRequest = require("./middlewares/checkOrigin");
const errorHandler = require("./utils/error/errorhandler");

// Enable Cross-Origin Resource Sharing (CORS)
// app.use(
//     cors({
//         origin: "http://localhost:3000", // ✅ Explicitly allow frontend URL
//         // origin: "https://internal.hironai.com",
//         // origin: "https://hironai.com",
//         credentials: true, // ✅ Allow cookies and credentials
//         methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//         allowedHeaders: "Content-Type,Authorization",
//     })
// );

const allowedOrigins = [
    "http://localhost:3000",
    "https://internal.hironai.com",
    "https://hironai.com",
  ];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );

  
// Enable JSON request parsing
app.use(express.json());

// Enable URL-encoded request parsing
app.use(express.urlencoded({ extended: true }));


// Use i18next middleware
app.use(i18nMiddleware);

// Set the views directory
app.set("views", path.join(__dirname, "templates/views"));

// Set the view engine (e.g., EJS, Pug, Handlebars)
app.set("view engine", "ejs");

// Set the proxy settings
app.set('trust proxy', 1)

// Use Helmet!
app.use(helmet());

// Use routes
// app.use("/api", routes);
app.use("/api", validateRequest, routes);

// Middelware for Error
app.use(errorHandler);

// export the app
module.exports = app;