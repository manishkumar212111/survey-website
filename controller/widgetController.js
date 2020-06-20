
const CommonHelper = require('../helper/commonHelper');
const SurveyModel = require('../model/surveyModel');

var WidgetController = {
    createPetition : function (req){       
        return new Promise( async function(resolve, reject) {
            try {
                let commonCheck = CommonHelper.commonCheck(req , ['name' , 'email' , 'mobile' , 'target' , 'survey_body'] , 'body');
                console.log(commonCheck);
                if(commonCheck){
                    reject({error : true , message : "Required field "+commonCheck})
                }
                
                let result = await SurveyModel.createPetition(req.body);
                resolve(result);
            } catch(e){
                return reject(e);
            }
        })
    }

}

// select cs.id as course_id , cs.couse_name as course_name , cs.short_description as short_description , cs.long_description as long_description, cs.duration as duration , cs.discount as discount , cs.eligibility, cs.end_date as end_date,
//  cs.start_date as start_date , cs.fee_type as fee_type , cs.photos as photos , cs.videos as videos , cs.available_seat as available_seat , cs.institute_fee as institute_fee ,
//  cs.institute_discount as institute_discount , cs.vendor_discount as vendor_discount , cs.vendor_registration_charges as vendor_registration_charges ,
//  cs.discount_start_date as discount_start_date , cs.discount_end_date as discount_end_date , cs.institute_id as institute_id 
//  from courses cs;

module.exports = WidgetController;