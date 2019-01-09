# Etrieve Document Viewer Example Site

- [Etrieve Document Viewer Example Site](#etrieve-document-viewer-example-site)
  - [Example Site Setup](#example-site-setup)
    - [Install Node Modules](#install-node-modules)
    - [Run](#run)
  - [How To Use The Etrieve Document Viewer](#how-to-use-the-etrieve-document-viewer)
    - [Supported Browsers](#supported-browsers)
    - [The Basics](#the-basics)
      - [Loading the Etrieve Document Viewer](#loading-the-etrieve-document-viewer)
      - [Initializing the Etrieve Document Viewer](#initializing-the-etrieve-document-viewer)
      - [Opening a Document via Metadata](#opening-a-document-via-metadata)
      - [Getting Document Metadata / Using the Etrieve Api](#getting-document-metadata--using-the-etrieve-api)

---
A demo of this site can be found at [https://etrieve-document-viewer-test.azurewebsites.net](https://etrieve-document-viewer-test.azurewebsites.net).

---

All commands take place using a terminal (Powershell, Command Line, Terminal, or CLI of your choice), and are run inside the root directory of the site.

## Example Site Setup

### Install Node Modules

Run the following command to download node modules.  

``` powershell
yarn
```

Or if you use NPM

``` powershell
npm install
```

### Run

Run the following command to build and run the site (port 9000).

``` powershell
yarn run run-watch
```

or if you use NPM

``` powershell
npm run-script run-watch
```

## How To Use The Etrieve Document Viewer

The Etrieve Document Viewer is designed to be loaded from a CDN into the `<head>` portion of your web page. It makes use of HTML Spec Custom Elements, Shadow DOM, ES Modules, and HTML Templates (the combination of these specs are considered "Web Components").

### Supported Browsers

Polyfills are used to supplement browser support, however supported browsers only consist of modern browsers:  

- Google Chrome (or Chromium based browsers)
- Safari
- Firefox
- Microsoft Edge (soon to be Chromium based)

### The Basics

#### Loading the Etrieve Document Viewer

Before we start using the Etrieve Document Viewer, we first need to get the resources from the CDN. To do this, we use a `<script>` tag to download the initializer into our webpage. This initializer file will look at the current browser and decide on any polyfills that need to be used so that Web Components will work.

``` html
<script type="module" src="https://etrieve-document-viewer.azureedge.net/initializer/initialize.js"></script>
```

Inserting this `<script>` tag into the head will allow you to start to use the `<etrieve-viewer>` custom element that our document viewer is based off of.

#### Initializing the Etrieve Document Viewer

In order for the document viewer to be able to download documents to view, we need to configure it so that it knows the correct api url's, as well as the appropriate client id and secret. We do this via a JavaScript interface on the `<etrieve-viewer>` element called `ViewerApi`.  
The `ViewerApi` interface can set the client id, and secret, and also has properties for Security and Content to be able to set the api base.  
An example of how to set the client id, secret, Security api base, and Content api base is as follows:

``` javascript
let viewerElement = document.querySelector('etrieve-viewer');

viewerElement.ViewerApi.clientId = 'SOME_ID';
viewerElement.ViewerApi.secret = 'SECRET_SECRET';
viewerElement.ViewerApi.Security.apiBase = 'https://some-security-site.com';
viewerElement.ViewerApi.Content.apiBase = 'https://some-content-site.com';
```

At this point, the document viewer can be used to view documents by passing it metadata on the document you want to view.

#### Opening a Document via Metadata

Once you have metadata on a document you want to open, all you need to do is use the `ViewerApi` interface to tell it to open a document with the `openFromMetadata` function. For example, opening a document from Content via metadata:

``` javascript
viewerElement.ViewerApi.Content.openFromMetadata(documentMetadata);
```

To explain what we just did, we used our `viewerElement` (which is our `<etrieve-viewer>`) instance to get the ViewerApi interface. From there, we chose the Content interface (since we're downloading a document from Etrieve Content), and requested we open a document from metadata (`openFromMetadata()`). From there, the document viewer will take care of downloading the document to display in the viewer.

#### Getting Document Metadata / Using the Etrieve Api

So we know how to open a document via metadata, but how do we get that metadata? To do that, you need to use the Etrieve Content Public API to make requests, and search for the documents you want to display.  
*If you want*, we have provided a convenience javascript api you can use to make requests to the Content Api. To access the api, there are two ways we can download it.

1. Use a `<script>` tag like we did with the `initialize.js` file for the the document viewer. Doing it this way will insert the `EtrieveApi` class on the `window` to use anywhere.

``` html
<script type="module" src="https://etrieve-document-viewer.azureedge.net/api/api.js"></script>
```

2. Import the module in JavaScript. Doing it this way you can keep the `EtrieveApi` in scope of your module instead of accessing it on the `window`.

``` javascript
import EtrieveApi from 'https://etrieve-document-viewer.azureedge.net/api/api.js';
```

Once you have the `EtrieveApi` class available, we can instantiate a new instance of it so it can communicate with our Security and Content Apis. We have to configure this Api similarly to how we configured the document viewer, with a client id, secret, Security api location, and Content api location.  
There are two ways to initialize the EtrieveApi.  

1. While instantiating the class

``` javascript
let etrieveApi = new EtrieveApi({
    SecurityApiBase: 'https://some-security-site.com',
    SecurityApiClientId: 'SOME_ID',
    SecurityApiSecret: 'SECRET_SECRET',
    SecurityApiDefaults: {},
    ContentApiBase: 'https://some-content-site.com',
    ContentApiDefaults: {}
});
```

2. After the class has been instantiated via configuration functions

``` javascript
let etrieveApi = new EtrieveApi();
etrieveApi
    .initializeApiSecurity(
        'https://some-security-site',
        'SOME_ID',
        'SECRET_SECRET',
        {})
    .initializeContent('https://some-content-site.com', {});
```

*You'll notice the empty objects while configuring*. Those are optional and are used to configure the fetch requests to the Api. If there is any default configuration you need to include on every request (for example some additional token), you can add that here. If you are unfamiliar with Fetch, it is the standard HTTP request pipeline that's replaced AJAX ([read more about Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).  

The two methods currently available via the `EtrieveApi` are `searchDocuments` and `getDocumentMetadata`. Passing the metadata from these requests into the document viewer will allow the document viewer to display the selected document. Since both of those are Content requests, you would make requests like this.  

``` javascript
let etrieveApi = new EtrieveApi({
    SecurityApiBase: 'https://some-security-site.com',
    SecurityApiClientId: 'SOME_ID',
    SecurityApiSecret: 'SECRET_SECRET',
    SecurityApiDefaults: {},
    ContentApiBase: 'https://some-content-site.com',
    ContentApiDefaults: {}
});

etrieveApi.Content.searchDocuments('some search string');
etrieveApi.Content.getDocumentMetadata(documentId);
```

The function signature for each is as follows

<pre>
/**
 * searchDocuments
 * Returns a list of documents satisfying the search.
 * @param {string} [query] An optional search value to match documents on. When provided, returned documents will have at least one property value or field value that starts with the search value. Matches are case-insensitive.
 * @param {string} [area] An optional Area code used to locate one or more items. Matches are case-sensitive.
 * @param {string} [documentType] An optional Document Type code used to locate one or more items. Matches are case-sensitive.
 * @param {boolean} [includeRecycleBinItems] An optional value indicating whether or not to include soft-deleted items.
 * @param {int} limit The max number of items to return in the response.
 * @param {int} offset The number of items to skip before collecting the response items.
 * @param {string} [fields] An optional comma-delimited set of fields to include in the resources returned in the response.
 * @returns {Array}
 */
</pre>

<pre>
/**
 * getDocumentMetadata
 * Get the metadata from a document
 * @param {int} id ID of document
 */
</pre>