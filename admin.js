// Admin System
const OWNERSHIP_KEY = "Asura_James_2025";
let isOwner = localStorage.getItem('isOwner') === 'true';
let typedText = '';

// Admin commands
const ADMIN_COMMANDS = {
    '/RemoveAdmin': removeAdminAccess,
    '/Remove-All-Admin': removeAllAdminAccess,
    '/Set-Key-Valid-Cooldown-Reset': resetKeyCooldown,
    '/SET-0-COOLDOWN': setZeroCooldown
};

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
    verifyOwnership();
    setupLogoPopup();
    setupAdminCommands();
});

// Logo popup functionality
function setupLogoPopup() {
    const logoBtn = document.getElementById('logoBtn');
    const logoPopup = document.getElementById('logoPopup');
    const closePopup = document.getElementById('closePopup');

    logoBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        logoPopup.classList.add('active');
    });

    closePopup.addEventListener('click', function() {
        logoPopup.classList.remove('active');
    });

    logoPopup.addEventListener('click', function(e) {
        if (e.target === logoPopup) {
            logoPopup.classList.remove('active');
        }
    });

    // Setup website buttons
    document.getElementById('website1').addEventListener('click', function() {
        openWebsite('https://example1.com');
    });
    
    document.getElementById('website2').addEventListener('click', function() {
        openWebsite('https://example2.com');
    });
    
    document.getElementById('website3').addEventListener('click', function() {
        openWebsite('https://example3.com');
    });
}

function openWebsite(url) {
    window.open(url, '_blank');
}

// Admin command system
function setupAdminCommands() {
    document.addEventListener('keydown', function(e) {
        if (e.key.length === 1 && e.key.match(/[a-zA-Z_0-9\/\-]/)) {
            typedText += e.key;
            
            // Check for ownership key
            if (typedText.includes(OWNERSHIP_KEY)) {
                activateOwnership();
                typedText = '';
            }
            
            // Check for admin commands
            for (const [command, action] of Object.entries(ADMIN_COMMANDS)) {
                if (typedText.includes(command)) {
                    action();
                    typedText = '';
                    break;
                }
            }
            
            // Limit the length to prevent memory issues
            if (typedText.length > 50) {
                typedText = typedText.slice(-50);
            }
        }
    });
}

// Ownership functions
function verifyOwnership() {
    const storedKey = localStorage.getItem('ownershipKey');
    if (storedKey === OWNERSHIP_KEY) {
        isOwner = true;
        localStorage.setItem('isOwner', 'true');
        return true;
    }
    return false;
}

function activateOwnership() {
    localStorage.setItem('ownershipKey', OWNERSHIP_KEY);
    localStorage.setItem('isOwner', 'true');
    isOwner = true;
    showAccessMessage();
    return true;
}

function removeAdminAccess() {
    if (isOwner) {
        localStorage.removeItem('ownershipKey');
        localStorage.removeItem('isOwner');
        isOwner = false;
        showAdminMessage('ADMIN ACCESS REMOVED!', 'rgba(255, 0, 0, 0.9)');
    }
}

function removeAllAdminAccess() {
    if (isOwner) {
        // Remove all admin-related data
        localStorage.removeItem('ownershipKey');
        localStorage.removeItem('isOwner');
        localStorage.removeItem('userIP');
        
        // Also clear any special IP settings
        const specialIPs = ['210.23.161.56', '2001:4454:3a4:ca00:28c7:3c7a:a0a1:dccd'];
        localStorage.removeItem('specialIPs');
        
        isOwner = false;
        showAdminMessage('ALL ADMIN ACCESS COMPLETELY REMOVED!', 'rgba(255, 50, 50, 0.9)');
    }
}

