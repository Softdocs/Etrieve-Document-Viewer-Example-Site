/**
 * An object containing parameters to request from the Content Api
 * @typedef {Object} ContentApiRequest
 * @property {String} [query] - An optional search value to match documents on. When provided, returned documents will have at least one field value that contains the search value. Matches are case-insensitive.
 * @property {String} [areaCode] - An optional Area code used to locate one or more items. Only documents within the given area will be matched. Matches are case-insensitive.
 * @property {String} [documentTypeCode] - An optional Document Type code used to locate one or more items. Only documents of the given type will be matched. Matches are case-insensitive.
 * @property {String} [fieldCode] - An optional Field code used to locate one or more items. Only documents with the given field will be matched. Matches are case-insensitive. Note this can only be used in conjunction with a fieldValue.
 * @property {String} [fieldValue] - An optional Field value used to locate one or more items. Only documents with the given field value will be matched. Matches are case-insensitive and exact.
 * @property {Boolean} [includeRecycleBinItems] - An optional value indicating whether or not to include soft-deleted items. When true, documents that reside in the recycle bin will be matched. Default value of false.
 * @property {Integer} [limit] - The max number of items to return in the response. Default value of 25.
 * @property {Integer} [offset] - The number of items to skip before collecting the response items. Default value of 0.
 * @property {String} [fields] - An optional comma-delimited set of fields to include in the resources returned in the response.
 * @property {String} [sort] - An optional comma-delimited set of fields to sort the results by. Default value of 'name,id'.
 */

export class App {
    constructor() {

        /*
        Here, we have some default values bound to the view that we can use for searching for a document.
        You can either search by Query/Fields, or by Document ID.
        */
        this.query = 'Adams';
        this.fields = 'id,name,totalPages,hasAnnotations';
        this.docId = null;

        this.searchType = 'query';

        this.queryField = 'ID';
        this.queryFieldValue = '100000001';

    }

    /**
     * Callback function for when the module is loaded, but before the DOM is attached.
     */
    activate() {
        /*
        For the purpose of the example site, we have a config.json file that holds our configuration properties such as sites and secrets.
        We will fetch that file so we can initialize our Api and configure the Etrieve Viewer to login with our credentials.
        You don't need to have your system configured this way, as long as you have your Security and Content Api locations and credentials, you can initialize the Etrieve Viewer.
        */
        return fetch('config.json')
            .then(response => {
                return response.json();
            })
            .then(config => {

                if (window.EtrieveWidgetManager) {

                    /*
                    Here, we're using the EtrieveWidgetManager (which was brought in by the initializer code) to initialize the EtrieveApi.
                    Initializing the EtrieveApi needs to be the first step before we actually perform any kind of operations.
                    */
                    window.EtrieveWidgetManager.EtrieveApi.initialize({
                        SecurityApiBase: config.security_api,
                        SecurityApiClientId: config.client_id,
                        SecurityApiSecret: config.secret,
                        SecurityApiDefaults: {},
                        ContentApiBase: config.content_api,
                        ContentApiDefaults: {}
                    });

                    window.EtrieveWidgetManager.waitForInitialization(() => {
                        /*
                            Insert any code you want to execute where you need to ensure that the widgets have ben loaded.
                            This can be helpful to use when you want to make requests right away to the widgets.
                        */
                    });

                } else {
                    throw Error('Cannot initialize etrieve widget manager');
                }
                
            });
    }

    /**
     * Callback function for when the DOM is attached. Here we can finally start interacting with the Etrieve Viewer.
     */
    attached() {

        /*
        Now that we have the <etrieve-document-viewer> element attached to the DOM, we can start interacting with it.
        The first thing we need to do is get a reference to the element; we do that here by using the document.querySelector.
        We're getting these DOM elements now so we can use the interface built into them later to instruct the widgets what to do.
        */
        // this.viewerElement = document.querySelector('etrieve-document-viewer');
        // this.folderViewer = document.querySelector('etrieve-folder-viewer');
        this.etrieveViewer = document.querySelector('etrieve-viewer');
        
        /*
        Off the bat, we'll go a head and start searching for documents based off our values set in the constructor.
        */
        this.searchDocuments();

    }

    /**
     * Use the query and fields to search for documents and view the first document returned.
     */
    searchDocuments() {

        let searchObj = {}
        if (this.searchType === 'query') {
            searchObj.query = this.query;
        } else if (this.searchType === 'field') {
            searchObj.fieldCode = this.queryField;
            searchObj.fieldValue = this.queryFieldValue;
        }
        this.etrieveViewer.Etrieve.searchDocuments(searchObj)
            .catch(err => {
                console.error(err);
            });
    }

    /**
     * View the selected document
     * @param {Object} documentMetadata 
     */
    viewDocument(documentMetadata) {
        /*
            If you wanted to specify exactly what document to display
                (i.e. avoid using the document selection from the folder viewer)
                then you can pass the document metadata into the openFromMetadata
                function from the viewer element directly.
        */
        this.viewerElement.Etrieve.openFromMetadata(documentMetadata);
    }
}
