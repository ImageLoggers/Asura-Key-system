// Key System Logic
const specialIPs = [
    '210.23.161.56',
    '2001:4454:3a4:ca00:28c7:3c7a:a0a1:dccd'
];

let currentKey = localStorage.getItem('currentKey') || '';
let lastGeneratedTime = localStorage.getItem('lastGeneratedTime');
let cooldownPeriod = 60 * 60 * 1000; // 1 hour
let isSunnyTheme = localStorage.getItem('isSunnyTheme') === 'true';

// Set initial theme
if (isSunnyTheme) {
    document.body.classList.add('sunny-theme');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i> Galaxy Theme';
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeKeySystem();
    setupEventListeners();
});

function initializeKeySystem() {
    createStars();
    startSpaceDoodles();
    createParticles();
    
    // Add random URL parameters if none exist
    addRandomUrlParameters();
    checkKeyStatus();
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', function(e) {
        e.stopPropagation();
        toggleTheme();
    });
    
    // Copy button
    document.getElementById('copyBtn').addEventListener('click', copyKey);
    
    // Click ripple effect
    document.body.addEventListener('click', function(e) {
        createRipple(e);
    });
}

// Add random URL parameters function
function addRandomUrlParameters() {
    const currentUrl = new URL(window.location.href);
    
    // Only add parameters if the URL is clean (no existing parameters)
    if (currentUrl.search === '') {
        const randomParams = new URLSearchParams();
        
        // Add random parameters
        randomParams.set('user', generateRandomString(10));
        randomParams.set('session', generateRandomString(8));
        randomParams.set('ref', 'asura_key_system');
        randomParams.set('t', Date.now().toString());
        randomParams.set('v', '1.0');
        
        // Create new URL with random parameters
        const newUrl = currentUrl.origin + currentUrl.pathname + '?' + randomParams.toString();
        
        // Update the URL without reloading the page
        window.history.replaceState({}, '', newUrl);
    }
}