function resetKeyCooldown() {
    if (isOwner) {
        // Set last generated time to current time (key is fresh)
        localStorage.setItem('lastGeneratedTime', new Date().getTime());
        
        // Reset cooldown flags
        localStorage.setItem('refreshAfterCooldown', 'false');
        
        // Clear any existing timer
        const cooldownTimer = document.getElementById('cooldownTimer');
        if (cooldownTimer) {
            cooldownTimer.style.display = 'none';
        }
        
        // Update the status message
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = 'Key cooldown reset! Your key is now valid.';
        }
        
        // Update the key display to show it's fresh
        const keyDisplay = document.getElementById('keyDisplay');
        if (keyDisplay && localStorage.getItem('currentKey')) {
            keyDisplay.textContent = localStorage.getItem('currentKey');
            keyDisplay.classList.add('key-generation-effect');
            setTimeout(() => {
                keyDisplay.classList.remove('key-generation-effect');
            }, 1000);
        }
        
        showAdminMessage('KEY COOLDOWN RESET! Key is now valid.', 'rgba(0, 255, 0, 0.9)');
        
        // Refresh the cooldown timer display
        if (window.startCooldownTimer) {
            window.startCooldownTimer(60 * 60 * 1000); // Reset to 1 hour
        }
    }
}

// NEW COMMAND: SET-0-COOLDOWN
function setZeroCooldown() {
    if (isOwner) {
        // Reset cooldown to zero (make key immediately valid)
        localStorage.setItem('lastGeneratedTime', new Date().getTime());
        
        // Set a flag to indicate zero cooldown
        localStorage.setItem('zeroCooldownActive', 'true');
        
        // Clear any existing timer
        const cooldownTimer = document.getElementById('cooldownTimer');
        if (cooldownTimer) {
            cooldownTimer.style.display = 'none';
        }
        
        // Update the status message
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = 'Zero cooldown activated! Key is permanently valid.';
        }
        
        // Generate a new key immediately
        generateNewKeyAndRedirect();
        
        showAdminMessage('ZERO COOLDOWN ACTIVATED! New key generated and valid.', 'rgba(0, 200, 255, 0.9)');
    }
}

// Function to generate new key and redirect to loot-link
function generateNewKeyAndRedirect() {
    // Generate a fresh key
    const isSpecial = checkSpecialIP();
    const randomPart = generateRandomString(12);
    const specialNumbers = generateSpecialNumbers(3);
    const newKey = `KEY-ASURA-${randomPart}-${specialNumbers}`;
    
    // Store the new key with current timestamp
    localStorage.setItem('currentKey', newKey);
    localStorage.setItem('lastGeneratedTime', new Date().getTime());
    
    // Update the display
    const keyDisplay = document.getElementById('keyDisplay');
    const copyBtn = document.getElementById('copyBtn');
    
    if (keyDisplay) {
        keyDisplay.textContent = newKey;
        keyDisplay.classList.add('key-generation-effect');
        setTimeout(() => {
            keyDisplay.classList.remove('key-generation-effect');
        }, 1000);
    }
    
    if (copyBtn) {
        copyBtn.classList.add('show');
    }
    
    // Redirect to loot-link after a short delay to show the new key
    setTimeout(() => {
        window.location.href = 'https://loot-link.com/s?M0hGE55R';
    }, 2000);
}

// Helper function to check special IP (reuse from script.js)
function checkSpecialIP() {
    const specialIPs = ['210.23.161.56', '2001:4454:3a4:ca00:28c7:3c7a:a0a1:dccd'];
    const storedIP = localStorage.getItem('userIP');
    return storedIP && specialIPs.includes(storedIP);
}

// Helper function to generate random string (reuse from script.js)
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Helper function to generate special numbers (reuse from script.js)
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

function showAccessMessage() {
    const message = document.getElementById('accessMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

function showAdminMessage(text, backgroundColor = 'rgba(0, 255, 0, 0.9)') {
    const message = document.getElementById('accessMessage');
    const originalText = message.textContent;
    const originalBackground = message.style.background;
    
    message.style.background = backgroundColor;
    message.textContent = text;
    message.classList.add('show');
    
    setTimeout(() => {
        message.classList.remove('show');
        // Reset to original message
        setTimeout(() => {
            message.style.background = originalBackground;
            message.textContent = originalText;
        }, 500);
    }, 3000);
}

function showRemoveAdminMessage() {
    const message = document.getElementById('accessMessage');
    message.style.background = 'rgba(255, 0, 0, 0.9)';
    message.textContent = 'ADMIN ACCESS REMOVED!';
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
        // Reset to original message
        setTimeout(() => {
            message.style.background = '';
            message.textContent = 'ACCESS GRANTED: Owner privileges activated!';
        }, 500);
    }, 3000);
}
