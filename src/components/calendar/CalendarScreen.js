import React, { useEffect, useState } from 'react'
import Navbar from '../ui/Navbar'
import moment from 'moment'
import 'moment/locale/es'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { messages } from '../../helpers/calendar-messages-es'
import CalendarEvent from './CalendarEvent'
import CalendarModal from './CalendarModal'
import { useDispatch, useSelector } from 'react-redux'
import { uiOpenModal } from '../../actions/ui'
import { eventSetActive, eventStartLoading } from '../../actions/events'
import AddNewFab from '../ui/AddNewFab'
import DeleteEventFab from '../ui/DeleteEventFab'
import { eventClearActiveEvent } from '../../actions/events'

moment.locale('es');


const localizer = momentLocalizer(moment);

// const events = [{
//     title: "Cumpleaños del jefe",
//     start: moment().toDate(),
//     end: moment().add(2, 'hour').toDate(),
//     bgcolor: "#fafafa",
//     notes: "comprar",
//     user: {
//         _id: "123",
//         name: "Lucas"
//     }
// }]

const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar)
    const { uid } = useSelector(state => state.auth)

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch(eventStartLoading())

    }, [dispatch])

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal())
    }

    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e))
    }

    const onViewChange = e => {
        setLastView(e)
        localStorage.setItem('lastView', e)
    }

    const onSelectSlot = e => {
        // console.log(e)
        dispatch(eventClearActiveEvent())
    }


    const eventStyleGetter = (event, start, end, isSelected) => {



        const style = {
            backgroundColor: (uid === event.user._id) ? "#367CF7" : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            display: "block",
            color: "white"
        }

        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                view={lastView}
                onSelectSlot={onSelectSlot}
                selectable={true}
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />

            {(activeEvent) && <DeleteEventFab />}


            <CalendarModal />


        </div>
    )
}

export default CalendarScreen
