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
                    <option value="Portar">Portar</option>
                    <option value="Fundas">Fundas</option>
                    <option value="Mijlocas">Mijlocas</option>
                    <option value="Atacant">Atacant</option>
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
    try {
        const response = await fetch(`${API_BASE}/matches`);
        const matches = await response.json();
        
        const tbody = document.querySelector('#matchesTable tbody');
        tbody.innerHTML = '';

        matches.forEach(match => {
            const row = document.createElement('tr');
            const matchDate = new Date(match.date).toLocaleDateString();
            const score = match.status === 'completed' ? 
                `${match.homeScore || 0} - ${match.awayScore || 0}` : 
                match.status;
            
            row.innerHTML = `
                <td>${matchDate}</td>
                <td>${match.opponent}</td>
                <td>${match.venue}</td>
                <td><span class="status-badge status-${match.status}">${match.status}</span></td>
                <td>${score}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="editMatch('${match._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteMatch('${match._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

function showMatchForm(matchId = null) {
    const title = matchId ? 'Edit Match' : 'Add Match';
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="matchForm">
            <div class="form-group">
                <label for="matchOpponent">Opponent</label>
                <input type="text" id="matchOpponent" name="opponent" required>
            </div>
            <div class="form-group">
                <label for="matchDate">Date</label>
                <input type="date" id="matchDate" name="date" required>
            </div>
            <div class="form-group">
                <label for="matchTime">Time</label>
                <input type="time" id="matchTime" name="time" required>
            </div>
            <div class="form-group">
                <label for="matchVenue">Venue</label>
                <input type="text" id="matchVenue" name="venue" required>
            </div>
            <div class="form-group">
                <label for="matchIsHome">Match Type</label>
                <select id="matchIsHome" name="isHome" required>
                    <option value="true">Home</option>
                    <option value="false">Away</option>
                </select>
            </div>
            <div class="form-group">
                <label for="matchStatus">Status</label>
                <select id="matchStatus" name="status" required>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div class="form-group">
                <label for="matchHomeScore">Home Score</label>
                <input type="number" id="matchHomeScore" name="homeScore" min="0">
            </div>
            <div class="form-group">
                <label for="matchAwayScore">Away Score</label>
                <input type="number" id="matchAwayScore" name="awayScore" min="0">
            </div>
            <div class="form-group">
                <label for="matchDescription">Description</label>
                <textarea id="matchDescription" name="description" placeholder="Match notes..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Match</button>
            </div>
        </form>
    `;

    if (matchId) {
        loadMatchData(matchId);
    }

    document.getElementById('matchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveMatch(matchId);
    });

    showModal();
}

async function loadMatchData(matchId) {
    try {
        const response = await fetch(`${API_BASE}/matches/${matchId}`);
        const match = await response.json();

        document.getElementById('matchOpponent').value = match.opponent;
        document.getElementById('matchDate').value = match.date.split('T')[0];
        document.getElementById('matchTime').value = match.time;
        document.getElementById('matchVenue').value = match.venue;
        document.getElementById('matchIsHome').value = match.isHome.toString();
        document.getElementById('matchStatus').value = match.status;
        document.getElementById('matchHomeScore').value = match.homeScore || '';
        document.getElementById('matchAwayScore').value = match.awayScore || '';
        document.getElementById('matchDescription').value = match.description || '';
    } catch (error) {
        console.error('Error loading match data:', error);
    }
}

async function saveMatch(matchId) {
    try {
        const form = document.getElementById('matchForm');
        const formData = new FormData(form);
        
        const matchData = {
            opponent: formData.get('opponent'),
            date: formData.get('date'),
            time: formData.get('time'),
            venue: formData.get('venue'),
            isHome: formData.get('isHome') === 'true',
            status: formData.get('status'),
            description: formData.get('description')
        };

        if (formData.get('homeScore')) {
            matchData.homeScore = parseInt(formData.get('homeScore'));
        }
        if (formData.get('awayScore')) {
            matchData.awayScore = parseInt(formData.get('awayScore'));
        }

        const url = matchId ? `${API_BASE}/matches/${matchId}` : `${API_BASE}/matches`;
        const method = matchId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchData)
        });

        if (response.ok) {
            closeModal();
            loadMatches();
            showSuccess(matchId ? 'Match updated successfully' : 'Match added successfully');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save match');
        }
    } catch (error) {
        console.error('Error saving match:', error);
        showError('Failed to save match');
    }
}

