const mongoose = require("mongoose");
const connection = "mongodb://0.0.0.0/books";

// Database connection
mongoose.connect(connection, (err, res) => {
    console.log(err ? "[ERROR] Connection failed with MongoDB" : "[INFO] Succesfully connected to MongoDB");
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
                        _id: 1, title: 1, author: 1, pages: 1, genre: 1, cover: 1
                    }
                }
            ]
        ).then(res => {
            response.json(res);
        }).catch(err => {
            response.end("An error has occurred");
        });
    }

    deleteBook(request, response) {
        const title  = request.params.title;
        Books.deleteOne( { title: title } ).then(res => {
            response.json({ estado: "ok" });
        }).catch(err => {
            response.json({ estado: "error"})
        })
    }
}

module.exports = new BookController();