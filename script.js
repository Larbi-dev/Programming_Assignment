// Messages for the story
const messages = [
  "Hi Mimi 🌸",
  "I don't know exactly when it started…",
  "but somehow, you slowly became my favorite thought.",
  "In the quiet moments.",
  "In the random ones too.",
  "Sometimes I catch myself smiling for no reason.",
  "And then I realize…",
  "it's you.",
  "Your smile has a way of staying with me.",
  "Your laugh feels like something I want to hear again and again.",
  "You make ordinary moments feel a little softer.",
  "So instead of sending a long message…",
  "I wanted to do something a bit more special.",
  "Something that shows how I feel.",
  "<span class='highlight'>Mimi</span>, will you be my Valentine? ❤️"
];

// DOM Elements
const messageContainer = document.getElementById('message-container');
const actions = document.getElementById('actions');
const response = document.getElementById('response');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnRestart = document.getElementById('btn-restart');
const heartsBg = document.getElementById('hearts-bg');
const floatingHearts = document.getElementById('floating-hearts');

// State variables
let currentMessageIndex = 0;
let isNoButtonActive = true;
let mouseX = 0;
let mouseY = 0;
let isMouseInArea = false;
let dodgeInterval = null;

// Initialize the page
function init() {
    createBackgroundHearts();
    startMessageDisplay();
    
    // Track mouse position
    document.addEventListener('mousemove', handleMouseMove);
    
    // Add occasional random floating hearts
    setInterval(() => {
        if (Math.random() > 0.6) {
            createFloatingHearts(1);
        }
    }, 4000);
}

// Create background hearts
function createBackgroundHearts() {
    const heartCount = 25;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        // Random properties
        const left = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = 15 + Math.random() * 15;
        const size = 18 + Math.random() * 20;
        
        heart.style.left = `${left}%`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.fontSize = `${size}px`;
        
        heartsBg.appendChild(heart);
    }
}

// Create floating hearts for celebration
function createFloatingHearts(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            // Random properties
            const left = Math.random() * 100;
            const delay = Math.random();
            const duration = 4 + Math.random() * 3;
            const size = 20 + Math.random() * 35;
            
            heart.style.left = `${left}%`;
            heart.style.animationDelay = `${delay}s`;
            heart.style.animationDuration = `${duration}s`;
            heart.style.fontSize = `${size}px`;
            
            floatingHearts.appendChild(heart);
            
            // Remove after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, (duration + delay) * 1000);
        }, i * 150);
    }
}

// Track mouse movement
function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    
    // Check if mouse is in actions area
    const actionsRect = actions.getBoundingClientRect();
    isMouseInArea = (
        mouseX >= actionsRect.left &&
        mouseX <= actionsRect.right &&
        mouseY >= actionsRect.top &&
        mouseY <= actionsRect.bottom
    );
}

// Display messages one by one
function startMessageDisplay() {
    if (currentMessageIndex < messages.length) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = messages[currentMessageIndex];
        
        messageContainer.appendChild(messageDiv);
        
        // Trigger animation
        setTimeout(() => {
            messageDiv.classList.add('visible');
        }, 50);
        
        currentMessageIndex++;
        
        // Set delay for next message
        let delay = 2200;
        
        // Longer delays for dramatic effect
        if (currentMessageIndex === 1 || currentMessageIndex === 7 || currentMessageIndex === messages.length) {
            delay = 3200;
        }
        
        // Schedule next message or show buttons
        if (currentMessageIndex < messages.length) {
            setTimeout(startMessageDisplay, delay);
        } else {
            setTimeout(showButtons, 1500);
        }
    }
}

// Show action buttons
function showButtons() {
    actions.classList.remove('hidden');
    setupButtonListeners();
    startLightningDodge();
}

// Set up button event listeners
function setupButtonListeners() {
    // Yes button
    btnYes.addEventListener('click', handleYesClick);
    
    // No button - CANNOT BE CLICKED!
    btnNo.style.pointerEvents = 'none';
    btnNo.style.cursor = 'not-allowed';
    
    // Restart button
    btnRestart.addEventListener('click', handleRestart);
}

// Start lightning-fast dodging
function startLightningDodge() {
    if (dodgeInterval) {
        clearInterval(dodgeInterval);
    }
    
    // Position No button randomly at start
    teleportButton();
    
    // Start ultra-fast repulsion (every 16ms ≈ 60fps)
    dodgeInterval = setInterval(repelFromMouse, 16);
}

// Teleport button to random position
function teleportButton() {
    const actionsRect = actions.getBoundingClientRect();
    const buttonRect = btnNo.getBoundingClientRect();
    
    const maxX = actionsRect.width - buttonRect.width - 10;
    const maxY = actionsRect.height - buttonRect.height - 10;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    // Lightning escape animation
    btnNo.classList.add('lightning-escape');
    setTimeout(() => btnNo.classList.remove('lightning-escape'), 150);
    
    // Instantly teleport
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
}

