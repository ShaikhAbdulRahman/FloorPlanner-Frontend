import React from "react";
import { Rect, Text, Group, Transformer, Circle } from "react-konva";
import DoorOrWindow from "./DoorOrWindow";
import { Trash2 } from "lucide-react";
import { IconButton } from "@mui/material";

const Room = ({
  room,
  isSelected,
  onSelect,
  onChange,
  doors,
  windows,
  onSelectItem,
  selectedItemId,
  onDeleteItem,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDoorChange = (updatedDoor) => {
    onChange({
      doors: doors.map((door) =>
        door.id === updatedDoor.id ? updatedDoor : door
      ),
    });
  };

  const handleWindowChange = (updatedWindow) => {
    onChange({
      windows: windows.map((window) =>
        window.id === updatedWindow.id ? updatedWindow : window
      ),
    });
  };

  return (
    <Group>
      <Rect
        ref={shapeRef}
        x={room.x}
        y={room.y}
        width={room.width}
        height={room.length}
        fill={room.color || "#f5f5f5"}
        stroke="#333"
        strokeWidth={2}
        onClick={onSelect}
        onTap={onSelect}
        draggable
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(50, node.width() * scaleX),
            length: Math.max(50, node.height() * scaleY),
          });
        }}
      />

      <Text
        x={room.x + 10}
        y={room.y + 10}
        text={room.name}
        fontSize={16}
        fill="#000"
        fontStyle="bold"
      />

      {isSelected && (
        <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "error.light",
            color: "white",
          },
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
        onClick={() => onDeleteItem(room.id, "room")}
        >
        <Trash2 size={20} />
      </IconButton>
      )}

      {doors &&
        doors.map((door) => (
          <DoorOrWindow
            key={`door-${door.id}`}
            item={door}
            roomData={room}
            isSelected={door.id === selectedItemId}
            onSelect={() => onSelectItem(door.id, "door")}
            onChange={handleDoorChange}
            type="door"
            onDelete={onDeleteItem}
          />
        ))}
      {windows &&
        windows.map((window) => (
          <DoorOrWindow
            key={`window-${window.id}`}
            item={window}
            roomData={room}
            isSelected={window.id === selectedItemId}
            onSelect={() => onSelectItem(window.id, "window")}
            onChange={handleWindowChange}
            type="window"
            onDelete={onDeleteItem}
          />
        ))}

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
};

export default Room;
