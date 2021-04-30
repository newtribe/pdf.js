import * as pks from "../web/PKITools.mjs";
import * as fs from 'fs';
import * as pdf from './build/pdf.js';
//const PKI =require("../web/PKITools.js");

console.info("..........");
try {
  const data = fs.readFileSync('D:/pdftest/empty_annotation_sig.pdf');
  // 等待操作结果返回，然后打印结果
  console.log(data);
 // const pk =new PKI() ;
  pks.verifyPDFSignature(data);


} catch(e) {
  console.log(e);

}
const asn1 = PKI.fromBER(contentBuffer);

