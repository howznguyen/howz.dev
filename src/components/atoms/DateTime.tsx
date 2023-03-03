import React from 'react'
import moment from "moment";
import 'moment/locale/vi';
moment.locale('vi');

interface DateTimeProps {
    value: any
}

const DateTime = ({value} : DateTimeProps) => { 
    const days = 5;
    let raw = moment(value);
    let duration = moment.duration(moment().diff(value));
    const datetime = (duration.asHours() > 24 * days) ? raw.format('DD/MM/YYYY HH:mm') : raw.fromNow();
    return (
        <>{datetime}</>
    )
}

export default DateTime