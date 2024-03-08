/**
 * Bind theming switching and ..you knw..!
 */
export function bindThemeSwitch() {
    const systemMode = window.matchMedia("(prefers-color-scheme: dark)");
    const setSysTheme = () => {
        if (systemMode.matches) {
            document.documentElement.classList.add("dark")
            sessionStorage.setItem("theme-selection", "dark");
        } else {
            document.documentElement.classList.remove("dark")
            sessionStorage.setItem("theme-selection", "light");
        }
    }

    // set sys theme
    const cachedState = sessionStorage.getItem("theme-selection")
    if (cachedState === "dark")
        document.documentElement.classList.add("dark")
    else if (!cachedState)
        setSysTheme()


    systemMode.addEventListener("change", setSysTheme)

    // add custom button functionality
    document.querySelector(".theme-swticher")?.addEventListener("click", (e) => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            sessionStorage.setItem("theme-selection", "light");
        } else {
            document.documentElement.classList.add("dark")
            sessionStorage.setItem("theme-selection", "dark");
        }
    })
}