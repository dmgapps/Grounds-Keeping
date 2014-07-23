var imageData;
var imageArray = [];
var fileNames = [];


$(document).bind('mobileinit pageinit', function(e)	{




});


$( document ).ready(function() {

	/*
		document is loaded
	*/ 


});


function sendForm() {

	

	var fullName = $('#fullName').val();
	var storeLocation = $('#storeLocation').val();
	var incidentReport = $('#incidentReport').val();

	if(fullName === "" || storeLocation === "" || incidentReport === "")
		alert('form must be completed');

	else {

		//logging


		$( "#reportOverlay" ).popup("open");
		var url = 'http://dmgdemos.com/mallapp/_server-scripts/uploadForm.php';

		//'images[]': imageArray
		var params = {'fileNames[]': fileNames, posted:true, fullname: fullName, storelocation: storeLocation, incidentreport: incidentReport};

		$.post(url, params, function(data) {
			
			$( "#reportOverlay" ).popup("close");
			//alert("Report Completed");

			imageArray = [];
			fileNames = [];
			updateHtml();
			$('#fullName').val("");
			$('#storeLocation').val("");
			$('#incidentReport').val("");
			$.mobile.navigate('#Home', { transition : "flow"});

			


		});

	}

}

function createFileName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 11; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text + '.jpg';
}


function encodeImageUri(imageUri) {
    
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function() {

        c.width=this.width;
        c.height=this.height;
        ctx.drawImage(img, 0,0);

    };

    img.src = imageUri;
    var dataUrl = c.toDataURL("image/jpeg");

    return dataUrl;
}


function getReportForm(reportName) {


	$.ajax({

		type: "GET",
		data: "reportName=" + reportName,
	  	url: "./app/getReportForm.php"
	}).done(function(data) {

		$.mobile.navigate('#ReportsForm', { transition : "flow"});


	});

}




function takePicture() {
	var options = {
	                    quality : 100,
	                    destinationType : Camera.DestinationType.DATA_URL,
	                    sourceType : Camera.PictureSourceType.CAMERA,
	                    allowEdit : true,
	                    encodingType: Camera.EncodingType.JPEG,
	                    targetWidth: 500,
	                    targetHeight: 500,
	                    popoverOptions: CameraPopoverOptions,
	                    saveToPhotoAlbum: false 
	            };

	navigator.camera.getPicture(onSuccess, onFail, options);


}


function updateHtml() {

	var html = "";

	for(var i = 0; i < imageArray.length; i++) {
			
		var src = "data:image/jpeg;base64," + imageArray[i];
		html += '<img src="' + src + '" />';
		html += '<br />';
	}

	$('#imageData').html(html);


}

function onSuccessAlbum(file_uri) {

		
		var data = encodeImageUri(file_uri);
		data = data.replace("data:image/jpeg;base64,", "");
	    imageArray.push(data);
	    updateHtml();

}


function onSuccess(data) {
		
		//fileURI
	    imageArray.push(data);
	    updateHtml();
	    var filename = createFileName();
	    fileNames.push(filename);

	    //upload image to server
	    var url = 'http://dmgdemos.com/mallapp/_server-scripts/uploadImage.php';
	    params = {imageData: data, fileName: filename, posted:true};

	    $.post(url, params, null);





	     	
	   /*
	     var options = new FileUploadOptions();
	     options.fileKey = "file";
	     options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
	     options.mimeType = "image/jpeg";
	     var params = new Object();
	     params.appID = appid;
	     params.eventTabID = document.getElementById('event_tab_id').value;
	     params.name = name;
	     options.params = params;
	     var ft = new FileTransfer();
	     ft.upload(fileURI, encodeURI(url), win, fail, options);
	   */
}

function onFail(message) {

}

function clearCache() {
    navigator.camera.cleanup();
}





