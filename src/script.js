async function displayProjects(repos) {
    const listContainer = document.querySelector('.collection-list');
    listContainer.innerHTML = '';

    for (const repo of repos) {
        const { name, html_url, full_name, created_at } = repo;
        let imageUrl = 'https://raw.githubusercontent.com/Tharaniesh3/suivent/main/placeholder.jpg';
        try {
            const readmeResponse = await fetch(`https://api.github.com/repos/${full_name}/contents/README.md`, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });
            if (!readmeResponse.ok) throw new Error(`Failed to fetch README for ${full_name}`);
            const readmeContent = await readmeResponse.json();
            
            if (readmeContent.content) {
                const decodedContent = atob(readmeContent.content);
                const imageMatch = decodedContent.match(/!\[.*\]\((.*?)\)/);
                if (imageMatch) {
                    imageUrl = imageMatch[1];
                    if (!imageUrl.startsWith('http')) {
                        imageUrl = `https://raw.githubusercontent.com/${full_name}/main/${imageUrl}`;
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching README for ${full_name}:`, error);
        }

        const creationYear = new Date(created_at).getFullYear();
        const projectHTML = `
            <div role="listitem" class="project-item w-dyn-item">
                <a href="${html_url}" class="project-link w-inline-block">
                    <div class="project-item-container">
                        <div class="project-item-thumbnail-container">
                            <img src="${imageUrl}" loading="lazy" alt="${name} Thumbnail" class="project-item-thumbnail" />
                            <div class="dashboard-image-holder">
                                <img src="${imageUrl}" loading="lazy" alt="${name} Thumbnail" class="dashboard-img-project" />
                            </div>
                            <div class="project-client-thumbnail-container">
                                <div class="project-client-thumbnail-holder">
                                    <img alt="" loading="lazy" src="https://cdn.prod.website-files.com/66b9ee8bc51587ba1b688da7/66cf1c63e120c1edb1a9d172_Group%201171276180.svg" class="client-thumbnail" />
                                </div>
                            </div>
                        </div>
                        <div class="project-info-container">
                            <h5 class="project-title">${name}</h5>
                            <p class="project-summary">${creationYear}</p>
                        </div>
                    </div>
                </a>
            </div>
        `;
        listContainer.innerHTML += projectHTML;
    }
}
