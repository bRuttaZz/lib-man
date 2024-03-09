import { modalBasics } from "./lib/utils/ui.js"
import { logoutBind, accountCenterBind, navBarsBinds } from "./lib/main-page/navbar.js"



window.addEventListener("load", () => {
    modalBasics()
    logoutBind()
    accountCenterBind()
    navBarsBinds()
})