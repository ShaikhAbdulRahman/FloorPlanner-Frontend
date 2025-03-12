// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Stage, Layer } from "react-konva";
// import Room from "./Room";
// import ItemInfo from "./ItemInfo";

// const FloorPlanner = () => {
//   const [floorPlan, setFloorPlan] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedItemType, setSelectedItemType] = useState(null);
//   const [stageSize, setStageSize] = useState({
//     width: window.innerWidth - 40,
//     height: 600,
//   });
//   const [scale, setScale] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const API_BASE = "http://localhost:8000/api/floorplan";


//   useEffect(() => {
//     fetchFloorPlan();

//     const handleResize = () => {
//       setStageSize({
//         width: window.innerWidth - 40,
//         height: 600,
//       });
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const fetchFloorPlan = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(`${API_BASE}/search`);
//       setFloorPlan(response.data.data[0]);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching floor plan:", error);
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     if (!floorPlan) return;
    
//     try {
//       setLoading(true);
//       const response = await axios.post(`${API_BASE}/save`, floorPlan);
      
//       if (response.data && response.data.data) {
//         setFloorPlan(response.data.data);
//       }
      
//       alert("Floor plan saved successfully!");
//       setLoading(false);
//     } catch (error) {
//       console.error("Error saving floor plan:", error);
//       alert("Failed to save floor plan.");
//       setLoading(false);
//     }
//   };

//   const handleRoomChange = (index, newAttrs) => {
//     const rooms = [...floorPlan.rooms];
    
//     if (newAttrs.doors) {
//       const updatedDoors = [...floorPlan.doors];
//       newAttrs.doors.forEach(door => {
//         const doorIndex = updatedDoors.findIndex(d => d.id === door.id);
//         if (doorIndex >= 0) {
//           updatedDoors[doorIndex] = door;
//         }
//       });
//       setFloorPlan({ ...floorPlan, doors: updatedDoors });
//       return;
//     }
    
//     if (newAttrs.windows) {
//       const updatedWindows = [...floorPlan.windows];
//       newAttrs.windows.forEach(window => {
//         const windowIndex = updatedWindows.findIndex(w => w.id === window.id);
//         if (windowIndex >= 0) {
//           updatedWindows[windowIndex] = window;
//         }
//       });
//       setFloorPlan({ ...floorPlan, windows: updatedWindows });
//       return;
//     }
    
//     rooms[index] = {
//       ...rooms[index],
//       ...newAttrs,
//     };
//     setFloorPlan({ ...floorPlan, rooms });
//   };

//   const handleSelectItem = (id, type) => {
//     setSelectedId(id);
//     setSelectedItemType(type);
//   };

//   const checkDeselect = (e) => {
//     if (e.target === e.target.getStage()) {
//       setSelectedId(null);
//       setSelectedItemType(null);
//     }
//   };

//   const zoomIn = () => {
//     setScale(scale * 1.2);
//   };

//   const zoomOut = () => {
//     setScale(Math.max(0.1, scale / 1.2));
//   };

//   const resetView = () => {
//     setScale(1);
//   };

//   const addDoor = () => {
//     if (!floorPlan || !selectedId || selectedItemType !== 'room') return;
    
//     const room = floorPlan.rooms.find(r => r.id === selectedId);
//     if (!room) return;
    
//     const newDoor = {
//       id: `door-${Date.now()}`,
//       roomId: room.id,
//       position: "top",
//       offset: 50,
//       width: 40,
//     };
    
//     setFloorPlan({
//       ...floorPlan,
//       doors: [...floorPlan.doors, newDoor]
//     });
//   };

//   const addWindow = () => {
//     if (!floorPlan || !selectedId || selectedItemType !== 'room') return;
    
//     // Find the selected room
//     const room = floorPlan.rooms.find(r => r.id === selectedId);
//     if (!room) return;
    
