/* =====================================================
   ELEVATE STORE ASSISTANT
   - Chatbot (products, shipping, cart, login, discount, FAQ, contact)
   - Scroll-to-top button
   - Chatbot 10 seconds baad show hoga
   - Scrolling ke waqt Scroll-to-top button chatbot ki jagah aayega

   Use: index.html me </body> se pehle ye line add karo:
        <script src="chatbot.js"></script>

   CSS aur HTML ye file khud inject karti hai.
===================================================== */

(function () {
    "use strict";

    if (window.__elevateAssistant) {
        return;
    }

    window.__elevateAssistant = true;

    /* =====================================================
       SETTINGS
    ===================================================== */

    var BRAND = "#2c514e";
    var BRAND_DARK = "#223f3d";

    var SCROLL_SHOW_AFTER = 50;
    var SUPPORT_EMAIL_FALLBACK = "support@elevateight.com";
    var SUPPORT_PHONE_FALLBACK = "(877) 355-0033";

    /* =====================================================
       CSS
    ===================================================== */

    var CSS = `
.ew-root, .ew-root * {
    box-sizing: border-box;
}

.ew-root {
    font-family: "Poppins", "Inter", system-ui, Arial, sans-serif;
    --ew-brand: ${BRAND};
    --ew-brand-dark: ${BRAND_DARK};
}

.ew-root button {
    font-family: inherit;
    margin: 0;
    text-transform: none;
    letter-spacing: normal;
}

/* ---------- SCROLL TO TOP ---------- */

.ew-top {
    position: fixed;
    right: 22px;
    bottom: 22px;
    width: 46px;
    height: 46px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: #fff;
    color: var(--ew-brand);
    cursor: pointer;
    z-index: 8999;
    box-shadow: 0 6px 18px rgba(0, 0, 0, .22);
    opacity: 0;
    visibility: hidden;
    transform: translateY(14px) scale(.9);
    transition: opacity .3s, transform .3s, visibility .3s,
                background .2s, color .2s;
    -webkit-tap-highlight-color: transparent;
}

.ew-top.show {
    opacity: 1;
    visibility: visible;
    transform: none;
}

.ew-top:hover {
    background: var(--ew-brand);
    color: #fff;
}

.ew-top:focus-visible,
.ew-fab:focus-visible {
    outline: 3px solid rgba(44, 81, 78, .45);
    outline-offset: 3px;
}

.ew-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    pointer-events: none;
}

.ew-ring circle {
    fill: none;
    stroke-width: 3;
}

.ew-ring-bg {
    stroke: rgba(0, 0, 0, .08);
}

.ew-ring-bar {
    stroke: var(--ew-brand);
    stroke-linecap: round;
    stroke-dasharray: 131.95;
    stroke-dashoffset: 131.95;
    transition: stroke .2s;
}

.ew-top:hover .ew-ring-bar {
    stroke: #fff;
}

.ew-arrow {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform .25s;
}

.ew-top:hover .ew-arrow {
    transform: translateY(-2px);
}

/* ---------- CHAT BUTTON ---------- */

.ew-fab {
    position: fixed;
    right: 22px;
    bottom: 22px;
    width: 60px;
    height: 60px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--ew-brand), #3f7872);
    color: #fff;
    cursor: pointer;
    z-index: 9000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 22px rgba(0, 0, 0, .28);
    transition: transform .2s;
    -webkit-tap-highlight-color: transparent;
}

.ew-fab:hover {
    transform: scale(1.06);
}

.ew-fab::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--ew-brand);
    opacity: .45;
    z-index: -1;
    animation: ew-pulse 2.4s ease-out infinite;
}

.ew-fab svg {
    width: 28px;
    height: 28px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform .3s, opacity .2s;
}

.ew-fab .ew-ico-close {
    position: absolute;
    opacity: 0;
    transform: rotate(-90deg) scale(.6);
}

.ew-open .ew-fab .ew-ico-chat {
    opacity: 0;
    transform: rotate(90deg) scale(.6);
}

.ew-open .ew-fab .ew-ico-close {
    opacity: 1;
    transform: none;
}

.ew-open .ew-fab::before {
    animation: none;
    opacity: 0;
}

.ew-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ef4444;
    border: 2px solid #fff;
}

.ew-dot.hide {
    display: none;
}

.ew-tip {
    position: fixed;
    right: 92px;
    bottom: 34px;
    background: #fff;
    color: #222;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 14px;
    border-radius: 999px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, .18);
    z-index: 9000;
    pointer-events: none;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(10px);
    transition: opacity .4s, transform .4s;
}

.ew-tip.show {
    opacity: 1;
    transform: none;
}

/* ---------- CHAT PANEL ---------- */

.ew-panel {
    position: fixed;
    right: 22px;
    bottom: 96px;
    width: 365px;
    max-width: calc(100vw - 24px);
    height: 540px;
    max-height: calc(100vh - 120px);
    background: #fff;
    border: 1px solid #e5e7e7;
    border-radius: 16px;
    box-shadow: 0 18px 50px rgba(0, 0, 0, .28);
    display: none;
    flex-direction: column;
    overflow: hidden;
    z-index: 9001;
}

.ew-open .ew-panel {
    display: flex;
    animation: ew-rise .25s ease;
}

.ew-open .ew-top {
    opacity: 0;
    visibility: hidden;
}

.ew-head {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--ew-brand);
    color: #fff;
    padding: 12px 12px 12px 14px;
}

.ew-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, .18);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.ew-avatar svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.ew-title {
    flex: 1;
    min-width: 0;
    line-height: 1.25;
}

.ew-title strong {
    display: block;
    font-size: 15px;
}

.ew-title span {
    font-size: 12px;
    opacity: .85;
}

.ew-close {
    border: none;
    background: rgba(255, 255, 255, .16);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
}

.ew-close:hover {
    background: rgba(255, 255, 255, .3);
}

.ew-msgs {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    background: #f7f8f8;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ew-msg {
    max-width: 90%;
    padding: 9px 12px;
    border-radius: 14px;
    font-size: 14px;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

.ew-msg .ew-msg-text {
    white-space: pre-line;
}

.ew-msg.bot {
    align-self: flex-start;
    background: #fff;
    color: #222;
    border: 1px solid #e6e9e9;
    border-bottom-left-radius: 4px;
}

.ew-msg.user {
    align-self: flex-end;
    background: var(--ew-brand);
    color: #fff;
    border-bottom-right-radius: 4px;
    white-space: pre-line;
}

.ew-msg.typing {
    display: flex;
    gap: 4px;
    padding: 12px 14px;
}

.ew-msg.typing span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9aa5a4;
    animation: ew-blink 1s infinite;
}

.ew-msg.typing span:nth-child(2) {
    animation-delay: .15s;
}

.ew-msg.typing span:nth-child(3) {
    animation-delay: .3s;
}

.ew-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 9px;
}

.ew-act {
    border: 1px solid var(--ew-brand);
    background: #fff;
    color: var(--ew-brand);
    padding: 6px 11px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
}

.ew-act:hover {
    background: var(--ew-brand);
    color: #fff;
}

.ew-chips {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding: 9px 12px;
    background: #fff;
    border-top: 1px solid #eee;
    scrollbar-width: thin;
}

.ew-chip {
    flex-shrink: 0;
    border: 1px solid #cfd8d7;
    background: #f3f7f6;
    color: #24403d;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.ew-chip:hover {
    background: var(--ew-brand);
    border-color: var(--ew-brand);
    color: #fff;
}

.ew-form {
    display: flex;
    gap: 8px;
    padding: 10px;
    margin: 0;
    border-top: 1px solid #eee;
    background: #fff;
}

.ew-form input {
    flex: 1;
    min-width: 0;
    height: 40px;
    margin: 0;
    padding: 0 14px;
    border: 1px solid #d9dddd;
    border-radius: 999px;
    background: #fff;
    color: #222;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    box-shadow: none;
}

.ew-form input:focus {
    border-color: var(--ew-brand);
}

.ew-send {
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--ew-brand);
    color: #fff;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ew-send svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* Cart/login popup khula ho to widget chhupao */
.ew-covered .ew-fab,
.ew-covered .ew-top,
.ew-covered .ew-tip,
.ew-covered .ew-panel {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

@keyframes ew-pulse {
    0% {
        transform: scale(1);
        opacity: .45;
    }

    70%, 100% {
        transform: scale(1.75);
        opacity: 0;
    }
}

@keyframes ew-rise {
    from {
        opacity: 0;
        transform: translateY(14px) scale(.98);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

@keyframes ew-blink {
    0%, 80%, 100% {
        opacity: .3;
    }

    40% {
        opacity: 1;
    }
}

@media (max-width: 480px) {
    .ew-fab {
        right: 22px;
        bottom: 22px;
        width: 56px;
        height: 56px;
    }

    .ew-top {
        right: 22px;
        bottom: 22px;
        width: 46px;
        height: 46px;
    }

    .ew-tip {
        right: 78px;
        bottom: 26px;
    }

    .ew-panel {
        right: 12px;
        bottom: 80px;
        width: calc(100vw - 24px);
        height: calc(100vh - 100px);
        max-height: 580px;
    }

    .ew-form input {
        font-size: 16px;
    }
}

/* ---------- CHAT / SCROLL BUTTON TIMING ---------- */

#ewRoot:not(.ew-ready) .ew-fab,
#ewRoot:not(.ew-ready) .ew-top,
#ewRoot:not(.ew-ready) .ew-tip {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

#ewRoot .ew-fab,
#ewRoot .ew-top {
    right: 22px !important;
    bottom: 22px !important;
    transition: opacity .25s ease, transform .25s ease,
                visibility .25s ease, background .2s, color .2s !important;
}

#ewRoot:not(.ew-scrolling) .ew-top {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

#ewRoot.ew-scrolling .ew-fab {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
}

#ewRoot.ew-scrolling .ew-top.show {
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    transform: none !important;
}

@media (prefers-reduced-motion: reduce) {
    .ew-fab::before,
    .ew-open .ew-panel {
        animation: none;
    }

    .ew-top,
    .ew-tip,
    .ew-fab svg {
        transition: none;
    }
}
`;

    /* =====================================================
       HTML
    ===================================================== */

    var HTML = `
<button type="button" class="ew-top" id="ewTop"
        aria-label="Scroll to top" title="Back to top">
    <svg class="ew-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle class="ew-ring-bg" cx="24" cy="24" r="21"></circle>
        <circle class="ew-ring-bar" id="ewRing" cx="24" cy="24" r="21"></circle>
    </svg>
    <svg class="ew-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7"></path>
    </svg>
</button>

<span class="ew-tip" id="ewTip">Hi! Need help? \u{1F44B}</span>

<button type="button" class="ew-fab" id="ewFab"
        aria-label="Chat with us" aria-expanded="false">
    <svg class="ew-ico-chat" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.6-.8L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"></path>
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"></path>
    </svg>

    <svg class="ew-ico-close" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18"></path>
    </svg>

    <span class="ew-dot" id="ewDot"></span>
</button>

<div class="ew-panel" id="ewPanel" role="dialog" aria-label="Store assistant">
    <div class="ew-head">
        <div class="ew-avatar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="8" width="16" height="11" rx="3"></rect>
                <path d="M12 4v4M9 13h.01M15 13h.01M9.5 16.5h5"></path>
            </svg>
        </div>

        <div class="ew-title">
            <strong>Elevate Assistant</strong>
            <span>Products, cart, shipping &amp; more</span>
        </div>

        <button type="button" class="ew-close" id="ewClose"
                aria-label="Close chat">&times;</button>
    </div>

    <div class="ew-msgs" id="ewMsgs" aria-live="polite"></div>
    <div class="ew-chips" id="ewChips"></div>

    <form class="ew-form" id="ewForm" autocomplete="off">
        <input type="text" id="ewInput" placeholder="Ask a question..."
               maxlength="200" aria-label="Type your message">

        <button type="submit" class="ew-send" aria-label="Send">
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
        </button>
    </form>
</div>
`;

    /* =====================================================
       START
    ===================================================== */

    function init() {
        var style = document.createElement("style");
        style.id = "ewStyles";
        style.textContent = CSS;
        document.head.appendChild(style);

        var root = document.createElement("div");
        root.className = "ew-root";
        root.id = "ewRoot";
        root.innerHTML = HTML;
        document.body.appendChild(root);

        setup(root);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    /* =====================================================
       MAIN LOGIC
    ===================================================== */

    function setup(root) {
        var $ = function (id) {
            return document.getElementById(id);
        };

        var topBtn = $("ewTop");
        var ring = $("ewRing");
        var fab = $("ewFab");
        var dot = $("ewDot");
        var tip = $("ewTip");
        var panel = $("ewPanel");
        var closeBtn = $("ewClose");
        var msgs = $("ewMsgs");
        var chipsBox = $("ewChips");
        var form = $("ewForm");
        var input = $("ewInput");

        var reduceMotion = window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        var isOpen = false;
        var greeted = false;

        /* =================================================
           SCROLL BUTTON LOGIC
        ================================================= */

        var RING_LENGTH = 131.95;
        var ticking = false;
        var scrollIdleTimer = null;

        var CHAT_SHOW_DELAY = 10000;
        var SCROLL_IDLE_DELAY = 900;

        function updateScroll() {
            ticking = false;

            var y = window.pageYOffset ||
                document.documentElement.scrollTop || 0;

            var max = Math.max(
                1,
                (document.documentElement.scrollHeight || 0) -
                window.innerHeight
            );

            var progress = Math.min(1, Math.max(0, y / max));

            topBtn.classList.toggle("show", y > SCROLL_SHOW_AFTER);

            ring.style.strokeDashoffset =
                String(RING_LENGTH * (1 - progress));
        }

        function onScroll() {
            root.classList.add("ew-scrolling");

            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateScroll);
            }

            window.clearTimeout(scrollIdleTimer);

            scrollIdleTimer = window.setTimeout(function () {
                root.classList.remove("ew-scrolling");
            }, SCROLL_IDLE_DELAY);
        }

        window.addEventListener("scroll", onScroll, {
            passive: true
        });

        window.addEventListener("resize", updateScroll);

        topBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });

        // Page load ke 10 seconds baad chatbot show karein.
        window.setTimeout(function () {
            root.classList.add("ew-ready");
        }, CHAT_SHOW_DELAY);

        updateScroll();

        /* =================================================
           CART / LOGIN POPUP CHECK
        ================================================= */

        function isShown(el) {
            if (!el) {
                return false;
            }

            var cs = window.getComputedStyle(el);

            return cs.display !== "none" &&
                cs.visibility !== "hidden" &&
                parseFloat(cs.opacity || "1") > 0.05 &&
                cs.pointerEvents !== "none";
        }

        function updateCovered() {
            var covered = false;

            var drawer = $("cartDrawer");

            if (drawer && isShown(drawer)) {
                var r = drawer.getBoundingClientRect();

                if (
                    r.width > 0 &&
                    r.left < window.innerWidth - 10 &&
                    r.right > 10
                ) {
                    covered = true;
                }
            }

            var auth = $("authOverlay");

            if (auth && isShown(auth)) {
                covered = true;
            }

            root.classList.toggle("ew-covered", covered);
        }

        setInterval(updateCovered, 250);

        /* =================================================
           OPEN / CLOSE CHAT
        ================================================= */

        function openPanel() {
            isOpen = true;

            root.classList.add("ew-open");
            fab.setAttribute("aria-expanded", "true");
            fab.setAttribute("aria-label", "Close chat");

            dot.classList.add("hide");
            tip.classList.remove("show");

            if (!greeted) {
                greeted = true;

                botSay(
                    "Hi! I'm the Elevate assistant.\n" +
                    "Ask me about products, shipping, your cart, login or discounts, " +
                    "or pick a topic below.",
                    [A.products, A.cart]
                );
            }

            setTimeout(function () {
                input.focus();
            }, 60);
        }

        function closePanel() {
            isOpen = false;

            root.classList.remove("ew-open");
            fab.setAttribute("aria-expanded", "false");
            fab.setAttribute("aria-label", "Chat with us");
        }

        fab.addEventListener("click", function () {
            if (isOpen) {
                closePanel();
            } else {
                openPanel();
            }
        });

        closeBtn.addEventListener("click", closePanel);

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && isOpen) {
                closePanel();
            }
        });

        // Help label session mein ek baar show ho.
        try {
            if (!sessionStorage.getItem("ewTipShown")) {
                setTimeout(function () {
                    if (!isOpen) {
                        tip.classList.add("show");
                    }

                    setTimeout(function () {
                        tip.classList.remove("show");
                    }, 6000);

                    sessionStorage.setItem("ewTipShown", "1");
                }, 10500);
            }
        } catch (e) {
            /* Ignore sessionStorage errors */
        }

        /* =================================================
           PAGE SE DATA READ KARNA
        ================================================= */

        function norm(s) {
            return String(s || "").replace(/\s+/g, " ").trim();
        }

        function money(n) {
            return "$" + Number(n).toFixed(2);
        }

        function titleCase(s) {
            return norm(s).toLowerCase()
                .replace(/\b[a-z]/g, function (c) {
                    return c.toUpperCase();
                })
                .replace(/\b(Thc|Cbd|Hhc|Thcv)\b/g, function (m) {
                    return m.toUpperCase();
                });
        }

        function readCart() {
            try {
                var c = JSON.parse(
                    localStorage.getItem("site_cart") || "[]"
                );

                return Array.isArray(c) ? c : [];
            } catch (e) {
                return [];
            }
        }

        function cartInfo() {
            var items = readCart().map(function (p) {
                var price = Number(p.price);
                var qty = Number(p.qty);

                return {
                    title: norm(p.title) || "Product",
                    price: isFinite(price) ? price : 0,
                    qty: isFinite(qty) && qty > 0 ? qty : 1
                };
            });

            var total = items.reduce(function (sum, i) {
                return sum + i.price * i.qty;
            }, 0);

            var count = items.reduce(function (sum, i) {
                return sum + i.qty;
            }, 0);

            return {
                items: items,
                total: total,
                count: count
            };
        }

        function getProducts() {
            return [].slice.call(
                document.querySelectorAll(".product-card")
            ).map(function (card) {
                var h = card.querySelector(".product-info h3");
                var p = card.querySelector(".product-price");

                return {
                    title: titleCase(h ? h.textContent : ""),
                    price: norm(p ? p.textContent : "")
                };
            }).filter(function (p) {
                return p.title;
            });
        }

        function getFaqs() {
            return [].slice.call(
                document.querySelectorAll(".faq-item")
            ).map(function (item) {
                var q = item.querySelector(".faq-question span");
                var a = item.querySelector(".faq-answer");

                return {
                    q: norm(q ? q.textContent : ""),
                    a: norm(a ? a.textContent : "")
                };
            }).filter(function (f) {
                return f.q && f.a;
            });
        }

        function getShipping() {
            var bar = document.querySelector(".shipping-bar");
            var text = norm(bar ? bar.textContent : "");
            var m = text.match(/\$\s*([\d.]+)/);

            return {
                text: text,
                threshold: m ? parseFloat(m[1]) : null
            };
        }

        function getContact() {
            var email = SUPPORT_EMAIL_FALLBACK;
            var phone = SUPPORT_PHONE_FALLBACK;

            var mail = document.querySelector('a[href^="mailto:"]');

            if (mail) {
                email = mail.getAttribute("href")
                    .replace(/^mailto:/i, "")
                    .split("?")[0] || email;
            }

            var spans = [].slice.call(
                document.querySelectorAll(".footer-contact span")
            );

            spans.forEach(function (s) {
                var t = norm(s.textContent);

                if (/^phone/i.test(t)) {
                    phone = norm(
                        t.replace(/^phone\s*:?\s*/i, "")
                    ) || phone;
                }
            });

            return {
                email: email,
                phone: phone
            };
        }

        function authState() {
            var btn = $("authBtn");
            var text = norm(btn ? btn.textContent : "");

            return {
                exists: !!btn,
                loggedOut: !btn ||
                    /^(log\s?in|sign\s?in|sign\s?up|login)/i.test(text),
                text: text
            };
        }

        /* =================================================
           NAVIGATION HELPERS
        ================================================= */

        function scrollToEl(el) {
            if (!el) {
                return;
            }

            var nav = document.querySelector(".navbar");
            var offset = nav
                ? nav.getBoundingClientRect().height + 12
                : 12;

            var top = el.getBoundingClientRect().top +
                (window.pageYOffset || 0) - offset;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: reduceMotion ? "auto" : "smooth"
            });
        }

        function goTo(id) {
            scrollToEl(document.getElementById(id));
        }

        function goToHeading(word) {
            var heads = [].slice.call(
                document.querySelectorAll("h2")
            );

            for (var i = 0; i < heads.length; i++) {
                if (
                    heads[i].textContent.toUpperCase().indexOf(word) !== -1
                ) {
                    scrollToEl(heads[i]);
                    return;
                }
            }
        }

        function clickEl(id) {
            var el = $(id);

            if (el) {
                el.click();
            }
        }

        // Action se pehle chat band kar dein.
        function nav(fn) {
            return function () {
                closePanel();
                setTimeout(fn, 180);
            };
        }

        var A = {
            products: {
                label: "Shop products",
                run: nav(function () {
                    goTo("products");
                })
            },

            cart: {
                label: "Open cart",
                run: nav(function () {
                    clickEl("cartToggle");
                })
            },

            checkout: {
                label: "Go to checkout",
                run: nav(function () {
                    window.location.href = "checkout.html";
                })
            },

            login: {
                label: "Login / Sign up",
                run: nav(function () {
                    clickEl("authBtn");
                })
            },

            search: {
                label: "Open search",
                run: nav(function () {
                    clickEl("searchToggle");
                })
            },

            discount: {
                label: "Get 20% off",
                run: nav(function () {
                    goTo("vip-club");
                })
            },

            faq: {
                label: "See all FAQs",
                run: nav(function () {
                    goTo("faq");
                })
            },

            contact: {
                label: "Contact section",
                run: nav(function () {
                    goTo("contact");
                })
            },

            dosing: {
                label: "Dosing guide",
                run: nav(function () {
                    goToHeading("DOSING");
                })
            },

            effects: {
                label: "Effects guide",
                run: nav(function () {
                    goToHeading("EFFECTS");
                })
            },

            learn: {
                label: "Learn more",
                run: nav(function () {
                    goTo("learn-more");
                })
            },

            reviews: {
                label: "Customer reviews",
                run: nav(function () {
                    goTo("reviews");
                })
            },

            email: {
                label: "Email support",
                run: function () {
                    window.location.href =
                        "mailto:" + getContact().email;
                }
            }
        };

        /* =================================================
           SMART MATCHING (PRODUCTS + FAQ)
        ================================================= */

        var STOP = {};

        (
            "the a an is are of to in on for and or do does did how what when where why can i my me you your our " +
            "it this that with about from have has tell please there be at by am was were will would could should " +
            "so if as not no yes any some more"
        ).split(" ").forEach(function (w) {
            STOP[w] = true;
        });

        var GENERIC = {};

        (
            "price prices cost much buy shop order product products show want need get sell available one list have looking"
        ).split(" ").forEach(function (w) {
            GENERIC[w] = true;
        });

        function isNum(t) {
            return /^\d+$/.test(t);
        }

        function tokens(s) {
            return norm(s).toLowerCase()
                .replace(/[^a-z0-9% ]+/g, " ")
                .split(" ")
                .filter(function (t) {
                    return t && !STOP[t] && (t.length > 2 || isNum(t));
                });
        }

        function matchProducts(text) {
            var ut = tokens(text);
            var nums = ut.filter(isNum);
            var words = ut.filter(function (t) {
                return !isNum(t) && !GENERIC[t];
            });

            if (!words.length) {
                return {
                    list: [],
                    score: 0
                };
            }

            var best = 0;
            var scored = [];

            getProducts().forEach(function (p) {
                var pt = tokens(p.title);

                var numsOk = nums.every(function (n) {
                    return pt.indexOf(n) !== -1;
                });

                if (!numsOk) {
                    return;
                }

                var score = words.filter(function (w) {
                    return pt.indexOf(w) !== -1;
                }).length;

                if (score > 0) {
                    scored.push({
                        p: p,
                        score: score
                    });

                    if (score > best) {
                        best = score;
                    }
                }
            });

            return {
                list: scored.filter(function (s) {
                    return s.score === best;
                }).map(function (s) {
                    return s.p;
                }),
                score: best
            };
        }

        function matchFaq(text) {
            var ut = tokens(text).filter(function (t) {
                return !GENERIC[t];
            });

            if (!ut.length) {
                return {
                    faq: null,
                    score: 0
                };
            }

            var best = null;
            var bestScore = 0;

            getFaqs().forEach(function (f) {
                var qt = tokens(f.q);
                var at = tokens(f.a);
                var score = 0;

                ut.forEach(function (w) {
                    if (qt.indexOf(w) !== -1) {
                        score += 1;
                    } else if (at.indexOf(w) !== -1) {
                        score += 0.25;
                    }
                });

                if (score > bestScore) {
                    bestScore = score;
                    best = f;
                }
            });

            return {
                faq: best,
                score: bestScore
            };
        }

        function sentenceCase(s) {
            s = norm(s).toLowerCase();

            return s.charAt(0).toUpperCase() +
                s.slice(1)
                    .replace(/\bdelta (\d+)/g, "Delta $1")
                    .replace(/\bthc\b/g, "THC");
        }

        /* =================================================
           ANSWERS
        ================================================= */

        function productReply(text) {
            var m = matchProducts(text || "");
            var all = getProducts();

            if (!all.length) {
                return {
                    text: "You can see all products in the Products section.",
                    actions: [A.products]
                };
            }

            if (m.list.length) {
                return {
                    text: "Here's what I found:\n" +
                        m.list.map(function (p) {
                            return "\u2022 " + p.title + " \u2013 " + p.price;
                        }).join("\n") +
                        "\n\nTap ADD TO CART on the product card to add it.",
                    actions: [A.products, A.cart]
                };
            }

            return {
                text: "Our products:\n" +
                    all.map(function (p) {
                        return "\u2022 " + p.title + " \u2013 " + p.price;
                    }).join("\n") +
                    "\n\nTap ADD TO CART on the product you want.",
                actions: [A.products, A.cart]
            };
        }

        function shippingReply() {
            var s = getShipping();
            var c = cartInfo();

            var text = s.threshold
                ? "Free shipping on orders over " +
                    money(s.threshold).replace(".00", "") + "."
                : (s.text
                    ? sentenceCase(s.text) + "."
                    : "Shipping details are shown at checkout.");

            if (s.threshold && c.total > 0) {
                if (c.total > s.threshold) {
                    text += "\n\nYour cart is " + money(c.total) +
                        ", so you qualify for free shipping.";
                } else {
                    text += "\n\nYour cart is " + money(c.total) +
                        ". Add " + money(s.threshold - c.total) +
                        " more to get free shipping.";
                }
            }

            text += "\n\nShipping for smaller orders is shown at checkout.";

            return {
                text: text,
                actions: [A.products, A.cart]
            };
        }

        function cartReply() {
            var c = cartInfo();

            if (!c.items.length) {
                return {
                    text: "Your cart is empty right now.\n" +
                        "Tap ADD TO CART on any product, then open the cart (cart icon, top right).",
                    actions: [A.products]
                };
            }

            return {
                text: "In your cart (" + c.count + " item" +
                    (c.count === 1 ? "" : "s") + "):\n" +
                    c.items.map(function (i) {
                        return "\u2022 " + i.qty + " \u00d7 " + i.title +
                            " \u2013 " + money(i.price * i.qty);
                    }).join("\n") +
                    "\n\nSubtotal: " + money(c.total),
                actions: [A.cart, A.checkout]
            };
        }

        function orderReply() {
            return {
                text: "How to order:\n" +
                    "1. Tap ADD TO CART on a product.\n" +
                    "2. Open the cart (cart icon, top right).\n" +
                    "3. Tap Checkout.\n" +
                    "4. Fill your details, choose a payment method and tap Place Order.\n\n" +
                    "Payment options and the final total are shown on the checkout page, which also has its own help chat if you get stuck.",
                actions: [A.products, A.cart]
            };
        }

        function accountReply() {
            var st = authState();

            if (st.exists && !st.loggedOut) {
                return {
                    text: "You're already signed in. To log out, use the button in the top menu (it shows " + st.text + ").",
                    actions: []
                };
            }

            return {
                text: "To create an account or sign in, tap LOGIN in the top menu.\n" +
                    "\u2022 Sign Up: full name, email and a password (minimum 6 characters).\n" +
                    "\u2022 Sign In: email and password.\n" +
                    "\u2022 Forgot your password? Open Sign In and tap \"Forgot password?\".",
                actions: [A.login]
            };
        }

        function discountReply() {
            return {
                text: "Take 20% off your first order! Enter your email in the discount box (VIP Club section) and tap GET DISCOUNT.\n\n" +
                    "If you're not sure how the discount is applied to your order, please contact support.",
                actions: [A.discount, A.email]
            };
        }

        function contactReply() {
            var c = getContact();

            return {
                text: "You can reach us here:\n" +
                    "Phone: " + c.phone + "\n" +
                    "Email: " + c.email + "\n\n" +
                    "For order questions, please include your Order ID.",
                actions: [A.email, A.contact]
            };
        }

        function orderStatusReply() {
            var c = getContact();

            return {
                text: "Order status, tracking and delivery times aren't available in this chat.\n" +
                    "Please contact support with your Order ID:\n" +
                    c.phone + "  |  " + c.email,
                actions: [A.email]
            };
        }

        function returnsReply() {
            var c = getContact();

            return {
                text: "You'll find the Refund/Return Policy link at the bottom of the page.\n" +
                    "For a specific order (cancel, return, damaged or wrong item), please contact support with your Order ID:\n" +
                    c.phone + "  |  " + c.email,
                actions: [A.email]
            };
        }

        function qualityReply() {
            return {
                text: "Elevate states that every batch is rigorously tested.\n" +
                    "You'll find a LAB TEST link in the footer. If you need a specific lab report, please ask support.",
                actions: [A.learn, A.email]
            };
        }

        function legalReply() {
            return {
                text: "From our footer: all products are Federal Farm Bill compliant and contain less than 0.3% THC.\n\n" +
                    "Laws can differ by state or country, so please check the rules where you live before ordering.",
                actions: [A.contact]
            };
        }

        function medicalReply() {
            return {
                text: "I can't give medical advice.\n" +
                    "The statements about these products have not been evaluated by the FDA, and the products are not intended to diagnose, treat, cure or prevent any disease.\n" +
                    "Please consult your health physician before use.",
                actions: [A.faq]
            };
        }

        function dosingReply() {
            return {
                text: "Please read the \"Dosing Delta 8 Gummies\" section on this page and the label on your product for serving instructions. " +
                    "The guide there says to \"start low and go slow\".\n\n" +
                    "For personal health questions, please consult your health physician.",
                actions: [A.dosing, A.faq]
            };
        }

        function effectsReply() {
            return {
                text: "You can read about this in the \"Effects of Delta 8 Gummies\" section and in our FAQ below. " +
                    "Everyone's experience is different.",
                actions: [A.effects, A.faq]
            };
        }

        function ageReply() {
            var c = getContact();

            return {
                text: "I don't have age-requirement details in this chat. Please check with support before ordering:\n" +
                    c.phone + "  |  " + c.email,
                actions: [A.email]
            };
        }

        function searchReply() {
            return {
                text: "Use the magnifying-glass icon (top right) to search products, or tell me what you're looking for and I'll check.",
                actions: [A.search, A.products]
            };
        }

        function reviewsReply() {
            return {
                text: "You can read what customers say in the Customer Reviews section.",
                actions: [A.reviews]
            };
        }

        function faqReply(f) {
            return {
                text: "From our FAQ:\n" + sentenceCase(f.q) + "\n" + f.a,
                actions: [A.faq]
            };
        }

        function fallbackReply() {
            var c = getContact();

            return {
                text: "I'm not sure about that one.\n" +
                    "I can help with products, shipping, your cart, login, discounts and our FAQ.\n" +
                    "For anything else, contact support: " + c.phone + " | " + c.email,
                actions: [A.products, A.email]
            };
        }

        var INTENTS = [
            {
                keys: [
                    "product", "products", "price", "prices", "cost of",
                    "catalog", "what do you sell", "what do you have",
                    "flavor", "flavour", "available", "menu",
                    "show me", "what can i buy"
                ],
                reply: productReply
            },
            {
                keys: [
                    "shipping", "free shipping", "delivery charge",
                    "delivery fee", "delivery cost", "postage",
                    "ship to", "ship my"
                ],
                reply: shippingReply
            },
            {
                keys: [
                    "my cart", "cart", "basket", "what's in",
                    "whats in", "items in"
                ],
                reply: cartReply
            },
            {
                keys: [
                    "checkout", "check out", "place order", "how to order",
                    "how do i order", "how can i order", "payment",
                    "pay ", "paying", "how to buy", "purchase"
                ],
                reply: orderReply
            },
            {
                keys: [
                    "login", "log in", "sign in", "signin", "sign up",
                    "signup", "register", "account", "password",
                    "forgot", "reset"
                ],
                reply: accountReply
            },
            {
                keys: [
                    "discount", "coupon", "promo", "20%", "offer",
                    "vip", "first order", "deal", "sale", "voucher"
                ],
                reply: discountReply
            },
            {
                keys: [
                    "track", "tracking", "order status", "where is my",
                    "where's my", "arrive", "delivery time", "how long will",
                    "shipped", "deliver"
                ],
                reply: orderStatusReply
            },
            {
                keys: [
                    "refund", "return", "exchange", "cancel", "damaged",
                    "wrong item", "money back", "broken"
                ],
                reply: returnsReply
            },
            {
                keys: [
                    "contact", "support", "phone", "call you", "email",
                    "human", "agent", "customer service", "speak",
                    "talk to", "wholesale", "affiliate", "help desk"
                ],
                reply: contactReply
            },
            {
                keys: [
                    "lab test", "lab report", "coa", "certificate",
                    "third party", "third-party", "tested", "quality",
                    "ingredient"
                ],
                reply: qualityReply
            },
            {
                keys: [
                    "legal", "farm bill", "federal", "fda", "0.3",
                    "law ", "laws", "illegal"
                ],
                reply: legalReply
            },
            {
                keys: [
                    "doctor", "medical", "medication", "pregnan", "pain",
                    "anxiety", "depress", "insomnia", "cure", "treat",
                    "disease", "side effect", "interact", "prescription",
                    "diagnos"
                ],
                reply: medicalReply
            },
            {
                keys: [
                    "dose", "dosing", "dosage", "how many gummies",
                    "how many to", "serving", "half a gummy", "beginner",
                    "first time", "new to"
                ],
                reply: dosingReply
            },
            {
                keys: ["effects", "feel like", "what will i feel", "high"],
                reply: effectsReply
            },
            {
                keys: [
                    "age limit", "age requirement", "how old",
                    "minimum age", "21", "18+", "minor", "underage"
                ],
                reply: ageReply
            },
            {
                keys: ["search", "find a product", "looking for"],
                reply: searchReply
            },
            {
                keys: ["review", "reviews", "testimonial", "feedback", "rating"],
                reply: reviewsReply
            },
            {
                keys: [
                    "thanks", "thank you", "thx", "shukriya",
                    "shukria", "appreciate"
                ],
                reply: function () {
                    return {
                        text: "You're welcome! Anything else I can help with?",
                        actions: []
                    };
                }
            },
            {
                keys: [
                    "bye", "goodbye", "see you", "that's all",
                    "thats all", "no thanks"
                ],
                reply: function () {
                    return {
                        text: "Thanks for visiting Elevate. Have a great day!",
                        actions: []
                    };
                }
            }
        ];

        function findIntent(text) {
            var t = text.toLowerCase();
            var best = null;
            var bestScore = 0;

            INTENTS.forEach(function (intent) {
                var score = 0;

                intent.keys.forEach(function (key) {
                    if (t.indexOf(key) !== -1) {
                        score += key.length > 4 ? 2 : 1;
                    }
                });

                if (score > bestScore) {
                    bestScore = score;
                    best = intent;
                }
            });

            return best;
        }

        function answerFor(text) {
            var t = text.trim();
            var low = t.toLowerCase();

            if (/^(hi|hello|hey|salam|salaam|assalam|assalamualaikum|aoa|helo|good (morning|evening|afternoon))\b/.test(low)) {
                return {
                    text: "Hello! What can I help you with today?",
                    actions: [A.products, A.cart]
                };
            }

            var pm = matchProducts(t);
            var fm = matchFaq(t);
            var intent = findIntent(low);

            if (fm.faq && fm.score >= 3 && fm.score > pm.score + 1) {
                return faqReply(fm.faq);
            }

            if (intent) {
                return intent.reply(t);
            }

            if (pm.list.length && pm.score >= 1 && pm.score >= fm.score) {
                return productReply(t);
            }

            if (fm.faq && fm.score >= 2) {
                return faqReply(fm.faq);
            }

            return fallbackReply();
        }

        /* =================================================
           CHAT UI
        ================================================= */

        var CHIPS = [
            "Show products",
            "Shipping info",
            "My cart",
            "How to order",
            "Login / Sign up",
            "20% discount",
            "Contact support"
        ];

        function scrollMsgs() {
            msgs.scrollTop = msgs.scrollHeight;
        }

        function addUser(text) {
            var div = document.createElement("div");
            div.className = "ew-msg user";
            div.textContent = text;
            msgs.appendChild(div);
            scrollMsgs();
        }

        function addBot(text, actions) {
            var div = document.createElement("div");
            var p = document.createElement("div");

            div.className = "ew-msg bot";
            p.className = "ew-msg-text";
            p.textContent = text;
            div.appendChild(p);

            if (actions && actions.length) {
                var box = document.createElement("div");
                box.className = "ew-actions";

                actions.forEach(function (a) {
                    var b = document.createElement("button");

                    b.type = "button";
                    b.className = "ew-act";
                    b.textContent = a.label;
                    b.addEventListener("click", a.run);

                    box.appendChild(b);
                });

                div.appendChild(box);
            }

            msgs.appendChild(div);
            scrollMsgs();
        }

        function botSay(text, actions) {
            var typing = document.createElement("div");

            typing.className = "ew-msg bot typing";
            typing.innerHTML = "<span></span><span></span><span></span>";

            msgs.appendChild(typing);
            scrollMsgs();

            setTimeout(function () {
                if (typing.parentNode) {
                    typing.parentNode.removeChild(typing);
                }

                addBot(text, actions);
            }, 450);
        }

        function handleUser(text) {
            text = String(text || "").trim();

            if (!text) {
                return;
            }

            addUser(text);

            var reply = answerFor(text);
            botSay(reply.text, reply.actions);
        }

        CHIPS.forEach(function (label) {
            var chip = document.createElement("button");

            chip.type = "button";
            chip.className = "ew-chip";
            chip.textContent = label;

            chip.addEventListener("click", function () {
                handleUser(label);
            });

            chipsBox.appendChild(chip);
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            handleUser(input.value);
            input.value = "";
        });
    }
})();