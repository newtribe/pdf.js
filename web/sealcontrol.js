/* eslint-disable sort-exports/sort-exports */
/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
import {Util} from "../src/shared/util.js";
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
    this.pageSeals=new Array()  ;
    this.app =app ;
  }

  init() {
    // 处理盖章的拖动
    document.addEventListener("mousedown", this.initDrag.bind(this));
    document.addEventListener("mousemove", this.moveMouse.bind(this));
    document.addEventListener("mouseup", this.stopDrag.bind(this));
     var sealsource =this.getobj("seal_001");
     sealsource.addEventListener("click", ()=>{
      this.createNewSeal(0,0);
     });
    // window.ondrop=this.stopDrag.bind(this);
    // document.addEventListener("click", this.createNewSeal.bind(this));
    // document.onmousedown = this.initDrag;
    // document.onmousemove = this.moveMouse;
    // document.onmouseup =  this.stopDrag ;\
    document.addEventListener("load", () => {
      const sealobj = this.getobj("seal_001");
      sealobj.ondrag = ev => {
        ev.dataTransfer.setData("source", "sealtmp");
      };
    });
    document.addEventListener("drop", ev => {
      ev.preventDefault();
      // const data = ev.dataTransfer.getData("source");
      if (this.isDragStart === true) {
        this.createNewSeal(ev.clientX, ev.clientY);
        this.isDragStart = false;
      }
    });

    this.app.eventBus.on('pagerendered',this.update.bind(this) );

    // ev.target.appendChild(document.getElementById(data));
  }
  // window.onload=function(this){}

  getobj(objid) {
    return document.getElementById(objid);
  }

  update (pageview){
    //console.log('pagerendered');
    var pn =pageview.pageNumber;

    let sealinfos =this.pageSeals[pn-1];
    if (!sealinfos ||sealinfos.length <1) return ;

    console.info(pageview);

    sealinfos.forEach(function(ele) {
       var type=ele.type ;

    });
    var scale =pageview.source.scale ;
    var viewport =pageview.source.viewport ;
    var transform =viewport.transform ;

    const rect = Util.normalizeRect([
      data.rect[0],
      page.view[3] - data.rect[1] + page.view[1],
      data.rect[2],
      page.view[3] - data.rect[3] + page.view[1],
    ]);
    
  container.style.transform = `matrix(${viewport.transform.join(",")})`;
  container.style.transformOrigin = `${-rect[0]}px ${-rect[1]}px`;

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

      this.sealMove(mLeft, mTop);
      return false;
    }
    return false;
  }

  initDrag(e) {
    let oDragHandle = this.nn6 ? e.target : event.srcElement;
    const topElement = "HTML";

    //
    while (
      oDragHandle.tagName !== topElement &&
      oDragHandle.className.includes("dragAble") === false
    ) {
      oDragHandle = this.nn6
        ? oDragHandle.parentNode
        : oDragHandle.parentElement;
    }

    // first process seal template
    if (oDragHandle.className.includes("sealTmp") ) {
      this.isDragStart = true;
      return;
    }

    if (oDragHandle.className.includes("dragAble")) {
      this.isdrag = true;
      this.oDragObj = oDragHandle;
      this.nTY = parseInt(this.oDragObj.style.top + 0);
      this.y = this.nn6 ? e.clientY : event.clientY;
      this.nTX = parseInt(this.oDragObj.style.left + 0);
      this.x = this.nn6 ? e.clientX : event.clientX;
      // return false;
    }
  }

  stopDrag(e) {
    this.isdrag = false;
    this.isDragStart = false;

    const oDragHandle = this.nn6 ? e.target : event.srcElement;
    if (oDragHandle.className.includes("sealTmp")) {
      const y = this.nn6 ? e.clientY : event.clientY;
      const x = this.nn6 ? e.clientX : event.clientX;

    //  this.createNewSeal(x, y);
    }
  }

  sealMove(mLeft, mTop) {
    const maxwidth = parseInt(this.pageViewContainer.style.width);
    const maxheight = parseInt(this.pageViewContainer.style.height);

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

    this.oDragObj.style.top = mTop + "px";
    this.oDragObj.style.left = mLeft + "px";
  }

  // document.ondragover=allowDrop;

  createNewSeal(x, y) {
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

    let pageSeals =this.pageSeals;
    let sealid ;
    let sealinfos =pageSeals[curpage-1] ; //get current page seals 
    if (!sealinfos || sealinfos.length ==0) {//no seals in the current page 

       sealid = "seal_info_"+curpage+"_0" ;
       sealinfos =new Array() ;
       pageSeals[curpage-1]=sealinfos;
    }else {
    
      let len =sealinfos.length ;
       sealid = "seal_info_"+curpage +"_"+len++;

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
const SealType ={
  COMMON_SEAL:0 ,
  QIFENG:1,
  HANDWRITE:2,
  BARCODE:3,
}
class SealInfo {
  constructor(sealobject, type=SealType.COMMON_SEAL, x = 0, y = 0, width = 30, img = 4) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.img = img;
    this.sealContainer;
    this.sealobject = sealobject;
    this.type =type;
  }

  getSealObj (){
    return this.sealobject ;
  }

  getX() {
    const x = this.sealobject.style.left;
    return x;

  }

  getY() {
    const y = this.sealobject.style.top;
    return y;

  }
  getType(){
    return this.type ;
  }

  getWidth() {
    return this.width;
  }
  toString(){
    return this.id
  }

}
export {
  SealControl,
  SealInfo
};
