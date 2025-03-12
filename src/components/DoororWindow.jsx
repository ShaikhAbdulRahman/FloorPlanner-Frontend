import React from "react";
import { Rect, Group, Transformer } from "react-konva";

const DoorOrWindow = ({
  item,
  roomData,
  isSelected,
  onSelect,
  onChange,
  type,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const getSize = () => {
    const isHorizontal = item.position === "top" || item.position === "bottom";
    return {
      width: isHorizontal ? item.width : 10,
      height: isHorizontal ? 10 : item.width,
    };
  };

  const calculatePosition = () => {
    const { x, y, width, length } = roomData;
    let itemX = x;
    let itemY = y;

    switch (item.position) {
      case "top":
        itemX = x + item.offset;
        break;
      case "right":
        itemX = x + width - 10;
        itemY = y + item.offset;
        break;
      case "bottom":
        itemX = x + item.offset;
        itemY = y + length - 10;
        break;
      case "left":
        itemY = y + item.offset;
        break;
      default:
        itemX = x + item.offset;
        itemY = y + item.offset;
    }

    return { x: itemX, y: itemY };
  };

  const initialPosition = calculatePosition();
  const initialSize = getSize();

  const getDoorColor = () => (type === "door" ? "#795548" : "#90caf9");
  const getStrokeColor = () => (isSelected ? "#f50057" : "#424242");

  return (
    <Group>
      <Rect
        ref={shapeRef}
        x={initialPosition.x}
        y={initialPosition.y}
        width={initialSize.width}
        height={initialSize.height}
        fill={getDoorColor()}
        stroke={getStrokeColor()}
        strokeWidth={isSelected ? 2 : 1}
        shadowBlur={isSelected ? 4 : 0}
        shadowColor={isSelected ? "rgba(245, 0, 87, 0.4)" : "transparent"}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          let newOffset = 0;
          let newPosition = item.position;

          const roomRight = roomData.x + roomData.width;
          const roomBottom = roomData.y + roomData.length;

          const distToLeft = Math.abs(newX - roomData.x);
          const distToRight = Math.abs(newX - roomRight);
          const distToTop = Math.abs(newY - roomData.y);
          const distToBottom = Math.abs(newY - roomBottom);

          const minDist = Math.min(
            distToLeft,
            distToRight,
            distToTop,
            distToBottom
          );

          if (minDist === distToLeft) {
            newPosition = "left";
            newOffset = newY - roomData.y;
          } else if (minDist === distToRight) {
            newPosition = "right";
            newOffset = newY - roomData.y;
          } else if (minDist === distToTop) {
            newPosition = "top";
            newOffset = newX - roomData.x;
          } else {
            newPosition = "bottom";
            newOffset = newX - roomData.x;
          }
          if (newPosition === "top" || newPosition === "bottom") {
            newOffset = Math.max(
              0,
              Math.min(newOffset, roomData.width - item.width)
            );
          } else {
            newOffset = Math.max(
              0,
              Math.min(newOffset, roomData.length - item.width)
            );
          }
          onChange({
            ...item,
            position: newPosition,
            offset: newOffset,
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          const newWidth = Math.max(
            20,
            Math.min(
              item.position === "left" || item.position === "right"
                ? initialSize.height * scaleY
                : initialSize.width * scaleX,
              item.position === "top" || item.position === "bottom"
                ? roomData.width - item.offset
                : roomData.length - item.offset
            )
          );

          onChange({
            ...item,
            width: newWidth,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          resizeEnabled={true}
          anchorFill="#f50057"
          anchorStroke="#f50057"
          anchorSize={7}
          borderStroke="#f50057"
          borderDash={[3, 3]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
};

export default DoorOrWindow;
