
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
 * @param {String} [buttonName] - primary button name
 * @param {String} [secondaryButton] - secondary button name if any  
 * @param {CallableFunction} [awaitBeforeFailureResolve] - call before success resolve
 * @param {CallableFunction} [awaitBeforeFailureResolve] - call before secondary btn resolve
 * @returns {Promise} - resolves on button click
 */
export function informModal(
    msg,
    heading,
    buttonName,
    secondaryButton,
    awaitBeforeSuccessResolve = () => { },
    awaitBeforeFailureResolve = () => { },
) {
    return new Promise(resolve => {
        const btn1 = document.getElementById("inform-modal-button")
        const btn2 = document.getElementById("inform-modal-button-2")

        const atEnd = async (e) => {
            btn1.disabled = true;
            btn2.disabled = true;
            if (e.target.id == "inform-modal-button")
                await awaitBeforeSuccessResolve()
            else
                await awaitBeforeFailureResolve()

            btn1.innerHTML = "Ok"
            btn2.innerHTML = "Cancel"
            btn2.classList.remove("d-none")
            btn1.removeEventListener("click", atEnd);
            btn2.removeEventListener("click", atEnd);
            document.getElementById("inform-modal-header").innerHTML = ""
            btn1.disabled = false;
            btn2.disabled = false;
            resolve();
        }
        btn1.addEventListener("click", atEnd);
        btn2.addEventListener("click", atEnd);
        document.getElementById("inform-modal-body").innerHTML = msg
        if (heading)
            document.getElementById("inform-modal-header").innerHTML = heading
        if (buttonName)
            btn1.innerHTML = buttonName
        if (secondaryButton)
            btn2.innerHTML = secondaryButton
        else
            btn2.classList.add("d-none")
        document.getElementById("inform-modal").classList.remove("d-none");
    });

}

/**
 * The fallback (apologies) for error case
 * @param {Boolean} [error] - to remove the div or not
 */
export function errorCase(error = true) {
    if (error)
        document.querySelector("#wrong-div")?.classList.remove("d-none")
    else
        document.querySelector("#wrong-div")?.classList.add("d-none")

}