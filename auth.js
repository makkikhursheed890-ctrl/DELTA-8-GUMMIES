import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile, onAuthStateChanged, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================================================
   STEP 1: Firebase Console se mili apni details yahan daalo
========================================================= */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const $ = id => document.getElementById(id);
const ONE_DAY = 24 * 60 * 60 * 1000;
let loggedIn = false;
let signingUp = false;

function hasSignedUp() { return localStorage.getItem("hasSignedUp") === "1"; }

function openAuth(msg) {
  $("authNotice").textContent = msg || "Signup required for more access";
  $("authError").textContent = "";
  $("tabSignin").disabled = !hasSignedUp();
  showTab(hasSignedUp() ? "signin" : "signup");
  $("authOverlay").classList.add("show");
}
function closeAuth() { $("authOverlay").classList.remove("show"); }

function showTab(t) {
  $("signupForm").style.display = t === "signup" ? "block" : "none";
  $("signinForm").style.display = t === "signin" ? "block" : "none";
  $("tabSignup").classList.toggle("active", t === "signup");
  $("tabSignin").classList.toggle("active", t === "signin");
}

function updateUI(user) {
  loggedIn = !!user;
  $("authBtn").textContent = loggedIn ? "LOGOUT" : "LOGIN";
}

function toast(msg) {
  const t = $("welcomeToast");
  t.textContent = msg; t.style.display = "block";
  setTimeout(() => t.style.display = "none", 4000);
}

function errText(code) {
  const map = {
    "auth/email-already-in-use": "Ye email pehle se registered hai",
    "auth/invalid-email": "Email sahi nahi hai",
    "auth/weak-password": "Password kam az kam 6 characters ka rakhein",
    "auth/invalid-credential": "Email ya password galat hai. Pehle signup karein.",
    "auth/user-not-found": "Ye email registered nahi hai. Pehle signup karein.",
    "auth/wrong-password": "Password galat hai",
    "auth/too-many-requests": "Bohot koshishen ho gayin, thodi der baad try karein",
    "auth/network-request-failed": "Internet connection check karein",
    "auth/operation-not-allowed": "Firebase Console mein Email/Password sign-in enable nahi hai",
    "auth/configuration-not-found": "Firebase Console mein Authentication ka Get started nahi hua",
    "auth/unauthorized-domain": "Ye domain Firebase ke Authorized domains mein add nahi hai"
  };
  return (map[code] || "Kuch masla aa gaya, dobara try karein") + " [" + code + "]";
}

/* Login / Logout button */
$("authBtn").addEventListener("click", async e => {
  e.preventDefault(); e.stopPropagation();
  if (loggedIn) {
    localStorage.removeItem("loginTime");
    await signOut(auth);
  } else {
    openAuth("Please sign in to continue");
  }
}, true);

/* Jab tak login na ho, har link/button block */
document.addEventListener("click", e => {
  if (loggedIn) return;
  if (e.target.closest("#authOverlay") || e.target.closest("#authBtn")) return;
  const el = e.target.closest("a, button, input[type=submit], [role=button]");
  if (!el) return;
  e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
  openAuth("Signup required for more access");
}, true);

$("authClose").onclick = closeAuth;
$("tabSignup").onclick = () => showTab("signup");
$("tabSignin").onclick = () => { if (hasSignedUp()) showTab("signin"); };

/* PASSWORD SHOW / HIDE (aankh wala icon) */
document.querySelectorAll(".toggle-pass").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = btn.parentElement.querySelector("input");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.querySelector("i").className = show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });
});

/* FORGOT PASSWORD */
$("forgotLink").addEventListener("click", async e => {
  e.preventDefault();
  const email = $("signinForm").elements["email"].value.trim();
  if (!email) {
    $("authError").textContent = "Pehle upar Email likhein, phir Forgot password dabayein";
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    $("authError").textContent = "";
    $("authNotice").textContent = "Password reset link aapki email par bhej diya gaya hai. Inbox ya Spam check karein.";
  } catch (err) {
    console.error("RESET ERROR:", err.code, err.message);
    $("authError").textContent = errText(err.code);
  }
});

/* SIGNUP */
$("signupForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  signingUp = true;
  try {
    const cred = await createUserWithEmailAndPassword(auth, f.email.trim(), f.password);
    await updateProfile(cred.user, { displayName: f.name.trim() });
    await signOut(auth);   // signup ke baad user ko khud Sign In karna hoga
    localStorage.setItem("hasSignedUp", "1");
    e.target.reset();
    $("tabSignin").disabled = false;
    $("authNotice").textContent = "Signup successful! Ab Sign In karein";
    $("authError").textContent = "";
    showTab("signin");
  } catch (err) {
    console.error("SIGNUP ERROR:", err.code, err.message);
    $("authError").textContent = errText(err.code);
  } finally {
    signingUp = false;
  }
});

/* SIGN IN */
$("signinForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  localStorage.setItem("loginTime", Date.now());   // listener se pehle set hona zaroori hai
  try {
    const cred = await signInWithEmailAndPassword(auth, f.email.trim(), f.password);
    e.target.reset(); closeAuth();
    toast("Welcome to website, " + (cred.user.displayName || "User") + "!");
  } catch (err) {
    localStorage.removeItem("loginTime");
    console.error("SIGNIN ERROR:", err.code, err.message);
    $("authError").textContent = errText(err.code);
  }
});

/* Page load / login state change: 1 din ka session */
onAuthStateChanged(auth, user => {
  if (signingUp) return;
  if (user) {
    const t = Number(localStorage.getItem("loginTime"));
    if (!t || Date.now() - t > ONE_DAY) {
      localStorage.removeItem("loginTime");
      signOut(auth);
      updateUI(null);
      return;
    }
  }
  updateUI(user);
});