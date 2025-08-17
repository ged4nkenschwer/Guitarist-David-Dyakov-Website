// Calendar Component for David Dyakov's Website
class ElegantCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [
            {
                date: '2024-12-15',
                title: 'Solo Recital - Bach & Spanish Masters',
                location: 'Kölner Philharmonie, Cologne',
                time: '19:30',
                description: 'An evening of Baroque elegance and Spanish passion'
            },
            {
                date: '2024-12-22',
                title: 'Duo Abendstern - Christmas Concert',
                location: 'Schlosskonzerte, Munich',
                time: '20:00',
                description: 'Festive program with flute and guitar'
            },
            {
                date: '2025-01-10',
                title: 'Masterclass - Advanced Technique',
                location: 'Musikhochschule, Berlin',
                time: '14:00',
                description: 'Intensive workshop for advanced students'
            },
            {
                date: '2025-01-25',
                title: 'Chamber Music Evening',
                location: 'Rheingau Musikfestival, Wiesbaden',
                time: '19:00',
                description: 'Collaborative performance with string quartet'
            },
            {
                date: '2025-02-08',
                title: 'Solo Recital - Romantic Repertoire',
                location: 'Konzerthaus, Vienna',
                time: '20:30',
                description: 'Works by Sor, Tarrega, and contemporary composers'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderCalendar();
        this.renderEvents();
        this.updateLanguage();
    }
    
    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        // Language switcher integration
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => this.updateLanguage(), 100);
            });
        });
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update title
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthNamesDE = [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ];
        
        const currentLang = document.querySelector('.lang-btn.active').textContent.toLowerCase();
        const title = currentLang === 'de' 
            ? `${monthNamesDE[month]} ${year}`
            : `${monthNames[month]} ${year}`;
        
        document.getElementById('calendarTitle').textContent = title;
        
        // Generate calendar days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();
            
            // Check if it's today
            if (currentDate.getTime() === today.getTime()) {
                dayElement.classList.add('today');
            }
            
            // Check if it's from another month
            if (currentDate.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            // Check if it has events
            const dateString = currentDate.toISOString().split('T')[0];
            const hasEvents = this.events.some(event => event.date === dateString);
            if (hasEvents) {
                dayElement.classList.add('has-event');
            }
            
            // Add click event
            dayElement.addEventListener('click', () => {
                this.selectDate(currentDate);
            });
            
            // Add hover animation
            dayElement.addEventListener('mouseenter', () => {
                anime({
                    targets: dayElement,
                    scale: 1.1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            dayElement.addEventListener('mouseleave', () => {
                anime({
                    targets: dayElement,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            calendarDays.appendChild(dayElement);
        }
        
        // Animate calendar appearance
        anime({
            targets: '.calendar-day',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(20),
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
    
    renderEvents() {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        // Sort events by date
        const sortedEvents = this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        sortedEvents.forEach((event, index) => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            const eventDate = new Date(event.date);
            const dateOptions = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            
            const currentLang = document.querySelector('.lang-btn.active').textContent.toLowerCase();
            const locale = currentLang === 'de' ? 'de-DE' : 'en-US';
            
            eventElement.innerHTML = `
                <div class="event-date">${eventDate.toLocaleDateString(locale, dateOptions)}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-location">${event.location}</div>
                <div class="event-time">${event.time} - ${event.description}</div>
            `;
            
            // Add hover animation
            eventElement.addEventListener('mouseenter', () => {
                anime({
                    targets: eventElement,
                    translateX: 10,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            
            eventElement.addEventListener('mouseleave', () => {
                anime({
                    targets: eventElement,
                    translateX: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            
            eventsList.appendChild(eventElement);
        });
        
        // Animate events appearance
        anime({
            targets: '.event-item',
            opacity: [0, 1],
            translateX: [-30, 0],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
    
    selectDate(date) {
        this.selectedDate = date;
        
        // Highlight selected date
        const allDays = document.querySelectorAll('.calendar-day');
        allDays.forEach(day => day.classList.remove('selected'));
        
        const selectedDay = Array.from(allDays).find(day => {
            const dayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), parseInt(day.textContent));
            return dayDate.getTime() === date.getTime();
        });
        
        if (selectedDay) {
            selectedDay.classList.add('selected');
            
            // Animate selection
            anime({
                targets: selectedDay,
                scale: [1, 1.2, 1.1],
                duration: 400,
                easing: 'easeOutElastic(1, 0.8)'
            });
        }
        
        // Filter events for selected date
        this.filterEventsForDate(date);
    }
    
    filterEventsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        const filteredEvents = this.events.filter(event => event.date === dateString);
        
        // Update events list to show only events for selected date
        if (filteredEvents.length > 0) {
            this.renderFilteredEvents(filteredEvents);
        } else {
            this.renderEvents(); // Show all events if no events for selected date
        }
    }
    
    renderFilteredEvents(filteredEvents) {
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        
        filteredEvents.forEach((event, index) => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            const eventDate = new Date(event.date);
            const currentLang = document.querySelector('.lang-btn.active').textContent.toLowerCase();
            const locale = currentLang === 'de' ? 'de-DE' : 'en-US';
            
            eventElement.innerHTML = `
                <div class="event-date">${eventDate.toLocaleDateString(locale, { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-location">${event.location}</div>
                <div class="event-time">${event.time} - ${event.description}</div>
            `;
            
            eventsList.appendChild(eventElement);
        });
        
        // Animate filtered events
        anime({
            targets: '.event-item',
            opacity: [0, 1],
            translateX: [-30, 0],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
    
    updateLanguage() {
        // Update weekday labels
        const weekdays = document.querySelectorAll('.weekday');
        const currentLang = document.querySelector('.lang-btn.active').textContent.toLowerCase();
        
        weekdays.forEach(day => {
            const enText = day.getAttribute('data-en');
            const deText = day.getAttribute('data-de');
            day.textContent = currentLang === 'de' ? deText : enText;
        });
        
        // Update events section title
        const eventsTitle = document.querySelector('.calendar-events h4');
        const titleEn = eventsTitle.getAttribute('data-en');
        const titleDe = eventsTitle.getAttribute('data-de');
        eventsTitle.textContent = currentLang === 'de' ? titleDe : titleEn;
        
        // Re-render calendar and events with new language
        this.renderCalendar();
        this.renderEvents();
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ElegantCalendar();
}); 