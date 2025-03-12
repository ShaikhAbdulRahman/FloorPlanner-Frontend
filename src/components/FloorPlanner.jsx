import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stage, Layer } from "react-konva";
import Room from "./Room";
import ItemInfo from "./ItemInfo";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import SaveIcon from "@mui/icons-material/Save";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import WindowIcon from "@mui/icons-material/Window";
import AddIcon from "@mui/icons-material/Add";
import { Trash2 } from "lucide-react";

const FloorPlanner = () => {
  const [floorPlan, setFloorPlan] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth - 40,
    height: 600,
  });
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openAddRoomDialog, setOpenAddRoomDialog] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: "",
    width: 150,
    length: 150,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const API_BASE = "http://localhost:8000/api/floorplan";

  useEffect(() => {
    fetchFloorPlan();
  }, []);

  const fetchFloorPlan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/search`);
      setFloorPlan(response.data.data[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching floor plan:", error);
      setLoading(false);
      showSnackbar("Failed to fetch floor plan.", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleSave = async () => {
    if (!floorPlan) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/save`, floorPlan);

      if (response.data && response.data.data) {
        const savedData = response.data.data;
        setFloorPlan((prevFloorPlan) => ({
          ...prevFloorPlan,
          id: savedData.id || prevFloorPlan.id,
          name: savedData.name || prevFloorPlan.name,
          rooms: savedData.rooms || prevFloorPlan.rooms,
          doors: savedData.doors || prevFloorPlan.doors,
          windows: savedData.windows || prevFloorPlan.windows,
          walls: savedData.walls || prevFloorPlan.walls,
          ...savedData,
        }));
      }
      showSnackbar("Floor plan saved successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error saving floor plan:", error);
      showSnackbar("Failed to save floor plan.", "error");
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (!id || !type || !floorPlan) return;

    try {
      setLoading(true);
      if (type === "room") {
        const updatedRooms = floorPlan.rooms.filter((room) => room.id !== id);
        const updatedDoors = floorPlan.doors
          ? floorPlan.doors.filter((door) => door.roomId !== id)
          : [];
        const updatedWindows = floorPlan.windows
          ? floorPlan.windows.filter((window) => window.roomId !== id)
          : [];
        const updatedWalls = floorPlan.walls
          ? floorPlan.walls.filter((wall) => wall.roomId !== id)
          : [];

        setFloorPlan({
          ...floorPlan,
          rooms: updatedRooms,
          doors: updatedDoors,
          windows: updatedWindows,
          walls: updatedWalls,
        });
      } else if (type === "door") {
        const updatedDoors = floorPlan.doors
          ? floorPlan.doors.filter((door) => door.id !== id)
          : [];
        setFloorPlan({
          ...floorPlan,
          doors: updatedDoors,
        });
      } else if (type === "window") {
        const updatedWindows = floorPlan.windows
          ? floorPlan.windows.filter((window) => window.id !== id)
          : [];
        setFloorPlan({
          ...floorPlan,
          windows: updatedWindows,
        });
      }

      if (id === selectedId) {
        setSelectedId(null);
        setSelectedItemType(null);
      }
      const response = await axios.post(`${API_BASE}/delete`, {
        id,
        type,
        floorPlanId: floorPlan.id,
      });

      if (response.data) {
        showSnackbar(`${type} deleted successfully!`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error deleting item:", error);
      showSnackbar(`${type} deleted successfully!`);
      setLoading(false);
    }
  };

  const handleRoomChange = (index, newAttrs) => {
    const rooms = [...floorPlan.rooms];

    if (newAttrs.doors) {
      const updatedDoors = [...floorPlan.doors];
      newAttrs.doors.forEach((door) => {
        const doorIndex = updatedDoors.findIndex((d) => d.id === door.id);
        if (doorIndex >= 0) {
          updatedDoors[doorIndex] = door;
        }
      });
      rooms[index] = {
        ...rooms[index],
        ...newAttrs,
      };

      setFloorPlan({
        ...floorPlan,
        doors: updatedDoors,
        rooms: rooms,
      });
      return;
    }

    if (newAttrs.windows) {
      const updatedWindows = [...floorPlan.windows];
      newAttrs.windows.forEach((window) => {
        const windowIndex = updatedWindows.findIndex((w) => w.id === window.id);
        if (windowIndex >= 0) {
          updatedWindows[windowIndex] = window;
        }
      });
      rooms[index] = {
        ...rooms[index],
        ...newAttrs,
      };

      setFloorPlan({
        ...floorPlan,
        windows: updatedWindows,
        rooms: rooms,
      });
      return;
    }
    rooms[index] = {
      ...rooms[index],
      ...newAttrs,
    };
    setFloorPlan({ ...floorPlan, rooms });
  };

  const handleSelectItem = (id, type) => {
    setSelectedId(id);
    setSelectedItemType(type);
  };

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      setSelectedItemType(null);
    }
  };

  const zoomIn = () => {
    setScale(scale * 1.2);
  };
  const zoomOut = () => {
    setScale(Math.max(0.1, scale / 1.2));
  };

  const isPositionOccupied = (position, offset, wallItems, itemWidth) => {
    const minDistance = itemWidth * 1.2;

    for (const item of wallItems) {
      const distance = Math.abs(item.offset - offset);
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  };

  const findAvailablePosition = (roomId, newItemType, itemWidth) => {
    if (!floorPlan) return { position: "top", offset: 50 };

    const room = floorPlan.rooms.find((r) => r.id === roomId);
    if (!room) return { position: "top", offset: 50 };

    const existingDoors = floorPlan.doors
      ? floorPlan.doors.filter((d) => d.roomId === roomId)
      : [];
    const existingWindows = floorPlan.windows
      ? floorPlan.windows.filter((w) => w.roomId === roomId)
      : [];
    const positions = ["top", "right", "bottom", "left"];

    for (const position of positions) {
      const doorsOnWall = existingDoors.filter(
        (door) => door.position === position
      );
      const windowsOnWall = existingWindows.filter(
        (window) => window.position === position
      );

      if (doorsOnWall.length === 0 && windowsOnWall.length === 0) {
        const wallLength =
          position === "top" || position === "bottom"
            ? room.width
            : room.length;
        return { position, offset: Math.max(itemWidth / 2, wallLength / 2) };
      }
    }
    let bestPosition = null;
    let bestOffset = 0;
    let maxSpace = 0;

    for (const position of positions) {
      const wallLength =
        position === "top" || position === "bottom" ? room.width : room.length;

      const itemsOnWall = [
        ...existingDoors.filter((door) => door.position === position),
        ...existingWindows.filter((window) => window.position === position),
      ].sort((a, b) => a.offset - b.offset);

      if (itemsOnWall.length === 0) {
        return { position, offset: wallLength / 2 };
      }

      if (
        itemsOnWall.length > 0 &&
        itemsOnWall[0].offset - itemWidth / 2 > itemWidth
      ) {
        const space = itemsOnWall[0].offset - itemWidth / 2;
        const potentialOffset = space / 2;

        if (
          space > maxSpace &&
          !isPositionOccupied(position, potentialOffset, itemsOnWall, itemWidth)
        ) {
          maxSpace = space;
          bestPosition = position;
          bestOffset = potentialOffset;
        }
      }

      if (
        itemsOnWall.length > 0 &&
        wallLength -
          (itemsOnWall[itemsOnWall.length - 1].offset + itemWidth / 2) >
          itemWidth
      ) {
        const space =
          wallLength -
          (itemsOnWall[itemsOnWall.length - 1].offset + itemWidth / 2);
        const potentialOffset = wallLength - space / 2;

        if (
          space > maxSpace &&
          !isPositionOccupied(position, potentialOffset, itemsOnWall, itemWidth)
        ) {
          maxSpace = space;
          bestPosition = position;
          bestOffset = potentialOffset;
        }
      }

      for (let i = 0; i < itemsOnWall.length - 1; i++) {
        const space =
          itemsOnWall[i + 1].offset - itemsOnWall[i].offset - itemWidth;
        if (space > itemWidth) {
          const potentialOffset =
            itemsOnWall[i].offset + itemWidth / 2 + space / 2;

          if (
            space > maxSpace &&
            !isPositionOccupied(
              position,
              potentialOffset,
              itemsOnWall,
              itemWidth
            )
          ) {
            maxSpace = space;
            bestPosition = position;
            bestOffset = potentialOffset;
          }
        }
      }
    }

    if (bestPosition) {
      return { position: bestPosition, offset: bestOffset };
    }

    const wallItemCounts = positions.map((position) => {
      const doorsOnWall = existingDoors.filter(
        (door) => door.position === position
      ).length;
      const windowsOnWall = existingWindows.filter(
        (window) => window.position === position
      ).length;
      return { position, count: doorsOnWall + windowsOnWall };
    });

    wallItemCounts.sort((a, b) => a.count - b.count);

    const leastCrowdedWall = wallItemCounts[0].position;
    const wallLength =
      leastCrowdedWall === "top" || leastCrowdedWall === "bottom"
        ? room.width
        : room.length;

    for (let i = 1; i <= 9; i++) {
      const testOffset = (wallLength / 10) * i;

      const itemsOnWall = [
        ...existingDoors.filter((door) => door.position === leastCrowdedWall),
        ...existingWindows.filter(
          (window) => window.position === leastCrowdedWall
        ),
      ];

      if (
        !isPositionOccupied(
          leastCrowdedWall,
          testOffset,
          itemsOnWall,
          itemWidth
        )
      ) {
        return { position: leastCrowdedWall, offset: testOffset };
      }
    }

    const randomWallIndex = Math.floor(Math.random() * 4);
    const randomPosition = positions[randomWallIndex];
    const randomWallLength =
      randomPosition === "top" || randomPosition === "bottom"
        ? room.width
        : room.length;

    const safeOffset = Math.max(
      itemWidth,
      Math.min(
        randomWallLength - itemWidth,
        Math.random() * (randomWallLength - itemWidth * 2) + itemWidth
      )
    );
    return { position: randomPosition, offset: safeOffset };
  };

  const addDoor = () => {
    if (!floorPlan || !selectedId || selectedItemType !== "room") return;

    const room = floorPlan.rooms.find((r) => r.id === selectedId);
    if (!room) return;

    const walls = floorPlan.walls || [];
    const wall = walls.find((w) => w.roomId === room.id);
    const wallId = wall ? wall.id : Date.now() - 1;

    if (!wall) {
      const newWall = {
        id: wallId,
        roomId: room.id,
        thickness: 10,
      };
      setFloorPlan((prevFloorPlan) => ({
        ...prevFloorPlan,
        walls: [...(prevFloorPlan.walls || []), newWall],
      }));
    }

    const doorWidth = 40;
    const { position, offset } = findAvailablePosition(
      room.id,
      "door",
      doorWidth
    );

    const newDoor = {
      id: Date.now(),
      roomId: room.id,
      wallId: wallId,
      width: doorWidth,
      position: position,
      offset: offset,
    };
    setFloorPlan((prevFloorPlan) => ({
      ...prevFloorPlan,
      doors: [...(prevFloorPlan.doors || []), newDoor],
    }));

    showSnackbar("Door added successfully!");
  };

  const addWindow = () => {
    if (!floorPlan || !selectedId || selectedItemType !== "room") return;

    const room = floorPlan.rooms.find((r) => r.id === selectedId);
    if (!room) return;

    const walls = floorPlan.walls || [];
    const wall = walls.find((w) => w.roomId === room.id);
    const wallId = wall ? wall.id : Date.now() - 1;

    if (!wall) {
      const newWall = {
        id: wallId,
        roomId: room.id,
        thickness: 10,
      };
      setFloorPlan((prevFloorPlan) => ({
        ...prevFloorPlan,
        walls: [...(prevFloorPlan.walls || []), newWall],
      }));
    }
    const windowWidth = 40;
    const { position, offset } = findAvailablePosition(
      room.id,
      "window",
      windowWidth
    );
    const newWindow = {
      id: Date.now(),
      roomId: room.id,
      wallId: wallId,
      width: windowWidth,
      position: position,
      offset: offset,
    };
    setFloorPlan((prevFloorPlan) => ({
      ...prevFloorPlan,
      windows: [...(prevFloorPlan.windows || []), newWindow],
    }));
    showSnackbar("Window added successfully!");
  };

  const getSelectedItemDetails = () => {
    if (!selectedId || !selectedItemType) return null;

    if (selectedItemType === "room") {
      return floorPlan.rooms.find((r) => r.id === selectedId);
    } else if (selectedItemType === "door") {
      return floorPlan.doors.find((d) => d.id === selectedId);
    } else if (selectedItemType === "window") {
      return floorPlan.windows.find((w) => w.id === selectedId);
    }
    return null;
  };

  const handleOpenAddRoomDialog = () => {
    setOpenAddRoomDialog(true);
  };

  const handleCloseAddRoomDialog = () => {
    setOpenAddRoomDialog(false);
    setNewRoom({
      name: "",
      width: 150,
      length: 150,
    });
  };

  const handleNewRoomInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({
      ...newRoom,
      [name]: name === "name" ? value : Number(value),
    });
  };

  const findNonOverlappingPosition = (width, length) => {
    if (!floorPlan || !floorPlan.rooms.length) {
      return { x: 50, y: 50 };
    }

    let maxX = 0;
    let maxY = 0;
    let minX = Infinity;
    let minY = Infinity;

    floorPlan.rooms.forEach((room) => {
      const roomMaxX = room.x + room.width;
      const roomMaxY = room.y + room.length;
      maxX = Math.max(maxX, roomMaxX);
      maxY = Math.max(maxY, roomMaxY);
      minX = Math.min(minX, room.x);
      minY = Math.min(minY, room.y);
    });

    if (maxX + width + 20 < stageSize.width) {
      return { x: maxX + 20, y: minY };
    }
    return { x: minX, y: maxY + 20 };
  };

  const addNewRoom = () => {
    if (!floorPlan) return;

    if (!newRoom.name || newRoom.width <= 0 || newRoom.length <= 0) {
      showSnackbar("Please enter valid room details", "error");
      return;
    }

    const position = findNonOverlappingPosition(newRoom.width, newRoom.length);
    const randomColor = generatePastelColor();

    const newRoomObject = {
      id: Date.now(),
      name: newRoom.name,
      width: newRoom.width,
      length: newRoom.length,
      x: position.x,
      y: position.y,
      color: randomColor,
    };

    const newWall = {
      id: Date.now(),
      roomId: newRoomObject.id,
      thickness: 10,
    };

    setFloorPlan((prevFloorPlan) => ({
      ...prevFloorPlan,
      rooms: [...prevFloorPlan.rooms, newRoomObject],
      walls: [...(prevFloorPlan.walls || []), newWall],
    }));

    showSnackbar(`Room "${newRoom.name}" added successfully!`);
    handleCloseAddRoomDialog();
  };

  const generatePastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`;
  };

  if (loading && !floorPlan) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!floorPlan) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">
          No floor plan found. Please create one.
        </Typography>
      </Box>
    );
  }
  const selectedItem = getSelectedItemDetails();

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Floor Plan
        </Typography>

        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={3} lg={2} md={2} sm={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              fullWidth
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Grid>
          <Grid item xs={4} lg={2} md={2} sm={4}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenAddRoomDialog}
              fullWidth
            >
              Add Room
            </Button>
          </Grid>

          {selectedItemType === "room" && (
            <>
              <Grid item xs={5} lg={2} md={2} sm={3}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DoorFrontIcon />}
                  onClick={addDoor}
                  fullWidth
                >
                  Add Door
                </Button>
              </Grid>
              <Grid item xs={6} lg={2} md={2} sm={3}>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<WindowIcon />}
                  onClick={addWindow}
                  fullWidth
                >
                  Add Window
                </Button>
              </Grid>
              <Grid item xs={6} lg={2} md={2} sm={3}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Trash2 size={16} />}
                  onClick={() => handleDeleteItem(selectedId, selectedItemType)}
                  fullWidth
                >
                  Delete Room
                </Button>
              </Grid>
            </>
          )}

          {selectedItemType === "door" && (
                          <Grid item xs={5} lg={2} md={2} sm={3}>

            <Button
              variant="contained"
              color="error"
              startIcon={<Trash2 size={16} />}
              onClick={() => handleDeleteItem(selectedId, selectedItemType)}
            >
              Delete Door
            </Button>
            </Grid>
          )}

          {selectedItemType === "window" && (
                                      <Grid item xs={5} lg={2} md={2} sm={3}>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteItem(selectedId, selectedItemType)}
              fullWidth
            >
              Delete Window
            </Button>
            </Grid>
          )}
        </Grid>

        <Paper
          elevation={1}
          sx={{
            overflow: "hidden",
            mb: 3,
            mt:2,
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            scaleX={scale}
            scaleY={scale}
            draggable={scale !== 1}
          >
            <Layer>
              {floorPlan.rooms &&
                floorPlan.rooms.map((room, i) => (
                  <Room
                    key={room.id}
                    room={room}
                    isSelected={
                      room.id === selectedId && selectedItemType === "room"
                    }
                    onSelect={() => handleSelectItem(room.id, "room")}
                    onChange={(newAttrs) => handleRoomChange(i, newAttrs)}
                    doors={(floorPlan.doors || []).filter(
                      (door) => door.roomId === room.id
                    )}
                    windows={(floorPlan.windows || []).filter(
                      (window) => window.roomId === room.id
                    )}
                    onSelectItem={handleSelectItem}
                    selectedItemId={selectedId}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
            </Layer>
          </Stage>
        </Paper>

        <ItemInfo
          selectedItem={selectedItem}
          selectedItemType={selectedItemType}
        />
      </Box>

      <Dialog open={openAddRoomDialog} onClose={handleCloseAddRoomDialog}>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, width: "300px" }}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Room Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newRoom.name}
              onChange={handleNewRoomInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="width"
              label="Width (px)"
              type="number"
              fullWidth
              variant="outlined"
              value={newRoom.width}
              onChange={handleNewRoomInputChange}
              inputProps={{ min: 50 }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="length"
              label="Length (px)"
              type="number"
              fullWidth
              variant="outlined"
              value={newRoom.length}
              onChange={handleNewRoomInputChange}
              inputProps={{ min: 50 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddRoomDialog}>Cancel</Button>
          <Button onClick={addNewRoom} variant="contained" color="primary">
            Create Room
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FloorPlanner;
