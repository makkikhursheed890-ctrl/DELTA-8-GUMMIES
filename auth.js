import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* =========================================================
   STEP 1: FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyC_qydbDcYURlx4NjhSsnxnrI-5mAFFRec",
  authDomain: "delta-8-gummies.firebaseapp.com",
  projectId: "delta-8-gummies",
  storageBucket: "delta-8-gummies.firebasestorage.app",
  messagingSenderId: "271896761472",
  appId: "1:271896761472:web:5745400dce7b732220c265",
  measurementId: "G-XEQRNRD24F"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


/* =========================================================
   VARIABLES
========================================================= */

const $ = id => document.getElementById(id);

/* SESSION = 3 DAYS */
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

let loggedIn = false;
let signingUp = false;


/* =========================================================
   SIGNUP CHECK
========================================================= */

function hasSignedUp() {
  return localStorage.getItem("hasSignedUp") === "1";
}


/* =========================================================
   OPEN LOGIN / SIGNUP POPUP
========================================================= */

function openAuth(msg) {

  $("authNotice").textContent =
    msg || "Signup required for more access";

  $("authError").textContent = "";

  $("tabSignin").disabled = !hasSignedUp();

  showTab(hasSignedUp() ? "signin" : "signup");

  $("authOverlay").classList.add("show");
}


/* =========================================================
   CLOSE LOGIN / SIGNUP POPUP
========================================================= */

function closeAuth() {
  $("authOverlay").classList.remove("show");
}


/* =========================================================
   LOGIN / SIGNUP TABS
========================================================= */

function showTab(t) {

  $("signupForm").style.display =
    t === "signup" ? "block" : "none";

  $("signinForm").style.display =
    t === "signin" ? "block" : "none";

  $("tabSignup").classList.toggle(
    "active",
    t === "signup"
  );

  $("tabSignin").classList.toggle(
    "active",
    t === "signin"
  );
}


/* =========================================================
   UPDATE LOGIN BUTTON
========================================================= */

function updateUI(user) {

  loggedIn = !!user;

  $("authBtn").textContent =
    loggedIn ? "LOGOUT" : "LOGIN";
}


/* =========================================================
   WELCOME TOAST
========================================================= */

function toast(msg) {

  const t = $("welcomeToast");

  t.textContent = msg;

  t.style.display = "block";

  setTimeout(() => {
    t.style.display = "none";
  }, 4000);
}


/* =========================================================
   FIREBASE ERROR MESSAGES
========================================================= */

function errText(code) {

  const map = {

    "auth/email-already-in-use":
      "Ye email pehle se registered hai",

    "auth/invalid-email":
      "Email sahi nahi hai",

    "auth/weak-password":
      "Password kam az kam 6 characters ka rakhein",

    "auth/invalid-credential":
      "Email ya password galat hai. Pehle signup karein.",

    "auth/user-not-found":
      "Ye email registered nahi hai. Pehle signup karein.",

    "auth/wrong-password":
      "Password galat hai",

    "auth/too-many-requests":
      "Bohot koshishen ho gayin, thodi der baad try karein",

    "auth/network-request-failed":
      "Internet connection check karein",

    "auth/operation-not-allowed":
      "Firebase Console mein Email/Password sign-in enable nahi hai",

    "auth/configuration-not-found":
      "Firebase Console mein Authentication ka Get started nahi hua",

    "auth/unauthorized-domain":
      "Ye domain Firebase ke Authorized domains mein add nahi hai"
  };

  return (
    map[code] ||
    "Kuch masla aa gaya, dobara try karein"
  ) + " [" + code + "]";
}


/* =========================================================
   LOGIN / LOGOUT BUTTON
========================================================= */

$("authBtn").addEventListener(
  "click",
  async e => {

    e.preventDefault();
    e.stopPropagation();

    /* USER LOGGED IN */
    if (loggedIn) {

      /* Confirmation popup */
      $("logoutConfirm").classList.add("show");

    }

    /* USER NOT LOGGED IN */
    else {

      openAuth("Please sign in to continue");

    }

  },
  true
);


/* =========================================================
   LOGOUT CONFIRMATION
========================================================= */

/* CANCEL LOGOUT */

$("cancelLogout").addEventListener("click", () => {

  $("logoutConfirm").classList.remove("show");

});


/* CONFIRM LOGOUT */

$("confirmLogout").addEventListener(
  "click",
  async () => {

    try {

      /* Remove saved login time */
      localStorage.removeItem("loginTime");

      /* Firebase logout */
      await signOut(auth);

      /* Close confirmation popup */
      $("logoutConfirm").classList.remove("show");

    } catch (err) {

      console.error(
        "LOGOUT ERROR:",
        err.code,
        err.message
      );

    }

  }
);


/* =========================================================
   BLOCK WEBSITE UNTIL LOGIN
========================================================= */