async function editMatch(matchId) {
    showMatchForm(matchId);
}

async function deleteMatch(matchId) {
    if (!confirm('Are you sure you want to delete this match?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/matches/${matchId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadMatches();
            showSuccess('Match deleted successfully');
        } else {
            showError('Failed to delete match');
        }
    } catch (error) {
        console.error('Error deleting match:', error);
        showError('Failed to delete match');
    }
}

async function loadNews() {
    try {
        const response = await fetch(`${API_BASE}/news?published=all`);
        const news = await response.json();
        
        const tbody = document.querySelector('#newsTable tbody');
        tbody.innerHTML = '';

        news.forEach(article => {
            const row = document.createElement('tr');
            const publishedBadge = article.published ? 
                '<span class="status-badge status-read">Published</span>' : 
                '<span class="status-badge status-new">Draft</span>';
            
            row.innerHTML = `
                <td>${article.title}</td>
                <td>${article.author}</td>
                <td><span class="category-badge ${article.category}">${article.category}</span></td>
                <td>${new Date(article.createdAt).toLocaleDateString()}</td>
                <td>${publishedBadge}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="editNews('${article._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteNews('${article._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

function showNewsForm(newsId = null) {
    const title = newsId ? 'Edit News Article' : 'Add News Article';
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="newsForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="newsTitle">Title</label>
                <input type="text" id="newsTitle" name="title" required>
            </div>
            <div class="form-group">
                <label for="newsAuthor">Author</label>
                <input type="text" id="newsAuthor" name="author" required>
            </div>
            <div class="form-group">
                <label for="newsCategory">Category</label>
                <select id="newsCategory" name="category" required>
                    <option value="general">General</option>
                    <option value="match">Match</option>
                    <option value="player">Player</option>
                    <option value="club">Club</option>
                </select>
            </div>
            <div class="form-group">
                <label for="newsContent">Content</label>
                <textarea id="newsContent" name="content" rows="8" required placeholder="Article content..."></textarea>
            </div>
            <div class="form-group">
                <label for="newsImage">Featured Image</label>
                <div class="file-input-wrapper">
                    <input type="file" id="newsImage" name="image" accept="image/*">
                    <p>Click to select image or drag and drop</p>
                </div>
            </div>
            <div class="form-group">
                <label for="newsPublished">Status</label>
                <select id="newsPublished" name="published" required>
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Article</button>
            </div>
        </form>
    `;

    if (newsId) {
        loadNewsData(newsId);
    }

    document.getElementById('newsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveNews(newsId);
    });

    showModal();
}

async function loadNewsData(newsId) {
    try {
        const response = await fetch(`${API_BASE}/news/${newsId}`);
        const article = await response.json();

        document.getElementById('newsTitle').value = article.title;
        document.getElementById('newsAuthor').value = article.author;
        document.getElementById('newsCategory').value = article.category;
        document.getElementById('newsContent').value = article.content;
        document.getElementById('newsPublished').value = article.published.toString();
    } catch (error) {
        console.error('Error loading news data:', error);
    }
}

async function saveNews(newsId) {
    try {
        const form = document.getElementById('newsForm');
        const formData = new FormData(form);

        const url = newsId ? `${API_BASE}/news/${newsId}` : `${API_BASE}/news`;
        const method = newsId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            closeModal();
            loadNews();
            showSuccess(newsId ? 'Article updated successfully' : 'Article added successfully');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save article');
        }
    } catch (error) {
        console.error('Error saving article:', error);
        showError('Failed to save article');
    }
}

async function editNews(newsId) {
    showNewsForm(newsId);
}

async function deleteNews(newsId) {
    if (!confirm('Are you sure you want to delete this article?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/news/${newsId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadNews();
            showSuccess('Article deleted successfully');
        } else {
            showError('Failed to delete article');
        }
    } catch (error) {
        console.error('Error deleting article:', error);
        showError('Failed to delete article');
    }
}

async function loadGallery() {
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        const gallery = await response.json();
        
        const container = document.getElementById('galleryGrid');
        container.innerHTML = '';

        gallery.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const mediaElement = item.type === 'image' ? 
                `<img src="${item.url}" alt="${item.title}">` :
                `<video src="${item.url}" ${item.thumbnail ? `poster="${item.thumbnail}"` : ''}></video>`;
            
            galleryItem.innerHTML = `
                ${mediaElement}
                <div class="gallery-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.description || 'No description'}</p>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-warning btn-small" onclick="editGalleryItem('${item._id}')">Edit</button>
                        <button class="btn btn-danger btn-small" onclick="deleteGalleryItem('${item._id}')">Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(galleryItem);
        });
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

function showGalleryForm(galleryId = null) {
    const title = galleryId ? 'Edit Media Item' : 'Add Media Item';
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="galleryForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="galleryTitle">Title</label>
                <input type="text" id="galleryTitle" name="title" required>
            </div>
            <div class="form-group">
                <label for="galleryDescription">Description</label>
                <textarea id="galleryDescription" name="description" placeholder="Optional description..."></textarea>
            </div>
            <div class="form-group">
                <label for="galleryMedia">Media File</label>
                <div class="file-input-wrapper">
                    <input type="file" id="galleryMedia" name="media" accept="image/*,video/*" ${!galleryId ? 'required' : ''}>
                    <p>Click to select image or video file</p>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Media</button>
            </div>
        </form>
    `;

    if (galleryId) {
        loadGalleryData(galleryId);
    }

    document.getElementById('galleryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveGalleryItem(galleryId);
    });

    showModal();
}

