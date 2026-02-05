document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-container');
    const username = 'Heliacaa'; // GitHub kullanıcı adınız

    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Github API hatası');
            }
            return response.json();
        })
        .then(repos => {
            // Yükleniyor animasyonunu kaldır
            projectsContainer.innerHTML = '';

            // Repoları filtrele (forklanmış olanları göstermek istemiyorsanız !repo.fork condition'ı ekleyebilirsiniz)
            const myRepos = repos.filter(repo => !repo.fork); // Sadece kendi oluşturduğunuz projeler

            if (myRepos.length === 0) {
                projectsContainer.innerHTML = '<p>Henüz proje bulunamadı.</p>';
                return;
            }

            myRepos.forEach(repo => {
                const card = createProjectCard(repo);
                projectsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Hata:', error);
            projectsContainer.innerHTML = `<p>Projeler yüklenirken bir hata oluştu: ${error.message}</p>`;
        });
});

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const description = repo.description || 'Açıklama bulunmuyor.';
    const language = repo.language || 'Belirtilmemiş';

    card.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${description}</p>
        <div class="project-footer">
            <span class="language">${language}</span>
            <div class="stars">
                <span>★</span> ${repo.stargazers_count}
            </div>
        </div>
    `;

    return card;
}
