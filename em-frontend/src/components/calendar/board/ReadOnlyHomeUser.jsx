"use client"

import { useState, useEffect } from "react"
import { Box, Typography, IconButton, Fade, MenuItem, Select, FormControl, CircularProgress } from "@mui/material"
import ReadOnlyWeeklyScheduler from "./ReadOnlyWeeklyScheduler"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import axios from "axios"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import clickAnimation from "../../../animations/calendarUser.lottie"
import API_BASE_URL from "../../../config"

const ReadOnlyHomeUser = () => {
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState("")
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/rooms`)
        setRooms(response.data)
      } catch (error) {
        console.error("Error al obtener los salones", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  const handleRoomChange = (event) => {
    const selectedRoomName = event.target.value
    setSelectedRoom(selectedRoomName)

    const room = rooms.find((room) => room.roomName === selectedRoomName)
    if (room) {
      setSelectedRoomId(room.id)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        padding: 4,
        backgroundColor: "#336FB5",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#f0f0f0",
          textAlign: "center",
          mb: 2,
          fontFamily: '"Josefin Sans", sans-serif',
        }}
      >
        Horario de Salones
      </Typography>

      <FormControl
        sx={{
          width: "100%",
          maxWidth: 400,
          mb: 4,
        }}
      >
        <Select
          value={selectedRoom}
          onChange={handleRoomChange}
          sx={{
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <em>Selecciona un salón</em>
            }
            return selected
          }}
        >
          {rooms.map((room) => (
            <MenuItem
              key={room.idroom}
              value={room.roomName}
              sx={{
                fontSize: "1rem",
                padding: 1.5,
              }}
            >
              {room.roomName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!selectedRoom && !loading && (
        <Fade in timeout={1000}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Box
              sx={{
                width: 400,
                height: 400,
                backgroundColor: "#fff",
                borderRadius: "50%",
                border: "4px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <DotLottieReact src={clickAnimation} autoplay loop style={{ width: "364px", height: "364px" }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: "#F0F0F0",
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: '"Josefin Sans", sans-serif',
                marginTop: "30px",
              }}
            >
              ¡Por favor selecciona un salón en la parte superior para ver su horario!
            </Typography>
          </Box>
        </Fade>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {selectedRoom && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              position: "absolute",
              top: 16,
              left: 16,
            }}
          >
            <IconButton
              onClick={() => {
                setSelectedRoom("")
                setSelectedRoomId(null)
              }}
              sx={{
                color: "#f0f0f0",
                "&:hover": {
                  color: "#000",
                },
              }}
            >
              <ArrowBackIcon fontSize="large" />
            </IconButton>
            <Typography
              sx={{
                color: "#f0f0f0",
                fontSize: "1rem",
                fontWeight: "500",
                marginRight: 1,
              }}
            >
              Volver
            </Typography>
          </Box>

          <Fade in={!!selectedRoom} timeout={600}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                  padding: 3,
                  backgroundColor: "#fff",
                  overflowX: "auto",
                }}
              >
                <ReadOnlyWeeklyScheduler selectedRoomId={selectedRoomId} />
              </Box>
            </Box>
          </Fade>
        </>
      )}
    </Box>
  )
}

export default ReadOnlyHomeUser

