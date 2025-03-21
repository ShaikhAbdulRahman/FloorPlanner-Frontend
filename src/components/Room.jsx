import React from "react";
import { Rect, Text, Group, Transformer, Circle } from "react-konva";
import DoorOrWindow from "./DoorOrWindow";

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

  const DeleteButton = ({ onClick }) => (
    <Group
      x={room.x + room.width}
      y={room.y - 20}
      onClick={onClick}
      onTap={onClick}
    >
      <Circle radius={12} fill="white" stroke="#333" strokeWidth={1} />
      <Text
        text="✕"
        fontSize={16}
        fill="#f44336"
        align="center"
        verticalAlign="middle"
        x={-6}
        y={-8}
      />
    </Group>
  );

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
        <DeleteButton onClick={() => onDeleteItem(room.id, "room")} />
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