// Search functionality
class TicketSearch {
    constructor() {
        this.currentTickets = getAllTickets();
        this.filters = {
            from: '',
            to: '',
            date: '',
            passengers: 1,
            maxPrice: 500,
            sortBy: 'price'
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setMinDate();
        this.displayTickets(this.currentTickets);
        this.updatePriceDisplay();
    }
    
    bindEvents() {
        // Search form submission
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }
        
        // Sort dropdown
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applySorting();
            });
        }
        
        // Price range slider
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.filters.maxPrice = parseInt(e.target.value);
                this.updatePriceDisplay();
                this.applyFilters();
            });
        }
        
        // Real-time search on input change
        const searchInputs = ['from', 'to', 'date', 'passengers'];
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateFiltersFromForm();
                    this.applyFilters();
                });
            }
        });
    }
    
    setMinDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            dateInput.value = today;
        }
    }
    
    updateFiltersFromForm() {
        const fromInput = document.getElementById('from');
        const toInput = document.getElementById('to');
        const dateInput = document.getElementById('date');
        const passengersInput = document.getElementById('passengers');
        
        if (fromInput) this.filters.from = fromInput.value;
        if (toInput) this.filters.to = toInput.value;
        if (dateInput) this.filters.date = dateInput.value;
        if (passengersInput) this.filters.passengers = parseInt(passengersInput.value);
    }
    
    updatePriceDisplay() {
        const priceValue = document.getElementById('priceValue');
        if (priceValue) {
            priceValue.textContent = `£${this.filters.maxPrice}`;
        }
    }
    
    performSearch() {
        this.updateFiltersFromForm();
        this.applyFilters();
        
        // Smooth scroll to results
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    applyFilters() {
        let filteredTickets = filterTickets(this.filters);
        filteredTickets = sortTickets(filteredTickets, this.filters.sortBy);
        
        this.currentTickets = filteredTickets;
        this.displayTickets(filteredTickets);
    }
    
    applySorting() {
        const sortedTickets = sortTickets(this.currentTickets, this.filters.sortBy);
        this.displayTickets(sortedTickets);
    }
    
    displayTickets(tickets) {
        const ticketsGrid = document.getElementById('ticketsGrid');
        
        if (!ticketsGrid) return;
        
        if (tickets.length === 0) {
            ticketsGrid.innerHTML = this.getNoResultsHTML();
            return;
        }
        
        const ticketsHTML = tickets.map(ticket => createTicketCard(ticket)).join('');
        ticketsGrid.innerHTML = ticketsHTML;
        
        // Add loading animation
        ticketsGrid.style.opacity = '0';
        setTimeout(() => {
            ticketsGrid.style.opacity = '1';
        }, 100);
    }
    
    getNoResultsHTML() {
        return `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--space-3xl);
                color: var(--text-secondary);
            ">
                <div style="font-size: var(--font-size-4xl); margin-bottom: var(--space-lg);">🔍</div>
                <h3 style="
                    font-size: var(--font-size-xl);
                    font-weight: 600;
                    margin-bottom: var(--space-md);
                    color: var(--text-primary);
                ">No tickets found</h3>
                <p style="margin-bottom: var(--space-lg);">
                    Try adjusting your search criteria or check back later for new listings.
                </p>
                <button class="btn btn-primary" onclick="ticketSearch.clearFilters()">
                    Clear Filters
                </button>
            </div>
        `;
    }
    
    clearFilters() {
        // Reset form inputs
        const form = document.getElementById('searchForm');
        if (form) {
            form.reset();
        }
        
        // Reset date to today
        this.setMinDate();
        
        // Reset price range
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = 500;
        }
        
        // Reset filters
        this.filters = {
            from: '',
            to: '',
            date: '',
            passengers: 1,
            maxPrice: 500,
            sortBy: 'price'
        };
        
        // Display all tickets
        this.currentTickets = getAllTickets();
        this.displayTickets(this.currentTickets);
        this.updatePriceDisplay();
    }
}

// Auto-complete functionality for station names
const commonStations = [
    "London Paddington", "London Euston", "London King's Cross", "London Victoria",
    "London Liverpool Street", "London Waterloo", "London Bridge", "London St Pancras",
    "Manchester Piccadilly", "Manchester Airport", "Birmingham New Street",
    "Edinburgh Waverley", "Glasgow Central", "Bristol Temple Meads", "Bath Spa",
    "Liverpool Lime Street", "Leeds", "Sheffield", "Newcastle", "York",
    "Oxford", "Cambridge", "Brighton", "Cardiff Central", "Swansea",
    "Reading", "Slough", "Windsor & Eton Central", "Portsmouth Harbour",
    "Southampton Central", "Bournemouth", "Exeter St Davids", "Plymouth"
];

function setupAutoComplete() {
    const stationInputs = ['from', 'to'];
    
    stationInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length < 2) return;
            
            const matches = commonStations.filter(station =>
                station.toLowerCase().includes(value)
            ).slice(0, 5);
            
            showSuggestions(this, matches);
        });
        
        input.addEventListener('blur', function() {
            setTimeout(() => hideSuggestions(this), 200);
        });
    });
}

function showSuggestions(input, suggestions) {
    hideSuggestions(input);
    
    if (suggestions.length === 0) return;
    
    const suggestionBox = document.createElement('div');
    suggestionBox.className = 'suggestions';
    suggestionBox.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border: 1px solid var(--rail-silver);
        border-top: none;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.textContent = suggestion;
        item.style.cssText = `
            padding: var(--space-md);
            cursor: pointer;
            border-bottom: 1px solid var(--rail-silver);
            transition: var(--transition-fast);
        `;
        
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--bg-accent)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        item.addEventListener('click', function() {
            input.value = suggestion;
            hideSuggestions(input);
            input.focus();
        });
        
        suggestionBox.appendChild(item);
    });
    
    const container = input.parentElement;
    container.style.position = 'relative';
    container.appendChild(suggestionBox);
}

function hideSuggestions(input) {
    const container = input.parentElement;
    const existing = container.querySelector('.suggestions');
    if (existing) {
        existing.remove();
    }
}

// Initialize search functionality when DOM is loaded
let ticketSearch;

document.addEventListener('DOMContentLoaded', function() {
    ticketSearch = new TicketSearch();
    setupAutoComplete();
});