//     // Create a new window
//     const newWindow = {
//       id: `window-${Date.now()}`,
//       roomId: room.id,
//       position: "left",
//       offset: 50,
//       width: 40,
//     };
    
//     setFloorPlan({
//       ...floorPlan,
//       windows: [...floorPlan.windows, newWindow]
//     });
//   };

//   const getSelectedItemDetails = () => {
//     if (!selectedId || !selectedItemType) return null;
    
//     if (selectedItemType === 'room') {
//       return floorPlan.rooms.find(r => r.id === selectedId);
//     } else if (selectedItemType === 'door') {
//       return floorPlan.doors.find(d => d.id === selectedId);
//     } else if (selectedItemType === 'window') {
//       return floorPlan.windows.find(w => w.id === selectedId);
//     }
    
//     return null;
//   };

//   if (loading && !floorPlan) {
//     return <div className="p-4 text-center">Loading floor plan...</div>;
//   }

//   if (!floorPlan) {
//     return <div className="p-4 text-center">No floor plan found. Please create one.</div>;
//   }

//   const selectedItem = getSelectedItemDetails();

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">{floorPlan.name || "Untitled Floor Plan"}</h1>
      
//       <div className="flex mb-4 gap-2 flex-wrap">
//         <button 
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           onClick={handleSave}
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save Floor Plan"}
//         </button>
//         <button 
//           className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//           onClick={zoomIn}
//         >
//           Zoom In
//         </button>
//         <button 
//           className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//           onClick={zoomOut}
//         >
//           Zoom Out
//         </button>
//         <button 
//           className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//           onClick={resetView}
//         >
//           Reset View
//         </button>
        
//         {selectedItemType === 'room' && (
//           <>
//             <button 
//               className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//               onClick={addDoor}
//             >
//               Add Door
//             </button>
//             <button 
//               className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
//               onClick={addWindow}
//             >
//               Add Window
//             </button>
//           </>
//         )}
//       </div>
      
//       <div className="border border-gray-300 rounded overflow-hidden">
//         <Stage 
//           width={stageSize.width} 
//           height={stageSize.height}
//           onMouseDown={checkDeselect}
//           onTouchStart={checkDeselect}
//           scaleX={scale}
//           scaleY={scale}
//           draggable={scale !== 1}
//         >
//           <Layer>
//             {floorPlan.rooms.map((room, i) => (
//               <Room
//                 key={room.id}
//                 room={room}
//                 isSelected={room.id === selectedId && selectedItemType === 'room'}
//                 onSelect={() => handleSelectItem(room.id, 'room')}
//                 onChange={(newAttrs) => handleRoomChange(i, newAttrs)}
//                 doors={floorPlan.doors.filter(door => door.roomId === room.id)}
//                 windows={floorPlan.windows.filter(window => window.roomId === room.id)}
//                 onSelectItem={handleSelectItem}
//                 selectedItemId={selectedId}
//               />
//             ))}
//           </Layer>
//         </Stage>
//       </div>
      
//       <ItemInfo selectedItem={selectedItem} selectedItemType={selectedItemType} />
//     </div>
//   );
// };

