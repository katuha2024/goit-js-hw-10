import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
let timerInterval = null; // змінна для збереження інтервалу

const startButton = document.querySelector('.button-start');
const calendarField = document.getElementById('datetime-picker');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

// 1️⃣ Ініціалізація Flatpickr
flatpickr(calendarField, {
  locale: Ukrainian,
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (!selectedDates.length) return;

    const unixDate = selectedDates[0].getTime();

    if (unixDate < Date.now()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Оберіть дату у майбутньому!',
        position: 'topRight',
      });
      startButton.disabled = true;
      return;
    }

    userSelectedDate = unixDate;
    startButton.disabled = false;
    console.log('Вибрана дата:', new Date(userSelectedDate).toLocaleString());
  },
});

// 2️⃣ Обробник кліку по кнопці "Старт"
startButton.addEventListener('click', startCountDown);

function startCountDown() {
  if (!userSelectedDate) {
    iziToast.warning({
      title: 'Увага',
      message: 'Спочатку оберіть дату!',
      position: 'topRight',
    });
    return;
  }

  startButton.disabled = true;
  calendarField.disabled = true;

  clearInterval(timerInterval); // Очищаємо попередній таймер, якщо він був

  timerInterval = setInterval(() => {
    const timeRemaining = userSelectedDate - Date.now();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      iziToast.success({
        title: 'Час вийшов!',
        message: 'Таймер завершено.',
        position: 'topRight',
      });
      calendarField.disabled = false;
      return;
    }

    updateTimerDisplay(timeRemaining);
  }, 1000);
}

// 3️⃣ Функція оновлення таймера на екрані
function updateTimerDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

// 4️⃣ Допоміжні функції
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
