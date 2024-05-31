document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.querySelector('.job-listings');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearButton = document.querySelector('.clear-btn');
    let filters = [];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderJobListings(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    function renderJobListings(jobs) {
        jobListingsContainer.innerHTML = '';
        jobs.forEach(job => {
            if (filters.length === 0 || filters.some(filter => [...job.languages, ...job.tools].includes(filter))) {
                const jobCard = document.createElement('div');
                jobCard.classList.add('job-card');
                jobCard.dataset.tags = [...job.languages, ...job.tools].join(' ');

                jobCard.innerHTML = `
                    <div class="job-header">
                        <img src="${job.logo}" alt="${job.company} Logo" class="company-logo">
                        <div class="company-info">
                            <div class="company-name">${job.company}</div>
                            <div class="job-type">
                                ${job.new ? '<span class="new">NEW!</span>' : ''}
                                ${job.featured ? '<span class="featured">FEATURED</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="job-title">${job.position}</div>
                    <div class="job-details">${job.postedAt} • ${job.contract} • ${job.location}</div>
                    <div class="job-tags">
                        ${[...job.languages, ...job.tools].map(tag => `<span class="job-tag">${tag}</span>`).join('')}
                    </div>
                `;

                jobListingsContainer.appendChild(jobCard);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (filters.includes(filter)) {
                filters = filters.filter(f => f !== filter);
                button.classList.remove('active');
            } else {
                filters.push(filter);
                button.classList.add('active');
            }
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    renderJobListings(data);
                });
        });
    });

    clearButton.addEventListener('click', () => {
        filters = [];
        filterButtons.forEach(button => button.classList.remove('active'));
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                renderJobListings(data);
            });
    });
});