// export default FloorPlanner;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Stage, Layer } from "react-konva";
import Room from "./Room";
import ItemInfo from "./ItemInfo";

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

  const API_BASE = "http://localhost:8000/api/floorplan";


  useEffect(() => {
    fetchFloorPlan();

    const handleResize = () => {
      setStageSize({
        width: window.innerWidth - 40,
        height: 600,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    }
  };

  const handleSave = async () => {
    if (!floorPlan) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/save`, floorPlan);
      
      if (response.data && response.data.data) {
        setFloorPlan(response.data.data);
      }
      
      alert("Floor plan saved successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error saving floor plan:", error);
      alert("Failed to save floor plan.");
      setLoading(false);
    }
  };

  const handleRoomChange = (index, newAttrs) => {
    const rooms = [...floorPlan.rooms];
    
    if (newAttrs.doors) {
      const updatedDoors = [...floorPlan.doors];
      newAttrs.doors.forEach(door => {
        const doorIndex = updatedDoors.findIndex(d => d.id === door.id);
        if (doorIndex >= 0) {
          updatedDoors[doorIndex] = door;
        }
      });
      setFloorPlan({ ...floorPlan, doors: updatedDoors });
      return;
    }
    
    if (newAttrs.windows) {
      const updatedWindows = [...floorPlan.windows];
      newAttrs.windows.forEach(window => {
        const windowIndex = updatedWindows.findIndex(w => w.id === window.id);
        if (windowIndex >= 0) {
          updatedWindows[windowIndex] = window;
        }
      });
      setFloorPlan({ ...floorPlan, windows: updatedWindows });
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

  const resetView = () => {
    setScale(1);
  };

  const addDoor = () => {
    if (!floorPlan || !selectedId || selectedItemType !== 'room') return;
    
    const room = floorPlan.rooms.find(r => r.id === selectedId);
    if (!room) return;
    
    const newDoor = {
      id: `door-${Date.now()}`,
      roomId: room.id,
      position: "top",
      offset: 50,
      width: 40,
    };
    
    setFloorPlan({
      ...floorPlan,
      doors: [...floorPlan.doors, newDoor]
    });
  };

  const addWindow = () => {
    if (!floorPlan || !selectedId || selectedItemType !== 'room') return;
    
    // Find the selected room
    const room = floorPlan.rooms.find(r => r.id === selectedId);
    if (!room) return;
    
    // Create a new window
    const newWindow = {
      id: `window-${Date.now()}`,
      roomId: room.id,
      position: "left",
      offset: 50,
      width: 40,
    };
    
    setFloorPlan({
      ...floorPlan,
      windows: [...floorPlan.windows, newWindow]
    });
  };

  const getSelectedItemDetails = () => {
    if (!selectedId || !selectedItemType) return null;
    
    if (selectedItemType === 'room') {
      return floorPlan.rooms.find(r => r.id === selectedId);
    } else if (selectedItemType === 'door') {
      return floorPlan.doors.find(d => d.id === selectedId);
    } else if (selectedItemType === 'window') {
      return floorPlan.windows.find(w => w.id === selectedId);
    }
    
    return null;
  };

  if (loading && !floorPlan) {
    return <div className="p-4 text-center">Loading floor plan...</div>;
  }

  if (!floorPlan) {
    return <div className="p-4 text-center">No floor plan found. Please create one.</div>;
  }

  const selectedItem = getSelectedItemDetails();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{floorPlan.name || "Untitled Floor Plan"}</h1>
      
      <div className="flex mb-4 gap-2 flex-wrap">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Floor Plan"}
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={zoomIn}
        >
          Zoom In
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={zoomOut}
        >
          Zoom Out
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={resetView}
        >
          Reset View
        </button>
        
        {selectedItemType === 'room' && (
          <>
            <button 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={addDoor}
            >
              Add Door
            </button>
            <button 
              className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
              onClick={addWindow}
            >
              Add Window
            </button>
          </>
        )}
      </div>
      
      <div className="border border-gray-300 rounded overflow-hidden">
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
            {floorPlan.rooms.map((room, i) => (
              <Room
                key={room.id}
                room={room}
                isSelected={room.id === selectedId && selectedItemType === 'room'}
                onSelect={() => handleSelectItem(room.id, 'room')}
                onChange={(newAttrs) => handleRoomChange(i, newAttrs)}
                doors={floorPlan.doors.filter(door => door.roomId === room.id)}
                windows={floorPlan.windows.filter(window => window.roomId === room.id)}
                onSelectItem={handleSelectItem}
                selectedItemId={selectedId}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      
      <ItemInfo selectedItem={selectedItem} selectedItemType={selectedItemType} />
    </div>
  );
};

export default FloorPlanner;