var express = require('express');
var router = express.Router();
const widgetController = require('../controller/widgetController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Express' });
});

router.get('/create-petition', function(req, res, next) {
  res.render('pages/create-petition', { title: 'Express' });
});

router.post('/create-petition/submit' , async function(req , res){
  let result = await widgetController.createPetition(req, res);
  if(result.error){
    console.log("Sdvsdjv sjdvkjdsh kjhkj");
  }
  let whatsappMessage = "Mind Like Me"+"\r\n\r\n"+"‎Please help me by signing this "+ survey_base_url + result.url_code; 
  result.whatsappMessage = encodeURIComponent(whatsappMessage)
  result.shareLink = encodeURIComponent(survey_base_url + result.url_code);
  
  res.render('pages/petition-thanks' , {data : result.data});
})

router.get('/create-petition/submit' , (req , res) => {
  let result = {
     url_code: 'd82c9c',
     long_description: '<h1>Title of your Petition/Question</h1>\r\n<h3>small description</h3>\r\n<p>Why this petition</p>',
     user_email: 'manish.kumar212111@gmail.com',
     user_mobile: '7868768768',
     type: 'petition',
     total_count: 1000,
     full_name: 'MANISH KUMAR',
     active: 1 
  }

  let whatsappMessage = "Mind Like Me"+"\r\n\r\n"+"‎Please help me by signing this "+ survey_base_url + result.url_code; 
  result.whatsappMessage = encodeURIComponent(whatsappMessage)
  result.shareLink = encodeURIComponent(survey_base_url + result.url_code);
  res.render('pages/petition-thanks' , {data : result , type : "svdf"});

})

module.exports = router;
