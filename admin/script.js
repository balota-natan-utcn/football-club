// Global variables
let currentUser = null;
let currentSection = 'dashboard';

// API endpoints
const API_BASE = '/api';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupEventListeners();
    loadDashboard();
});

// Authentication check
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            if (user.role !== 'admin') {
                window.location.href = '/admin/login.html';
                return;
            }
            currentUser = user;
        } else {
            window.location.href = '/admin/login.html';
        }
    } catch (error) {
        window.location.href = '/admin/login.html';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            showSection(section);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
}

// Show section
function showSection(sectionName) {
    // Update nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');

    currentSection = sectionName;

    // Load section data
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'players':
            loadPlayers();
            break;
        case 'matches':
            loadMatches();
            break;
        case 'news':
            loadNews();
            break;
        case 'gallery':
            loadGallery();
            break;
        case 'sponsors':
            loadSponsors();
            break;
        case 'contacts':
            loadContacts();
            break;
    }
}

// Logout
async function logout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/admin/login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Dashboard
async function loadDashboard() {
    try {
        const [players, matches, news, gallery] = await Promise.all([
            fetch(`${API_BASE}/players`).then(r => r.json()),
            fetch(`${API_BASE}/matches`).then(r => r.json()),
            fetch(`${API_BASE}/news`).then(r => r.json()),
            fetch(`${API_BASE}/gallery`).then(r => r.json())
        ]);

        document.getElementById('playersCount').textContent = players.length;
        document.getElementById('matchesCount').textContent = matches.length;
        document.getElementById('newsCount').textContent = news.length;
        document.getElementById('galleryCount').textContent = gallery.length;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Players management
async function loadPlayers() {
    try {
        const response = await fetch(`${API_BASE}/players`);
        const players = await response.json();
        
        const tbody = document.querySelector('#playersTable tbody');
        tbody.innerHTML = '';

        players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${player.photo ? 
                        `<img src="${player.photo}" class="player-photo" alt="${player.name}">` :
                        '<div class="player-photo" style="background: #ddd; display: flex; align-items: center; justify-content: center; color: #666;">No Photo</div>'
                    }
                </td>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td>${player.jerseyNumber}</td>
                <td>${player.age}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="editPlayer('${player._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deletePlayer('${player._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

function showPlayerForm(playerId = null) {
    const title = playerId ? 'Edit Player' : 'Add Player';
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="playerForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="playerName">Name</label>
                <input type="text" id="playerName" name="name" required>
            </div>
            <div class="form-group">
                <label for="playerPosition">Position</label>
                <select id="playerPosition" name="position" required>
                    <option value="">Select Position</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                </select>
            </div>
            <div class="form-group">
                <label for="playerJersey">Jersey Number</label>
                <input type="number" id="playerJersey" name="jerseyNumber" min="1" max="99" required>
            </div>
            <div class="form-group">
                <label for="playerAge">Age</label>
                <input type="number" id="playerAge" name="age" min="16" max="50" required>
            </div>
            <div class="form-group">
                <label for="playerHeight">Height</label>
                <input type="text" id="playerHeight" name="height" placeholder="e.g., 180cm">
            </div>
            <div class="form-group">
                <label for="playerWeight">Weight</label>
                <input type="text" id="playerWeight" name="weight" placeholder="e.g., 75kg">
            </div>
            <div class="form-group">
                <label for="playerBio">Bio</label>
                <textarea id="playerBio" name="bio" placeholder="Player biography..."></textarea>
            </div>
            <div class="form-group">
                <label for="playerPhoto">Photo</label>
                <div class="file-input-wrapper">
                    <input type="file" id="playerPhoto" name="photo" accept="image/*">
                    <p>Click to select photo or drag and drop</p>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Player</button>
            </div>
        </form>
    `;

    if (playerId) {
        loadPlayerData(playerId);
    }

    document.getElementById('playerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        savePlayer(playerId);
    });

    showModal();
}

async function loadPlayerData(playerId) {
    try {
        const response = await fetch(`${API_BASE}/players/${playerId}`);
        const player = await response.json();

        document.getElementById('playerName').value = player.name;
        document.getElementById('playerPosition').value = player.position;
        document.getElementById('playerJersey').value = player.jerseyNumber;
        document.getElementById('playerAge').value = player.age;
        document.getElementById('playerHeight').value = player.height || '';
        document.getElementById('playerWeight').value = player.weight || '';
        document.getElementById('playerBio').value = player.bio || '';
    } catch (error) {
        console.error('Error loading player data:', error);
    }
}

async function savePlayer(playerId) {
    try {
        const form = document.getElementById('playerForm');
        const formData = new FormData(form);

        const url = playerId ? `${API_BASE}/players/${playerId}` : `${API_BASE}/players`;
        const method = playerId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            closeModal();
            loadPlayers();
            showSuccess(playerId ? 'Player updated successfully' : 'Player added successfully');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save player');
        }
    } catch (error) {
        console.error('Error saving player:', error);
        showError('Failed to save player');
    }
}

async function editPlayer(playerId) {
    showPlayerForm(playerId);
}

async function deletePlayer(playerId) {
    if (!confirm('Are you sure you want to delete this player?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/players/${playerId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadPlayers();
            showSuccess('Player deleted successfully');
        } else {
            showError('Failed to delete player');
        }
    } catch (error) {
        console.error('Error deleting player:', error);
        showError('Failed to delete player');
    }
}

// Modal functions
function showModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Message functions
function showSuccess(message) {
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const main = document.querySelector('.admin-main');
    main.insertBefore(successDiv, main.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const main = document.querySelector('.admin-main');
    main.insertBefore(errorDiv, main.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Placeholder functions for other sections
async function loadMatches() {
    // Similar implementation for matches
    console.log('Loading matches...');
}

function showMatchForm(matchId = null) {
    // Similar implementation for match form
    console.log('Show match form');
}

async function loadNews() {
    // Similar implementation for news
    console.log('Loading news...');
}

function showNewsForm(newsId = null) {
    // Similar implementation for news form
    console.log('Show news form');
}

async function loadGallery() {
    // Similar implementation for gallery
    console.log('Loading gallery...');
}

function showGalleryForm(galleryId = null) {
    // Similar implementation for gallery form
    console.log('Show gallery form');
}

async function loadSponsors() {
    // Similar implementation for sponsors
    console.log('Loading sponsors...');
}

function showSponsorForm(sponsorId = null) {
    // Similar implementation for sponsor form
    console.log('Show sponsor form');
}

async function loadContacts() {
    // Similar implementation for contacts
    console.log('Loading contacts...');
}