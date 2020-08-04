function isEmpty(data) { 
    return(!data || /^\s*$/.test(data));
}

module.exports = {
    empty(data) { //return true for invalid data
       return (isEmpty(data)); //isEmpty?
    }, 
    date(data) { //return true for invalid data
        var [year, month, day] = data.split("-");
        if (isEmpty(year) || isEmpty(month) || isEmpty(day)){
            return true;
        }
        if(isNaN(year) || isNaN(month) || isNaN(day)) {
            return true;
        }
        if(year.length != 4 || month.length != 2 || day.length!= 2) {
            return true;
        }

        var date1 = new Date(year, month-1, day, 0, 0, 0, 0);

        if (date1.getDate() != day || date1.getMonth() != month-1 || date1.getFullYear() != year) {
            return true;
        }

        return false;
    }, 
    time (data) { //return true for invalid data
        var [hour, min, sec, milli] = data.split(":");
        [sec, milli] = sec.split(".");
        if (isEmpty(hour) || isEmpty(min) || isEmpty(sec) || isEmpty(milli)){
            return true;
        }
        if(isNaN(hour) || isNaN(min) || isNaN(sec) || isNaN(milli)) {
            return true;
        }
        if(hour.length != 2 || min.length != 2 || sec.length!= 2 || milli.length != 3) {
            return true;
        }

        var date1 = new Date(2020, 0 , 22, hour, min, sec, milli);

        if (date1.getHours() != hour || date1.getMinutes() != min || date1.getSeconds() != sec || date1.getMilliseconds() != milli) {
            return true;
        }
    
        return false;
    }
}