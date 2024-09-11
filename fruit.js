document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById("loader");

    function showLoading() {
        loading.style.display = "block";
    }

    function hideLoading() {
        loading.style.display = "none";
    }

    function fetchFruits() {
        showLoading();
        fetch("./fruits.json")
            .then((response) => response.json())
            .then((data) => {
                displayFruits(data);
                hideLoading();
            })
            .catch(() => hideLoading());
    }

    fetchFruits();

    function displayFruits(fruits) {
        const fruitsContainer = document.getElementById("fruits");
        fruitsContainer.innerHTML = "";
        fruits.forEach((fruit) => {
            const fruitDiv = document.createElement("div");
            fruitDiv.id = "fruit";
            fruitDiv.innerHTML = `
                    <img src='${fruit.image}' alt='${fruit.name}' />
                    <h2 id='fruit_name'> ${fruit.name}</h2>
                `;
            fruitsContainer.appendChild(fruitDiv);
        });
    }

    // FILTERING FRUITS BY CATEGORY
    const categories = document.querySelectorAll("#nav-item a");
    categories.forEach((category) => {
        category.addEventListener("click", (e) => {
            e.preventDefault();
            categories.forEach((cat) => cat.classList.remove("active"));
            e.target.classList.add("active");
            const selectedCategory = e.target.textContent;
            showLoading();
            fetch("./fruits.json")
                .then((response) => response.json())
                .then((data) => {
                    const filteredFruits = data.filter(
                        (fruit) => fruit.category === selectedCategory
                    );
                    displayFruits(filteredFruits);
                    hideLoading();
                })
                .catch(() => hideLoading());
        });
    });

    // IMPLEMENTING THE SEARCH FUNCTIONALITY
    const searchBox = document.getElementById("search-box");
    const noResults = document.getElementById("no-results");

    searchBox.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = e.target.querySelector("input");
        const searchTerm = input.value.toUpperCase();
        showLoading();
        fetch("./fruits.json")
            .then((response) => response.json())
            .then((data) => {
                const filteredFruits = data.filter((fruit) =>
                    fruit.name.toUpperCase().includes(searchTerm)
                );
                displayFruits(filteredFruits);
                hideLoading();

                // Show or hide the no-result message
                if (filteredFruits.length === 0) {
                    noResults.style.display = "block";
                } else {
                    noResults.style.display = "none";
                }
            })
            .finally(() => {
                // Clear the input field after processing
                input.value = "";
                hideLoading();
            })
            .catch(() => hideLoading());
    });
});
