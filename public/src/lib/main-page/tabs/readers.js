import { ajax, URL_PREFIX, FieldValidators } from "../../utils/index.js"
import { errorCase, informModal } from "../../utils/ui.js"
import {
    getReaderCard,
    getLoaderPlaceHolder,
    getTopButton,
    DomMan,
    PageToggle,
} from "../components.js"
import { INFORM_MODAL_HEADER, INFORM_MODAL_MESSAGE, CUSTOMER_CENTER_WARNING } from "../../messages.js"

function resetReaderUpdaterModal() {
    const button = document.getElementById("craete-or-update-field")
    button.HTTPMethod = "";
    button.CustID = "";
    button.innerHTML = "Create / Update";
    document.getElementById("reader-modal").classList.add("d-none");
    document.querySelector("#reader-name-field").value = ""
    document.querySelector("#reader-phone-field").value = ""
    document.querySelector("#reader-email-field").value = ""
    document.querySelector(".reader-center-error-region").innerHTML = ""

    document.querySelector("#reader-email-field").disabled = false;
    button.dispatchEvent(new Event("updateChecks"))
    document.getElementById("delete-member-field").classList.add("d-none")
}

/**
 * Bind reader card edit button
 */
function bindReaderCardEditButton() {
    document.querySelectorAll(".edit-member-details-btn").forEach(el => {
        el.addEventListener("click", () => {
            resetReaderUpdaterModal()
            const button = document.getElementById("craete-or-update-field")
            button.HTTPMethod = "POST";
            button.innerHTML = "Update";
            button.CustID = el.dataset.id

            document.querySelector("#reader-name-field").value = el.dataset.username
            document.querySelector("#reader-phone-field").value = el.dataset.phone_number
            document.querySelector("#reader-email-field").value = el.dataset.email
            document.querySelector("#reader-email-field").disabled = true;

            if (el.dataset.delete === "true")
                document.getElementById("delete-member-field").classList.remove("d-none")
            document.getElementById("reader-modal").classList.remove("d-none")
            button.dispatchEvent(new Event("updateChecks"))
            button.classList.add("disabled")
        })
    })
}

/**
 * Bind listners for validation check for reader account center
 */
