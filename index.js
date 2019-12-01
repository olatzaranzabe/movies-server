const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const {
    getMovieFromMoviesDataById,
    getMoviesFromMoviesDataByTitle,
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
            const id = parseInt(query.replace(/\D/g, ""));

            const getMovieById = id => {
                getMovieFromMoviesDataById(id, (error, data) => {
                    if (error) {
                        response.statusCode = 404;
                        response.setHeader("Content-type", "text/plain");
                        response.end(
                            `No se ha encontrado ninguna pelicula con la id ${id}`
                        );
                    }

                    response.statusCode = 200;
                    response.setHeader("Content-type", "text/plain");
                    response.end(JSON.stringify(data));
                });
            };
            getMovieById(id);
            break;
        case `/getmoviebytitle?${query}`:
            const title = query.split("=")[1];
            const getMoviesByTitle = title => {
                getMoviesFromMoviesDataByTitle(title)
                    .then(title => {
                        response.statusCode = 200;
                        response.setHeader("Content-type", "text/plain");
                        response.end(JSON.stringify(title));
                    })
                    .catch(error => {
                        response.statusCode = 404;
                        response.setHeader("Content-type", "text/plain");
                        response.end(error);
                    });
            };
            getMoviesByTitle(title);

            break;
        case `/getmoviebyshowtime?${query}`:
            const shotimes = query.split("=")[1];
            const getMovieByShowtimes = async shotimes => {
                try {
                    const moviesMatched = await getMoviesFromMoviesDataByShowtimes(
                        shotimes
                    );

                    response.statusCode = 200;
                    response.setHeader("Content-type", "text/plain");
                    response.end(JSON.stringify(moviesMatched));
                } catch (error) {
                    response.statusCode = 404;
                    response.setHeader("Content-type", "text/plain");
                    response.end(
                        `No se ha encontrado ninguna pelicula que comience a las ${shotimes}`
                    );
                }
            };
            getMovieByShowtimes(shotimes);
            break;
        default:
            response.statusCode = 404;
            response.end("La ruta a la que se intenta acceder no existe");
    }
});

server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
