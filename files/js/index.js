const carouselItems = document.getElementById("carousel-items");
const colors = ["red", "blue", "purple", "green", "brown", "yellow"];
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

let active = true;

let books;
let pointer = 0;

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

nextButton.addEventListener("click", (e) => {
    pointer = pointer >= books.length - 1 ? 0 : (pointer + 1);
});

previousButton.addEventListener("click", (e) => {
    pointer = pointer <= 0 ? books.length - 1 : (pointer - 1);
});


/**
 * En el momento de cargar la página se realiza un fetch() para
 * conseguir todos los libros almacenados en la base de datos.
 */
window.addEventListener("load", (e) => {

    fetch("/books").then(res => {
        res.json().then(json => {
            renderBooks(json);
            books = json;
        });
    })
});

/**
 * Renderiza unos libros en el carousel de la página web dado
 * un json. 
 * 
 * El primer libro se marca como "activo" para el carousel
 * 
 * @param json - JSON con libros a renderizar
 */
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


/**
 * Extrae un libro específico utilizando fetch().
 * 
 * Para ello, se hace uso de una variable {pointer} y el JSON {books} para
 * extraer el título del libro que esta siendo mostrado en el carousel.
 * 
 */
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

/**
 * Elimina un libro de la base de datos y después recarga la página.
 * 
 * A la hora de coger el libro seleccionado, se hace uso de una variable {pointer} 
 * y el JSON {books} para saber qué libro esta siendo mostrado al usuario en el momento.
 * 
 */
function deleteBook() {
    fetch(`/removeBook/${books[pointer].title}`);
    location.reload();
}

/**
 * Envía los datos del formulario EDITAR libro
 * 
 * Es importante tener en cuenta que en este caso el ID no se modificará
 * dado que es una clave primaria.
 */
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

/**
 * Envía los datos del formulario CREAR libro.
 * 
 * En este método se omite por completo el campo ID
 */
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

/**
 * Escoge un color aleatorio para mostrar en el carousel
 * @returns 
 */
function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Muestra el formulario cambiandole el display a block
 * Este método es utilizado cuando se presiona el boton editar.
 */
function showForm() {
    editForm.style.display = "block";
}

/**
 * Muestra el formulario cambiandole el display a none
 * Esto ocurre cuando se ha cancelado el boton presionar a la 
 * hora de editar un libro
 */
function hideForm() {
    editForm.style.display = "none";
}

/**
 * Limpia los datos de cada input que contiene el formulario
 * editar.
 */
function clearForm() {
    document.getElementById("book-id").value = "";
    document.getElementById("book-title").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-pages").value = "";
    document.getElementById("book-genres").value = "";
    document.getElementById("book-cover").value = "";
}