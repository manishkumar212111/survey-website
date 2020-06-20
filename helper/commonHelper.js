let CommonHelper = [];
CommonHelper.countInDb = function(condition = {}, tableName, delimeter = 'OR') {
    return new Promise(async function(resolve, reject) {
        try {
            let conditionArray = [];
            let valueArray = [];
            for (var key in condition) {
                if (condition.hasOwnProperty(key)) {
                    conditionArray.push(key + ' = ?');
                    valueArray.push(condition[key]);
                }
            }
            if (!conditionArray || conditionArray.length == 0) {
                let query = `SELECT count(id) as count FROM ${tableName}`;
                let result = await executeQuery(query, []);
                resolve(result[0].count);
            } else {
                let query = `SELECT count(id) as count FROM ${tableName} where ` + (conditionArray).join(`${delimeter}`);
                let result = await executeQuery(query, valueArray);
                resolve(result[0].count);
            }
        } catch (e) {
            reject(e);
        }
    });
}

CommonHelper.findInDb = function(condition, tableName, fields, delimeter = ' OR ', limit = -1, offset = -1, orderby = null) {
    return new Promise(async function(resolve, reject) {
        try {
            let valueArray = [];
            let query = `SELECT ${fields.join()} FROM ${tableName}`;
            if (condition && Object.keys(condition).length) {
              let conditionArray = [];
              for (var key in condition) {
                  if (condition.hasOwnProperty(key)) {
                      conditionArray.push(key + ' = ?');
                      valueArray.push(condition[key]);
                  }
              }
              query = query + ` where ` + (conditionArray).join(`${delimeter}`)
            }
            if (orderby) {
              query = query + ` ORDER BY ${orderby}`;
            }
            if (limit != -1) {
              query = query + " LIMIT " + (offset != -1 ? "?," : "") + "?";
              valueArray.push(parseInt(offset))
              valueArray.push(parseInt(limit));
            }
            let result = await executeQuery(query, valueArray);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

CommonHelper.findInDbAfterOrderBy = function(condition, tableName, fields, orderField, order, limit = 10, delimeter = ' OR ') {
    return new Promise(async function(resolve, reject) {
        try {
            if (!condition) {
                return reject('please provide condition');
            }
            let conditionArray = [];
            let valueArray = [];
            for (var key in condition) {
                if (condition.hasOwnProperty(key)) {
                    conditionArray.push(key + ' = ?');
                    valueArray.push(condition[key]);
                }
            }
            let query = `SELECT ${fields.join()} FROM ${tableName} where ` + (conditionArray).join(`${delimeter}`);
            query = query +
                ` ORDER BY ${orderField} ${order} LIMIT ${limit}`
                //console.log("findInDbAfterOrderBy Query ------------> ",query)
            let result = await executeQuery(query, valueArray);
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

CommonHelper.fetchLastRow = function(fields, tableName) {
    return new Promise(async function(resolve, reject) {
        try {
            let sql = `SELECT ${fields.join()} FROM ${tableName} ORDER BY id DESC LIMIT 1;`;
            result = await executeQuery(sql, []);
            console.log("Find Manufacturer SQL Response --> ", result[0])
            return resolve(result[0]);
        } catch (e) {
            reject(e);
        }
    });
}

CommonHelper.fetchLastRowConditional = function(fields, tableName, value, column = 'id') {
    return new Promise(async function(resolve, reject) {
        try {
            let sql = `SELECT ${fields.join()} FROM ${tableName} WHERE ${column} = ? ORDER BY id DESC LIMIT 1;`;
            result = await executeQuery(sql, [value]);
            return resolve(result[0]);
        } catch (e) {
            reject(e);
        }
    });
}

CommonHelper.getCouponsMetaData = function() {
    return new Promise(async function(resolve, reject) {
        try {
            let result = await CommonHelper.findInDb({'1':'1'},'coupons_metadata',['*']);
            let res = {
              'metadata':result,
              'status': DEALER_COUPON_STATUS
            }
            return resolve(res);
        } catch (e) {
            return reject(e);
        }
    });
}

CommonHelper.getCurrentMilestone = function(condition) {
    return new Promise(async function(resolve, reject) {
		if (condition.vehicle_bought_id) {
	        return reject('please provide condition');
	    }
      try {
            let sql = `SELECT l.milestone FROM vehicle_boughts vb JOIN leads l ON l.id = vb.lead_id 
            WHERE vb.id = ?`;
            result = await executeQuery(sql, [condition.vehicle_bought_id]);
            return resolve(result[0]);
        } catch (e) {
            reject(e);
        }
    });
}

CommonHelper.getCurrentTimeInHours = function() {
  let d = new Date();
  let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  let nd = new Date(utc + (3600000*+5.5));
  return nd.getHours();
  // var ist =  nd.toLocaleString();
  // return ist && ist.split(' ')[1] && ist.split(' ')[1].split(':') && ist.split(' ')[1].split(':')[0];  
}

CommonHelper.updateTable = function(updateObject, tableName, id, whereColumnName = 'id'){
    return new Promise( async function(resolve, reject) {
      try{
         let query = `UPDATE ${tableName} SET `;
         let valueArray = [];
         let columnValue = [];
         for (var key in updateObject) {
          if (updateObject.hasOwnProperty(key)) {
            columnValue.push('`'+key+'` = ? ');
            valueArray.push(updateObject[key]);
          }
         }
        query += columnValue.join(", ")+` where ${whereColumnName} = ? `;
        valueArray.push(id);
        let result = await executeQuery(query,valueArray); 
        resolve(result.changedRows || 0);
      }catch(e){
        reject(e);
      }
    });
}

CommonHelper.updateTableWithCondition = function(updateObject, tableName, condition, delimeter = ' OR '){
    return new Promise( async function(resolve, reject) {
      try{
         let query = `UPDATE ${tableName} SET `;
         let valueArray = [];
         let columnValue = [];
         for (var key in updateObject) {
          if (updateObject.hasOwnProperty(key)) {
            columnValue.push('`'+key+'` = ? ');
            valueArray.push(updateObject[key]);
          }
         }

        if (!condition) {
           return reject('please provide condition');
        }
        let conditionArray = [];
        for (var key in condition) {
            if (condition.hasOwnProperty(key)) {
                conditionArray.push(key + ' = ?');
                valueArray.push(condition[key]);
            }
        }

        query += columnValue.join(", ")+` where ` + (conditionArray).join(`${delimeter}`);
        let result = await executeQuery(query,valueArray); 
        resolve(result.changedRows || 0);
      }catch(e){
        reject(e);
      }
    });
}

CommonHelper.deleteInDb = function(tableName, whereColumnValue, whereColumnName = 'id'){
  return new Promise(async (resolve, reject) => {
    try{
      let query = `DELETE FROM ${tableName} `;
        query += `WHERE ${whereColumnName} = ? `;
        let result = await executeQuery(query, [whereColumnValue]);
        resolve(result['affectedRows'] || 0);
    } catch(err){
      reject(err);
    }
  });
}

CommonHelper.commonCheck = function(req, req_data, key) {
	key = key || 'body';
	if(!req_data.length) {
		return 0;
	}
	let blank_array = [];
	for(let count = 0; count < req_data.length; count++) {
		//console.log("Key",key,"Req[key] --> ",req[key],!req[key])
		if( !req[key] ||
			req[key][req_data[count]] === 'undefined'   ||
			req[key][req_data[count]] === undefined   ||
			req[key][req_data[count]] === null   ||
			(typeof req[key][req_data[count]] == 'string' && req[key][req_data[count]].trim() == "") ||
			req[key][req_data[count]] === " " || 
			req[key][req_data[count]] === "") {
			blank_array.push(req_data[count]);
		}
	}
	if(blank_array.length) {
		return blank_array.join(',');
	}
	return 0;
}

CommonHelper.insertInDB = function(data, tableName){
    return new Promise( async function(resolve, reject) {
        try{
         let query = `INSERT INTO ${tableName} `;
         let valueArray = [];
         let columnValue = [];
         let symboleValue = [];
         for (var key in data) {
          if (data.hasOwnProperty(key)) {
            columnValue.push(key);
            symboleValue.push('?');
            valueArray.push(data[key]);
          }
         }
        query += '(`'+columnValue.join("`, `")+'`) VALUES ('+symboleValue.join(", ")+')';
        let result = await executeQuery(query,valueArray); 
          resolve((result.insertId||0));
        }catch(e){
          reject(e);
        }
    });
  }

CommonHelper.sumInDb = function(field, condition = {}, tableName, delimeter = 'OR') {
    return new Promise(async function(resolve, reject) {
        try {
            let conditionArray = [];
            let valueArray = [];
            for (var key in condition) {
                if (condition.hasOwnProperty(key)) {
                    conditionArray.push(key + ' = ?');
                    valueArray.push(condition[key]);
                }
            }
            if (!conditionArray || conditionArray.length == 0) {
                let query = `SELECT sum(${field}) as sum FROM ${tableName} `;
                let result = await executeQuery(query, []);
                resolve(result[0].count);
            } else {
                let query = `SELECT sum(${field})  as sum FROM ${tableName} where ` + (conditionArray).join(`${delimeter}`);
                let result = await executeQuery(query, valueArray);
                resolve(result[0].sum);
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = CommonHelper;
