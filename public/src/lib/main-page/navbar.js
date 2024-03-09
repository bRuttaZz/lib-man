import { URL_PREFIX, deleteAllCookies, ajax } from "../utils/index.js"
import { informModal } from "../utils/ui.js"
import { ADMIN_CENTER_WARNING, LOGIN_WARNING, INFORM_MODAL_HEADER, INFORM_MODAL_MESSAGE } from "../messages.js"
import { bindTabListeners } from "./tabsetup.js"

/**
 * Bind logout button
 */
export function logoutBind() {
    document.querySelector("#logout-cnfirm").addEventListener("click", (e) => {
        deleteAllCookies()
        window.location.href = `${URL_PREFIX}/login`;
    })
    // do a test (for checking if already verified)
    ajax(`${URL_PREFIX}/api/admin/test-session`, "POST")
        .then(dat => {
            if (dat.status !== 200)
                window.location.href = `${URL_PREFIX}/login`
        })
        .catch(e => { window.location.href = `${URL_PREFIX}/login` })
}

/**
 * Bind account icon tasks
 */
export function accountCenterBind() {
    const suPassword = document.getElementById("su-password-field");
    const newPassword = document.getElementById("new-password-field");
    const newPasswordCnf = document.getElementById("new-password-cnf-field");
    const updateBtn = document.getElementById("update-admin-btn");
    const errorRegion = document.querySelector(".admin-center-error-region");

    let newPassOk = false
    let newPassCnfOk = false
    let suPassOk = false

    const checkNewPass = () => {
        if (newPassword.value.length > 5 && newPassword.value.length < 25)
            newPassOk = true;
        else
            newPassOk = false;
        if (newPassword.value.length >= 25)
            errorRegion.innerText = ADMIN_CENTER_WARNING.passwordMaxLimit
        else
            if (errorRegion.innerText === ADMIN_CENTER_WARNING.passwordMaxLimit)
                errorRegion.innerText = ""

    }
    const checkCnfPass = () => {
        if (newPasswordCnf.value === newPassword.value) {
            newPassCnfOk = true;
            if (errorRegion.innerText === ADMIN_CENTER_WARNING.passwordsNotMatching)
                errorRegion.innerText = ""

        }
        else {
            newPassCnfOk = false;
            errorRegion.innerText = ADMIN_CENTER_WARNING.passwordsNotMatching
        }
    }
    const checkSuPassword = () => {
        if (suPassword.value.length > 5 && suPassword.value.length < 25)
            suPassOk = true;
        else {
            suPassOk = false;
            if (suPassword.value.length >= 25)
                errorRegion.innerText = ADMIN_CENTER_WARNING.suPasswordMaxLimit
            else
                if (errorRegion.innerText === ADMIN_CENTER_WARNING.suPasswordMaxLimit)
                    errorRegion.innerText = ""
        }
    }
    const validate = () => {
        checkSuPassword()
        checkCnfPass()
        checkNewPass()
        if (suPassOk && newPassCnfOk && newPassOk) {
            errorRegion.innerText = ""
            updateBtn.disabled = false;
        }
        else
            updateBtn.disabled = true;
    }

    // start the validation
    validate()
    errorRegion.innerText = ""
    suPassword.addEventListener("input", validate)
    newPassword.addEventListener("input", validate)
    newPasswordCnf.addEventListener("input", validate)

    updateBtn.addEventListener("click", () => {
        updateBtn.disabled = true
        updateBtn.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span> Updating`
        const onComplete = () => {
            updateBtn.disabled = true
            updateBtn.innerHTML = `Update`
        }
        ajax(
            `${URL_PREFIX}/api/admin/update-password`,
            "POST",
            {
                username: "admin",
                new_password: newPassword.value,
                super_user_password: suPassword.value,
            }
        )
            .then(dat => {
                if (dat.status === 422) {
                    onComplete();
                    errorRegion.innerText = ADMIN_CENTER_WARNING.wrongPassword;
                }
                else if (dat.status === 403) {
                    onComplete();
                    errorRegion.innerText = ADMIN_CENTER_WARNING.invalidSuPassword;
                }
                else if (dat.status !== 200) {
                    onComplete();
                    window.sessionStorage.setItem("re-login-cause", LOGIN_WARNING.sessionExpired)
                    window.location.href = `${URL_PREFIX}/login`
                }
                else {
                    // success condition
                    onComplete();
                    document.getElementById("update-admin-close-btn").click();
                    informModal(INFORM_MODAL_MESSAGE.passwordResetSuccess, INFORM_MODAL_HEADER.passwordResetSuccess)
                }
            })
            .catch(err => {
                console.error("got an exception on password reset :", err)
                onComplete();
                errorRegion.innerText = ADMIN_CENTER_WARNING.somethingWentWrong;
            })
    })
}

export function navBarsBinds() {
    const navBar = document.querySelector("#nav-bar")
    const navElems = document.querySelectorAll(".nav-elem")

    bindTabListeners();
    navElems.forEach(e => {
        e.addEventListener("click", () => {
            if (!e.classList.contains("selected-nav-elem")) {
                navElems.forEach(navElem => navElem.classList.remove("selected-nav-elem"))
                e.classList.add("selected-nav-elem");
                navBar.dispatchEvent(new CustomEvent("tabSwtich", {detail: {tabName: e.dataset.tabName}}))    
            }
        })
        if (e.classList.contains("selected-nav-elem"))
            navBar.dispatchEvent(new CustomEvent("tabSwtich", {detail: {tabName: e.dataset.tabName}}))
    })
}