async function loadGalleryData(galleryId) {
    try {
        const response = await fetch(`${API_BASE}/gallery/${galleryId}`);
        const item = await response.json();

        document.getElementById('galleryTitle').value = item.title;
        document.getElementById('galleryDescription').value = item.description || '';
    } catch (error) {
        console.error('Error loading gallery data:', error);
    }
}

async function saveGalleryItem(galleryId) {
    try {
        const form = document.getElementById('galleryForm');
        const formData = new FormData(form);

        const url = galleryId ? `${API_BASE}/gallery/${galleryId}` : `${API_BASE}/gallery`;
        const method = galleryId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            closeModal();
            loadGallery();
            showSuccess(galleryId ? 'Media updated successfully' : 'Media added successfully');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save media');
        }
    } catch (error) {
        console.error('Error saving media:', error);
        showError('Failed to save media');
    }
}

async function editGalleryItem(galleryId) {
    showGalleryForm(galleryId);
}

async function deleteGalleryItem(galleryId) {
    if (!confirm('Are you sure you want to delete this media item?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/gallery/${galleryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadGallery();
            showSuccess('Media deleted successfully');
        } else {
            showError('Failed to delete media');
        }
    } catch (error) {
        console.error('Error deleting media:', error);
        showError('Failed to delete media');
    }
}