export function bindReaderCardValidators() {
    const username = document.querySelector("#reader-name-field")
    const phone = document.querySelector("#reader-phone-field")
    const email = document.querySelector("#reader-email-field")
    const errorField = document.querySelector(".reader-center-error-region")
    const btn = document.querySelector("#craete-or-update-field")

    btn.classList.add("disabled")

    let usernameOk = false
    let phoneOk = false
    let emailOk = false

    const checkAllOk = () => {
        if (usernameOk && phoneOk && emailOk) {
            errorField.innerHTML = ""
            btn.classList.remove("disabled")
        } else {
            btn.classList.add("disabled")
        }
    }
    const checkPhone = () => {
        phoneOk = FieldValidators.phoneValidator(phone.value)
        if (!phoneOk)
            errorField.innerHTML = CUSTOMER_CENTER_WARNING.invalidPhone
        else if (errorField.innerHTML === CUSTOMER_CENTER_WARNING.invalidPhone)
            errorField.innerHTML = ""
        checkAllOk()
    }
    const checkEmail = () => {
        emailOk = FieldValidators.emailValidator(email.value)
        if (!emailOk)
            errorField.innerHTML = CUSTOMER_CENTER_WARNING.invalidEmail
        else if (errorField.innerHTML === CUSTOMER_CENTER_WARNING.invalidEmail)
            errorField.innerHTML = ""
        checkAllOk()
    }
    const checkUsername = () => {
        usernameOk = FieldValidators.lengthChecker(username.value, 3, 15)
        if (!usernameOk)
            errorField.innerHTML = CUSTOMER_CENTER_WARNING.invalidUsername
        else if (errorField.innerHTML === CUSTOMER_CENTER_WARNING.invalidUsername)
            errorField.innerHTML = ""
        checkAllOk()
    }


    username.addEventListener("input", checkUsername)
    email.addEventListener("input", checkEmail)
    phone.addEventListener("input", checkPhone)
    const checkAll = () => {
        checkEmail()
        checkPhone()
        checkUsername()
    }
    checkAll()

    btn.addEventListener("updateChecks", checkAll)

    // bind update button
    btn.addEventListener("click", (e) => {
        e.target.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span> Updating`
        e.target.classList.add("disabled")
        const onComplete = () => {
            resetReaderUpdaterModal();
        }

        const username = document.querySelector("#reader-name-field")
        const phone = document.querySelector("#reader-phone-field")
        const email = document.querySelector("#reader-email-field")
        ajax(`${URL_PREFIX}/api/readers/member`, e.target.HTTPMethod || "POST", {
            name: username.value,
            phone_number: phone.value,
            email: email.value,
            id: e.target.CustID,
        }).then(dat => {
            onComplete()
            if (dat.status > 299) {
                return informModal(INFORM_MODAL_MESSAGE.readerOperationFailuer, INFORM_MODAL_HEADER.readerOperationFailuer)
            }
            searchReaders()
            informModal(INFORM_MODAL_MESSAGE.readerOperationSuccess, INFORM_MODAL_HEADER.readerOperationSuccess)
        }).catch(err => {
            console.error("error creating reader", err)
            onComplete();
            return informModal(INFORM_MODAL_MESSAGE.readerOperationFailuer, INFORM_MODAL_HEADER.readerOperationFailuer)
        })
    })

    document.getElementById("delete-member-field").addEventListener("click", (el) => {
        el.target.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span> Deleting`
        el.target.classList.add("disabled")
        const onComplete = () => {
            el.target.classList.remove("disabled")
            resetReaderUpdaterModal();
        }
        ajax(`${URL_PREFIX}/api/readers/member`, "DELETE", { id: btn.CustID })
            .then(dat => {
                onComplete();
                if (dat.status !== 200) {
                    return informModal(INFORM_MODAL_MESSAGE.readerOperationFailuer, INFORM_MODAL_HEADER.readerOperationFailuer)
                }
                searchReaders();
                informModal(INFORM_MODAL_MESSAGE.readerOperationSuccess, INFORM_MODAL_HEADER.readerOperationSuccess)
            })
            .catch(err => {
                console.log("error deleting user", err);
                onComplete()
                return informModal(INFORM_MODAL_MESSAGE.readerOperationFailuer, INFORM_MODAL_HEADER.readerOperationFailuer)
            })
    })
}

/**
 * Bind add reader button
 */
export function bindReaderAddButton() {
    DomMan.replaceDataHeader(getTopButton({ buttonName: "New Reader", buttonClassName: "new-reader-create-btn" }))
    document.querySelector(".new-reader-create-btn").addEventListener("click", (el) => {
        resetReaderUpdaterModal();
        const modal = document.getElementById("reader-modal")
        const button = document.getElementById("craete-or-update-field")
        modal.classList.remove("d-none")
        button.HTTPMethod = "PUT";
        button.innerHTML = "Create";
        button.dispatchEvent(new Event("updateChecks"))
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
export function searchReaders(options = {}) {
    return new Promise((resolve, reject) => {
        let url = `${URL_PREFIX}/api/readers/member?`;
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
                    return resolve(searchReaders());
                }
                // render the books
                DomMan.clearDataBody()
                let readers = ""
                dat.json.message.forEach(reader => {
                    DomMan.appendCurrentBodyItems(reader.id, reader)
                    readers += getReaderCard(reader)
                });
                DomMan.appendDataBody(readers)

                const currentPage = options?.page || 1
                PageToggle.setFooter(
                    Math.floor(dat.json.total_count / 20) + 1,
                    currentPage,
                    options || {},
                    "readersTab"
                )
                bindReaderCardEditButton();
                resolve()
            })
            .catch((err) => {
                console.error("[ERROR IN READERS]", err)
                errorCase(true);
                reject()
            })
    })
}
