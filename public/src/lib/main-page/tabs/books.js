import { ajax, URL_PREFIX } from "../../utils/index.js"
import { errorCase, informModal } from "../../utils/ui.js"
import {
    getBookCard,
    getLoaderPlaceHolder,
    getTopButton,
    DomMan,
    PageToggle,
} from "../components.js"
import { INFORM_MODAL_HEADER, INFORM_MODAL_MESSAGE } from "../../messages.js"



/**
 * Bind dlete button
 */
function bindDeleteButton() {
    document.querySelector(".delete-exisiting-btn").addEventListener("click", e => {
        if (e.target.currentBookCount > 10) {
            searchBooks()
            return informModal(
                INFORM_MODAL_MESSAGE.bookdeleteLimitExceeded,
                INFORM_MODAL_HEADER.bookdeleteLimitExceeded,
                "Cancel"
            )
        }
        let message = `You are about to delete the following books. Please verify it and confirm bellow<br><br><ul>`
        for (let book in e.target.books) {
            message += `<li>${e.target.books[book].bookDecrease} - ${e.target.books[book].title}</li>`
        }
        message += `</ul><br><br>`
        informModal(
            message,
            `<span class="mdi mdi-check-circle"></span> Attention Please!`,
            "Delete",
            "Cancel",
            async () => {
                // on before success
                // console.log(e.target.books)
                const oncomplete = (status) => {
                    setTimeout(() => {
                        if (status) {
                            return informModal(
                                INFORM_MODAL_MESSAGE.bookDeleteSuccess,
                                INFORM_MODAL_HEADER.bookDeleteSuccess
                            )
                        }
                        informModal(
                            INFORM_MODAL_MESSAGE.bookDeleteFail,
                            INFORM_MODAL_HEADER.bookDeleteFail
                        )
                    }, 100)
                    searchBooks();
                }
                document.getElementById("inform-modal-button").innerHTML = `
                        <span class="mdi mdi-loading mdi-spin"></span> Deleting`
                const books = {}
                for (let key in e.target.books){
                    books[e.target.books[key].id] = e.target.books[key].bookDecrease 
                }  
                ajax(`${URL_PREFIX}/api/books/books`,
                    "DELETE",
                    { books }
                ).then((dat) => {
                    if (dat.status !== 200) {
                        console.log("error", dat.json, dat.status)
                        oncomplete(false)
                    }
                    else {
                        oncomplete(true)

                    }
                }).catch((err) => {
                    console.log("Error", err)
                    oncomplete(false)
                })

            },
            async () => {
                // on before failure
                // probably do nothing here
            }
        )
    })
}




/**
 * get book decrement button bindings (JQERY may have helped me)
 */
function getBookIncrementKeyBind() {
    DomMan.replaceDataHeader(getTopButton({
        buttonName: "Delete Books (0)",
        buttonClassName: "delete-exisiting-btn disabled"
    }))
    const btn = document.querySelector(".delete-exisiting-btn")
    btn.currentBookCount = 0
    btn.books = {}

    document.querySelectorAll(".number-of-book-deletes").forEach(el => {
        const originalVal = parseInt(el.value);
        el.currentVal = originalVal;
        el.addEventListener("input", e => {
            const newVal = parseInt(el.value)
            if (newVal > el.currentVal)
                btn.currentBookCount -= 1
            else if (newVal < el.currentVal)
                btn.currentBookCount += 1
            else
                return
            el.currentVal = newVal;

            // add book item

            const item = {
                ...DomMan.getCurrentBodyItem(el.dataset.bookId),
                bookCount: newVal, bookDecrease: originalVal - newVal
            }
            btn.books[item.id] = item

            btn.innerHTML = `Delete Books (${btn.currentBookCount})`
            if (btn.currentBookCount > 0)
                btn.classList.remove("disabled")
            else
                btn.classList.add("disabled")
        })
    })
    bindDeleteButton()
}





// IMPORT BOOKS
/**
 * search for new books
 * @param {Object} options 
 * @param {String} options.title - title of the book
 * @param {String} options.page - page number
 * @param {String} options.authors - authors
 * @param {String} options.isbn - isbn of book 
 * @param {String} options.publisher - publisher name 
 */
export function searchBooks(options) {
    return new Promise((resolve, reject) => {
        let url = `${URL_PREFIX}/api/books/get-books?`;
        for (let key in options) {
            url += `&${key}=${encodeURIComponent(options[key])}`
        }
        DomMan.clearDataBody()
        DomMan.appendDataBody(getLoaderPlaceHolder())
        PageToggle.clearFooter()

        ajax(url)
            .then((dat) => {
                if (dat.status !== 200) {
                    informModal(INFORM_MODAL_MESSAGE.invalidSearchQuery, INFORM_MODAL_HEADER.invalidSearchQuery, "ok")
                    return resolve(searchBooks());
                }
                // render the books
                DomMan.clearDataBody()
                let books = ""
                dat.json.message.forEach(book => {
                    DomMan.appendCurrentBodyItems(book.bookID, book)
                    books += getBookCard(book)
                });
                DomMan.appendDataBody(books)
                getBookIncrementKeyBind()   // binding book increment handler

                const currentPage = options?.page || 1
                PageToggle.setFooter(
                    Math.floor(dat.json.total_count / 20) + 1,
                    currentPage,
                    options || {},
                    "booksTab"
                )
                resolve()
            })
            .catch((err) => {
                console.error("[ERROR IN NEW BOOKS]", err)
                errorCase(true);
                reject()
            })
    })
}
