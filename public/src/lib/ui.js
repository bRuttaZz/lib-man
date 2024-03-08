

function bindThemeSwitch() {
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)");
    const setSysTheme = () => {
        if (systemMode.matches) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }

    // set sys theme
    setSysTheme()
    systemMode.addEventListener("change", setSysTheme)

    // add custom button functionality
    document.querySelector(".theme-switch-button")?.addEventListener("click", (e) => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark")
        } else {
            document.documentElement.classList.add("dark")
        }
    })
}