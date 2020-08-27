const {WDAYS_MASK, MWEEKS_MASK, VALUE_MASK} = require('./repetitionDefs');

function isEmpty(data) { 
    return(!data || /^\s*$/.test(data));
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
        var [year, month, day] = data.split("-");
        if (isEmpty(year) || isEmpty(month) || isEmpty(day)){
            return false;
        }
        if(isNaN(year) || isNaN(month) || isNaN(day)) {
            return false;
        }
        if(year.length != 4 || month.length != 2 || day.length!= 2) {
            return false;
        }

        var date1 = new Date(year, month-1, day, 0, 0, 0, 0);

        if (date1.getDate() != day || date1.getMonth() != month-1 || date1.getFullYear() != year) {
            return false;
        }

        return true;
    }, 
    isTime (data) { //return true for valid data
        var [hour, min, sec, milli] = data.split(":");
        [sec, milli] = sec.split(".");
        if (isEmpty(hour) || isEmpty(min) || isEmpty(sec) || isEmpty(milli)){
            return false;
        }
        if(isNaN(hour) || isNaN(min) || isNaN(sec) || isNaN(milli)) {
            return false;
        }
        if(hour.length != 2 || min.length != 2 || sec.length!= 2 || milli.length != 3) {
            return false;
        }

        var date1 = new Date(2020, 0 , 22, hour, min, sec, milli);

        if (date1.getHours() != hour || date1.getMinutes() != min || date1.getSeconds() != sec || date1.getMilliseconds() != milli) {
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

        if( (data['wdays'] & ~WDAYS_MASK) || (data['mweeks'] & ~MWEEKS_MASK) || (data['value'] & ~VALUE_MASK) ) {
            return false;
        }

        return true;
    }
}