async function loadSponsors() {
    try {
        const response = await fetch(`${API_BASE}/sponsors`);
        const sponsors = await response.json();
        
        const tbody = document.querySelector('#sponsorsTable tbody');
        tbody.innerHTML = '';

        sponsors.forEach(sponsor => {
            const row = document.createElement('tr');
            const website = sponsor.website ? 
                `<a href="${sponsor.website}" target="_blank">Visit</a>` : 
                'N/A';
            
            row.innerHTML = `
                <td>
                    <img src="${sponsor.logo}" alt="${sponsor.name}" style="width: 50px; height: 50px; object-fit: contain;">
                </td>
                <td>${sponsor.name}</td>
                <td><span class="status-badge status-${sponsor.tier}">${sponsor.tier}</span></td>
                <td>${website}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="editSponsor('${sponsor._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteSponsor('${sponsor._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading sponsors:', error);
    }
}

function showSponsorForm(sponsorId = null) {
    const title = sponsorId ? 'Edit Sponsor' : 'Add Sponsor';
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <h2>${title}</h2>
        <form id="sponsorForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="sponsorName">Name</label>
                <input type="text" id="sponsorName" name="name" required>
            </div>
            <div class="form-group">
                <label for="sponsorTier">Tier</label>
                <select id="sponsorTier" name="tier" required>
                    <option value="partner">Partner</option>
                    <option value="secondary">Secondary</option>
                    <option value="main">Main</option>
                </select>
            </div>
            <div class="form-group">
                <label for="sponsorWebsite">Website</label>
                <input type="url" id="sponsorWebsite" name="website" placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label for="sponsorDescription">Description</label>
                <textarea id="sponsorDescription" name="description" placeholder="Optional description..."></textarea>
            </div>
            <div class="form-group">
                <label for="sponsorLogo">Logo</label>
                <div class="file-input-wrapper">
                    <input type="file" id="sponsorLogo" name="logo" accept="image/*" ${!sponsorId ? 'required' : ''}>
                    <p>Click to select logo image</p>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Sponsor</button>
            </div>
        </form>
    `;

    if (sponsorId) {
        loadSponsorData(sponsorId);
    }

    document.getElementById('sponsorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveSponsor(sponsorId);
    });

    showModal();
}

async function loadSponsorData(sponsorId) {
    try {
        const response = await fetch(`${API_BASE}/sponsors/${sponsorId}`);
        const sponsor = await response.json();

        document.getElementById('sponsorName').value = sponsor.name;
        document.getElementById('sponsorTier').value = sponsor.tier;
        document.getElementById('sponsorWebsite').value = sponsor.website || '';
        document.getElementById('sponsorDescription').value = sponsor.description || '';
    } catch (error) {
        console.error('Error loading sponsor data:', error);
    }
}

async function saveSponsor(sponsorId) {
    try {
        const form = document.getElementById('sponsorForm');
        const formData = new FormData(form);

        const url = sponsorId ? `${API_BASE}/sponsors/${sponsorId}` : `${API_BASE}/sponsors`;
        const method = sponsorId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            closeModal();
            loadSponsors();
            showSuccess(sponsorId ? 'Sponsor updated successfully' : 'Sponsor added successfully');
        } else {
            const error = await response.json();
            showError(error.message || 'Failed to save sponsor');
        }
    } catch (error) {
        console.error('Error saving sponsor:', error);
        showError('Failed to save sponsor');
    }
}

async function editSponsor(sponsorId) {
    showSponsorForm(sponsorId);
}

async function deleteSponsor(sponsorId) {
    if (!confirm('Are you sure you want to delete this sponsor?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/sponsors/${sponsorId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadSponsors();
            showSuccess('Sponsor deleted successfully');
        } else {
            showError('Failed to delete sponsor');
        }
    } catch (error) {
        console.error('Error deleting sponsor:', error);
        showError('Failed to delete sponsor');
    }
}

async function loadContacts() {
    try {
        const response = await fetch(`${API_BASE}/contact`);
        const contacts = await response.json();
        
        const tbody = document.querySelector('#contactsTable tbody');
        tbody.innerHTML = '';

        contacts.forEach(contact => {
            const row = document.createElement('tr');
            const statusBadge = `<span class="status-badge status-${contact.status}">${contact.status}</span>`;
            
            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.subject}</td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-warning btn-small" onclick="viewContact('${contact._id}')">View</button>
                    <button class="btn btn-success btn-small" onclick="markAsRead('${contact._id}')">Mark Read</button>
                    <button class="btn btn-danger btn-small" onclick="deleteContact('${contact._id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function viewContact(contactId) {
    try {
        const response = await fetch(`${API_BASE}/contact`);
        const contacts = await response.json();
        const contact = contacts.find(c => c._id === contactId);
        
        if (!contact) return;

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <h2>Contact Message</h2>
            <div class="contact-details">
                <div class="form-group">
                    <label><strong>Name:</strong></label>
                    <p>${contact.name}</p>
                </div>
                <div class="form-group">
                    <label><strong>Email:</strong></label>
                    <p>${contact.email}</p>
                </div>
                <div class="form-group">
                    <label><strong>Subject:</strong></label>
                    <p>${contact.subject}</p>
                </div>
                <div class="form-group">
                    <label><strong>Date:</strong></label>
                    <p>${new Date(contact.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="form-group">
                    <label><strong>Message:</strong></label>
                    <div style="background: #f8f9fa; padding: 1rem; border-radius: 5px; margin-top: 0.5rem;">
                        <p>${contact.message}</p>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Close</button>
                    <button type="button" class="btn btn-success" onclick="markAsRead('${contact._id}'); closeModal();">Mark as Read</button>
                </div>
            </div>
        `;
        
        showModal();
        
        // Auto-mark as read when viewed
        if (contact.status === 'new') {
            setTimeout(() => markAsRead(contactId), 1000);
        }
    } catch (error) {
        console.error('Error viewing contact:', error);
    }
}

async function markAsRead(contactId) {
    try {
        const response = await fetch(`${API_BASE}/contact/${contactId}/status`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'read' })
        });

        if (response.ok) {
            loadContacts();
            showSuccess('Contact marked as read');
        } else {
            showError('Failed to update contact status');
        }
    } catch (error) {
        console.error('Error updating contact status:', error);
        showError('Failed to update contact status');
    }
}

async function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact message?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/contact/${contactId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadContacts();
            showSuccess('Contact deleted successfully');
        } else {
            showError('Failed to delete contact');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        showError('Failed to delete contact');
    }
}