import { ajax, URL_PREFIX, FieldValidators } from "../../utils/index.js"
import { errorCase, informModal } from "../../utils/ui.js"
import {
    getTransactionCard,
    getLoaderPlaceHolder,
    getTopButton,
    DomMan,
    PageToggle,
} from "../components.js"
import { INFORM_MODAL_HEADER, INFORM_MODAL_MESSAGE } from "../../messages.js"


function searchAndFillResult(key, term, url, dropdown, reference, resulsvals) {
    const id = Math.random()
    reference.id = id
    if (term)
        url = `${url}?${key}=${term}`
    ajax(url, "GET")
        .then(dat => {
            if (reference.id === id) {
                if (dat.json.message.length) {
                    dropdown.innerHTML = ""
                    dat.json.message.forEach(e => {
                        dropdown.innerHTML += `<li class="dropdown-item item" data-id="${e.id}">${e[resulsvals[0]]} - ${e[resulsvals[1]]}</li>`
                    })
                } else {
                    dropdown.innerHTML = `<li class="dropdown-item"> </li><li class="dropdown-item"> </li>`
                }
            }
        })
        .catch(() => { })
}

/**
 * Bind auto search for bookid and member id finding
 */
export function autoSearchBinds() {
    const bookInput = document.getElementById("transact-book-field")
    const bookDropdown = document.getElementById("transact-book-field-dropdown")
    const memberInput = document.getElementById("transact-member-field")
    const memberDropdown = document.getElementById("transact-member-field-dropdown")
    const mainBtn = document.getElementById("craete-tranact-btn")

    const bookState = {
        ok: false
    }
    const memberState = {
        ok: false
    }

    const checkAll = () => {
        if (memberState.ok && bookState.ok)
            mainBtn.classList.remove("disabled")
        else
            mainBtn.classList.add("disabled")
    }

    bookInput.addEventListener("keyup", (e) => {
        searchAndFillResult(
            "title",
            e.target.value,
            `${URL_PREFIX}/api/books/get-books`,
            bookDropdown,
            bookState,
            ["isbn", "title"]
        )
        checkAll()
    })
    bookInput.addEventListener("focus", () => {
        bookState.ok = false;
        bookInput.value = "";
        bookDropdown.classList.remove("d-none")
        bookInput.dispatchEvent(new Event("keyup"))
    })
    bookInput.addEventListener("blur", () => setTimeout(() => { bookDropdown.classList.add("d-none") }, 500))
    bookDropdown.addEventListener("click", (e) => {
        console.log(e.target, e.target.classList)
        if (e.target.classList.contains("item")) {
            bookInput.value_ = e.target.dataset.id
            bookInput.value = e.target.innerHTML
            bookState.ok = true;
            checkAll()
        }
    })

    memberInput.addEventListener("keyup", (e) => {
        searchAndFillResult(
            "name",
            e.target.value,
            `${URL_PREFIX}/api/readers/member`,
            memberDropdown,
            memberState,
            ["id", "name"]
        )
        checkAll()
    })
    memberInput.addEventListener("focus", () => {
        memberState.ok = false;
        memberInput.value = "";
        memberDropdown.classList.remove("d-none")
        memberInput.dispatchEvent(new Event("keyup"))
    })
    memberInput.addEventListener("blur", () => setTimeout(() => { memberDropdown.classList.add("d-none") }, 500))
    memberDropdown.addEventListener("click", (e) => {
        if (e.target.classList.contains("item")) {
            memberInput.value_ = e.target.dataset.id
            memberInput.value = e.target.innerHTML
            memberState.ok = true;
            checkAll()
        }
    })
    checkAll()
}

/**
 * Binding create transaction buttons
 */
