import { ajax, URL_PREFIX } from "../../utils/index.js"
import { errorCase } from "../../utils/ui.js"
import {
    getNewBookCard,
    getLoaderPlaceHolder,
    getTopButton,
    DomMan,
    PageToggle,
} from "../components.js"
import { informModal } from "../../utils/ui.js"
import { INFORM_MODAL_HEADER, INFORM_MODAL_MESSAGE } from "../../messages.js"


// constants
const IMPORT_BOOKS_API = "/api/books/get-new-books"
// let IMPORT_TOTAL_PAGES = 4000 / 20
// // update the list 
// ajax(`${IMPORT_BOOKS_API}?testparam=12`)
//     .then((dat) => IMPORT_TOTAL_PAGES = dat.json.total_records)
//     .catch(() => { })

/**
 * reset import button mainly to be used with the bindImportbutton
 */
function resetImportButton() {
    document.querySelectorAll(".number-of-book-imports").forEach(el=>{
        el.currentVal = 0
        el.value = 0
    })
    const btn = document.querySelector(".new-book-import-btn")
    btn.currentBookCount = 0
    btn.books = {}
    btn.classList.add("disabled")
    btn.innerHTML = `Import Books (0)`
}

/**
 * Bind book import buttom
 */
function bindImportButton() {
    document.querySelector(".new-book-import-btn").addEventListener("click", e => {
        if (e.target.currentBookCount > 10) {
            resetImportButton()
            return informModal(
                INFORM_MODAL_MESSAGE.importMaxLimit,
                INFORM_MODAL_HEADER.importMaxLimit,
                "Cancel"
            )
        }
        informModal(
            INFORM_MODAL_MESSAGE.importNewBooks.replaceAll("NUMBER_OF", e.target.currentBookCount),
            INFORM_MODAL_HEADER.importNewBooks,
            "Import",
            "Cancel",
            async () => {
                // on before success
                // console.log(e.target.books)
                const oncomplete = (status) => {
                    setTimeout(() => {
                        if (status) {
                            return informModal(
                                INFORM_MODAL_MESSAGE.importNewBooksSuccess,
                                INFORM_MODAL_HEADER.importNewBooksSuccess
                            )
                        }
                        informModal(
                            INFORM_MODAL_MESSAGE.importNewBooksError,
                            INFORM_MODAL_HEADER.importNewBooksError
                        )
                    }, 100)
                }
                document.getElementById("inform-modal-button").innerHTML = `
                        <span class="mdi mdi-loading mdi-spin"></span> Importing`
                ajax(`${URL_PREFIX}/api/books/put-books`,
                    "PUT",
                    { books: Object.values(e.target.books) }
                ).then((dat) => {
                    if (dat.status !== 200) {
                        console.log("error", err.json)
                        oncomplete(false)
                    }
                    else {
                        resetImportButton()
                        oncomplete(true)
                        
                    }
                }).catch((err) => {
                    console.log("error", err.json)
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
 * get book increment button bindings (JQERY may have helped me)
 */
function getBookIncrementKeyBind() {
    DomMan.replaceDataHeader(getTopButton({
        buttonName: "Import Books (0)",
        buttonClassName: "new-book-import-btn disabled"
    }))
    const btn = document.querySelector(".new-book-import-btn")
    btn.currentBookCount = 0
    btn.books = {}

    document.querySelectorAll(".number-of-book-imports").forEach(el => {
        el.currentVal = 0;
        el.addEventListener("input", e => {
            const newVal = parseInt(el.value)
            if (newVal > el.currentVal)
                btn.currentBookCount += 1
            else if (newVal < el.currentVal)
                btn.currentBookCount -= 1
            else
                return
            el.currentVal = newVal;

            // add book item
            if (newVal) {
                const item = { ...DomMan.getCurrentBodyItem(el.dataset.bookId), bookCount: newVal }
                btn.books[item.bookID] = item
            }

            btn.innerHTML = `Import Books (${btn.currentBookCount})`
            if (btn.currentBookCount > 0)
                btn.classList.remove("disabled")
            else
                btn.classList.add("disabled")
        })
    })
    bindImportButton()
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
export function searchNewBooks(options) {
    return new Promise((resolve, reject) => {
        let url = IMPORT_BOOKS_API + "?";
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
                    return resolve(searchNewBooks());
                }
                // render the books
                DomMan.clearDataBody()
                let books = ""
                dat.json.message.forEach(book => {
                    const keys = {}
                    for (let key in book) {
                        keys[key.trim()] = book[key]
                    }
                    DomMan.appendCurrentBodyItems(keys.bookID, keys)
                    books += getNewBookCard(keys)
                });
                DomMan.appendDataBody(books)
                getBookIncrementKeyBind()   // binding book increment handler

                const currentPage = options?.page || 1
                PageToggle.setFooter(
                    dat.json.message.length < 20 ? currentPage : parseInt(currentPage) + 1,
                    currentPage,
                    options || {},
                    "importBooksTab"
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
