// steal this if you want, i dont think u want to steal this
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

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('revealed');
        const onEnd = (e) => {
            if (e.propertyName === 'opacity') {
                el.classList.remove('will-reveal', 'revealed');
                el.removeEventListener('transitionend', onEnd);
            }
        };
        el.addEventListener('transitionend', onEnd);
        revealObserver.unobserve(el);
    });
}, { threshold: 0.08 });

function staggerReveal(elements) {
    Array.from(elements).forEach((el, i) => {
        el.classList.add('will-reveal');
        el.style.setProperty('--stagger', `${i * 60}ms`);
        revealObserver.observe(el);
    });
}

document.querySelectorAll('.section > .container').forEach(el => {
    el.classList.add('will-reveal');
    el.style.setProperty('--stagger', '0ms');
    revealObserver.observe(el);
});

document.querySelectorAll('.cards-grid').forEach(grid =>
    staggerReveal(grid.querySelectorAll('.card'))
);
staggerReveal(document.querySelectorAll('.tech-item'));
staggerReveal(document.querySelectorAll('.opsec-card'));
staggerReveal(document.querySelectorAll('.github-profile, .github-contributions, .github-pinned'));
staggerReveal(document.querySelectorAll('.opsec-intro'));

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
    const avatar = document.getElementById('github-avatar');
    avatar.classList.add('loading');

    try {
        const userResponse = await fetch('https://api.github.com/users/T9Tuco'); //pls dont rate limit me github
        const reposResponse = await fetch('https://api.github.com/users/T9Tuco/repos');

        if (!userResponse.ok || !reposResponse.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const userData = await userResponse.json();
        const reposData = await reposResponse.json();

        avatar.onload = () => avatar.classList.remove('loading');
        avatar.src = userData.avatar_url;
        document.getElementById('github-name').textContent = userData.name || userData.login;
        document.getElementById('github-bio').textContent = userData.bio || '';
        document.getElementById('github-followers').textContent = userData.followers;
        document.getElementById('github-repos').textContent = userData.public_repos;

        let totalStars = 0;
        reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
        });
        document.getElementById('github-stars').textContent = totalStars;
    } catch (error) {
        avatar.classList.remove('loading');
        console.error('GitHub API Error:', error);
    }
}
// why is this here
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

async function fetchPinnedRepos() {
    const container = document.getElementById('pinned-repos');
    if (!container) {
        console.error('HTML element with ID "pinned-repos" not found.');
        return;
    }

    try {
        const response = await fetch('https://pinned.berrysauce.dev/get/T9Tuco');

        if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
        }

        const repos = await response.json();
        if (repos && repos.length > 0) {
            renderPinnedRepos(repos.map(r => ({
                name: r.name,
                description: r.description,
                html_url: `https://github.com/${r.author}/${r.name}`,
                stargazers_count: r.stars,
                forks_count: r.forks,
                language: r.language || null,
                languageColor: r.languageColor || null
            })), container);
        }
    } catch (error) {
        console.error('Pinned repos error:', error);
    }
}

function renderPinnedRepos(repos, container) {
    container.innerHTML = '';
    repos.forEach((repo, index) => {
        const langDot = repo.language
            ? `<span class="pinned-repo-lang"><span class="lang-dot" style="background:${repo.languageColor || languageColors[repo.language] || '#ccc'}"></span>${repo.language}</span>`
            : '';
        const repoCard = document.createElement('div');
        repoCard.className = 'pinned-repo will-reveal';
        repoCard.style.setProperty('--stagger', `${index * 60}ms`);
        revealObserver.observe(repoCard);
        repoCard.innerHTML = `
            <div class="pinned-repo-header">
                <i class="fas fa-book-bookmark"></i>
                <a href="${repo.html_url}" target="_blank" class="pinned-repo-name">${repo.name}</a>
            </div>
            <p class="pinned-repo-desc">${repo.description || 'No description available.'}</p>
            <div class="pinned-repo-stats">
                ${langDot}
                <span><i class="fas fa-star"></i> ${repo.stargazers_count} Stars</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count} Forks</span>
            </div>
        `;
        container.appendChild(repoCard);
    });
}

//ty claude
function updateContributionGraph() {
    const contributionsGraph = document.querySelector('.contribution-graph');
    contributionsGraph.classList.add('loading');
    contributionsGraph.onload = () => contributionsGraph.classList.remove('loading');
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
    img.addEventListener('load', () => img.classList.remove('loading'));
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

// PGP modal
const pgpModal = document.getElementById('pgpModal');
const pgpModalClose = document.getElementById('pgpModalClose');
const pgpCopyBtn = document.getElementById('pgpCopyBtn');
const pgpKeyBlock = document.getElementById('pgpKeyBlock');

document.querySelector('.pgp-link').addEventListener('click', e => {
    e.preventDefault();
    pgpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closePgpModal() {
    pgpModal.classList.remove('active');
    document.body.style.overflow = '';
}

pgpModalClose.addEventListener('click', closePgpModal);
pgpModal.addEventListener('click', e => { if (e.target === pgpModal) closePgpModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && pgpModal.classList.contains('active')) closePgpModal(); });

pgpCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(pgpKeyBlock.textContent).then(() => {
        pgpCopyBtn.classList.add('copied');
        pgpCopyBtn.innerHTML = '<i class="fas fa-check"></i> copied!';
        setTimeout(() => {
            pgpCopyBtn.classList.remove('copied');
            pgpCopyBtn.innerHTML = '<i class="fas fa-copy"></i> copy key';
        }, 2000);
    });
});
