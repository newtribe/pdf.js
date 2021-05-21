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

/**
 * @typedef {Object} PasswordPromptOptions
 * @property {string} overlayName - Name of the overlay for the overlay manager.
 * @property {HTMLDivElement} container - Div container for the overlay.
 * @property {HTMLParagraphElement} label - Label containing instructions for
 *                                          entering the password.
 * @property {HTMLInputElement} input - Input field for entering the password.
 * @property {HTMLButtonElement} submitButton - Button for submitting the
 *                                              password.
 * @property {HTMLButtonElement} cancelButton - Button for cancelling password
 *                                              entry.
 */
 import { fromBER,ContentInfo,SignedData ,supportDigestAlgo} from "./PKITools.js";

class SigninfoPrompt {
  /**
   * @param {PasswordPromptOptions} options
   * @param {OverlayManager} overlayManager - Manager for the viewer overlays.
   * @param {IL10n} l10n - Localization service.
   * @param {boolean} [isViewerEmbedded] - If the viewer is embedded, in e.g.
   *   an <iframe> or an <object>. The default value is `false`.
   */
  constructor(options, overlayManager, l10n, isViewerEmbedded = false) {
    this.overlayName = options.overlayName;
    this.container = options.container;
    this.fields =options.fields ;
    this.cancelButton = options.cancelButton;
    this.overlayManager = overlayManager;
    this.l10n = l10n;
    this._isViewerEmbedded = isViewerEmbedded;

    this.updateCallback = null;
    this.reason = null;

    // Attach the event listeners.
    this.cancelButton.addEventListener("click", this.close.bind(this));


    this.overlayManager.register(
      this.overlayName,
      this.container,
      this.close.bind(this),
      true
    );
  }

  async open(data) {
    console.info(".........signer click ...") ;

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
    var asn1 = fromBER(contentBuffer);
    var cmsContentSimp = new ContentInfo({
      schema: asn1.result
    });
    var cmsSignedSimp = new SignedData({
      schema: cmsContentSimp.content
    });

    var digid =cmsSignedSimp.signerInfos[0].digestAlgorithm.algorithmId ;
    var digestAlgo="" ;
    if(digid){
      digestAlgo =supportDigestAlgo[digid];
    }
    console.info("digest algo:"+digestAlgo);

    this.fields.sigerinfo.textContent =cmsSignedSimp.certificates[0].subject.toString();


    this.fields.digestalgo.textContent =digestAlgo;
    this.fields.address.textContent ="";

    this.fields.verifyresult.textContent="通过";
    this.fields.stime.textContent=cmsSignedSimp.certificates[0].notBefore.value ;
    this.fields.etime.textContent=cmsSignedSimp.certificates[0].notAfter.value;

  
    await this.overlayManager.open(this.overlayName);

    // for (const id in this.fields) {
    //   const content = this.fieldData[id];
    //   this.fields[id].textContent =
    //     content || content === 0 ? content : DEFAULT_FIELD_CONTENT;
    // }
 
  }

  close() {
    this.overlayManager.close(this.overlayName).then(() => {
     
    });
  }

  setUpdateCallback(updateCallback, reason) {
    this.updateCallback = updateCallback;
    this.reason = reason;
  }
}

export { SigninfoPrompt };
