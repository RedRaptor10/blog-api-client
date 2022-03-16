const { DateTime } = require('luxon');

// Change date to readable format
const formatDate = (time) => {
    return DateTime.fromJSDate(new Date(time)).toLocaleString(DateTime.DATETIME_MED);
};

export default formatDate;