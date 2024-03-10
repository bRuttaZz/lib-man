import {
    DomMan,
    SearchSelectorItems,
    getBookCard,
    getNewBookCard,
    getReaderCard,
    getTransactionCard,
    getLoaderPlaceHolder,
    getFooterLoadBtn,
    getTopButton,
    PageToggle
} from "./components.js"
import { errorCase } from "../utils/ui.js"
import { searchNewBooks } from "./tabs/newbooks.js"
import { searchBooks } from "./tabs/books.js"
import { searchReaders, bindAddButton, bindReaderCardValidators } from "./tabs/readers.js"


/**
 * Bind page toggle listeners
 */
function bindPageToggle() {
    const container = document.getElementById("footer-buttons")
    container.addEventListener("pageChangeTriger", (e) => {
        switch (e.detail.tabName) {
            case "booksTab":
                searchBooks({ ...e.detail.param, page: e.detail.page })
                break;

            case "importBooksTab":
                searchNewBooks({ ...e.detail.param, page: e.detail.page })
                break;

            case "readersTab":
                searchReaders({ ...e.detail.param, page: e.detail.page })
                break;

            case "transactionsTab":
                break;
        }
    })
}

/**
 * register the functionalities of key strokes 
 */
function registerButtonGestures() {
    const searchbar = document.querySelector("#major-search-bar")
    const searchbtn = document.querySelector(".major-search-btn")

    document.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "Enter":
                if (document.activeElement === searchbar)
                    searchbtn.click()
                break
        }
    })
}

/**
 * Bind listeners to the search bar actions
 */
function bindSearchBar() {
    const btn = document.querySelector(".major-search-btn")
    const bar = document.getElementById("major-search-bar")
    const selector = document.querySelector(".searchbar-pre")
    btn.addEventListener("click", () => {
        const params = {}
        if (bar.value && selector.value)
            params[selector.value] = bar.value

        switch (sessionStorage.getItem("currentTab")) {
            case "booksTab":
                searchBooks(params)
                break;

            case "importBooksTab":
                searchNewBooks(params)
                break;

            case "readersTab":
                searchReaders(params)
                break;

            case "transactionsTab":
                break;
        }
    })
}

/** Bind tab switching and related listners 
 * 
*/
export function bindTabListeners() {
    bindReaderCardValidators();
    bindPageToggle();
    PageToggle.bindToggler()
    document.getElementById("nav-bar").addEventListener("tabSwtich", e => {
        errorCase(false)
        DomMan.clearDataBody()
        DomMan.appendDataBody(getLoaderPlaceHolder())
        PageToggle.clearFooter()
        DomMan.replaceDataHeader("")

        let dataHandlerBtn = "";
        switch (e.detail.tabName) {
            case "booksTab":
                searchBooks()
                break;

            case "importBooksTab":
                searchNewBooks()
                break;

            case "readersTab":
                bindAddButton()
                searchReaders()
                break;

            case "transactionsTab":
                break;
        }
        SearchSelectorItems.setSelectorList(e.detail.tabName)
        sessionStorage.setItem("currentTab", e.detail.tabName)
    });
    SearchSelectorItems.bindAutoListener()
    bindSearchBar();
    registerButtonGestures();
}
