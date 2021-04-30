import { PKI } from "../web/PKITools.mjs";
const fs = require('fs');
//const PKI =require("../web/PKITools.js");
const pdf =require("./build/pdf.js");

console.info("..........");
try {
  const data = fs.readFileSync('D:/pdftest/empty_annotation_sig.pdf');
  // 等待操作结果返回，然后打印结果
  console.log(data);
  const PKI =new PKI() ;
  PKI.verifyPDFSignature(data);


} catch(e) {
  console.log(e);

}
const asn1 = PKI.fromBER(contentBuffer);

