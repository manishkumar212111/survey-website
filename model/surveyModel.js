
const CommonHelper = require('../helper/commonHelper');
var crypto = require('crypto');

function generate_next_hex_8digit() {

    let buff = crypto.randomBytes(3);
    // put let below
    url_code = buff.toString('hex');
    return url_code; 

}

var generate_token_8digit = async function () {
    let url_code = generate_next_hex_8digit();
    console.log(url_code)
    let table_to_search = 'survey';

    let lead = await CommonHelper.findInDb({
        'url_code': url_code
    }, table_to_search, ['*'], ' AND ');

    if (lead.length) {
        do {
            url_code = generate_next_hex_8digit();
            lead = await CommonHelper.findInDb({
                'url_code': url_code
            }, table_to_search , ['*'], ' AND ')
        } while (lead.length);
    }

    return url_code;
}


var WidgetController = {
    createPetition : function (obj){       
        return new Promise( async function(resolve, reject) {
            try {
                console.log("In widget controller" , HOST_DB , await generate_token_8digit());
                let data = {
                    url_code : await generate_token_8digit(),
                    long_description : obj.survey_body,
                    user_email : obj.email,
                    user_mobile : obj.mobile,
                    type : 'petition',
                    total_count : parseInt(obj.target) ? parseInt(obj.target) : 1000,
                    full_name : obj.name ? obj.name : "NA",
                    active : 1
                }
                console.log(data);
                let insertId = await CommonHelper.insertInDB(data , 'survey');
                resolve({data : data});
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