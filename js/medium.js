const fetchMediumArticles = async () => {
    // Replace '@your_username' with your actual Medium username
    const username = '@andrenogueira.dev';
    const rssUrl = `https://medium.com/feed/${username}`;

    // We use rss2json to convert Medium's XML RSS feed into useable JSON format
    const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        if (data.status === 'ok' && data.items.length > 0) {
            const blogGrid = document.querySelector('.blog-grid');

            // Clear out the static placeholder blog posts
            blogGrid.innerHTML = '';

            // Limit to newest 3 articles max to match the design grid
            const latestArticles = data.items.slice(0, 3);

            latestArticles.forEach((article) => {
                // Formatting Date from Medium
                const rawDate = new Date(article.pubDate);
                const formattedDate = rawDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

                // Extracting first image from Medium's article content if thumbnail doesn't exist
                let thumbnailSrc = article.thumbnail;
                if (!thumbnailSrc) {
                    const imgMatch = article.content.match(/<img[^>]+src="([^">]+)"/);
                    thumbnailSrc = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'; // Fallback
                }

                // Medium Categories mapping - picking the first reliable category as a tag
                const fallbackCategories = ['Tech', 'Design', 'Performance', 'Opinion'];
                const categoryTag = article.categories.length > 0 ? article.categories[0] : fallbackCategories[Math.floor(Math.random() * fallbackCategories.length)];

                // Building the individual blog card component markup dynamically
                const articleMarkup = `
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="blog-card" style="text-decoration: none;">
                        <div class="blog-thumbnail">
                            <img src="${thumbnailSrc}" alt="${article.title}">
                        </div>
                        <div class="blog-meta">
                            <span class="category-badge cat-tech">${categoryTag}</span>
                            <span class="blog-date">${formattedDate}</span>
                        </div>
                        <h4 class="blog-title" style="color: var(--text-primary);">${article.title}</h4>
                    </a>
                `;

                // Injecting dynamically constructed article to the grid
                blogGrid.insertAdjacentHTML('beforeend', articleMarkup);
            });
        }
    } catch (error) {
        console.error('Failed to fetch Medium articles:', error);
        // If the fetch fails, the static fallback articles will remain untouched
    }
};

// Execute the code once the HTML has been fully parsed
document.addEventListener('DOMContentLoaded', fetchMediumArticles);