// Check key status and display appropriate message
function checkKeyStatus() {
    const keyDisplay = document.getElementById('keyDisplay');
    const statusMessage = document.getElementById('statusMessage');
    const autoGenerationMessage = document.getElementById('autoGenerationMessage');
    const copyBtn = document.getElementById('copyBtn');
    
    // Check if we have an existing key
    if (currentKey) {
        const currentTime = new Date().getTime();
        const timePassed = currentTime - parseInt(lastGeneratedTime);
        
        if (timePassed < cooldownPeriod) {
            // Show existing valid key
            keyDisplay.textContent = currentKey;
            copyBtn.classList.add('show');
            
            const timeLeft = cooldownPeriod - timePassed;
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            statusMessage.textContent = `Your key is valid for: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            autoGenerationMessage.style.display = 'none';
            
            startCooldownTimer(timeLeft);
        } else {
            // Key expired - redirect to loot-link
            redirectToLootLink();
        }
    } else {
        // No key exists - generate new key
        autoGenerateKey();
    }
}

// Auto-generate key function
function autoGenerateKey() {
    const isSpecial = checkSpecialIP();
    const randomPart = generateRandomString(12);
    const specialNumbers = generateSpecialNumbers(3);
    currentKey = `KEY-ASURA-${randomPart}-${specialNumbers}`;
    
    localStorage.setItem('currentKey', currentKey);
    localStorage.setItem('lastGeneratedTime', new Date().getTime());
    
    const keyDisplay = document.getElementById('keyDisplay');
    const statusMessage = document.getElementById('statusMessage');
    const autoGenerationMessage = document.getElementById('autoGenerationMessage');
    const copyBtn = document.getElementById('copyBtn');
    
    keyDisplay.textContent = currentKey;
    keyDisplay.classList.add('key-generation-effect');
    setTimeout(() => {
        keyDisplay.classList.remove('key-generation-effect');
    }, 1000);
    
    copyBtn.classList.add('show');
    statusMessage.textContent = 'Your new key has been generated!';
    autoGenerationMessage.style.display = 'block';
    
    if (!isSpecial) {
        startCooldownTimer(cooldownPeriod);
    } else {
        statusMessage.textContent += ' (No cooldown for special users)';
    }
    
    createParticles();
}

function checkSpecialIP() {
    const storedIP = localStorage.getItem('userIP');
    return storedIP && specialIPs.includes(storedIP);
}

function startCooldownTimer(timeLeft) {
    const cooldownTimer = document.getElementById('cooldownTimer');
    const timerDisplay = document.getElementById('timerDisplay');
    cooldownTimer.style.display = 'block';
    
    const timerInterval = setInterval(() => {
        timeLeft -= 1000;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            cooldownTimer.style.display = 'none';
            document.getElementById('statusMessage').textContent = 'Key expired! Refresh to get new key.';
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function redirectToLootLink() {
    // Clear the current key so when user returns, they get a new one
    localStorage.removeItem('currentKey');
    localStorage.removeItem('lastGeneratedTime');
    
    // Redirect to loot-link
    window.location.href = 'https://loot-link.com/s?M0hGE55R';
}

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateSpecialNumbers(count) {
    const specialNumbers = [];
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
    
    for (let i = 0; i < count; i++) {
        if (Math.random() > 0.5) {
            specialNumbers.push(primes[Math.floor(Math.random() * primes.length)]);
        } else {
            specialNumbers.push(fibonacci[Math.floor(Math.random() * fibonacci.length)]);
        }
    }
    
    return specialNumbers.join('');
}

function copyKey() {
    if (currentKey) {
        navigator.clipboard.writeText(currentKey).then(() => {
            showSuccessMessage();
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = currentKey;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccessMessage();
        });
    }
}

function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

function toggleTheme() {
    isSunnyTheme = !isSunnyTheme;
    localStorage.setItem('isSunnyTheme', isSunnyTheme);
    
    if (isSunnyTheme) {
        document.body.classList.add('sunny-theme');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i> Galaxy Theme';
    } else {
        document.body.classList.remove('sunny-theme');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i> Sunny Theme';
    }
}

// Visual effects functions
function createSpaceDoodle() {
    if (document.body.classList.contains('sunny-theme')) return;
    
    const types = ['moving-planet', 'asteroid', 'satellite'];
    const type = types[Math.floor(Math.random() * types.length)];
    const animations = ['spaceDriftHorizontal', 'spaceDriftVertical', 'spaceDriftDiagonal'];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    
    const doodle = document.createElement('div');
    doodle.className = `space-doodle ${type}`;
    
    if (animation === 'spaceDriftHorizontal') {
        doodle.style.top = Math.random() * 80 + 10 + '%';
        doodle.style.left = '-100px';
    } else if (animation === 'spaceDriftVertical') {
        doodle.style.left = Math.random() * 80 + 10 + '%';
        doodle.style.top = '-100px';
    } else {
        doodle.style.left = '-100px';
        doodle.style.bottom = '-100px';
    }
    
    doodle.style.animation = `${animation} ${15 + Math.random() * 20}s linear`;
    doodle.style.animationDelay = Math.random() * 5 + 's';
    
    document.body.appendChild(doodle);
    
    setTimeout(() => {
        doodle.remove();
    }, 40000);
}

function startSpaceDoodles() {
    setInterval(createSpaceDoodle, 3000);
}

function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

function createParticles() {
    const existingParticles = document.querySelectorAll('.particle');
    existingParticles.forEach(p => p.remove());
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        const duration = Math.random() * 10 + 10;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        document.body.appendChild(particle);
    }
}

function createRipple(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    document.body.appendChild(ripple);
    
    const size = 100;
    const pos = getClickPosition(e, size);
    
    ripple.style.left = pos.x + 'px';
    ripple.style.top = pos.y + 'px';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function getClickPosition(e, size) {
    let x, y;
    
    if (e.clientX && e.clientY) {
        x = e.clientX - (size / 2);
        y = e.clientY - (size / 2);
    } else {
        x = document.body.offsetWidth / 2 - (size / 2);
        y = document.body.offsetHeight / 2 - (size / 2);
    }
    
    return { x, y };
}
