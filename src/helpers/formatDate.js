const { DateTime } = require('luxon');

// Change date to readable format - Jan 01, 2022
const formatDate = (time) => {
    return DateTime.fromJSDate(new Date(time)).toLocaleString(DateTime.DATE_MED);
};

export default formatDate;