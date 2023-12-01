import React from "react";
import styles from "../../Styles/Settings.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GiConsoleController } from "react-icons/gi";

export default function Order({ order, setOrder, model, title, description }) {
  // activat/deactivate the order item
  const handleSwitch = (index) => {
    const newOrder = [...order];
    newOrder[index].active = !newOrder[index].active;
    setOrder(newOrder);
  };
  return (
    <div className={styles.settingContainer}>
      <div className={styles.settingTitle}>{title}</div>
      <div className={styles.settingDescription}>{description}</div>
      <DragDropContext
        onDragEnd={(result) => {
          const { source, destination } = result;
          if (!destination) {
            return;
          }
          if (source.index === destination.index) {
            return;
          }
          const newOrder = Array.from(order);
          newOrder.splice(source.index, 1);
          newOrder.splice(destination.index, 0, order[source.index]);
          setOrder(newOrder);
        }}
      >
        <Droppable droppableId="order">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {order.map((item, index) => (
                <Draggable
                  key={item.name}
                  draggableId={item.name}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div
                        className={styles.orderItem}
                        onClick={() =>
                          item.value !== "temperature"
                            ? handleSwitch(index)
                            : null
                        }
                      >
                        <div
                          className={
                            item.active
                              ? model === "euterpe-v2"
                                ? styles.orderItemNameActive
                                : styles.orderItemNameActiveCassandra
                              : styles.orderItemName
                          }
                        >
                          {item.name}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
