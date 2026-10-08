
/* =========================================================
   DELTA 8 PULL TO REFRESH
   Reviews Slider ke swipe ke saath conflict na kare
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const deltaPullRefresh =
        document.getElementById("deltaPullRefresh");

    const deltaRefreshText =
        document.getElementById("deltaRefreshText");

    if (!deltaPullRefresh || !deltaRefreshText) return;


    /* =========================================
       SETTINGS
    ========================================= */

    const DELTA_PULL_LIMIT = 70;

    let deltaStartX = 0;
    let deltaStartY = 0;

    let deltaPulling = false;
    let deltaRefreshing = false;
    let deltaHorizontalGesture = false;


    /* =========================================
       CHECK INTERACTIVE / SLIDER ELEMENT
    ========================================= */

    function shouldIgnoreTouch(target) {

        if (!target) return false;

        /* Reviews slider ko ignore karein */
        if (target.closest(".reviews-slider")) {
            return true;
        }

        /* Dusre sliders agar future mein add hon */
        if (
            target.closest(".product-slider") ||
            target.closest(".swiper") ||
            target.closest("[data-slider]")
        ) {
            return true;
        }

        /* Buttons / links / forms par refresh na chale */
        if (
            target.closest("button") ||
            target.closest("a") ||
            target.closest("input") ||
            target.closest("textarea") ||
            target.closest("select")
        ) {
            return true;
        }

        return false;
    }


    /* =========================================
       RESET REFRESH AREA
    ========================================= */

    function resetPullRefresh() {

        deltaPullRefresh.style.height = "0px";

        deltaPullRefresh.classList.remove(
            "active",
            "ready",
            "refreshing"
        );

        deltaRefreshText.textContent =
            "Pull to refresh";

    }


    /* =========================================
       TOUCH START
    ========================================= */

    document.addEventListener(
        "touchstart",
        function (e) {

            /* Already refreshing */
            if (deltaRefreshing) return;


            /* Page top par hona zaroori hai */
            if (window.scrollY > 0) return;


            /* Slider / button / link etc. ignore */
            if (shouldIgnoreTouch(e.target)) return;


            const touch = e.touches[0];

            if (!touch) return;


            deltaStartX = touch.clientX;
            deltaStartY = touch.clientY;

            deltaPulling = true;
            deltaHorizontalGesture = false;

        },
        {
            passive: true
        }
    );


    /* =========================================
       TOUCH MOVE
    ========================================= */

    document.addEventListener(
        "touchmove",
        function (e) {

            if (!deltaPulling) return;

            if (deltaRefreshing) return;


            /*
             * Agar page top se neeche scroll ho gaya
             * to pull refresh cancel
             */

            if (window.scrollY > 0) {

                deltaPulling = false;

                resetPullRefresh();

                return;
            }


            const touch = e.touches[0];

            if (!touch) return;


            const currentX = touch.clientX;
            const currentY = touch.clientY;


            const moveX =
                currentX - deltaStartX;

            const moveY =
                currentY - deltaStartY;


            /* =====================================
               HORIZONTAL SWIPE DETECTION
            ===================================== */

            if (
                Math.abs(moveX) > Math.abs(moveY) &&
                Math.abs(moveX) > 10
            ) {

                deltaHorizontalGesture = true;

                deltaPulling = false;

                resetPullRefresh();

                return;

            }


            /* Horizontal gesture already detected */
            if (deltaHorizontalGesture) return;


            /* =====================================
               USER UPWARD SWIPE
            ===================================== */

            if (moveY <= 0) {

                resetPullRefresh();

                return;

            }


            /* =====================================
               PULL DISTANCE
            ===================================== */

            const pullDistance =
                Math.min(
                    moveY * 0.55,
                    DELTA_PULL_LIMIT
                );


            deltaPullRefresh.style.height =
                `${pullDistance}px`;

            deltaPullRefresh.classList.add(
                "active"
            );


            /* =====================================
               READY STATE
            ===================================== */

            if (
                pullDistance >=
                DELTA_PULL_LIMIT
            ) {

                deltaPullRefresh.classList.add(
                    "ready"
                );

                deltaRefreshText.textContent =
                    "Release to refresh";

            } else {

                deltaPullRefresh.classList.remove(
                    "ready"
                );

                deltaRefreshText.textContent =
                    "Pull to refresh";

            }

        },
        {
            passive: true
        }
    );


    /* =========================================
       TOUCH END
    ========================================= */

    document.addEventListener(
        "touchend",
        function () {

            if (!deltaPulling) return;


            deltaPulling = false;


            if (deltaRefreshing) return;


            if (deltaHorizontalGesture) {

                deltaHorizontalGesture = false;

                resetPullRefresh();

                return;

            }


            /* =====================================
               CHECK CURRENT PULL HEIGHT
            ===================================== */

            const currentHeight =
                parseInt(
                    getComputedStyle(
                        deltaPullRefresh
                    ).height
                ) || 0;


            /* =====================================
               REFRESH
            ===================================== */

            if (
                currentHeight >=
                DELTA_PULL_LIMIT
            ) {

                deltaRefreshing = true;


                deltaPullRefresh.style.height =
                    "65px";


                deltaPullRefresh.classList.add(
                    "active",
                    "refreshing"
                );


                deltaRefreshText.textContent =
                    "Refreshing...";


                /*
                 * Small delay taake
                 * refreshing animation nazar aaye
                 */

                setTimeout(function () {

                    window.location.reload();

                }, 700);


            } else {

                /* =================================
                   PULL COMPLETE NAHI HUA
                ================================= */

                resetPullRefresh();

            }

        },
        {
            passive: true
        }
    );


    /* =========================================
       TOUCH CANCEL
    ========================================= */

    document.addEventListener(
        "touchcancel",
        function () {

            if (!deltaPulling) return;

            deltaPulling = false;

            deltaHorizontalGesture = false;

            if (!deltaRefreshing) {
                resetPullRefresh();
            }

        },
        {
            passive: true
        }
    );

});
