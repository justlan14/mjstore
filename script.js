const products = [

    {
        id: 1,
        name: "AJG TUNJUK",
        category: "CAR",
        categoryName: "AJG",
        price: 59,
        image: "ajg.jpg",
        description: "Premium oversized T-shirt designed for everyday comfort and modern streetwear style.",
    },

    {
        id: 2,
        name: "REDBULL",
        category: "CAR",
        categoryName: "CAR",
        price: 129,
        image: "SI202202150586_news.jpg",
        description: "A clean and comfortable hoodie made for casual everyday outfits.",
        tag: "BEST SELLER"
    },
];



let currentProducts = [...products];

let cart = JSON.parse(localStorage.getItem("noireCart")) || [];

let selectedProduct = null;

let selectedSize = null;


const productGrid =
    document.getElementById("productGrid");

const noProducts =
    document.getElementById("noProducts");


function displayProducts(productList) {

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        noProducts.style.display = "block";

        return;

    }

    noProducts.style.display = "none";


    productList.forEach(product => {

        const card = document.createElement("div");

        card.classList.add("product-card");

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <span class="product-tag">
                    ${product.tag}
                </span>

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.categoryName}
                </p>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-price">
                    RM ${product.price.toFixed(2)}
                </p>

            </div>

        `;


        card.addEventListener("click", () => {

            openProduct(product);

        });


        productGrid.appendChild(card);

    });

}


displayProducts(currentProducts);




const categoryButtons =
    document.querySelectorAll(".category-card");


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        const category =
            button.dataset.category;


        if (category === "all") {

            currentProducts = [...products];

        } else {

            currentProducts =
                products.filter(
                    product =>
                        product.category === category
                );

        }


        displayProducts(currentProducts);

    });

});



const sortProducts =
    document.getElementById("sortProducts");


sortProducts.addEventListener("change", () => {

    let sorted =
        [...currentProducts];


    if (sortProducts.value === "low") {

        sorted.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sortProducts.value === "high") {

        sorted.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    displayProducts(sorted);

});




const searchBtn =
    document.getElementById("searchBtn");

const searchBox =
    document.getElementById("searchBox");

const searchInput =
    document.getElementById("searchInput");

const closeSearch =
    document.getElementById("closeSearch");


searchBtn.addEventListener("click", () => {

    searchBox.classList.toggle("show");

    if (searchBox.classList.contains("show")) {

        searchInput.focus();

    }

});


closeSearch.addEventListener("click", () => {

    searchBox.classList.remove("show");

    searchInput.value = "";

    currentProducts = [...products];

    displayProducts(currentProducts);

});


searchInput.addEventListener("input", () => {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    currentProducts =
        products.filter(product =>

            product.name
                .toLowerCase()
                .includes(search)

            ||

            product.categoryName
                .toLowerCase()
                .includes(search)

        );


    displayProducts(currentProducts);

});




const productModal =
    document.getElementById("productModal");

const closeModal =
    document.getElementById("closeModal");

const modalImage =
    document.getElementById("modalImage");

const modalName =
    document.getElementById("modalName");

const modalPrice =
    document.getElementById("modalPrice");

const modalCategory =
    document.getElementById("modalCategory");

const modalDescription =
    document.getElementById("modalDescription");

const modalAddCart =
    document.getElementById("modalAddCart");


function openProduct(product) {

    selectedProduct = product;

    selectedSize = null;


    modalImage.src =
        product.image;

    modalName.textContent =
        product.name;

    modalPrice.textContent =
        `RM ${product.price.toFixed(2)}`;

    modalCategory.textContent =
        product.categoryName;

    modalDescription.textContent =
        product.description;


    document
        .querySelectorAll(".size-btn")
        .forEach(button => {

            button.classList.remove("selected");

        });


    productModal.classList.add("show");

    document.body.classList.add("no-scroll");

}


closeModal.addEventListener("click", closeProductModal);


function closeProductModal() {

    productModal.classList.remove("show");

    document.body.classList.remove("no-scroll");

}



document
    .querySelectorAll(".size-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".size-btn")
                .forEach(btn => {

                    btn.classList.remove("selected");

                });


            button.classList.add("selected");

            selectedSize =
                button.textContent;

        });

    });



modalAddCart.addEventListener("click", () => {

    if (!selectedSize) {

        alert("Please select a size first.");

        return;

    }


    const existingItem =
        cart.find(item =>

            item.id === selectedProduct.id
            &&
            item.size === selectedSize

        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            id: selectedProduct.id,

            name: selectedProduct.name,

            price: selectedProduct.price,

            image: selectedProduct.image,

            size: selectedSize,

            quantity: 1

        });

    }


    saveCart();

    closeProductModal();

    openCart();

});


const cartBtn =
    document.getElementById("cartBtn");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const closeCart =
    document.getElementById("closeCart");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");


cartBtn.addEventListener("click", openCart);


closeCart.addEventListener("click", closeCartSidebar);


cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


function openCart() {

    cartSidebar.classList.add("show");

    cartOverlay.classList.add("show");

    document.body.classList.add("no-scroll");

    renderCart();

}


function closeCartSidebar() {

    cartSidebar.classList.remove("show");

    cartOverlay.classList.remove("show");

    document.body.classList.remove("no-scroll");

}




function renderCart() {

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

    }


    let total = 0;

    let count = 0;


    cart.forEach((item, index) => {

        total +=
            item.price *
            item.quantity;

        count += item.quantity;


        const div =
            document.createElement("div");


        div.classList.add("cart-item");


        div.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    Size: ${item.size}
                </p>

                <p>
                    RM ${item.price.toFixed(2)}
                </p>

                <div class="quantity">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                onclick="removeItem(${index})"
            >
                REMOVE
            </button>

        `;


        cartItems.appendChild(div);

    });


    cartCount.textContent = count;

    cartTotal.textContent =
        `RM ${total.toFixed(2)}`;

}



function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

    renderCart();

}




function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    renderCart();

}


function saveCart() {

    localStorage.setItem(
        "noireCart",
        JSON.stringify(cart)
    );

    renderCart();

}



const checkoutBtn =
    document.getElementById("checkoutBtn");

const checkoutModal =
    document.getElementById("checkoutModal");

const closeCheckout =
    document.getElementById("closeCheckout");

const checkoutForm =
    document.getElementById("checkoutForm");

const orderMessage =
    document.getElementById("orderMessage");


checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;

    }


    checkoutModal.classList.add("show");

});


closeCheckout.addEventListener("click", () => {

    checkoutModal.classList.remove("show");

});


checkoutForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        orderMessage.textContent =
            "Thank you! Your order has been placed successfully.";


        cart = [];

        saveCart();

        checkoutForm.reset();

    }
);



const newsletterForm =
    document.getElementById("newsletterForm");

const newsletterMessage =
    document.getElementById("newsletterMessage");


newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        newsletterMessage.textContent =
            "Thank you for subscribing!";


        newsletterForm.reset();

    }
);




const menuBtn =
    document.getElementById("menuBtn");

const navLinks =
    document.getElementById("navLinks");


menuBtn.addEventListener("click", () => {

    navLinks.classList.toggle("show");

});


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("show");

        });

    });




document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeProductModal();

        closeCartSidebar();

        checkoutModal.classList.remove("show");

        searchBox.classList.remove("show");

    }

});




renderCart();
