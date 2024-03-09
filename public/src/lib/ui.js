
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
    document.querySelector(".theme-switcher-btn")?.addEventListener("click", (e) => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            sessionStorage.setItem("theme-selection", "light");
        } else {
            document.documentElement.classList.add("dark")
            sessionStorage.setItem("theme-selection", "dark");
        }
    })
}

/**
 * I am inspired to create my own js-css combo (I partially dumped bootsrap)
 */
export function modalBasics() {
    // modal open buttons
    document.querySelectorAll(".modal_open_button").forEach(e => {
        e.addEventListener("click", () => {
            document.querySelector(e.dataset.openItem)?.classList.remove("d-none");
        })
    })

    // modal close buttons
    document.querySelectorAll(".modal_close_button").forEach(e => {
        e.addEventListener("click", () => {
            document.querySelector(e.dataset.closeItem)?.classList.add("d-none");
        })
    })

}

/**
 * Spin an information modal!
 * @param {String} msg - body message can be html :)
 * @param {String} [heading]  - title 
 * @param {String} [buttonName] - button name  
 * @returns {Promise} - resolves on button click
 */
export function informModal(msg, heading, buttonName) {
    return new Promise(resolve => {
        document.getElementById("inform-modal-button").addEventListener("click", ()=>{
            document.getElementById("inform-modal-button").innerHTML = "Ok"
            resolve()
        }, {once: true});
        document.getElementById("inform-modal-body").innerHTML = msg
        if (heading)
            document.getElementById("inform-modal-header").innerHTML = heading
        if (buttonName)
            document.getElementById("inform-modal-button").innerHTML = buttonName
        document.getElementById("inform-modal").classList.remove("d-none");
    });

}