
/* =========================================================
   REVIEWS SLIDER  (3 dots, drag/swipe + auto slide)
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".reviews-slider");
    const track = document.querySelector(".reviews-track");
    const cards = document.querySelectorAll(".review-card");
    const dotsContainer = document.querySelector(".reviews-dots");

    if (!slider || !track || !cards.length || !dotsContainer) return;

    const TOTAL_DOTS = 3;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let autoSlide;


    function getVisibleCards() {

        if (window.innerWidth <= 767) {
            return 1;
        }

        return 3;
    }


    function getTotalSlides() {

        return Math.max(
            1,
            cards.length - getVisibleCards() + 1
        );

    }


    function getSlideFromDot(dotIndex) {

        const lastSlide = getTotalSlides() - 1;

        if (TOTAL_DOTS <= 1) return 0;

        return Math.round(
            dotIndex * lastSlide / (TOTAL_DOTS - 1)
        );

    }

    function getDotFromSlide(slideIndex) {

        const lastSlide = getTotalSlides() - 1;

        if (lastSlide <= 0) return 0;

        return Math.round(
            slideIndex * (TOTAL_DOTS - 1) / lastSlide
        );

    }


    function createDots() {

        dotsContainer.innerHTML = "";

        for (let i = 0; i < TOTAL_DOTS; i++) {

            const dot = document.createElement("button");

            dot.className = "review-dot";

            if (i === getDotFromSlide(currentIndex)) {
                dot.classList.add("active");
            }

            dot.setAttribute(
                "aria-label",
                "Go to review slide " + (i + 1)
            );

            dot.addEventListener("click", function () {

                currentIndex = getSlideFromDot(i);

                updateSlider();

                restartAutoSlide();

            });

            dotsContainer.appendChild(dot);

        }

    }


    function updateSlider() {

        if (currentIndex > getTotalSlides() - 1) {
            currentIndex = 0;
        }

        let step = cards[0].offsetWidth;

        if (cards.length > 1) {
            step = cards[1].offsetLeft - cards[0].offsetLeft;
        }

        const moveAmount = currentIndex * step;

        track.style.transform =
            `translate3d(-${moveAmount}px, 0, 0)`;


        const dots =
            dotsContainer.querySelectorAll(".review-dot");

        const activeDot = getDotFromSlide(currentIndex);

        dots.forEach(function (dot, index) {

            dot.classList.toggle(
                "active",
                index === activeDot
            );

        });

    }


    function nextSlide() {

        currentIndex++;

        if (currentIndex >= getTotalSlides()) {
            currentIndex = 0;
        }

        updateSlider();

    }


    function startAutoSlide() {

        clearInterval(autoSlide);

        autoSlide = setInterval(function () {

            nextSlide();

        }, 4000);

    }


    function restartAutoSlide() {

        clearInterval(autoSlide);

        startAutoSlide();

    }


    function dragStart(event) {

        isDragging = true;

        track.style.transition = "none";

        startX =
            event.type === "touchstart"
                ? event.touches[0].clientX
                : event.clientX;

        currentX = startX;

        clearInterval(autoSlide);

    }


    function dragMove(event) {

        if (!isDragging) return;

        currentX =
            event.type === "touchmove"
                ? event.touches[0].clientX
                : event.clientX;

    }


    function dragEnd() {

        if (!isDragging) return;

        isDragging = false;

        track.style.transition =
            "transform 0.45s ease";

        const difference =
            currentX - startX;

        const minimumSwipe = 50;


        if (difference < -minimumSwipe) {

            currentIndex++;

            if (currentIndex >= getTotalSlides()) {
                currentIndex = 0;
            }

        }


        else if (difference > minimumSwipe) {

            currentIndex--;

            if (currentIndex < 0) {
                currentIndex = getTotalSlides() - 1;
            }

        }


        updateSlider();

        startAutoSlide();

    }


    slider.addEventListener(
        "touchstart",
        dragStart,
        { passive: true }
    );

    slider.addEventListener(
        "touchmove",
        dragMove,
        { passive: true }
    );

    slider.addEventListener(
        "touchend",
        dragEnd
    );


    slider.addEventListener(
        "mousedown",
        dragStart
    );

    window.addEventListener(
        "mousemove",
        dragMove
    );

    window.addEventListener(
        "mouseup",
        dragEnd
    );


    slider.addEventListener("mouseenter", function () {

        clearInterval(autoSlide);

    });


    slider.addEventListener("mouseleave", function () {

        if (!isDragging) {
            startAutoSlide();
        }

    });


    window.addEventListener("resize", function () {

        currentIndex = Math.min(
            currentIndex,
            getTotalSlides() - 1
        );

        updateSlider();

    });


    createDots();

    updateSlider();

    startAutoSlide();

});


/* =========================================================
   FAQ ACCORDION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const faqItems = document.querySelectorAll(".faq-item");


    faqItems.forEach(function (item) {

        const question = item.querySelector(".faq-question");
        const icon = item.querySelector(".faq-icon");


        question.addEventListener("click", function () {

            const isAlreadyOpen =
                item.classList.contains("active");


            faqItems.forEach(function (faq) {

                faq.classList.remove("active");

                const faqIcon =
                    faq.querySelector(".faq-icon");

                faqIcon.textContent = "+";

            });


            if (!isAlreadyOpen) {

                item.classList.add("active");

                icon.textContent = "−";

            }

        });

    });

});


/* =========================================================
   CART + SEARCH + NAV STAR ANIMATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const cartToggle = document.getElementById("cartToggle");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartClose = document.getElementById("cartClose");
    const cartItemsEl = document.getElementById("cartItems");
    const cartTotalEl = document.getElementById("cartTotal");
    const cartCountEl = document.getElementById("cartCount");
    const navStar = document.getElementById("navStar");

    const searchToggle = document.getElementById("searchToggle");
    const searchBar = document.getElementById("searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose");
    const searchResults = document.getElementById("searchResults");

    const STORAGE_KEY = "site_cart";

    let cart = loadCart();


    /* =========================================
       HELPERS
    ========================================= */

    function loadCart() {

        try {

            return JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

        } catch (e) {

            return [];

        }

    }


    function saveCart() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(cart)
            );

        } catch (e) { }

    }


    function parsePrice(text) {

        const num =
            parseFloat(
                String(text)
                    .replace(/[^0-9.]/g, "")
            );

        return isNaN(num) ? 0 : num;

    }


    function formatPrice(num) {

        return "$" + num.toFixed(2);

    }


    function el(tag, className, text) {

        const node =
            document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text !== undefined) {
            node.textContent = text;
        }

        return node;

    }


    /* =========================================
       OPEN / CLOSE CART
    ========================================= */

    function openCart() {

        cartDrawer.classList.add("open");

        cartOverlay.classList.add("open");

        cartDrawer.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeCart() {

        cartDrawer.classList.remove("open");

        cartOverlay.classList.remove("open");

        cartDrawer.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    cartToggle.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            openCart();

        }
    );


    cartClose.addEventListener(
        "click",
        closeCart
    );


    cartOverlay.addEventListener(
        "click",
        closeCart
    );


    /* =========================================
       RENDER CART
    ========================================= */

    function renderCart() {

        cartItemsEl.innerHTML = "";


        if (!cart.length) {

            cartItemsEl.appendChild(
                el(
                    "li",
                    "cart-empty",
                    "Your cart is empty."
                )
            );

        }


        cart.forEach(function (item, index) {

            const li =
                el("li", "cart-item");


            if (item.image) {

                const img =
                    el("img");

                img.src =
                    item.image;

                img.alt =
                    item.title;

                li.appendChild(img);

            }


            const info =
                el(
                    "div",
                    "cart-item-info"
                );


            info.appendChild(
                el(
                    "h4",
                    "",
                    item.title
                )
            );


            info.appendChild(
                el(
                    "p",
                    "",
                    formatPrice(
                        item.price * item.qty
                    )
                )
            );


            const qty =
                el(
                    "div",
                    "cart-qty"
                );


            const minus =
                el(
                    "button",
                    "",
                    "−"
                );


            minus.addEventListener(
                "click",
                function () {

                    changeQty(
                        index,
                        -1
                    );

                }
            );


            const count =
                el(
                    "span",
                    "",
                    String(item.qty)
                );


            const plus =
                el(
                    "button",
                    "",
                    "+"
                );


            plus.addEventListener(
                "click",
                function () {

                    changeQty(
                        index,
                        1
                    );

                }
            );


            qty.append(
                minus,
                count,
                plus
            );


            info.appendChild(qty);


            const remove =
                el(
                    "button",
                    "cart-remove",
                    "Remove"
                );


            remove.addEventListener(
                "click",
                function () {

                    removeItem(index);

                }
            );


            li.append(
                info,
                remove
            );


            cartItemsEl.appendChild(li);

        });


        /* =========================================
           TOTAL + BADGE
        ========================================= */

        const totalQty =
            cart.reduce(
                function (sum, i) {

                    return sum + i.qty;

                },
                0
            );


        const totalPrice =
            cart.reduce(
                function (sum, i) {

                    return sum +
                        i.price * i.qty;

                },
                0
            );


        cartTotalEl.textContent =
            formatPrice(totalPrice);


        cartCountEl.textContent =
            totalQty;


        cartCountEl.classList.toggle(
            "show",
            totalQty > 0
        );


        navStar.classList.toggle(
            "cart-active",
            totalQty > 0
        );


        saveCart();

    }


    /* =========================================
       CART ACTIONS
    ========================================= */

    function addToCart(product) {

        const existing =
            cart.find(
                function (i) {

                    return i.title ===
                        product.title;

                }
            );


        if (existing) {

            existing.qty++;

        } else {

            cart.push({

                title:
                    product.title,

                price:
                    product.price,

                image:
                    product.image,

                qty:
                    1

            });

        }


        renderCart();

        openCart();

    }


    function changeQty(index, change) {

        cart[index].qty += change;


        if (cart[index].qty <= 0) {

            cart.splice(
                index,
                1
            );

        }


        renderCart();

    }


    function removeItem(index) {

        cart.splice(
            index,
            1
        );

        renderCart();

    }


    /* =========================================
       ADD TO CART BUTTONS
    ========================================= */

    document
        .querySelectorAll(".product-btn")
        .forEach(function (btn) {

            btn.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();


                    const card =
                        btn.closest(
                            ".product-card"
                        );


                    if (!card) return;


                    const titleEl =
                        card.querySelector(
                            ".product-info h3"
                        );


                    const priceEl =
                        card.querySelector(
                            ".product-price"
                        );


                    const imgEl =
                        card.querySelector(
                            ".product-image img"
                        );


                    addToCart({

                        title:
                            titleEl
                                ? titleEl.textContent.trim()
                                : "Product",

                        price:
                            priceEl
                                ? parsePrice(
                                    priceEl.textContent
                                )
                                : 0,

                        image:
                            imgEl
                                ? imgEl.getAttribute(
                                    "src"
                                )
                                : ""

                    });

                }
            );

        });


    /* =========================================================
       CHECKOUT BUTTON
       ADDED — EXISTING CART CODE REMOVE NAHI KIYA
    ========================================================= */

    const checkoutButton =
        document.querySelector(
            ".cart-checkout"
        );


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function (e) {

                /*
                 * Agar cart empty hai to checkout
                 * page par nahi jayega.
                 */

                if (!cart.length) {

                    e.preventDefault();

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                /*
                 * Latest cart ko save karo.
                 *
                 * Checkout.html isi "site_cart"
                 * ko read karega.
                 */

                saveCart();


                /*
                 * Checkout page par jao.
                 */

                e.preventDefault();

                window.location.href =
                    "checkout.html";

            }
        );

    }


    /* =========================================
       SEARCH BAR
    ========================================= */

    function openSearch() {

        searchBar.classList.add(
            "open"
        );

        searchInput.focus();

    }


    function closeSearch() {

        searchBar.classList.remove(
            "open"
        );

        searchInput.value = "";

        searchResults.innerHTML = "";

    }


    searchToggle.addEventListener(
        "click",
        function (e) {

            e.preventDefault();

            searchBar.classList.contains(
                "open"
            )
                ? closeSearch()
                : openSearch();

        }
    );


    searchClose.addEventListener(
        "click",
        closeSearch
    );


    function runSearch() {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        searchResults.innerHTML = "";


        if (!query) return;


        const matches = [];


        document
            .querySelectorAll(
                ".product-card"
            )
            .forEach(function (card) {

                const titleEl =
                    card.querySelector(
                        ".product-info h3"
                    );


                const priceEl =
                    card.querySelector(
                        ".product-price"
                    );


                if (
                    titleEl &&
                    titleEl.textContent
                        .toLowerCase()
                        .includes(query)
                ) {

                    matches.push({

                        card:
                            card,

                        title:
                            titleEl.textContent.trim(),

                        price:
                            priceEl
                                ? priceEl.textContent.trim()
                                : ""

                    });

                }

            });


        if (!matches.length) {

            searchResults.appendChild(
                el(
                    "li",
                    "no-result",
                    "No products found."
                )
            );

            return;

        }


        matches.forEach(
            function (m) {

                const li =
                    el("li");


                li.appendChild(
                    el(
                        "div",
                        "",
                        m.title
                    )
                );


                li.appendChild(
                    el(
                        "span",
                        "",
                        m.price
                    )
                );


                li.addEventListener(
                    "click",
                    function () {

                        goToProduct(
                            m.card
                        );

                    }
                );


                searchResults.appendChild(
                    li
                );

            }
        );

    }


    function goToProduct(card) {

        closeSearch();


        card.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });


        card.classList.add(
            "highlight"
        );


        setTimeout(
            function () {

                card.classList.remove(
                    "highlight"
                );

            },
            2000
        );

    }


    searchInput.addEventListener(
        "input",
        runSearch
    );


    searchInput.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Enter") {

                const first =
                    searchResults.querySelector(
                        "li:not(.no-result)"
                    );


                if (first) {
                    first.click();
                }

            }

        }
    );


    /* =========================================
       ESC KEY
    ========================================= */

    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                closeCart();

                closeSearch();

            }

        }
    );


    /* =========================================
       INITIALIZE
    ========================================= */

    renderCart();

});


