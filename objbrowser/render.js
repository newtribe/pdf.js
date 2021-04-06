
//var pdfjsLib ={} ;



function go(data) {
  showpdf();
}

function showpdf(file) {
  
  console.log("start render ..............");
  

  //pdfjsLib.GlobalWorkerOptions.workerSrc ='../build/dist/build/pdf.js';

  pdfjsLib.GlobalWorkerOptions.workerSrc ='../node_modules/pdfjs-dist/build/pdf.worker.js';
  var loadingTask =pdfjsLib.getDocument(file) ;
    loadingTask.promise.then(function(pdf) {
      //
      // Fetch the first page
      //
      pdf.getPage(1).then(function(page) {
        var scale = 1.5;
        var viewport = page.getViewport({ scale: scale, });
  
        //
        // Prepare canvas using PDF page dimensions
        //
        var canvas = document.getElementById('the-canvas');
        console.info(canvas);
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        //
        // Render PDF page into canvas context
        //
        var renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
      });
    });
  
  
  
  
  
  
  }

window.addEventListener('change', function webViewerChange(evt) {

  
  var files = evt.target.files;
  if (!files || files.length === 0)
    return;

  // Read the local file into a Uint8Array.
  var fileReader = new FileReader();
  fileReader.onload = function webViewerChangeFileReaderOnload(evt) {

    var buffer = evt.target.result;
    var uint8Array = new Uint8Array(buffer);

    showpdf(uint8Array);
  };

  var file = files[0];
  fileReader.readAsArrayBuffer(file);


  

}, true);

window.addEventListener('hashchange', function (evt) {
  go(Browser.data);
});

