// konfiguracja aplikacji – dostęp przez zmienne środowiskowe
require("dotenv").config();

//niepotrzebne bo ^
// // parametry – ewentualnie przekazywane poprzez zmienne środowiskowe
//const port = process.env.PORT || 3000;
//const secret = process.env.SECRET || "$uper $ecret";
//const env = process.env.NODE_ENV || "development";

// jako „bazy” używamy Express.js
const express = require("express");
const app = express();
app.set("view engine", "ejs");

// wszelkie dane przesyłamy w formacie JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// machnaizm sesji – z wykorzystaniem ciasteczek
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const expressSession = require("express-session");
app.use(expressSession({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: false
}));

// cookie-session – w sesji zapamiętamy identyfikator rozgrywki
//const cookieSession = require("cookie-session");
// obsługa sesji za pomocą ciasteczek
//app.use(cookieSession({secret: secret}));

const path = require("path");
app.use("/lib", express.static(path.normalize("./node_modules/axios/dist")));

// do obsługi autoryzacji używamy Passport.js
const passport = require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// drobiazgi do sprawnego i czytelnego logowania
const logger = require("morgan");
const errorHandler = require("errorhandler");

// middleware do kompilacji SCSS -> CSS
const sass = require("node-sass-middleware");
app.use(sass({
    src: path.join(__dirname, "/src"),
    dest: path.join(__dirname, "/views"),
    debug: true,
    outputStyle: "compressed",
}));

// główny „serwer statyczny”
app.use(express.static(path.join(__dirname, "views")));

// w zależności od trybu działania wybieramy odpowiedni poziom logowania
if ("development" === process.env.NODE_ENV) {
    app.use(logger("dev"));
    app.use(errorHandler());
} else {
    app.use(logger("short"));
}


// // routing:

// // importujemy obsługę zapytań
// const routes = require("./routes");

// // i „podłączamy” ją pod adres „/mmind”
// app.use("/mmind", routes);

// // przechwytujemy niepoprawne odwołania do serwera
// app.use((req, res) => {
//     res.status(404).json({
//         error: `Niepoprawne żądanie: ${req.method} ${req.originalUrl}`
//     });
// });

// // uruchamiamy serwer z aplikacją
// app.listen(port, () => {
//     console.log(`Serwer gry dostępny na porcie ${port}`);
// });

// routing aplikacji
const routes = require("./routes");
app.use(routes);

// wyłapujemy odwołania do nieobsługiwanych adresów
app.use((_, res) => {
    // Not Found
    res.sendStatus(404);
});

// Serwer HTTPS
// openssl req -x509 -nodes -days 365 -newkey rsa:1024 -out my.crt -keyout my.key
const server = require("./https")(app);
const port = process.env.port;

server.listen(port, () => {
    console.log(`Serwer działa pod adresem: https://localhost:${port}`);
});

