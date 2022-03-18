const carouselItems = document.getElementById("carousel-items");
const colors = ["red", "blue", "purple"];
const editForm = document.getElementById("edit-form");

const nextButton = document.getElementById("next-carousel-button");
const previousButton = document.getElementById("previous-carousel-button");

const editButton = document.getElementById("edit-button");

const modalDeleteButton = document.getElementById("modal-delete-button");

const formSaveChangesButton = document.getElementById("save-edit-form");
const formCancelButton = document.getElementById("cancel-edit-form");

const insertBook = document.getElementById("insert-book");

let id;
let title;
let author;
let pages;
let genres;
let cover;


editButton.addEventListener("click", (e) => {
    clearForm();
    getBook();
    showForm();
});

modalDeleteButton.addEventListener("click", (e) => {
    deleteBook();
});

insertBook.addEventListener("click", (e) => {
    sendDataFromNewBook();
});

formSaveChangesButton.addEventListener("click", (e) => {
    sendDataFromEditBook();
});

formCancelButton.addEventListener("click", (e) => {
    hideForm();
})

let active = true;

let books;
let pointer = 0;

window.addEventListener("load", (e) => {

    fetch("/books").then(res => {
        res.json().then(json => {
            renderBooks(json);
            books = json;
        });
    })

    nextButton.addEventListener("click", (e) => {
        pointer = pointer >= books.length - 1 ? 0 : (pointer + 1);
    });

    previousButton.addEventListener("click", (e) => {
        pointer = pointer <= 0 ? books.length - 1 : (pointer - 1);
    });

});


function renderBooks(json) {
    for (const book of json) {
        carouselItems.innerHTML += 
        `
        <div class="carousel-item ${active ? "active" : ""}">
            <div class="carousel-block border ${randomColor()}">
                <div class="book p-4 mx-auto">
                    <div class="row my-5">
                        <h2>${book.title}</h2>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p>${book.author}</p>
                        </div>
                        <div class="col">
                            <p>${book.pages} páginas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        active = false; 
    }
}

function getBook() {
    fetch(`/getBook/${books[pointer].title}`)
    .then(res => {
        res.json().then(json => {
            document.getElementById("book-id").value = json[0]._id;
            document.getElementById("book-title").value = json[0].title;
            document.getElementById("book-author").value = json[0].author;
            document.getElementById("book-pages").value = json[0].pages;
            document.getElementById("book-genres").value = json[0].genres;
            document.getElementById("book-cover").value = json[0].cover;
        })
    }).catch(err => { console.log(err) });
}

function deleteBook() {
    fetch(`/removeBook/${books[pointer].title}`);
    location.reload();
}

function sendDataFromEditBook() {
    id = document.getElementById("book-id").value;
    title = document.getElementById("book-title").value;
    author = document.getElementById("book-author").value;
    pages = document.getElementById("book-pages").value;
    genres = document.getElementById("book-genres").value;
    cover = document.getElementById("book-cover").value;

    const jsonData = {
        "_id": id,
        "title": title,
        "author": author,
        "pages": pages,
        "genres": genres,
        "cover": cover,
    }

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }

    fetch("/updateBook", options)
    .then(res => {
        res.json().then(response => {
            alert(response.estado == "ok" ? "Successfully updated book" : "An error has occurred");
        }).catch(err => {
            alert("There was an error 3", err);
        })
    })
    location.reload();
}

function sendDataFromNewBook() {
    title = document.getElementById("title").value;
    author = document.getElementById("author").value;
    pages = document.getElementById("pages").value;
    genres = document.getElementById("genres").value;
    cover = document.getElementById("cover").value;

    const jsonData = {
        "_id": id,
        "title": title,
        "author": author,
        "pages": pages,
        "genres": genres,
        "cover": cover,
    }

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }

    fetch("/insertBook", options)
    .then(res => {
        res.json().then(response => {
            alert(response.estado == "ok" ? "Successfully inserted book" : "An error has occurred");
        }).catch(err => {
            alert("There was an error 3", err);
        })
    })
    location.reload();

}

function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function showForm() {
    editForm.style.display = "block";
}

function hideForm() {
    editForm.style.display = "none";
}

function clearForm() {
    document.getElementById("book-id").value = "";
    document.getElementById("book-title").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-pages").value = "";
    document.getElementById("book-genres").value = "";
    document.getElementById("book-cover").value = "";
}