/* =========================================================
   DYNAMIC TAB TITLE + FAVICON
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const DEFAULT_TITLE =
            "Delta 8 Gummies";


        const DEFAULT_ICON =
            "pictures/default-icon.png";


        document.title =
            DEFAULT_TITLE;


        function setFavicon(iconUrl) {

            let favicon =
                document.querySelector(
                    "#dynamic-favicon"
                );


            if (!favicon) {

                favicon =
                    document.createElement(
                        "link"
                    );

                favicon.id =
                    "dynamic-favicon";

                favicon.rel =
                    "icon";

                document.head.appendChild(
                    favicon
                );

            }


            favicon.type =
                "image/png";

            favicon.href =
                iconUrl;

        }


        function resetTab() {

            document.title =
                DEFAULT_TITLE;

            setFavicon(
                DEFAULT_ICON
            );

        }


        function updateTab(productCard) {

            if (!productCard) {

                resetTab();

                return;

            }


            const titleElement =
                productCard.querySelector(
                    ".product-info h3"
                );


            const imageElement =
                productCard.querySelector(
                    ".product-image img"
                );


            if (titleElement) {

                const productName =
                    titleElement
                        .textContent
                        .trim();


                if (productName) {

                    document.title =
                        productName;

                }

            }


            if (
                imageElement &&
                imageElement.src
            ) {

                setFavicon(
                    imageElement.src
                );

            }

        }


        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".product-btn"
                    );


                if (!button) return;


                const productCard =
                    button.closest(
                        ".product-card"
                    );


                if (!productCard) return;


                updateTab(
                    productCard
                );

            }
        );


        function checkCart() {

            const cartProducts =
                document.querySelectorAll(
                    ".cart .product-card, .cart-item, .cc-cart-item"
                );


            if (
                cartProducts.length === 0
            ) {

                resetTab();

            }

        }


        const observer =
            new MutationObserver(
                function () {

                    checkCart();

                }
            );


        observer.observe(
            document.body,
            {

                childList:
                    true,

                subtree:
                    true

            }
        );


        checkCart();

    }
);


/* =========================================================
   SMOOTH SCROLL WITH NAVBAR OFFSET
========================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        anchor => {

            anchor.addEventListener(
                "click",
                function (e) {

                    const targetId =
                        this.getAttribute(
                            "href"
                        );


                    if (
                        targetId === "#"
                    ) return;


                    const targetEl =
                        document.querySelector(
                            targetId
                        );


                    if (!targetEl) return;


                    e.preventDefault();


                    const navbar =
                        document.querySelector(
                            ".navbar"
                        );


                    const navbarHeight =
                        navbar
                            ? navbar.offsetHeight
                            : 0;


                    const targetPosition =
                        targetEl
                            .getBoundingClientRect()
                            .top +
                        window.pageYOffset -
                        navbarHeight -
                        10;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        }
    );


/* =========================================================
   DELTA 8 PULL TO REFRESH
========================================================= */

