// Yeah I understand the easiness behind React its predecessors

// const domComposer = new DOMParser()

/**
 * extract html string from dom
 * @param {String} id - dom id 
 * @param {Object} replaceObjs - Key value pairs to be replaced
 * @returns {String} - Modified HTML dom 
 */
function constructComponentFromDom(id, replaceObjs = {}) {
    let html = document.getElementById(id).innerHTML
    for (let key in replaceObjs) {
        html = html.replaceAll(key, replaceObjs[key])
    }
    return html
}

/**
 * Get book card component
 * @param {Object} options
 * @param {String} options.title - name of books 
 * @param {String} options.authors - authors 
 * @param {String} options.bookId - id
 * @param {String} options.average_rating - rating 
 * @param {String} options.isbn - isbn
 * @param {String} options.isbn13 - isbn but 13char long 
 * @param {String} options.language_code - lang code of book 
 * @param {String} options.num_pages - num of pages 
 * @param {String} options.ratings_count - num of ratings 
 * @param {String} options.text_reviews_count - text review count 
 * @param {String} options.publication_date - date of publication 
 * @param {String} options.publisher - name of publisher
 * @param {String} options.bookCount - num of books on our hand 
 * @param {String} options.availableCount - num of books available 
 * 
 * @returns {String}
 */
export function getBookCard(options) {
    return constructComponentFromDom("data-card-book", {
        BOOK_COUNT: options.bookCount,
        TITLE: options.title,
        AUTHORS: options.authors,
        PUBLISHER: options.publisher,
        PUBLISH_DATE: options.publication_date,
        LANG_CODE: options.language_code,
        RATING: options.RATING,
        RATER_COUNT: options.ratings_count,
        PAGES: options.num_pages,
        ISBN_: options.isbn,
        ISBN13: options.isbn13,
        BOOK_ID: options.bookId,
        AVAILABLE_COUNT: options.availableCount,
    })
}

/**
 * Get new book card component
 * @param {Object} options
 * @param {String} options.title - name of books 
 * @param {String} options.authors - authors 
 * @param {String} options.bookId - id
 * @param {String} options.average_rating - rating 
 * @param {String} options.isbn - isbn
 * @param {String} options.isbn13 - isbn but 13char long 
 * @param {String} options.language_code - lang code of book 
 * @param {String} options.num_pages - num of pages 
 * @param {String} options.ratings_count - num of ratings 
 * @param {String} options.text_reviews_count - text review count 
 * @param {String} options.publication_date - date of publication 
 * @param {String} options.publisher - name of publisher
 * 
 * @returns {String}
 */
export function getNewBookCard(options) {
    return constructComponentFromDom("data-card-new-book", {
        TITLE: options.title,
        AUTHORS: options.authors,
        PUBLISHER: options.publisher,
        PUBLISH_DATE: options.publication_date,
        LANG_CODE: options.language_code,
        RATING: options.RATING,
        RATER_COUNT: options.ratings_count,
        PAGES: options.num_pages,
        ISBN_: options.isbn,
        ISBN13: options.isbn13,
        BOOK_ID: options.bookId,
    })
}

/**
 * Get reader's card
 * @param {Object} options 
 * @param {String} options.name - name of the reader
 * @param {String} options.email - email of the reader
 * @param {String} options.phone - phone of the reader
 * @param {String} options.numBooksInHand - number of bookes currently handled by the reader
 * @param {String} options.debt - total debt
 * @param {String} options.id - memebership id
 * 
 * @returns {String} - COmposed card element
 */
export function getReaderCard(options) {
    return constructComponentFromDom("data-card-reader", {
        READER_NAME: options.name,
        EMAILID_READER: options.email,
        PHONENUM_READER: options.phone,
        BOOKS_IN_HAND: options.numBooksInHand,
        TOTAL_DEBT: options.debt,
        MEMEBER_ID: options.id
    })
}

/**
 * Get new transaction card
 * @param {Object} options
 * @param {String} options.title - book title 
 * @param {String} options.author - book author 
 * @param {String} options.bookId - book id 
 * @param {String} options.isbn - book isbn 
 * @param {String} options.readerName - reader name 
 * @param {String} options.readerId - reader id
 * @param {Boolean} options.transactionCompletionStatus - status of tranasction completion 
 * @returns {String}
 */
export function getTransactionCard(options) {
    return constructComponentFromDom("data-card-transaction", {
        BOOK_TITILE: options.title,
        AUTHOR: options.author,
        BOOKID: options.bookId,
        BOOK_ISBN: options.isbn,
        READER_NAME: options.readerName,
        READER_ID: options.readerId,
        TRANSACT_STATUS: options.transactionCompletionStatus,
    })
}

