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
                // getBookIncrementKeyBind()   // binding book increment handler

                const currentPage = options?.page || 1
                PageToggle.setFooter(
                    Math.floor(dat.json.total_count/20) + 1,
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
