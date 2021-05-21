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
import { fromBER,ContentInfo,SignedData ,supportDigestAlgo} from "./PKITools.js";



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
      //////////////////////
//       签名者：	051@付伟@0230703198002041014@1
// 签名状态：	签名有效，证书链完整
// 证书持有者：	CN = 051@付伟@0230703198002041014@1
// OU = Individual-1
// OU = anxinsign
// O = CFCA RSA OCA31
// C = CN
// 证书颁发者：	CN = CFCA ACS OCA31
// O = China Financial Certification Authority
// C = CN
// 序列号：	42 99 66 95 29
// 生效时间：	2020/08/25 13:49:42
// 过期时间：	2025/08/25 13:49:42
// 证书公钥：	RSA (2048)
// 签名时间：	2021/02/10 12:50:03
// 时间戳颁发机构：	CN = tss.cfca.com.cn
// OU = 运行部
// O = 中金金融认证中心有限公司
// L = 西城区
// S = 北京市
// C = CN
// 签名原因：	签名
// 签名地点：	127.0.0.1, 2021-02-10 12:50:03, 113.57.130.110
// 联系信息：
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
        element4.textContent = cmsSignedSimp;
        
        div.appendChild(element); div.appendChild(element2); div.appendChild(element3);
        div.appendChild(element4);
        fragment.appendChild(div);
       
      
  
      this._finishRendering(fragment, count);
    
  }
}

export { PDFSignatureViewer };
