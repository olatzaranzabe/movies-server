const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const {
    getMovieById,
    getMoviesByTitle,
    getMovieByShowtimes
} = require("./methods.js");
const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url);

    console.log("parsedUrl", parsedUrl);

    const query = parsedUrl.query;

    console.log("query: ", query);

    switch (request.url) {
        case "/":
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/plain");
            response.end("Llamada a la ruta raiz");
            break;

        case "/image":
            const image = fs.readFileSync("./matrix.jpg");
            response.statusCode = 200;
            response.setHeader("Content-Type", "image/jpg");
            response.end(image);
            break;

        case `/html?${query}`:
            const name = query;
            response.statusCode = 200;
            response.write("<div>");
            response.write(`<h1>HOLA ${name}</h1`);
            response.write("</div>");
            response.end();
            break;

        case "/html-file":
            const html = fs.readFileSync("./html.html");
            response.statusCode = 200;
            response.setHeader("Content-Type", "text/html");
            response.end(html);
            break;
        case `/getmoviebyid?${query}`:
            console.log("rrr", query);
            console.log("yyy", query.replace(/\D/g, ""));
            const id = query.replace(/\D/g, "");
            //const { id } = query.replace(/\D/g, "");

            console.log("putoid", id);
            //const methods = fs.readFileSync("./methods.js");
            const getMovieById = id => {
                console.log("holita");
                getMovieFromMoviesDataById(id, (error, data) => {
                    if (error) {
                        response.statusCode = 404;
                        response.setHeader("Content-type", "text/plain");
                        response.end(
                            `No se ha encontrado ninguna película con la id ${id}`
                        );
                    }
                    getMovieById(id);
                    response.statusCode = 200;
                    response.setHeader("Content-type", "text/plain");
                    response.end("hola");
                    // response.end(JSON.stringify(data));
                });
                response.end("hola");
            };
            break;

        default:
            response.statusCode = 404;
            response.end("La ruta a la que se intenta acceder no existe");
    }
});

server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
