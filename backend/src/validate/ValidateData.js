const {WDAYS_MASK, MWEEKS_MASK, VALUE_MASK} = require('./repetitionDefs');

function isEmpty(data) { 
    return(!data || /^\s*$/.test(data)); //regex to check if str is null or only ' '
}

function isTimeFormat(data) {
    return(/^\d\d:\d\d$/.test(data)); //regex to check format hh:mm 
}

function isDateFormat(data) {
    return(/^\d\d\d\d-\d\d-\d\d$/.test(data)); //regex to check format yyyy-mm-dd
}

function isRepetitionType (data) {
    if (!isEmpty(data)) {
        data = data.toLowerCase();
        if(data === 'day' || data === 'week' || data === 'month' || data === 'year') {
            return true;  
        }   
    }
    return false;
}

module.exports = {
    empty(data) { //return true for invalid data
       return (isEmpty(data)); //isEmpty?
    }, 
    isDate(data) { //return true for valid data
        if(!isDateFormat(data)) {
            return false;
        }

        var [year, month, day] = data.split("-");
        var date1 = new Date(year, month-1, day, 0, 0, 0, 0);

        if (date1.getDate() != day || date1.getMonth() != month-1 || date1.getFullYear() != year) {
            return false;
        }

        return true;
    }, 
    isTime (data) { //return true for valid data
        if (!isTimeFormat(data)) { 
            return false;
        } 
        var [hour, min] = data.split(":");
        var date1 = new Date(2020, 0 , 22, hour, min, 0, 0);

        if (date1.getHours() != hour || date1.getMinutes() != min ) {
            return false;
        }
        return true;
    }, 
    isValidRepetition (data) {
        if(!isRepetitionType(data['type'])) {
            return false
        }
        else {
            if(data['type'].toLowerCase() == 'week') {
                if( (data['wdays'] & WDAYS_MASK) == 0 ) {
                    return false;
                }
            }
            else if(data['type'].toLowerCase() == 'month') {
                if( ((data['mweeks'] & MWEEKS_MASK) != 0) && ((data['wdays'] & WDAYS_MASK) == 0) ) {
                    return false;
                }
            }
        }

        if (isNaN(data['wdays']) || isNaN(data['value'] || isNaN(data['mweeks']))) {
            return false;
        }
        
        if( (data['wdays'] & ~WDAYS_MASK) || (data['mweeks'] & ~MWEEKS_MASK) || (data['value'] & ~VALUE_MASK) ) {
            return false;
        }

        return true;
    }
}