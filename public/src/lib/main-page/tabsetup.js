import {
    DomMan, 
    SearchSelectorItems,
    getBookCard,
    getNewBookCard,
    getReaderCard,
    getTransactionCard,
    getLoaderPlaceHolder,
    getFooterLoadBtn,
    getTopButton,
} from "./components.js"
import { errorCase } from "../utils/ui.js"
import { searchNewBooks } from "./apis.js"

export const TabState = {
    currentTab: "booksTab",
}

export function bindTabListeners() {
    document.getElementById("nav-bar").addEventListener("tabSwtich", e => {
        errorCase(false)
        DomMan.clearDataBody()
        DomMan.appendDataBody(getLoaderPlaceHolder())

        let dataHandlerBtn = "";
        switch (e.detail.tabName) {
            case "booksTab" :
                break;
            
            case "importBooksTab":
                searchNewBooks()
                break;
                
            case "readersTab" :
                dataHandlerBtn = getTopButton({
                    buttonName: "New Reader", 
                    buttonClassName:"new-reader-btn"
                })
                break;

            case "transactionsTab":
                dataHandlerBtn = getTopButton({
                    buttonName: "New Transaction", 
                    buttonClassName:"new-transact-btn"
                })
                break;
        }
        DomMan.replaceDataHeader(dataHandlerBtn)
        DomMan.replaceFooter("")
        SearchSelectorItems.setSelectorList(e.detail.tabName)
        TabState.currentTab = e.detail.tabName;
    });
    SearchSelectorItems.bindAutoListener()
}
