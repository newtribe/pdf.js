/* eslint-disable sort-exports/sort-exports */
/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
import { Util } from "../src/shared/util.js";
class SealControl {
  constructor(app) {
    this.isDragStart = false;
    this.move = 0;
    // var ie = document.all;
    this.nn6 = true; // document.getElementById && !document.all;
    this.isdrag = false;
    this.y;
    this.x;
    this.oDragObj;
    this.nTx;
    this.nTy;
    this.pageViewContainer;
    //this.sealinfos = new Array();
    this.pageSeals = new Array();
    this.sealMap = [];
    this.app = app;
  }

  init() {
    // 处理盖章的拖动
    document.addEventListener("mousedown", this.initDrag.bind(this));
    document.addEventListener("mousemove", this.moveMouse.bind(this));
    document.addEventListener("mouseup", this.stopDrag.bind(this));

    let sealsource = this.getallobj(".seal");
    for (var i = 0; i < sealsource.length; i++)
      sealsource[i].addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        var se = ev.srcElement;
        var qifeng = se.className.includes("qifeng_seal");
        var sealtype = qifeng ? SealType.QIFENG : SealType.COMMON_SEAL;
        var img = se.src;
        this.createNewSeal(0, 0, sealtype, img);

        return false;
      });
    // window.ondrop=this.stopDrag.bind(this);
    // document.addEventListener("click", this.createNewSeal.bind(this));
    // document.onmousedown = this.initDrag;
    // document.onmousemove = this.moveMouse;
    // document.onmouseup =  this.stopDrag ;\
    this.app.eventBus.on('pagerendered', this.update.bind(this));

    // ev.target.appendChild(document.getElementById(data));
  }
  // window.onload=function(this){}

  getobj(objid) {
    return document.getElementById(objid);
  }

  getallobj(name) {
    return document.querySelectorAll(name);
  }

  update(pageview) {

    //add drop listen to current pageview .
    const pagediv = pageview.source.div;
    pagediv.addEventListener("drop", ev => {
      // const data = ev.dataTransfer.getData("source");

      // const vapp = window.PDFViewerApplication;
      // const curpage = vapp.page;

      // const curView = vapp.appConfig.viewerContainer.childNodes[curpage - 1];
      // let viewTop = curView.style.top;
      // let viewleft = curView.style.left;
      ev.preventDefault();
      ev.stopPropagation();
      if (this.isDragStart === true) {
        var se = this.oDragObj;

        var qifeng = se.className.includes("qifeng_seal");

        var sealtype = qifeng ? SealType.QIFENG : SealType.COMMON_SEAL;
        var img = se.src;

        this.createNewSeal(ev.offsetX, ev.offsetY, sealtype, img);

        this.isDragStart = false;
      }
    });


    //console.log('pagerendered');
    var pn = pageview.pageNumber;

    let sealinfos = this.pageSeals[pn - 1];
    if (!sealinfos || sealinfos.length < 1) return;

    console.info(pageview);

    const scale = pageview.source.scale;

    for (let i = 0; i < sealinfos.length; i++) {
      const ele = sealinfos[i];
      var type = ele.type;
      var obj = ele.getSealObj();
      obj.style.transform = 'scale(' + scale + "," + scale + ')';
      obj.style.transformOrigin = "0 0";



    }
    // sealinfos.forEach(function (ele) {


    // });


    // var viewport = pageview.source.viewport;
    // var transform = viewport.transform;

    // const rect = Util.normalizeRect([
    //   data.rect[0],
    //   page.view[3] - data.rect[1] + page.view[1],
    //   data.rect[2],
    //   page.view[3] - data.rect[3] + page.view[1],
    // ]);

    // container.style.transform = `matrix(${viewport.transform.join(",")})`;
    // container.style.transformOrigin = `${-rect[0]}px ${-rect[1]}px`;

  }

  moveMouse(e) {
    if (this.isdrag) {
      const mTop = this.nn6
        ? this.nTY + e.clientY - this.y
        : this.nTY + event.clientY - this.y;
      const mLeft = this.nn6
        ? this.nTX + e.clientX - this.x
        : this.nTX + event.clientX - this.x;
      // boundry check
      //  var maxwidth =parseInt(this.pageViewContainer.style.width);
      //  var maxheight =parseInt(this.pageViewContainer.style.height);

      //   if (mLeft <0) mLeft =0 ;
      //   if (mLeft >maxwidth) mLeft =maxwidth ;
      //   if (mTop <0)  mTop =0 ;
      //   if (mTop >maxheight) mTop =maxheight ;

      //   this.oDragObj.style.top = mTop+ "px";
      //   this.oDragObj.style.left =mLeft  + "px";
      const sealid = this.oDragObj.id;
      const sealobj = this.sealMap[sealid];

      this.sealMove(sealobj, mLeft, mTop);
      return false;
    }
    return false;
  }

  initDrag(e) {
    let oDragHandle = this.nn6 ? e.target : event.srcElement;
    const topElement = "HTML";

    //
    while (
      oDragHandle.tagName !== topElement && (
        oDragHandle.className.includes("dragAble") === false &&
        oDragHandle.className.includes("seal") === false)
    ) {
      oDragHandle = this.nn6
        ? oDragHandle.parentNode
        : oDragHandle.parentElement;
    }

    const vapp = window.PDFViewerApplication;
    const curpage = vapp.page;

    const curView = vapp.appConfig.viewerContainer.childNodes[curpage - 1];
    //curView = curView.getElementByclassName("annotationLayer");
    this.pageViewContainer = curView;

    // first process seal template
    if (oDragHandle.className.includes("seal")) {
      this.oDragObj = oDragHandle;
      this.isDragStart = true;
      return false;
    }

    if (oDragHandle.className.includes("dragAble")) {
      this.isdrag = true;
      this.oDragObj = oDragHandle;
      this.nTY = parseInt(this.oDragObj.style.top + 0);
      this.y = this.nn6 ? e.clientY : event.clientY;
      this.nTX = parseInt(this.oDragObj.style.left + 0);
      this.x = this.nn6 ? e.clientX : event.clientX;
      return false;
    }
    return false;
  }

  stopDrag(e) {
    this.isdrag = false;
    this.isDragStart = false;
  }

  sealMove(seal, mLeft, mTop) {
    const maxwidth = parseInt(this.pageViewContainer.style.width);
    const maxheight = parseInt(this.pageViewContainer.style.height);
    // check boundry in the page view container .
    const sealobj = seal.getSealObj();

    const sealWidth = sealobj.style.width;
    const w = parseInt(sealWidth);

    if (mLeft < 0) {
      mLeft = 0;
    }
    if (seal.getType() === SealType.QIFENG) {
      mLeft = maxwidth - 20;

    } else if (mLeft > maxwidth - w) {
      mLeft = maxwidth - w;
    }
    if (mTop < 0) {
      mTop = 0;
    }
    if (mTop > maxheight - w) {
      mTop = maxheight - w;
    }
    sealobj.style.top = mTop + "px";
    sealobj.style.left = mLeft + "px";

    // this.oDragObj.style.top = mTop + "px";
    // this.oDragObj.style.left = mLeft + "px";
  }

  // document.ondragover=allowDrop;

  createNewSeal(x, y, type, image) {
    const seal = new SealInfo(this, x, y);
    seal.setType(type);
    seal.setImage(image);
    seal.createSeal();
  }

  createNewSeal2(x, y) {
    console.info(".....");

    const vapp = window.PDFViewerApplication;
    const curpage = vapp.page;

    const curView = vapp.appConfig.viewerContainer.childNodes[curpage - 1];
    //curView = curView.getElementByclassName("annotationLayer");
    this.pageViewContainer = curView;
    // to be append

    //  var sealNode=document.createElement("div");
    //  sealNode.setAttribute("id","seal_001");
    //  sealNode.style="z-index: 1;position: absolute";
    //  sealNode.style.class="dragAble";
    //  sealNode.insertAdjacentHTML("afterBegin","<img id='image_001' draggable='true' src='./images/seal/seal.png' style='width:151px'");
    //  curView.appendChild(sealNode);

    const maxwidth = parseInt(this.pageViewContainer.style.width);
    const maxheight = parseInt(this.pageViewContainer.style.height);
    let mLeft = x,
      mTop = y;
    if (mLeft < 0) {
      mLeft = 0;
    }
    if (mLeft > maxwidth) {
      mLeft = maxwidth;
    }
    if (mTop < 0) {
      mTop = 0;
    }
    if (mTop > maxheight) {
      mTop = maxheight;
    }

    let pageSeals = this.pageSeals;
    let sealid;
    let sealinfos = pageSeals[curpage - 1]; //get current page seals 
    if (!sealinfos || sealinfos.length == 0) {//no seals in the current page 

      sealid = "seal_info_" + curpage + "_0";
      sealinfos = new Array();
      pageSeals[curpage - 1] = sealinfos;
    } else {

      let len = sealinfos.length;
      sealid = "seal_info_" + curpage + "_" + len++;

    }
    const str =
      "<div id='" + sealid + "'    class='dragAble seal' style='z-index: 1;position: absolute;top:" +
      mTop +
      "px;left:" +
      mLeft +
      "px'>" +
      "<img id='image_sub_001'  src='./images/seal/seal.png' style='width:150px'></div>";

    // var seal = document.createElement('div');
    // seal.innerHTML = str;
    // 1.     beforeBegin: 插入到标签开始前
    // 2.     afterBegin:插入到标签开始标记之后

    // 3.     beforeEnd:插入到标签结束标记前

    // 4.     afterEnd:插入到标签结束标记后
    // eslint-disable-next-line no-unsanitized/method
    curView.insertAdjacentHTML("afterBegin", str);
    const sealobj = this.getobj(sealid);

    const sinfo = new SealInfo(sealobj)
    sealinfos.push(sinfo);
    // curView.appendChild(seal);
  }
}
const SealType = {
  COMMON_SEAL: 0,
  QIFENG: 1,
  HANDWRITE: 2,
  BARCODE: 3,
}
class SealInfo {
  constructor(sealcontrol, x = 0, y = 0, scale = 1, width = 30, img = "") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.img = img;
    this.sealContainer;
    this.sealobj;
    this.type = SealType.COMMON_SEAL;
    this.sealcontrol = sealcontrol;
    this.sealHtml;
  }

  createSeal() {
    // console.info(".....");

    const vapp = window.PDFViewerApplication;
    const curpage = vapp.page;

    const curView = vapp.appConfig.viewerContainer.childNodes[curpage - 1];
    this.sealContainer = curView;

    const pageview = vapp.pdfViewer.getPageView(curpage - 1);
    //curView = curView.getElementByclassName("annotationLayer");
    // to be append

    //  var sealNode=document.createElement("div");
    //  sealNode.setAttribute("id","seal_001");
    //  sealNode.style="z-index: 1;position: absolute";
    //  sealNode.style.class="dragAble";
    //  sealNode.insertAdjacentHTML("afterBegin","<img id='image_001' draggable='true' src='./images/seal/seal.png' style='width:151px'");
    //  curView.appendChild(sealNode);

    // const maxwidth = parseInt(this.sealContainer.style.width);
    // const maxheight = parseInt(this.sealContainer.style.height);
    //  let mLeft = this.x,
    //    mTop = this.y;
    // if (mLeft < 0) {
    //   mLeft = 0;
    // }
    // if (mLeft > maxwidth) {
    //   mLeft = maxwidth;
    // }
    // if (mTop < 0) {
    //   mTop = 0;
    // }
    // if (mTop > maxheight) {
    //   mTop = maxheight;
    // }

    const pageSeals = this.sealcontrol.pageSeals;
    let sealid;
    let sealinfos = pageSeals[curpage - 1]; //get current page seals 
    if (!sealinfos || sealinfos.length == 0) {//no seals in the current page 

      sealid = "seal_info_" + curpage + "_0";
      sealinfos = new Array();
      pageSeals[curpage - 1] = sealinfos;
    } else {

      let len = sealinfos.length;
      sealid = "seal_info_" + curpage + "_" + len++;

    }

    const scale = pageview.scale;

    const str =
      "<div id='" + sealid + "'    class='dragAble show' style='width:100px;z-index: 1;position: absolute;top:" +
      this.y +
      "px;left:" +
      this.x +
      "px;" +
      "transform:scale(" + scale + "," + scale + ")'> " +
      "<img   src='" + this.img + "' style='width:100px'></div>";
    this.sealHtml = str;

    // var seal = document.createElement('div');
    // seal.innerHTML = str;
    // 1.     beforeBegin: 插入到标签开始前
    // 2.     afterBegin:插入到标签开始标记之后

    // 3.     beforeEnd:插入到标签结束标记前

    // 4.     afterEnd:插入到标签结束标记后
    // eslint-disable-next-line no-unsanitized/method
    curView.insertAdjacentHTML("afterBegin", str);
    const sealobj = this.sealcontrol.getobj(sealid);
    this.sealobj = sealobj;
    this.sealcontrol.sealMove(this, this.x, this.y)
    sealinfos.push(this);
    this.sealcontrol.sealMap[sealid] = this;
    // curView.appendChild(seal);
  }

  getSealObj() {
    return this.sealobj;
  }

  getX() {
    const x = this.sealobj.style.left;
    return x;

  }

  getY() {
    const y = this.sealobj.style.top;
    return y;

  }

  getType() {
    return this.type;
  }

  setType(type) {
    return this.type = type;
  }

  getWidth() {
    return this.width;
  }

  setImage(img) {
    this.img = img;
  }

  toString() {
    return this.id
  }

}
export {
  SealControl,
  SealInfo
};