export function bindTransactionButton() {
    document.getElementById("craete-tranact-btn").addEventListener("click", (el) => {
        el.target.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span> Creating`
        el.target.classList.add("disabled")
        const onComplete = () => {
            // el.target.classList.remove("disabled")
            el.target.innerHTML = "Create"
            document.getElementById("transact-modal").classList.add("d-none")
        }
        ajax(`${URL_PREFIX}/api/transactions/transactions`, "PUT", {
            book_id: document.getElementById("transact-book-field").value_,
            reader_id: document.getElementById("transact-member-field").value_,
        })
            .then(dat => {
                onComplete();
                if (dat.status > 299 || dat.status < 200)
                    informModal(INFORM_MODAL_MESSAGE.transactionFailture + (dat.json.msg || ""), INFORM_MODAL_HEADER.transactionFailture)
                else {
                    informModal(INFORM_MODAL_MESSAGE.transactSuccess + (dat.json.msg || ""), INFORM_MODAL_HEADER.transactSuccess)
                    searchTransactions()
                }
            })
            .catch(err => {
                informModal(INFORM_MODAL_MESSAGE.transactionFailture, INFORM_MODAL_HEADER.transactionFailture)
                onComplete()
            })

    })
}

/**
 * bind transact card buttons
 */
function bindTransactCardButtons() {
    const revertBtns = document.querySelectorAll(".revert-transaction-details-btn")
    revertBtns.forEach(revertBtn => {
        revertBtn.addEventListener("click", (el) => {
            informModal(
                INFORM_MODAL_MESSAGE.askTransactRevert + revertBtn.dataset.id, INFORM_MODAL_HEADER.askTransactRevert,
                "Ok",
                "Cancel",
                () => {
                    el.target.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span>`
                    ajax(`${URL_PREFIX}/api/transactions/transactions`, "POST", {
                        id: revertBtn.dataset.id,
                        returned: true,
                    })
                        .then(dat => {
                            if (dat.status !== 200)
                                informModal(INFORM_MODAL_MESSAGE.transactupdateFailure, INFORM_MODAL_HEADER.transactupdateFailure)
                            else
                                informModal(INFORM_MODAL_MESSAGE.transactUpdateSuccess, INFORM_MODAL_HEADER.transactUpdateSuccess)
                            searchTransactions()
                        })
                        .catch(e => {
                            console.log("error updating transaction", e)
                            informModal(INFORM_MODAL_MESSAGE.transactupdateFailure, INFORM_MODAL_HEADER.transactupdateFailure)
                            searchTransactions()
                        })
                }
            )
        })
    })

    const deleteBtns = document.querySelectorAll(".remove-transaction-details-btn")
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", (el) => {
            informModal(
                INFORM_MODAL_MESSAGE.askTransactDelete + deleteBtn.dataset.id, INFORM_MODAL_HEADER.askTransactDelete,
                "Ok",
                "Cancel",
                () => {
                    el.target.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span>`
                    ajax(`${URL_PREFIX}/api/transactions/transactions`, "DELETE", {
                        id: deleteBtn.dataset.id,
                        returned: true,
                    })
                        .then(dat => {
                            if (dat.status !== 200)
                                informModal(INFORM_MODAL_MESSAGE.transactupdateFailure, INFORM_MODAL_HEADER.transactupdateFailure)
                            else
                                informModal(INFORM_MODAL_MESSAGE.transactDeleteSuccess, INFORM_MODAL_HEADER.transactDeleteSuccess)
                            searchTransactions()
                        })
                        .catch(e => {
                            console.log("error deleting transaction", e)
                            informModal(INFORM_MODAL_MESSAGE.transactupdateFailure, INFORM_MODAL_HEADER.transactupdateFailure)
                            searchTransactions()
                        })
                }
            )
        })
    })
}


/**
 * Bind add transaction button
 */
export function bindTransactAddButton() {
    DomMan.replaceDataHeader(getTopButton({ buttonName: "New Transaction", buttonClassName: "transact-create-btn" }))
    document.querySelector(".transact-create-btn").addEventListener("click", (el) => {
        const modal = document.getElementById("transact-modal")
        modal.classList.remove("d-none")
    })
}

// IMPORT BOOKS
/**
 * search for new books
 * @param {Object} options 
 * @param {String} options.name
 * @param {String} options.email - authors
 * @param {String} options.phone_number  
 */
export function searchTransactions(options = {}) {
    return new Promise((resolve, reject) => {
        let url = `${URL_PREFIX}/api/transactions/transactions?`;
        for (let key in options) {
            url += `&${key}=${encodeURIComponent(options[key])}`
        }
        DomMan.clearDataBody()
        DomMan.appendDataBody(getLoaderPlaceHolder())
        PageToggle.clearFooter()
        ajax(url, "GET")
            .then((dat) => {
                if (dat.status !== 200) {
                    informModal(INFORM_MODAL_MESSAGE.invalidSearchQuery, INFORM_MODAL_HEADER.invalidSearchQuery, "ok")
                    return resolve(searchTransactions());
                }
                // render the books
                DomMan.clearDataBody()
                let tranactions = ""
                dat.json.message.forEach(dat => {
                    DomMan.appendCurrentBodyItems(dat.id, dat)
                    tranactions += getTransactionCard(dat)
                });
                DomMan.appendDataBody(tranactions)
                bindTransactCardButtons();

                const currentPage = options?.page || 1
                PageToggle.setFooter(
                    Math.floor(dat.json.total_count / 20) + 1,
                    currentPage,
                    options || {},
                    "transactionsTab"
                )
                resolve()
            })
            .catch((err) => {
                console.error("[ERROR IN READERS]", err)
                errorCase(true);
                reject()
            })
    })
}
