import { modalBasics } from "./lib/ui.js"
import { logoutBind, accountCenterBind, navBarsBinds } from "./lib/main-page/navbar.js"



window.addEventListener("load", () => {
    modalBasics()
    logoutBind()
    accountCenterBind()
    navBarsBinds()
})