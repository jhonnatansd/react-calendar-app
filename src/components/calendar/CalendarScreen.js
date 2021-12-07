import React, { useState } from 'react'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'

import { NavBar } from '../ui/NavBar'
import { CalendarEvent } from './CalendarEvent'
import { CalendarModal } from './CalendarModal'
import { AddNewFab } from '../ui/AddNewFab'
import { DeleteEventFab } from '../ui/DeleteEventFab'
import { messages } from '../../helpers/calendar-messages-es'

import { uiOpenModal } from '../../actions/ui'
import { eventSetActive } from '../../actions/events'
import { eventClearActiveEvent } from '../../actions/events'
import { eventStartLoading } from '../../actions/events'

import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import 'moment/locale/es';

moment.locale('es');

const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {

    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    useEffect(() => {
        dispatch( eventStartLoading() )
    }, [ dispatch ])

    const onDoubleClick = (e) => {
        dispatch( uiOpenModal() );
    }

    const onSelect = (e) => {
        dispatch( eventSetActive(e) );
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        dispatch( eventClearActiveEvent() );
    }

    const eventStyleGetter = ( event, start, end, isSelected ) => {
        const style = {
            backgroundColor: uid === event.user._id ? '#367CF7': '#465660',
            borderRadious: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return { style }
    }

    return (
        <div className="calendar-screen">
            <NavBar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
                onView={onViewChange}
                onSelectSlot={onSelectSlot}
                selectable={true}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />

            { activeEvent && <DeleteEventFab /> }

            <CalendarModal />
        </div>
    )
}
