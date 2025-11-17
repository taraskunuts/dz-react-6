import React, { useState, useEffect } from "react"; // Імпортуємо основні хуки React
import styled, { createGlobalStyle } from "styled-components"; // Для стилізації компонентів
import PropTypes from "prop-types"; // Для перевірки типів props
import * as Icons from "react-icons/fa"; // Іконки FontAwesome

// =============================
//  GLOBAL STYLES
// =============================
// Створюємо глобальні стилі для всього додатку
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;          // прибираємо стандартний відступ браузера
    padding: 20px;      // додаємо відступи для контенту
    font-family: Arial; // шрифт для всього додатку
    background: #f3f3f3; // світлий фон
  }
`;

// =============================
//  STYLED COMPONENTS
// =============================
// Обгортка для "дошки подій"
const BoardWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto; // центруємо по горизонталі
`;

// Окремий блок для події
const EventCard = styled.div`
  background: white;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); // легка тінь
`;

// Інформація всередині події (текст)
const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;
`;

const Small = styled.span`
  font-size: 14px;
  color: #555;
`;

// =============================
// COMPONENT: Event
// =============================
// Компонент для однієї події
function Event({ name, start, end, location, speaker, icon }) {
  // Вибираємо іконку по імені, якщо її немає - стандартна календарна
  const IconComp = Icons[icon] || Icons.FaCalendarAlt;

  // Використовуємо React.createElement замість JSX
  return React.createElement(
    EventCard,
    null,
    [
      React.createElement(IconComp, { key: "icon", size: 40 }),

      React.createElement(
        EventInfo,
        { key: "info" },
        [
          React.createElement(Title, { key: "title" }, name),
          React.createElement(Small, { key: "start" }, "Start: " + start),
          React.createElement(Small, { key: "end" }, "End: " + end),
          React.createElement(Small, { key: "loc" }, "Location: " + location),
          React.createElement(Small, { key: "speaker" }, "Speaker: " + speaker)
        ]
      )
    ]
  );
}

// Пропси для Event - обов'язково мають бути
Event.propTypes = {
  name: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  speaker: PropTypes.string.isRequired,
  icon: PropTypes.string
};

// =============================
// COMPONENT: PageBoard
// =============================
// Відповідає за список подій
function PageBoard({ events }) {
  return React.createElement(
    BoardWrapper,
    null,
    events.map((ev) =>
      React.createElement(Event, {
        key: ev.id, // унікальний ключ для React
        name: ev.name,
        start: ev.start,
        end: ev.end,
        location: ev.location,
        speaker: ev.speaker,
        icon: ev.icon
      })
    )
  );
}

PageBoard.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired
};

// =============================
// MAIN APP
// =============================
function App() {
  // useState зберігає список подій
  const [events, setEvents] = useState([]); 

  // useEffect виконує код при першому рендері
  useEffect(() => {
    // Беремо дані з JSON
    fetch("/upcoming-events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data)); // оновлюємо стан
  }, []); // [] означає, що useEffect виконається лише один раз при старті

  // Рендеримо глобальні стилі та дошку подій
  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(GlobalStyle, { key: "g" }),
      React.createElement(PageBoard, { key: "b", events })
    ]
  );
}

export default App;
