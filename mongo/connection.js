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
        pages: Schema.Types.Number
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
                        _id: 1, title: 1, author: 1, pages: 1
                    }
                }
            ]
        ).then(res => {
            response.json(res);
        }).catch(err => {
            response.end("An error has occurred");
        });
    }
}

module.exports = new BookController();