document.addEventListener(
  "click",
  e => {

    if (loggedIn) return;

    /* Allow auth popup */
    if (
      e.target.closest("#authOverlay") ||
      e.target.closest("#logoutConfirm") ||
      e.target.closest("#authBtn")
    ) {
      return;
    }

    const el = e.target.closest(
      "a, button, input[type=submit], [role=button]"
    );

    if (!el) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    openAuth("Signup required for more access");

  },
  true
);


/* =========================================================
   CLOSE AUTH POPUP
========================================================= */

$("authClose").onclick = closeAuth;


/* =========================================================
   AUTH TABS
========================================================= */

$("tabSignup").onclick = () => {

  showTab("signup");

};


$("tabSignin").onclick = () => {

  if (hasSignedUp()) {

    showTab("signin");

  }

};


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

document
  .querySelectorAll(".toggle-pass")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      const input =
        btn.parentElement.querySelector("input");

      const show =
        input.type === "password";

      input.type =
        show ? "text" : "password";

      btn.querySelector("i").className =
        show
          ? "fa-solid fa-eye-slash"
          : "fa-solid fa-eye";

      btn.setAttribute(
        "aria-label",
        show
          ? "Hide password"
          : "Show password"
      );

    });

  });


/* =========================================================
   FORGOT PASSWORD
========================================================= */

$("forgotLink").addEventListener(
  "click",
  async e => {

    e.preventDefault();

    const email =
      $("signinForm")
        .elements["email"]
        .value
        .trim();

    if (!email) {

      $("authError").textContent =
        "Pehle upar Email likhein, phir Forgot password dabayein";

      return;

    }

    try {

      await sendPasswordResetEmail(
        auth,
        email
      );

      $("authError").textContent = "";

      $("authNotice").textContent =
        "Password reset link aapki email par bhej diya gaya hai. Inbox ya Spam check karein.";

    } catch (err) {

      console.error(
        "RESET ERROR:",
        err.code,
        err.message
      );

      $("authError").textContent =
        errText(err.code);

    }

  }
);


/* =========================================================
   SIGNUP
========================================================= */

$("signupForm").addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    const f =
      Object.fromEntries(
        new FormData(e.target)
      );

    signingUp = true;

    try {

      /* Create Firebase account */

      const cred =
        await createUserWithEmailAndPassword(
          auth,
          f.email.trim(),
          f.password
        );


      /* Save display name */

      await updateProfile(
        cred.user,
        {
          displayName: f.name.trim()
        }
      );


      /*
        Signup ke baad automatically logout
        User ko khud Sign In karna hoga
      */

      await signOut(auth);


      /* Remember that signup completed */

      localStorage.setItem(
        "hasSignedUp",
        "1"
      );


      /* Clear form */

      e.target.reset();


      /* Enable Sign In */

      $("tabSignin").disabled = false;


      /* Message */

      $("authNotice").textContent =
        "Signup successful! Ab Sign In karein";

      $("authError").textContent = "";


      /* Open Sign In */

      showTab("signin");

    } catch (err) {

      console.error(
        "SIGNUP ERROR:",
        err.code,
        err.message
      );

      $("authError").textContent =
        errText(err.code);

    } finally {

      signingUp = false;

    }

  }
);


/* =========================================================
   SIGN IN
========================================================= */

$("signinForm").addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    const f =
      Object.fromEntries(
        new FormData(e.target)
      );


    try {

      /*
        Login time successful login se pehle
        temporarily save karna
      */

      localStorage.setItem(
        "loginTime",
        Date.now()
      );


      /* Firebase Sign In */

      const cred =
        await signInWithEmailAndPassword(
          auth,
          f.email.trim(),
          f.password
        );


      /* Clear form */

      e.target.reset();


      /* Close login popup */

      closeAuth();


      /* Welcome message */

      toast(
        "Welcome to website, " +
        (cred.user.displayName || "User") +
        "!"
      );

    } catch (err) {

      /* Login failed */

      localStorage.removeItem(
        "loginTime"
      );

      console.error(
        "SIGNIN ERROR:",
        err.code,
        err.message
      );

      $("authError").textContent =
        errText(err.code);

    }

  }
);


/* =========================================================
   AUTH STATE + 3 DAY SESSION
========================================================= */

onAuthStateChanged(
  auth,
  user => {

    /*
      Signup ke waqt auth state change ko ignore karein
    */

    if (signingUp) return;


    /* User logged in */

    if (user) {

      const t =
        Number(
          localStorage.getItem("loginTime")
        );


      /*
        Agar loginTime nahi hai
        ya 3 days complete ho gaye hain
      */

      if (
        !t ||
        Date.now() - t > THREE_DAYS
      ) {

        localStorage.removeItem(
          "loginTime"
        );


        /* Automatic logout */

        signOut(auth);

        updateUI(null);

        return;

      }

    }


    /* Update LOGIN / LOGOUT button */

    updateUI(user);

  }
);