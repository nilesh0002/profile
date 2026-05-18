// GitHub UI tabs highlighting
const tabs = document.querySelectorAll('.tabs-container a');

tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// No typing role in GitHub UI

// Contact form submission
const contactForm = document.getElementById('contact-form');

// Contact form now submits natively to FormSubmit
// No custom AJAX required

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: -100px;
                left: 50%;
                transform: translateX(-50%);
                padding: 1rem 2rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                transition: all 0.3s ease;
                z-index: 1000;
                opacity: 0;
            }

            .notification.success {
                background: linear-gradient(45deg, #10B981, #059669);
            }

            .notification.error {
                background: linear-gradient(45deg, #EF4444, #DC2626);
            }

            .notification.show {
                bottom: 20px;
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// No scroll reveal animations needed for clean GitHub UI

// Usernames for API fetching
const GITHUB_USERNAME = 'nilesh0002';
const LEETCODE_USERNAME = 'nilesh0002';
const GFG_USERNAME = 'nilesh98';

// Fetch GitHub Stats
async function fetchGitHubStats() {
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=6`)
        ]);
        
        const user = await userRes.json();
        const repos = await reposRes.json();

        // Populate Overview bento card
        document.getElementById('github-overview').innerHTML = `
            <div class="stat-row">
                <span>Public Repos</span>
                <span>${user.public_repos || 0}</span>
            </div>
            <div class="stat-row">
                <span>Followers</span>
                <span>${user.followers || 0}</span>
            </div>
            <div class="stat-row">
                <span>Following</span>
                <span>${user.following || 0}</span>
            </div>
        `;

        // Populate sidebar live follower / following count
        const ghFollowers = document.getElementById('gh-followers');
        const ghFollowing = document.getElementById('gh-following');
        if (ghFollowers) ghFollowers.textContent = user.followers || 0;
        if (ghFollowing) ghFollowing.textContent = user.following || 0;

        // Populate Top Repos
        const repoContainer = document.getElementById('github-repos');
        repoContainer.innerHTML = '';

        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            repoCard.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description ? repo.description.substring(0, 60) + '...' : 'No description'}</p>
                <div class="repo-stats">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-code"></i> ${repo.language || 'Code'}</span>
                </div>
                <a href="${repo.html_url}" target="_blank" class="repo-link">View Repo</a>
            `;
            repoContainer.appendChild(repoCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        document.getElementById('github-overview').innerHTML = '<p class="error">Failed to load data</p>';
        document.getElementById('github-repos').innerHTML = '<p class="error">Failed to load repositories</p>';
    }
}

// Fetch LeetCode Stats
async function fetchLeetCodeStats() {
    try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`);
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        
        document.getElementById('leetcode-overview').innerHTML = `
            <div class="stat-row">
                <span>Total Solved</span>
                <span style="color: #FFA116">${data.solvedProblem || 0}</span>
            </div>
            <div class="stat-row">
                <span>Easy</span>
                <span style="color: #00B8A3">${data.easySolved || 0}</span>
            </div>
            <div class="stat-row">
                <span>Medium</span>
                <span style="color: #FFC01E">${data.mediumSolved || 0}</span>
            </div>
            <div class="stat-row">
                <span>Hard</span>
                <span style="color: #EF4743">${data.hardSolved || 0}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
        document.getElementById('leetcode-overview').innerHTML = `
            <p class="error" style="color: var(--gh-text-secondary); text-align: center;">Failed to load LeetCode data</p>
        `;
    }
}

// Fetch GeeksforGeeks Stats
async function fetchGFGStats() {
    try {
        // Try a known community API if it works, otherwise fall to placeholder
        const response = await fetch(`https://geeks-for-geeks-api-two.vercel.app/v1/geeksforgeeks/${GFG_USERNAME}`);
        if (!response.ok) throw new Error('API failed');
        const data = await response.json();
        
        document.getElementById('gfg-overview').innerHTML = `
            <div class="stat-row">
                <span>Total Solved</span>
                <span style="color: #2ea043">${data.info.totalProblemsSolved || 0}</span>
            </div>
            <div class="stat-row">
                <span>Coding Score</span>
                <span style="color: #58a6ff">${data.info.codingScore || 0}</span>
            </div>
            <div class="stat-row">
                <span>Institute Rank</span>
                <span style="color: #f78166">${data.info.instituteRank || '-'}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching GFG stats:', error);
        document.getElementById('gfg-overview').innerHTML = `
            <p class="error" style="color: var(--gh-text-secondary); text-align: center;">Failed to load GeeksforGeeks data</p>
        `;
    }
}

// Star rating functionality
const stars = document.querySelectorAll('.stars i');
let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        updateStars(currentRating);
    });

    star.addEventListener('mouseover', () => {
        updateStars(parseInt(star.dataset.rating));
    });

    star.addEventListener('mouseout', () => {
        updateStars(currentRating);
    });
});

function updateStars(rating) {
    document.getElementById('rating-input').value = rating;
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Feedback form will submit natively to FormSubmit

// Initialize all stats and APIs on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
    fetchLeetCodeStats();
    fetchGFGStats();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const githubStreak = document.getElementById('github-streak');

        function setTheme(isLight) {
            if (isLight) {
                document.documentElement.setAttribute('data-theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                if (githubStreak) githubStreak.src = "https://github-readme-streak-stats.herokuapp.com/?user=nilesh0002&theme=default&hide_border=true&background=ffffff&ring=0969da&fire=0969da&currStreakNum=24292f";
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                if (githubStreak) githubStreak.src = "https://github-readme-streak-stats.herokuapp.com/?user=nilesh0002&theme=dark&hide_border=true&background=0d1117&ring=58a6ff&fire=58a6ff&currStreakNum=c9d1d9";
                localStorage.setItem('theme', 'dark');
            }
        }

        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setTheme(true);
        }

        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isLight = document.documentElement.hasAttribute('data-theme');
            setTheme(!isLight);
        });
    }

    // Prevent body scroll removed because we don't have a mobile menu popup anymore.
});