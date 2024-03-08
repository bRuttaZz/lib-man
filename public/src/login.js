import { ajax } from "./lib/utils.js"
import { LOGIN_WARNING } from "./lib/messages.js"

function bindButton() {
    const loginBtn = document.querySelector(".login-btn");
    const usernameField = window.usernameField
    const passwordField = window.passwordField
    const errorRegion = document.querySelector(".error-region")

    let userNameOk = false
    let passwordOk = false

    if (2 < usernameField.value.length && usernameField.value.length <= 15)
        userNameOk = true
    if (5 < passwordField.value.length && passwordField.value.length <= 25)
        passwordOk = true
    if (userNameOk && passwordOk)
        loginBtn.disabled = false

    window.addEventListener("keydown", (e) => {
        if (e.key == "Enter")
            loginBtn.click()
    })

    usernameField.addEventListener("input", (e) => {
        if (2 < usernameField.value.length && usernameField.value.length <= 15) {
            userNameOk = true;
            if (userNameOk && passwordOk)
                loginBtn.disabled = false;
        } else {
            userNameOk = false
            loginBtn.disabled = true;
        }
        if (e.target.value.length > 15)
            errorRegion.innerText = LOGIN_WARNING.usernameMaxLimit
        else
            errorRegion.innerText = ""
    })
    passwordField.addEventListener("input", (e) => {
        if (5 < passwordField.value.length && passwordField.value.length <= 25) {
            passwordOk = true;
            if (userNameOk && passwordOk)
                loginBtn.disabled = false;
        } else {
            passwordOk = false;
            loginBtn.disabled = true;
        }
        if (e.target.value.length > 25)
            errorRegion.innerText = LOGIN_WARNING.passwordMaxLimit
        else
            errorRegion.innerText = ""
    })
    loginBtn.addEventListener("click", (e) => {
        e.target.disabled = true
        e.target.innerHTML = `<span class="mdi mdi-loading mdi-spin"></span> Loging In`
        const onComplete = () => {
            e.target.disabled = true
            e.target.innerHTML = `Login`
        }
        ajax(
            "/api/admin/login",
            "POST",
            { username: usernameField.value, password: passwordField.value }
        )
            .then(dat => {
                if (dat.status !== 200) {
                    errorRegion.innerText = "invalid username/password"
                    onComplete()
                    return
                }
                errorRegion.innerText = ""
                window.location.href = "/"
                onComplete()
            })
            .catch(err => {
                console.error("got into a trouble :", err)
                errorRegion.innerText = "invalid username/password"
                onComplete()
            })
    })

    // do a test (for checking if already verified)
    ajax("/api/admin/test-session", "POST")
        .then(dat => { 
            if (dat.status === 200){
                window.location.href = "/"
            }
        })
        .catch(e=>{console.log("no existing valid sessions : ", e.status)})
}

window.addEventListener("load", () => {
    bindButton()
})