// Repel button from mouse with lightning speed
function repelFromMouse() {
    if (!isNoButtonActive || !isMouseInArea) return;
    
    const buttonRect = btnNo.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    
    // Calculate button center
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    // Calculate distance from mouse to button
    const distanceX = mouseX - buttonCenterX;
    const distanceY = mouseY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // HUGE repulsion field - button moves away from far away
    const repulsionRadius = 300; // pixels
    const maxRepulsionForce = 25; // pixels per frame - EXTREMELY FAST
    
    if (distance < repulsionRadius) {
        // Calculate repulsion force (exponential - much stronger when closer)
        const repulsionForce = maxRepulsionForce * Math.pow((1 - (distance / repulsionRadius)), 3);
        
        // Calculate repulsion direction (away from mouse)
        const repulsionX = -distanceX / distance * repulsionForce;
        const repulsionY = -distanceY / distance * repulsionForce;
        
        // Get current position
        const currentLeft = parseFloat(btnNo.style.left) || 0;
        const currentTop = parseFloat(btnNo.style.top) || 0;
        
        // Calculate new position with momentum
        let newX = currentLeft + repulsionX;
        let newY = currentTop + repulsionY;
        
        // Keep within bounds with very small padding
        const padding = 3;
        const maxX = actionsRect.width - buttonRect.width - padding;
        const maxY = actionsRect.height - buttonRect.height - padding;
        
        newX = Math.max(padding, Math.min(newX, maxX));
        newY = Math.max(padding, Math.min(newY, maxY));
        
        // Apply new position INSTANTLY
        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
        
        // Add speed lines when moving fast
        if (repulsionForce > 5) {
            btnNo.classList.add('moving');
        } else {
            btnNo.classList.remove('moving');
        }
        
        // Add danger warning when very close
        if (distance < 60) {
            btnNo.classList.add('danger-close');
            // Add escape blur effect
            btnNo.classList.add('escaping');
            setTimeout(() => btnNo.classList.remove('escaping'), 200);
            
            // HIGH chance of teleport when extremely close
            if (distance < 40 && Math.random() > 0.90) { // 10% chance when very close
                teleportButton();
            }
        } else {
            btnNo.classList.remove('danger-close');
        }
    } else {
        btnNo.classList.remove('moving', 'danger-close');
    }
    
    // Add random teleportation occasionally
    if (distance < 150 && Math.random() > 0.995) { // 0.5% chance when moderately close
        teleportButton();
    }
    
    // Make button jitter slightly even when not in danger (feels alive)
    if (distance > 200 && Math.random() > 0.99) {
        const currentLeft = parseFloat(btnNo.style.left) || 0;
        const currentTop = parseFloat(btnNo.style.top) || 0;
        
        const jitterX = currentLeft + (Math.random() - 0.5) * 10;
        const jitterY = currentTop + (Math.random() - 0.5) * 10;
        
        const actionsRect = actions.getBoundingClientRect();
        const buttonRect = btnNo.getBoundingClientRect();
        const padding = 3;
        const maxX = actionsRect.width - buttonRect.width - padding;
        const maxY = actionsRect.height - buttonRect.height - padding;
        
        const safeX = Math.max(padding, Math.min(jitterX, maxX));
        const safeY = Math.max(padding, Math.min(jitterY, maxY));
        
        btnNo.style.left = `${safeX}px`;
        btnNo.style.top = `${safeY}px`;
    }
}

// Handle Yes button click
function handleYesClick() {
    // Clear repulsion interval
    if (dodgeInterval) {
        clearInterval(dodgeInterval);
        dodgeInterval = null;
    }
    
    actions.classList.add('hidden');
    response.classList.remove('hidden');
    
    // Celebration hearts
    createFloatingHearts(40);
    
    // More hearts after delays
    setTimeout(() => createFloatingHearts(25), 400);
    setTimeout(() => createFloatingHearts(20), 800);
    setTimeout(() => createFloatingHearts(15), 1200);
}

// Handle restart
function handleRestart() {
    // Clear messages
    messageContainer.innerHTML = '';
    
    // Hide response, show message container
    response.classList.add('hidden');
    actions.classList.add('hidden');
    
    // Clear repulsion interval
    if (dodgeInterval) {
        clearInterval(dodgeInterval);
        dodgeInterval = null;
    }
    
    // Reset state
    currentMessageIndex = 0;
    isNoButtonActive = true;
    
    // Reset No button
    btnNo.innerHTML = '<i class="fas fa-flower"></i> Maybe later? 🥰';
    btnNo.className = 'btn btn-no';
    btnNo.style.position = 'absolute';
    btnNo.style.left = 'auto';
    btnNo.style.top = 'auto';
    btnNo.style.pointerEvents = 'none';
    btnNo.style.cursor = 'not-allowed';
    btnNo.classList.remove('moving', 'danger-close', 'escaping', 'lightning-escape');
    
    // Remove all event listeners to avoid duplicates
    btnYes.removeEventListener('click', handleYesClick);
    btnRestart.removeEventListener('click', handleRestart);
    
    // Reattach listeners
    btnYes.addEventListener('click', handleYesClick);
    btnRestart.addEventListener('click', handleRestart);
    
    // Restart message display
    setTimeout(startMessageDisplay, 500);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);