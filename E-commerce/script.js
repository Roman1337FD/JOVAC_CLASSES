const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const productGrid = document.getElementById("productGrid");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");

const API_URL = "https://dummyjson.com/products/search?q=";

// Show Loading
function showLoading() {
    loadingIndicator.classList.remove("hidden");
    productGrid.innerHTML = "";
    errorMessage.classList.add("hidden");
}

// Hide Loading
function hideLoading() {
    loadingIndicator.classList.add("hidden");
}

// Show Error
function showError(message) {
    hideLoading();
    errorMessage.textContent = `Oops! ${message}`;
    errorMessage.classList.remove("hidden");
}

// Render Products
function renderProducts(productsArray) {
    hideLoading();
    productGrid.innerHTML = "";

    if (productsArray.length === 0) {
        productGrid.innerHTML =
            "<h2>No products found! Try another search.</h2>";
        return;
    }

    productsArray.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" width="100%">
            <h3>${product.title}</h3>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
        `;

        productGrid.appendChild(card);
    });
}

// Fetch Products
async function fetchProducts(searchQuery = "") {
    showLoading();

    try {
        const response = await fetch(`${API_URL}${searchQuery}`);

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        renderProducts(data.products);

    } catch (error) {
        console.error("Fetch process failed:", error);
        showError("Failed to fetch products.");
    }
}

// Search Button Click
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    fetchProducts(query);
});

// Enter Key Search
searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        fetchProducts(searchInput.value.trim());
    }
});

// Load All Products Initially
fetchProducts();