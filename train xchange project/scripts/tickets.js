// Sample ticket data
const sampleTickets = [
    {
        id: 1,
        from: "London Paddington",
        to: "Bath Spa",
        date: "2024-08-25",
        time: "09:15",
        duration: "1h 35m",
        originalPrice: 89.50,
        price: 65.00,
        class: "Standard",
        type: "Off-Peak",
        seller: {
            name: "Sarah M.",
            rating: 4.8,
            avatar: "S"
        },
        flexible: true
    },
    {
        id: 2,
        from: "Manchester Piccadilly",
        to: "London Euston",
        date: "2024-08-26",
        time: "14:30",
        duration: "2h 15m",
        originalPrice: 156.00,
        price: 120.00,
        class: "First Class",
        type: "Advance",
        seller: {
            name: "James L.",
            rating: 4.9,
            avatar: "J"
        },
        flexible: false
    },
    {
        id: 3,
        from: "Edinburgh Waverley",
        to: "London King's Cross",
        date: "2024-08-27",
        time: "11:00",
        duration: "4h 30m",
        originalPrice: 198.50,
        price: 145.00,
        class: "Standard",
        type: "Off-Peak",
        seller: {
            name: "Emma W.",
            rating: 4.7,
            avatar: "E"
        },
        flexible: true
    },
    {
        id: 4,
        from: "Birmingham New Street",
        to: "London Euston",
        date: "2024-08-25",
        time: "16:45",
        duration: "1h 25m",
        originalPrice: 78.00,
        price: 55.00,
        class: "Standard",
        type: "Advance",
        seller: {
            name: "David R.",
            rating: 4.6,
            avatar: "D"
        },
        flexible: false
    },
    {
        id: 5,
        from: "Liverpool Lime Street",
        to: "London Euston",
        date: "2024-08-28",
        time: "08:30",
        duration: "2h 35m",
        originalPrice: 134.50,
        price: 98.00,
        class: "Standard",
        type: "Off-Peak",
        seller: {
            name: "Rachel K.",
            rating: 4.9,
            avatar: "R"
        },
        flexible: true
    },
    {
        id: 6,
        from: "Bristol Temple Meads",
        to: "London Paddington",
        date: "2024-08-29",
        time: "13:20",
        duration: "1h 50m",
        originalPrice: 98.00,
        price: 72.00,
        class: "Standard",
        type: "Off-Peak",
        seller: {
            name: "Michael T.",
            rating: 4.8,
            avatar: "M"
        },
        flexible: true
    }
];

// Get all tickets
function getAllTickets() {
    return sampleTickets;
}

// Filter tickets based on search criteria
function filterTickets(criteria) {
    return sampleTickets.filter(ticket => {
        const matchFrom = !criteria.from || 
            ticket.from.toLowerCase().includes(criteria.from.toLowerCase());
        const matchTo = !criteria.to || 
            ticket.to.toLowerCase().includes(criteria.to.toLowerCase());
        const matchDate = !criteria.date || ticket.date === criteria.date;
        const matchPrice = !criteria.maxPrice || ticket.price <= criteria.maxPrice;
        
        return matchFrom && matchTo && matchDate && matchPrice;
    });
}

// Sort tickets
function sortTickets(tickets, sortBy) {
    const sorted = [...tickets];
    
    switch (sortBy) {
        case 'price':
            return sorted.sort((a, b) => a.price - b.price);
        case 'time':
            return sorted.sort((a, b) => a.time.localeCompare(b.time));
        case 'date':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        default:
            return sorted;
    }
}

// Format price
function formatPrice(price) {
    return `£${price.toFixed(2)}`;
}

// Format date
function formatDate(dateString) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}

// Calculate savings
function calculateSavings(originalPrice, salePrice) {
    const savings = originalPrice - salePrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    return { amount: savings, percentage };
}

// Create ticket card HTML
function createTicketCard(ticket) {
    const savings = calculateSavings(ticket.originalPrice, ticket.price);
    
    return `
        <div class="ticket-card" data-ticket-id="${ticket.id}">
            <div class="ticket-header">
                <div class="route-info">
                    <div class="route">
                        ${ticket.from} <span class="route-arrow">→</span> ${ticket.to}
                    </div>
                    <div class="journey-details">
                        ${formatDate(ticket.date)} • ${ticket.time} • ${ticket.duration}
                    </div>
                </div>
                <div class="price-tag">
                    ${formatPrice(ticket.price)}
                </div>
            </div>
            
            <div class="ticket-details">
                <div class="detail-item">
                    <span class="detail-label">Class</span>
                    <span class="detail-value">${ticket.class}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">${ticket.type}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Original Price</span>
                    <span class="detail-value">${formatPrice(ticket.originalPrice)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">You Save</span>
                    <span class="detail-value" style="color: var(--railway-green)">
                        ${formatPrice(savings.amount)} (${savings.percentage}%)
                    </span>
                </div>
            </div>
            
            <div class="seller-info">
                <div class="seller-avatar">${ticket.seller.avatar}</div>
                <div class="seller-details">
                    <div class="seller-name">${ticket.seller.name}</div>
                    <div class="seller-rating">
                        ${'★'.repeat(Math.floor(ticket.seller.rating))} ${ticket.seller.rating}
                    </div>
                </div>
                ${ticket.flexible ? '<span style="color: var(--railway-green); font-size: var(--font-size-xs); font-weight: 600;">Flexible</span>' : ''}
            </div>
            
            <button class="btn btn-primary" style="width: 100%" onclick="selectTicket(${ticket.id})">
                <span class="btn-icon">🎫</span>
                Buy This Ticket
            </button>
        </div>
    `;
}

// Select ticket (placeholder function)
function selectTicket(ticketId) {
    const ticket = sampleTickets.find(t => t.id === ticketId);
    if (ticket) {
        alert(`You selected the ticket from ${ticket.from} to ${ticket.to} for ${formatPrice(ticket.price)}.\n\nIn a real app, this would open the purchase flow.`);
    }
}