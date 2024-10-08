import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const RoomsList = ({ onSelectRoom }) => {
    const [rooms, setRooms] = useState([]);
    const [bookedRooms, setBookedRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/rooms`);
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        const fetchBookedRooms = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events`);
                const booked = response.data.map(event => event.roomId);
                setBookedRooms(booked);
            } catch (error) {
                console.error('Error fetching booked rooms:', error);
            }
        };

        fetchRooms();
        fetchBookedRooms();
    }, []);

    const isRoomAvailable = (roomId) => !bookedRooms.includes(roomId);

    const handleRoomSelect = (roomId) => {
        if (isRoomAvailable(roomId)) {
            setSelectedRoomId(roomId);
            onSelectRoom(roomId);
        }
    };

    return (
        <div style={styles.grid}>
            {rooms.map(room => (
                <button
                    key={room.id}
                    type="button"
                    style={{
                        ...styles.button,
                        backgroundColor: selectedRoomId === room.id ? 'blue' : isRoomAvailable(room.id) ? 'green' : 'red',
                    }}
                    disabled={!isRoomAvailable(room.id)}
                    onClick={() => handleRoomSelect(room.id)}
                >
                    {room.roomName}
                </button>
            ))}
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        marginTop: '20px',
    },
    button: {
        padding: '20px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default RoomsList;
