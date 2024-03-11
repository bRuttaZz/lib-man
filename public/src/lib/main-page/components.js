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
 * @param {String} options.bookID - id
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
        RATING: options.average_rating,
        RATER_COUNT: options.ratings_count,
        PAGES: options.num_pages,
        ISBN_: options.isbn,
        ISBN13_: options.isbn13,
        BOOK_ID: options.bookID,
        AVAILABLE_COUNT: options.availableCount,
        CURRENT_VALUE_COUNT: options.availableCount,
        MAX_VALUE_COUNT: options.availableCount,
    })
}

/**
 * Get new book card component
 * @param {Object} options
 * @param {String} options.title - name of books 
 * @param {String} options.authors - authors 
 * @param {String} options.bookID - id
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
        RATING: options.average_rating,
        RATER_COUNT: options.ratings_count,
        PAGES: options.num_pages,
        ISBN_: options.isbn,
        ISBN13_: options.isbn13,
        BOOK_ID: options.bookID,
    })
}

/**
 * Get reader's card
 * @param {Object} options 
 * @param {String} options.name - name of the reader
 * @param {String} options.email - email of the reader
 * @param {String} options.phone_number - phone of the reader
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
        PHONENUM_READER: options.phone_number,
        BOOKS_IN_HAND: options.numBooksInHand,
        TOTAL_DEBT: options.debt,
        MEMEBER_ID: options.id,
        DELETE_BUTTON: options.debt?"false":"true",
    })
}

/**
 * Get new transaction card
 * @param {Object} options
 * @param {String} options.title - book title 
 * @param {String} options.authors - book author 
 * @param {String} options.book_id - book id 
 * @param {String} options.isbn - book isbn 
 * @param {String} options.readerName - reader name 
 * @param {String} options.reader_id - reader id
 * @param {Boolean} options.returned - status of tranasction completion 
 * @returns {String}
 */
export function getTransactionCard(options) {
    return constructComponentFromDom("data-card-transaction", {
        BOOK_TITILE: options.title,
        AUTHOR: options.authors,
        BOOKID: options.book_id,
        BOOK_ISBN: options.isbn,
        READER_NAME: options.readerName,
        READER_ID: options.reader_id,
        TRANSACT_STATUS: options.returned,
        START_DATE: options.borrowed_at,
        END_DATE: options.returned_at || "_",
        TRANSACT_ID: options.id,
        REMOVE_BUTTON_CLASS: options.returned?"":"d-none",
        REVERT_BUTTON_CLASS: options.returned?"d-none":"",
        TRANSACTSTATUS_TEXT_CLASS: options.returned?"text-warning":"text-danger", 
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
    static dataHeader = document.getElementById("data-content-header")
    static dataBody = document.getElementById("data-content-body")
    static replaceDataHeader(html) {
        this.dataHeader.innerHTML = html
    }

    static clearDataBody() {
        this.dataBody.innerHTML = "";
        this.dataBody.currentItems = {}
    }

    static appendCurrentBodyItems(key, val) {
        this.dataBody.currentItems[key] = val;
    }

    static getCurrentBodyItem(key) {
        return this.dataBody.currentItems[key] 
    }

    static removeCurrentBodyItem(key) {
        delete this.dataBody.currentItems[key]
    }

    static appendDataBody(html) {
        this.dataBody.innerHTML += html;
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
                display: "Publisher",
                value: "publisher",
                placeholder: "Search the name of publishers",
            },
            {
                display: "Lang",
                value: "language_code",
                placeholder: "Search for language code",
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
                placeholder: "Search for transaction status (Provide True/False)",
            }
        ],
    }

    static getSelectorList(itemtype) {
        let html = ""
        let firstItem = true
        this._items[itemtype]?.forEach(element => {
            html += `<option ${firstItem ? "selected" : ""} value="${element.value}" data-placeholder="${element.placeholder}">${element.display}</option>`
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

export class PageToggle {
    static _neighborLength = 2

    static _arrayRange(start, stop, step = 1) {
        return Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
        );
    }


    /**
     * Bind listeners for page toggle
     */
    static bindToggler() {
        const container = document.getElementById("footer-buttons")
        container.addEventListener("click", (e) => {
            const dat = {
                param: container.pageToggleParams,
                tabName: container.currentTabName,
            }
            if (e.target.classList.contains("page-btn")) {
                container.dispatchEvent(new CustomEvent("pageChangeTriger", {
                    detail: {
                        page: e.target.innerText?.trim(),
                        ...dat,
                    }
                }))
            }
            if (e.target.classList.contains("page-btn-next")) {
                container.dispatchEvent(new CustomEvent("pageChangeTriger", {
                    detail: {
                        page: container.currentPage + 1,
                        ...dat,
                    }
                }))
            }
            if (e.target.classList.contains("page-btn-pre")) {
                container.dispatchEvent(new CustomEvent("pageChangeTriger", {
                    detail: {
                        page: container.currentPage - 1,
                        ...dat,
                    }
                }))
            }
        })
    }

    /**
     * set new footer items
     * @param {number} min - minimum page cuont
     * @param {number} max - maximum page count
     * @param {number} current - current page count
     * @param {Object} additionalParams - additional switch params
     * @param {String} tabName - current tabname
     */
    static setFooter(max, current, additionalParams, tabName) {
        max = parseInt(max)
        current = parseInt(current)
        const container = document.getElementById("footer-buttons")

        const start = current <= this._neighborLength ? 1 : current - this._neighborLength;
        const stop = max - current <= this._neighborLength ? max : current + this._neighborLength;
        let html = ""
        const fillings = '<span class="mt-3 mb-2 ms-1 p-1 small"> ... </span>'
        if (start !== 1)
            html += `<span class="mt-3 mb-2 ms-1 load-more-btn pointer p-1 ps-3 pe-3 small page-btn-pre"> < </span>${fillings}`
        this._arrayRange(start, stop).forEach(el => {
            if (el == current)
                html += `<span class="mt-3 mb-2 ms-1 load-more-btn pointer p-1 ps-3 pe-3 small page-btn current-page-btn"> ${el} </span>`
            else
                html += `<span class="mt-3 mb-2 ms-1 load-more-btn pointer p-1 ps-3 pe-3 small page-btn"> ${el} </span>`
        })
        if (stop !== max)
            html += `${fillings}<span class="mt-3 mb-2 load-more-btn pointer p-1 ps-3 pe-3 small page-btn-next"> > </span>`
        container.innerHTML = html
        container.currentPage = current
        container.pageToggleParams = additionalParams
        container.currentTabName = tabName
    }

    /** Clear current footer */
    static clearFooter() {
        const container = document.getElementById("footer-buttons")
        container.innerHTML = ""
        delete container.currentPage
        delete container.pageToggleParams

    }
}