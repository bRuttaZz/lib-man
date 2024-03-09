import { ajax } from "../utils/index.js"
import { errorCase } from "../utils/ui.js"
import {
    getNewBookCard,
    DomMan

} from "./components.js"


// constants
const IMPORT_BOOKS_API = "https://frappe.io/api/method/frappe-library"
let IMPORT_TOTAL_PAGES = 4000 / 20
// update the list 
ajax(`${IMPORT_BOOKS_API}?testparam=12`)
    .then((dat) => IMPORT_TOTAL_PAGES = dat.json.total_records)
    .catch(() => { })

// BOOKS


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
        ajax()
            .then((dat) => {
                // render the books
                let books = ""
                dat.json.message.forEach(book => {
                    const keys = {}
                    for (let key in book) {
                        keys[key.trim()] = book[key]
                    }
                    books += getNewBookCard(keys)
                });
                DomMan.clearDataBody()
                DomMan.appendDataBody(books)
                resolve()
            })
            .catch(() => {
                errorCase(true);
                reject()
            })
    })
}


// READERS


// TRANSACTIONS