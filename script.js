document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .tech-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    observer.observe(element);
});

const modal = document.getElementById('techModal');
const modalIcon = modal.querySelector('.modal-icon');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const skillPercentage = modal.querySelector('.skill-percentage');
const skillProgress = modal.querySelector('.skill-progress');
const closeButton = modal.querySelector('.modal-close');

const techIcons = {
    javascript: 'fab fa-js',
    react: 'fab fa-react',
    python: 'fab fa-python',
    php: 'fab fa-php',
    csharp: 'fab fa-microsoft',
    cpp: 'fas fa-code',
    lua: 'fas fa-moon',
    archlinux: 'fab fa-linux',
    git: 'fab fa-git-alt',
    github: 'fab fa-github',
    google: 'fab fa-google'
};

document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('click', () => {
        const tech = item.getAttribute('data-tech');
        const skill = item.getAttribute('data-skill');
        const description = item.getAttribute('data-description');
        
        modalIcon.className = techIcons[tech] + ' modal-icon';
        modalTitle.textContent = item.querySelector('.tech-name').textContent;
        modalDescription.textContent = description;
        skillPercentage.textContent = skill + '%';
        
        modal.classList.add('active');
        
        setTimeout(() => {
            skillProgress.style.width = skill + '%';
        }, 100);
    });
});

closeButton.addEventListener('click', () => {
    modal.classList.remove('active');
    skillProgress.style.width = '0';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        skillProgress.style.width = '0';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        skillProgress.style.width = '0';
    }
});

async function fetchGitHubStats() {
    try {
        const userResponse = await fetch('https://api.github.com/users/T9Tuco');
        const reposResponse = await fetch('https://api.github.com/users/T9Tuco/repos');

        if (!userResponse.ok || !reposResponse.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const userData = await userResponse.json();
        const reposData = await reposResponse.json();

        document.getElementById('github-avatar').src = userData.avatar_url;
        document.getElementById('github-name').textContent = userData.name || userData.login;
        document.getElementById('github-bio').textContent = userData.bio || '';
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-repos').textContent = userData.public_repos;

        let totalStars = 0;
        reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
        });
        document.getElementById('github-stars').textContent = totalStars;

        await fetchPinnedRepos(reposData);
    } catch (error) {
        console.error('GitHub API Error:', error);
    }
}

const languageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    PHP: '#4F5D95',
    TypeScript: '#2b7489',
    Shell: '#89e051',
    Lua: '#000080',
    'C++': '#f34b7d',
    C: '#555555',
    Java: '#b07219',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584'
};

async function fetchPinnedRepos(repos) {
    try {
        const pinnedRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);

        const container = document.getElementById('pinned-repos');
        container.innerHTML = '';

        pinnedRepos.forEach(repo => {
            const langColor = languageColors[repo.language] || '#00ff88';
            const repoCard = document.createElement('div');
            repoCard.className = 'pinned-repo';
            repoCard.innerHTML = `
                <div class="pinned-repo-header">
                    <i class="fas fa-book-bookmark"></i>
                    <a href="${repo.html_url}" target="_blank" class="pinned-repo-name">${repo.name}</a>
                </div>
                <p class="pinned-repo-desc">${repo.description || 'No description'}</p>
                <div class="pinned-repo-stats">
                    ${repo.language ? `<span class="repo-language"><span class="language-dot" style="background: ${langColor}"></span>${repo.language}</span>` : ''}
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                </div>
            `;
            container.appendChild(repoCard);
        });
    } catch (error) {
        console.error('Pinned repos error:', error);
    }
}

async function fetchPinnedRepos() {
    try {
        const userResponse = await fetch('https://api.github.com/users/T9Tuco/repos');
        const orgResponse = await fetch('https://api.github.com/orgs/CoreHub-lol/repos');

        if (!userResponse.ok || !orgResponse.ok) {
            console.error(`Failed to fetch repositories: ${userResponse.status} ${userResponse.statusText}, ${orgResponse.status} ${orgResponse.statusText}`);
            return;
        }

        const userRepos = await userResponse.json();
        const orgRepos = await orgResponse.json();
        const pinnedRepoNames = [
            "MoneroWEB",
            "PROT7",
            "suckless-config",
            "Digispark-Scripts"
        ];

        const allRepos = [...userRepos, ...orgRepos];
        const uniqueRepos = allRepos.filter((repo, index, self) =>
            index === self.findIndex(r => r.name === repo.name)
        );
        const pinnedRepos = uniqueRepos.filter(repo => pinnedRepoNames.includes(repo.name));

        const container = document.getElementById('pinned-repos');
        if (!container) {
            console.error('HTML element with ID "pinned-repos" not found.');
            return;
        }

        container.innerHTML = '';

        pinnedRepos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'pinned-repo';
            repoCard.innerHTML = `
                <div class="pinned-repo-header">
                    <i class="fas fa-book-bookmark"></i>
                    <a href="${repo.html_url}" target="_blank" class="pinned-repo-name">${repo.name}</a>
                </div>
                <p class="pinned-repo-desc">${repo.description || 'No description available.'}</p>
                <div class="pinned-repo-stats">
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count} Stars</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count} Forks</span>
                </div>
            `;
            container.appendChild(repoCard);
        });
    } catch (error) {
        console.error('Pinned repos error:', error);
    }
}

function updateContributionGraph() {
    const contributionsGraph = document.querySelector('.contribution-graph');
    contributionsGraph.src = `https://ghchart.rshah.org/d946ef/T9Tuco?${new Date().getTime()}`;
    contributionsGraph.alt = `T9Tuco's GitHub Contributions`;
}

fetchGitHubStats();
fetchPinnedRepos();
updateContributionGraph();

function updateTime() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', options);
}

updateTime();
setInterval(updateTime, 1000);

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.opsec-card-image img').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});
lightboxClose.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
});
