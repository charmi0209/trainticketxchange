// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupSellTicketButton();
    setupSmoothScrolling();
    addAccessibilityFeatures();
}

// Navigation functionality
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                // Reset hamburger icon
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                // Reset hamburger icon
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            }
        });
    }
}

// Sell ticket button functionality
function setupSellTicketButton() {
    const sellTicketBtn = document.getElementById('sellTicketBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    if (sellTicketBtn) {
        sellTicketBtn.addEventListener('click', function() {
            showSellTicketModal();
        });
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showLoginModal();
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add accessibility features
function addAccessibilityFeatures() {
    // Add keyboard navigation support
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.tagName === 'BUTTON' || this.tagName === 'A') {
                    e.preventDefault();
                    this.click();
                }
            }
        });
    });
    
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
        *:focus {
            outline: 2px solid var(--railway-blue);
            outline-offset: 2px;
        }
        
        .btn:focus {
            box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.3);
        }
    `;
    document.head.appendChild(style);
}

// Modal functionality
function createModal(title, content, actions = []) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: var(--space-lg);
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: var(--space-2xl);
        max-width: 500px;
        width: 100%;
        box-shadow: var(--shadow-xl);
        position: relative;
        animation: modalSlideIn 0.3s ease-out;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    const modalHeader = document.createElement('div');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-xl);
    `;
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;
    modalTitle.style.cssText = `
        font-size: var(--font-size-2xl);
        font-weight: 700;
        color: var(--railway-blue-dark);
        margin: 0;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: var(--font-size-3xl);
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--transition-fast);
    `;
    
    closeButton.addEventListener('click', closeModal);
    closeButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--rail-silver)';
    });
    closeButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    const modalContent = document.createElement('div');
    modalContent.innerHTML = content;
    modalContent.style.cssText = `
        margin-bottom: var(--space-xl);
        line-height: 1.6;
        color: var(--text-secondary);
    `;
    
    const modalActions = document.createElement('div');
    modalActions.style.cssText = `
        display: flex;
        gap: var(--space-md);
        justify-content: flex-end;
    `;
    
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = `btn ${action.class || 'btn-secondary'}`;
        button.textContent = action.text;
        button.addEventListener('click', action.handler);
        modalActions.appendChild(button);
    });
    
    modal.appendChild(modalHeader);
    modal.appendChild(modalContent);
    modal.appendChild(modalActions);
    modalOverlay.appendChild(modal);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    document.body.appendChild(modalOverlay);
    
    function closeModal() {
        modalOverlay.style.animation = 'modalSlideOut 0.3s ease-in';
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            to {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

function showSellTicketModal() {
    const content = `
        <p>Ready to sell your train ticket? Our platform makes it easy and secure.</p>
        <div style="
            background: var(--bg-accent);
            padding: var(--space-lg);
            border-radius: var(--radius-lg);
            margin: var(--space-lg) 0;
        ">
            <h4 style="
                color: var(--railway-blue-dark);
                margin-bottom: var(--space-sm);
                font-size: var(--font-size-lg);
            ">What you'll need:</h4>
            <ul style="
                margin: 0;
                padding-left: var(--space-lg);
                color: var(--text-secondary);
            ">
                <li>Your ticket details (route, time, class)</li>
                <li>Original purchase price</li>
                <li>Your selling price</li>
                <li>A valid email address</li>
            </ul>
        </div>
        <p>The listing process takes just 2 minutes, and we'll help you find buyers quickly!</p>
    `;
    
    const actions = [
        {
            text: 'Get Started',
            class: 'btn-primary',
            handler: () => {
                alert('In a real app, this would open the ticket listing form!');
            }
        },
        {
            text: 'Learn More',
            class: 'btn-secondary',
            handler: () => {
                alert('In a real app, this would show more information about selling tickets.');
            }
        }
    ];
    
    createModal('Sell Your Train Ticket', content, actions);
}

function showLoginModal() {
    const content = `
        <p>Sign in to your account to buy tickets, manage your listings, and track your savings.</p>
        <form style="margin: var(--space-lg) 0;">
            <div style="margin-bottom: var(--space-md);">
                <label style="
                    display: block;
                    font-weight: 600;
                    margin-bottom: var(--space-sm);
                    color: var(--text-primary);
                ">Email Address</label>
                <input type="email" placeholder="Enter your email" style="
                    width: 100%;
                    padding: var(--space-md);
                    border: 2px solid var(--rail-silver);
                    border-radius: var(--radius-md);
                    font-size: var(--font-size-base);
                ">
            </div>
            <div style="margin-bottom: var(--space-lg);">
                <label style="
                    display: block;
                    font-weight: 600;
                    margin-bottom: var(--space-sm);
                    color: var(--text-primary);
                ">Password</label>
                <input type="password" placeholder="Enter your password" style="
                    width: 100%;
                    padding: var(--space-md);
                    border: 2px solid var(--rail-silver);
                    border-radius: var(--radius-md);
                    font-size: var(--font-size-base);
                ">
            </div>
        </form>
        <p style="text-align: center; margin-top: var(--space-lg);">
            <a href="#" style="color: var(--railway-blue); text-decoration: none;">
                Don't have an account? Sign up here
            </a>
        </p>
    `;
    
    const actions = [
        {
            text: 'Sign In',
            class: 'btn-primary',
            handler: () => {
                alert('In a real app, this would authenticate the user!');
            }
        },
        {
            text: 'Forgot Password',
            class: 'btn-secondary',
            handler: () => {
                alert('In a real app, this would open password recovery.');
            }
        }
    ];
    
    createModal('Sign In', content, actions);
}

// Add loading states
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
    }
}

function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
    }
}

// Error handling
function showError(message, container) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: var(--railway-red);
        color: var(--text-white);
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin: var(--space-md) 0;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    `;
    errorDiv.innerHTML = `
        <span>⚠️</span>
        <span>${message}</span>
        <button style="
            margin-left: auto;
            background: none;
            border: none;
            color: var(--text-white);
            cursor: pointer;
            font-size: var(--font-size-lg);
            padding: 0;
        " onclick="this.parentElement.remove()">×</button>
    `;
    
    if (container) {
        container.appendChild(errorDiv);
    } else {
        document.body.appendChild(errorDiv);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Success messages
function showSuccess(message, container) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        background: var(--railway-green);
        color: var(--text-white);
        padding: var(--space-md);
        border-radius: var(--radius-md);
        margin: var(--space-md) 0;
        display: flex;
        align-items: center;
        gap: var(--space-sm);
    `;
    successDiv.innerHTML = `
        <span>✅</span>
        <span>${message}</span>
        <button style="
            margin-left: auto;
            background: none;
            border: none;
            color: var(--text-white);
            cursor: pointer;
            font-size: var(--font-size-lg);
            padding: 0;
        " onclick="this.parentElement.remove()">×</button>
    `;
    
    if (container) {
        container.appendChild(successDiv);
    } else {
        document.body.appendChild(successDiv);
    }
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 3000);
}