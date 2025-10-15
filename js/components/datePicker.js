const modal = document.getElementById('date-picker-modal');
const dayColumn = document.getElementById('day-column');
const monthColumn = document.getElementById('month-column');
const trigger = document.getElementById('date-picker-trigger');

let selectedDay = null;
let selectedMonth = null;
let onDateSelectedCallback = null;

const months = [
    'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'December'
];

/**
 * Initializes the date picker component.
 * @param {function} onDateSelected - Callback function when a date is confirmed.
 */
export function initDatePicker(onDateSelected) {
    onDateSelectedCallback = onDateSelected;

    // Populate columns
    populateDays();
    populateMonths();

    // Event Listeners
    trigger.addEventListener('click', openDatePicker);
    document.getElementById('date-picker-cancel').addEventListener('click', closeDatePicker);
    document.getElementById('date-picker-ok').addEventListener('click', confirmDateSelection);

    dayColumn.addEventListener('click', handleDaySelection);
    monthColumn.addEventListener('click', handleMonthSelection);

    // Set initial date to today
    const today = new Date();
    selectDay(today.getDate());
    selectMonth(today.getMonth() + 1);
    updateTriggerText();
}

function populateDays() {
    for (let i = 1; i <= 31; i++) {
        const dayItem = document.createElement('div');
        dayItem.className = 'date-picker-item';
        dayItem.dataset.day = i;
        dayItem.textContent = String(i).padStart(2, '0');
        dayColumn.appendChild(dayItem);
    }
}

function populateMonths() {
    months.forEach((month, index) => {
        const monthItem = document.createElement('div');
        monthItem.className = 'date-picker-item';
        monthItem.dataset.month = index + 1;
        monthItem.textContent = `${String(index + 1).padStart(2, '0')} ${month}`;
        monthColumn.appendChild(monthItem);
    });
}

function handleDaySelection(event) {
    if (event.target.classList.contains('date-picker-item')) {
        selectDay(Number(event.target.dataset.day));
    }
}

function handleMonthSelection(event) {
    if (event.target.classList.contains('date-picker-item')) {
        selectMonth(Number(event.target.dataset.month));
    }
}

function selectDay(day) {
    // Deselect previous
    const prevSelected = dayColumn.querySelector('.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    // Select new
    const newSelected = dayColumn.querySelector(`[data-day='${day}']`);
    if (newSelected) newSelected.classList.add('selected');
    selectedDay = day;
}

function selectMonth(month) {
    // Deselect previous
    const prevSelected = monthColumn.querySelector('.selected');
    if (prevSelected) prevSelected.classList.remove('selected');
    // Select new
    const newSelected = monthColumn.querySelector(`[data-month='${month}']`);
    if (newSelected) newSelected.classList.add('selected');
    selectedMonth = month;
}

function openDatePicker() {
    modal.style.display = 'flex';
}

function closeDatePicker() {
    modal.style.display = 'none';
}

function confirmDateSelection() {
    if (selectedDay && selectedMonth) {
        if (onDateSelectedCallback) {
            onDateSelectedCallback({ day: selectedDay, month: selectedMonth });
        }
        updateTriggerText();
        closeDatePicker();
    } else {
        alert('Vælg venligst både dag og måned.');
    }
}

function updateTriggerText() {
    trigger.textContent = `Dato: ${String(selectedDay).padStart(2, '0')}-${String(selectedMonth).padStart(2, '0')}`;
}
