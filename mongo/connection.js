const mongoose = require("mongoose");
const connection = "mongodb://0.0.0.0/books";

// Database connection
mongoose.connect(connection, (err, res) => {
    console.log(err ? "[ERROR] Connection failed with MongoDB" : "[INFO] Successfully connected to MongoDB");
});

// Creating a Schema
const Schema = mongoose.Schema;

const object = new Schema(
    {
        _id: Schema.Types.String,
        title: Schema.Types.String,
        author: Schema.Types.String,
        pages: Schema.Types.Number,
        genre: Schema.Types.Number,
        cover: Schema.Types.String
    }, { collection: "Books"}
)

// Modeling the Schema with the object
const Books = mongoose.model("Books", object)

class BookController {
    getAll(request, response) {
        Books.aggregate(
            [
                {
                    $project: {
                        _id: 1, title: 1, author: 1, pages: 1, genres: 1, cover: 1
                    }
                }
            ]
        ).then(res => {
            response.json(res);
        }).catch(err => {
            response.end("An error has occurred");
        });
    }

    getBook(request, response) {
        const title = request.params.title;
        Books.aggregate(
            [
                {
                    $match: {title: title}
                },
                {
                    $project: {
                        _id: 1, title: 1, author: 1, pages: 1, genres: 1, cover: 1
                    }
                }
            ]
        ).then(res => {
            response.json(res);
        }).catch(err => {
            response.end(err);
        });
    }

    // continuar aqui
    insertBook(request, response) {
        const id = mongoose.Types.ObjectId();
        const title = request.body.title;
        const author = request.body.author;
        const pages = request.body.pages;
        const genres = request.body.genres;
        const cover = request.body.cover;

        const objectBook = new Books(
            {
                "_id": id,
                "title": title,
                "author": author,
                "pages": pages,
                "genres": genres,
                "cover": cover,
            }
        )

        objectBook.save((err, res) => {
            if (err) {
                console.log("Failed to insert a new book");
            } else {
                console.log("ok");
                response.json({estado: "ok"});
            }
        })
    }

    updateBook(request, response) {
        const id = request.body._id;
        const title = request.body.title;
        const author = request.body.author;
        const pages = request.body.pages;
        const genres = request.body.genres;
        const cover = request.body.cover;

        Books.updateOne({title: title}, {
            $set: {
                title: title,
                author: author,
                pages: pages,
                genres: genres,
                cover: cover
            }
        }).then(res => {
            response.json({estado: "ok"})
        }).catch(error => {
            response.json({estado: "error"})
        });
    }

    deleteBook(request, response) {
        const title = request.params.title;
        Books.deleteOne( { title: title } ).then(res => {
            response.json({ estado: "ok" });
        }).catch(err => {
            response.json({ estado: "error"})
        })
    }
}

module.exports = new BookController();