const deltaPullRefresh =
    document.getElementById(
        "deltaPullRefresh"
    );


const deltaRefreshText =
    document.getElementById(
        "deltaRefreshText"
    );


let deltaStartY = 0;
let deltaPulling = false;
let deltaRefreshing = false;

const DELTA_PULL_LIMIT = 70;


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
    "touchstart",
    function (e) {

        if (window.scrollY > 0) return;

        if (deltaRefreshing) return;

        deltaStartY =
            e.touches[0].clientY;

        deltaPulling = true;

    },
    {
        passive: true
    }
);


/* =========================================================
   TOUCH MOVE
========================================================= */

document.addEventListener(
    "touchmove",
    function (e) {

        if (!deltaPulling) return;

        if (deltaRefreshing) return;


        if (window.scrollY > 0) {

            deltaPulling = false;

            return;

        }


        const currentY =
            e.touches[0].clientY;


        const distance =
            currentY - deltaStartY;


        if (distance <= 0) {

            if (deltaPullRefresh) {

                deltaPullRefresh.style.height =
                    "0px";

                deltaPullRefresh.classList.remove(
                    "active",
                    "ready"
                );

            }

            return;

        }


        const pullDistance =
            Math.min(
                distance * 0.55,
                DELTA_PULL_LIMIT
            );


        if (deltaPullRefresh) {

            deltaPullRefresh.style.height =
                `${pullDistance}px`;


            deltaPullRefresh.classList.add(
                "active"
            );

        }


        if (
            pullDistance >=
            DELTA_PULL_LIMIT
        ) {

            if (deltaPullRefresh) {

                deltaPullRefresh.classList.add(
                    "ready"
                );

            }


            if (deltaRefreshText) {

                deltaRefreshText.textContent =
                    "Release to refresh";

            }

        } else {

            if (deltaPullRefresh) {

                deltaPullRefresh.classList.remove(
                    "ready"
                );

            }


            if (deltaRefreshText) {

                deltaRefreshText.textContent =
                    "Pull to refresh";

            }

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   TOUCH END
========================================================= */

document.addEventListener(
    "touchend",
    function () {

        if (!deltaPulling) return;

        deltaPulling = false;


        if (deltaRefreshing) return;


        const currentHeight =
            deltaPullRefresh
                ? parseInt(
                    getComputedStyle(
                        deltaPullRefresh
                    ).height
                ) || 0
                : 0;


        if (
            currentHeight >=
            DELTA_PULL_LIMIT
        ) {

            deltaRefreshing = true;


            if (deltaPullRefresh) {

                deltaPullRefresh.style.height =
                    "65px";


                deltaPullRefresh.classList.add(
                    "refreshing"
                );

            }


            if (deltaRefreshText) {

                deltaRefreshText.textContent =
                    "Refreshing...";

            }


            setTimeout(
                function () {

                    window.location.reload();

                },
                700
            );


        } else {

            if (deltaPullRefresh) {

                deltaPullRefresh.style.height =
                    "0px";


                deltaPullRefresh.classList.remove(
                    "active",
                    "ready"
                );

            }


            if (deltaRefreshText) {

                deltaRefreshText.textContent =
                    "Pull to refresh";

            }

        }

    },
    {
        passive: true
    }
);
