// Admin System
const OWNERSHIP_KEY = "Asura_James_2025";
let isOwner = localStorage.getItem('isOwner') === 'true';
let typedText = '';

// Admin commands
const ADMIN_COMMANDS = {
    '/RemoveAdmin': removeAdminAccess,
    '/Remove-All-Admin': removeAllAdminAccess,
    '/Set-Key-Valid-Cooldown-Reset': resetKeyCooldown
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
