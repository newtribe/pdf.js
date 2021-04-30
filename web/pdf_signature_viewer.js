/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createPromiseCapability, getFilenameFromUrl } from "pdfjs-lib";
import { BaseTreeViewer } from "./base_tree_viewer.js";
//import { PKI } from "./PKITools.js";



/**
 * @typedef {Object} PDFAttachmentViewerOptions
 * @property {HTMLDivElement} container - The viewer element.
 * @property {EventBus} eventBus - The application event bus.
 * @property {DownloadManager} downloadManager - The download manager.
 */

/**
 * @typedef {Object} PDFAttachmentViewerRenderParameters
 * @property {Object|null} attachments - A lookup table of attachment objects.
 */

class PDFSignatureViewer extends BaseTreeViewer {
  /**
   * @param {} options
   */
  constructor(options) {
    super(options);
    this.downloadManager = options.downloadManager;

    this.eventBus._on(
      "sigannotation",
      this._appendAttachment.bind(this)
    );
  }


  /**
   * @private
   */
  _dispatchEvent(attachmentsCount) {
    this._renderedCapability.resolve();

    if (this._pendingDispatchEvent) {
      clearTimeout(this._pendingDispatchEvent);
      this._pendingDispatchEvent = null;
    }
    if (attachmentsCount === 0) {
      // Delay the event when no "regular" attachments exist, to allow time for
      // parsing of any FileAttachment annotations that may be present on the
      // *initially* rendered page; this reduces the likelihood of temporarily
      // disabling the attachmentsView when the `PDFSidebar` handles the event.
      this._pendingDispatchEvent = setTimeout(() => {
        this.eventBus.dispatch("sigloaded", {
          source: this,
          attachmentsCount: 0,
        });
        this._pendingDispatchEvent = null;
      });
      return;
    }

    this.eventBus.dispatch("sigloaded", {
      source: this,
      attachmentsCount,
    });
  }


  /**
   * Used to append signature annotations to the sidebar.
   * @private
   */

   _appendAttachment({ id, data, content }) {
    try {
      this.dosignverify({id,data,content});
    }catch(e){
      console.error(e);
    }

   }
   dosignverify({ id, data, content }) {
  
      let fieldName =data.fieldName;
      let appear =data.defaultAppearance;
      let rect =data.rect ;
      //==========================
      //parse asn1 Contents.
      let contents= data.fieldValue;
      var contentLength = contents.length;
      var contentBuffer = new ArrayBuffer(contentLength);
      var contentView = new Uint8Array(contentBuffer);

      for (var i = 0; i < contentLength; i++) {
        contentView[i] = contents.charCodeAt(i);
      }

      var sequence = Promise.resolve();
      var asn1 = PKI.fromBER(contentBuffer);
      var cmsContentSimp = new ContentInfo({
        schema: asn1.result
      });
      var cmsSignedSimp = new SignedData({
        schema: cmsContentSimp.content
      });
      //////////////////////

      const fragment = document.createDocumentFragment();

      let count = 0;

  
        const div = document.createElement("div");
        div.className = "treeItem";
  
        const element = document.createElement("a");
        element.textContent = this._normalizeTextContent(fieldName);

        const element2 = document.createElement("a");
        element2.textContent = this._normalizeTextContent(appear);

        const element3 = document.createElement("a");
        element3.textContent = rect;

        const element4 = document.createElement("a");
        element4.textContent = data.fieldValue;
        
        div.appendChild(element); div.appendChild(element2); div.appendChild(element3);
        div.appendChild(element4);
        fragment.appendChild(div);
       
      
  
      this._finishRendering(fragment, count);
    
  }
}

export { PDFSignatureViewer };
