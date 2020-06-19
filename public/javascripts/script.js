
// Modal Image Gallery
function onClick(element) {
  document.getElementById("img01").src = element.src;
  document.getElementById("modal01").style.display = "block";
  var captionText = document.getElementById("caption");
  captionText.innerHTML = element.alt;
}


// Toggle between showing and hiding the sidebar when clicking the menu icon
var mySidebar = document.getElementById("mySidebar");

function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
  } else {
    mySidebar.style.display = 'block';
  }
}

// Close the sidebar with the close button
function w3_close() {
    mySidebar.style.display = "none";
}

function handleChange(event , name , options){
  console.log("dvdjf jhkj");
  let value = event && event.value ? event.value : document.getElementById(name).value ;
  let errorId = name + "-error"
  if(options && options.required && (!value || value == "") ){
    console.log(errorId);
    document.getElementById(errorId).classList.remove('hide');
    return false;
  }
  
  if(options && options.number){
    if(!/^[0-9]+$/.test(value) && value.length > 2){
      event.prevenDefault();
    }
  }
  


  switch(name){
    case "name" :
      if(/^[ A-Za-z ]+$/.test(value) && value.length > 2){
        document.getElementById(errorId).classList.add('hide');

      } else {
        document.getElementById(errorId).classList.remove('hide');
        return false;
      
      }
      break;
    
    case "email" :
        if(/^[a-z0-9]+[\.a-z0-9+_-]+(\.[a-z0-9+_-]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|consulting|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(value)){
          document.getElementById(errorId).classList.add('hide');
        } else {
          document.getElementById(errorId).classList.remove('hide');
          return false;

        }
        break;
    
      case "mobile" :
        if(/^(?![9]{10})(?:[6|7|8|9][0-9]{9})$/.test(value)){
          document.getElementById(errorId).classList.add('hide');
        } else {
          document.getElementById(errorId).classList.remove('hide');
          return false;
          
        }
        break;
      case "target" :
          if(/^[0-9]+$/.test(value) && value.length <= 1000000 && value.length >= 1){
            document.getElementById(errorId).classList.add('hide');
          } else {
            document.getElementById(errorId).classList.remove('hide');
            return false;
            
          }
        break;
      case "survey_body" :
        if(value.length > 2){
          document.getElementById(errorId).classList.add('hide');
        } else {
          document.getElementById(errorId).classList.remove('hide');
          return false;
          
        }
        break;
          
  }
  return true;
}

function handleFinalSubmission(finalObj){
  let status = true;
  finalObj && finalObj.forEach(element => {
    status = status && this.handleChange('' , element , {required : true});  
  });
  console.log(status);
  if(!status)
    return;

  document.getElementById('petition-form').submit();
}