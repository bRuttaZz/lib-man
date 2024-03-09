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

export const TabState = {
    currentTab: "booksTab",
}

export function bindTabListeners() {
    document.getElementById("nav-bar").addEventListener("tabSwtich", e => {
        let dataHandlerBtn = "";
        switch (e.detail.tabName) {
            case "booksTab" :
                break;
            
            case "importBooksTab":
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
        DomMan.clearDataBody()
        DomMan.replaceFooter("")
        DomMan.appendDataBody(getLoaderPlaceHolder())
        SearchSelectorItems.setSelectorList(e.detail.tabName)
        TabState.currentTab = e.detail.tabName;
    });
    SearchSelectorItems.bindAutoListener()
}