/**
 * get load more button :)
 */
export function getFooterLoadBtn() {
    return constructComponentFromDom("footer-button", {})
}

/**
 * get loader place holder :)
 * @returns 
 */
export function getLoaderPlaceHolder() {
    return constructComponentFromDom("loader-placeholder", {})
}

/**
 * Get custom top button layer
 * @param {Object} options
 * @param {String} options.buttonName - button name
 * @param {String} options.buttonClassName - button classname 
 * @returns 
 */
export function getTopButton(options) {
    return constructComponentFromDom("top-buttons", {
        BUTTON_NAME: options.buttonName,
        BUTTON_CLASS_NAME: options.buttonClassName,
    })
}

/**
 * For dom manipulation
 */
export class DomMan {
    static replaceDataHeader(html) {
        document.getElementById("data-content-header").innerHTML = html
    }

    static clearDataBody() {
        document.getElementById("data-content-body").innerHTML = "";
    }

    static appendDataBody(html) {
        document.getElementById("data-content-body").innerHTML += html;
    }

    static replaceFooter(html) {
        document.getElementById("data-content-footer").innerHTML = ""
    }
}

export class SearchSelectorItems {
    static _items = {
        booksTab: [
            {
                display: "Title",
                value: "title",
                placeholder: "Search for the book-title",
            },
            {
                display: "Authors",
                value: "authors",
                placeholder: "Search for the authors",
            },
            {
                display: "ISBN",
                value: "isbn",
                placeholder: "Search for ISBN",
            },
            {
                display: "ISBN13",
                value: "isbn13",
                placeholder: "Search for ISBN13",
            },
            {
                display: "Rating",
                value: "average_rating",
                placeholder: "Search for book-rating",
            },
            {
                display: "Publisher",
                value: "publisher",
                placeholder: "Search the name of publishers",
            },
            {
                display: "Lang",
                value: "language_code",
                placeholder: "Search for language code",
            },
            {
                display: "Id",
                value: "bookID",
                placeholder: "Search for book id!",
            },
        ],
        importBooksTab: [
            {
                display: "Title",
                value: "title",
                placeholder: "Search for the book-title",
            },
            {
                display: "Authors",
                value: "authors",
                placeholder: "Search for the authors",
            },
            {
                display: "ISBN",
                value: "isbn",
                placeholder: "Search for ISBN",
            },
            {
                display: "Publisher",
                value: "publisher",
                placeholder: "Search the name of publishers",
            },
        ],
        readersTab: [
            {
                display: "Name",
                value: "name",
                placeholder: "Search for Reader's name",
            },
            {
                display: "Phone",
                value: "phone_number",
                placeholder: "Search phone number",
            },
            {
                display: "Email",
                value: "email",
                placeholder: "Search for email id",
            },
            {
                display: "Id",
                value: "id",
                placeholder: "Search for reader's id!",
            },
        ],
        transactionsTab: [
            {
                display: "Reader",
                value: "reader_name",
                placeholder: "Search for reader's name",
            },
            {
                display: "Book",
                value: "book_name",
                placeholder: "Search for book's name",
            }, 
            {
                display: "ISBN",
                value: "isbn",
                placeholder: "Search for ISBN",
            }, 
            {
                display: "Status",
                value: "transaction_status",
                placeholder: "Search for transaction status",
            },
            {
                display: "Id",
                value: "transaction_id",
                placeholder: "Search for transaction id",
            }, 
        ],
    }

    static getSelectorList(itemtype) {
        let html = "" 
        let firstItem = true
        this._items[itemtype]?.forEach(element => {
            html += `<option ${firstItem?"selected":""} value="${element.value}" data-placeholder="${element.placeholder}">${element.display}</option>`
            firstItem = false
        });
        return html
    }

    static setSearchPlaceHolder() {
        const selector = document.querySelector(".searchbar-pre")
        if (selector) {
            document.getElementById("major-search-bar").placeholder = selector.options[selector.selectedIndex]?.dataset?.placeholder
        }
    }

    static setSelectorList(itemtype) {
        document.querySelector(".searchbar-pre").innerHTML = this.getSelectorList(itemtype);
        this.setSearchPlaceHolder()
    }

    static bindAutoListener() {
        document.querySelector(".searchbar-pre").addEventListener("change", this.setSearchPlaceHolder)
    }
} 