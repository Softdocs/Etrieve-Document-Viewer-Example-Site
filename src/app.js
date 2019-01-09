
export class App {
    constructor() {

        /*
        Here, we have some default values bound to the view that we can use for searching for a document.
        You can either search by Query/Fields, or by Document ID.
        */
        this.query = 'scan - attach';
        this.fields = 'id,name,totalPages,hasAnnotations';
        this.docId = null;;

        /*
        We'll use this property (also bound to the view) to help show what kind of data is being returned from Api requests.
        */
        this.metadataResponse = 'nothing to show';
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
                /*
                We're going to store this config option so once we have the Etrieve Document Viewer attached to the DOM, we can tell it how to configure itself.
                */
                this._config = config;

                /*
                Next, we're going to configure the Etrieve Api so we can search for documents and tell the Etrieve Viewer what to load up.
                The EtrieveApi class was loaded up to the window in the <head> of the index.html file.
                Type the following command in a javascript terminal to get details on how to use the Api.
                    EtrieveApi.help();
                
                You can initialize the Api two different ways: via the constructor, or via initialize functions.

                    Constructor:
                        let etrieveApi = new EtrieveApi({
                            SecurityApiBase: 'https://etrieve-api-security-site.com',
                            SecurityApiClientId: 'GUID',
                            SecurityApiSecret: 'SECRET',
                            SecurityApiDefaults: {},
                            ContentApiBase: 'https://etrieve-api-content-site.com/',
                            ContentApiDefaults: {}
                        });

                    Functions:
                        let etrieveApi = new EtrieveApi();
                        etrieveApi
                            .initializeApiSecurity(
                                'https://etrieve-api-security-site.com/',
                                'GUID',
                                'SECRET')
                            .initializeContent('https://etrieve-api-content-site.com/');
                        

                We will initialize the EtrieveApi via the constructor and then register the instance with Aurelia's Dependency Injection container for later use.
                */
                this._etrieveApi = new EtrieveApi({
                    SecurityApiBase: config.security_api,
                    SecurityApiClientId: config.client_id,
                    SecurityApiSecret: config.secret,
                    ContentApiBase: config.content_api,
                    ContentApiDefaults: {}
                });

            });
    }

    /**
     * Callback function for when the DOM is attached. Here we can finally start interacting with the Etrieve Viewer.
     */
    attached() {
        /*
        Off the bat, we'll go a head and start searching for documents based off our values set in the constructor.
        */
        this.searchDocuments();

        /*
        Now that we have the <etrieve-viewer> element attached to the DOM, we can start interacting with it.
        The first thing we need to do is get a reference to the element; we do that here by using the document.querySelector.
        */
        this.viewerElement = document.querySelector('etrieve-viewer');

        /*
        Once we have a reference to the element, we can start using the Etrieve Viewer's interface to configure it.
        We need to configure it similarly to how we configured our Etrieve Api, that is adding Api locations, client Id's, and secrets.
        The reason this and the Etrieve Api has been abstracted out from each other is that the Etrieve Api can be used for controlling other elements,
            and login information might be different between the request for data via the Etrieve Api, and the request for viewing the document via the Etrieve Viewer.

        The interface exists under the ViewerApi property inside the Etrieve Viewer element.
        To initialize the the viewer, we need to set the clientId and the secret. This allows the element to log into the Etrieve Api's and make requests for documents.
        */
        this.viewerElement.ViewerApi.clientId = this._config.client_id;
        this.viewerElement.ViewerApi.secret = this._config.secret;

        /*
        Next, we need to tell the viewer where we have the Security and Content Api's.
        Both Security and Content have their own interface inside the ViewerApi interface. This allows you to configure the two Api's separately.
            Security:
                - apiBase

            Content:
                - apiBase
                - openFromDocumentId
                - openFromMetadata
        */
        this.viewerElement.ViewerApi.Security.apiBase = this._config.security_api;
        this.viewerElement.ViewerApi.Content.apiBase = this._config.content_api;
    }

    /**
     * Use the query and fields to search for documents and view the first document returned.
     */
    searchDocuments() {
        /**
         * Returns an array of documents satisfying the search.
         * @param {string} [query] An optional search value to match documents on. When provided, returned documents will have at least one property value or field value that starts with the search value. Matches are case-insensitive.
         * @param {string} [area] An optional Area code used to locate one or more items. Matches are case-sensitive.
         * @param {string} [documentType] An optional Document Type code used to locate one or more items. Matches are case-sensitive.
         * @param {boolean} [includeRecycleBinItems] An optional value indicating whether or not to include soft-deleted items.
         * @param {int} limit The max number of items to return in the response.
         * @param {int} offset The number of items to skip before collecting the response items.
         * @param {string} [fields] An optional comma-delimited set of fields to include in the resources returned in the response.
         * @returns {Array}
         */
        return this._etrieveApi.Content.searchDocuments(this.query, null, null, null, 25, 0, this.fields)
            .then(response => {
                /*
                Prettify the response so we can show it on the view for visual feedback of responses.
                */
                this.metadataResponse = JSON.stringify(response, null, '\t');

                /*
                Now that we have some metadata describing a list of documents, we can tell the Etrieve Viewer to open the first document via the metadata we've gathered.
                */
                let documentToView = response[0];
                this.viewerElement.ViewerApi.Content.openFromMetadata(documentToView);
            });
    }

    /**
     * Get a specific document's metadata via a Document Id and view the document.
     */
    getDocumentById() {
        /**
         * Get the metadata from a document
         * @param {int} id ID of document
         */
        return this._etrieveApi.Content.getDocumentMetadata(this.docId)
            .then(documentMetadata => {
                /*
                Prettify the response so we can show it on the view for visual feedback of responses.
                */
                this.metadataResponse = JSON.stringify(documentMetadata, null, '\t');
                
                /*
                Now that we have some metadata describing a document, we can tell the Etrieve Viewer to open the document via the metadata we've gathered.
                */
                this.viewerElement.ViewerApi.Content.openFromMetadata(documentMetadata);
            });
    }
}
