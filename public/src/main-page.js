import { deleteAllCookies, ajax } from "./lib/utils.js"

function logoutBind() {

    document.querySelector(".mdi-logout").addEventListener("click", (e) => {
        deleteAllCookies()
        window.location.href = "/login";
    })
    // do a test (for checking if already verified)
    ajax("/api/admin/test-session", "POST")
        .then(dat => {
            if (dat.status !== 200)
                window.location.href = "/login"
        })
        .catch(e => { window.location.href = "/login" })
}

window.addEventListener("load", () => {
    logoutBind()
})