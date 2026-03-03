"use strict";

/* Espresso Time - Final Project JS
   Requirements met:
   - Strict mode globally
   - No inline handlers (events added via JS)
   - Light/Dark mode toggle (no persistence by request)
   - Product display (one at a time)
   - Game play (1-10 random compare)
   - Contact form validation w/ regex + customer object + thank you message
*/

document.addEventListener("DOMContentLoaded", function () {
    // ---------- Smooth scroll enhancement + focus management ----------
    // (CSS already handles smooth scrolling, but this ensures keyboard focus after jump)
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            // Let default anchor happen, then move focus for accessibility
            setTimeout(() => {
                targetEl.setAttribute("tabindex", "-1");
                targetEl.focus({ preventScroll: true });
                // Remove tabindex later so it doesn't remain in tab order
                setTimeout(() => targetEl.removeAttribute("tabindex"), 250);
            }, 0);
        });
    });

    // ---------- Theme Toggle ----------
    const themeToggleBtn = document.getElementById("themeToggle");
    let isDark = false;

    function updateThemeUI() {
        document.body.classList.toggle("theme-dark", isDark);
        themeToggleBtn.setAttribute("aria-pressed", String(isDark));
        themeToggleBtn.textContent = isDark ? "Dark Mode: On" : "Dark Mode: Off";
    }

    themeToggleBtn.addEventListener("click", function () {
        isDark = !isDark;
        updateThemeUI();
    });

    updateThemeUI();

    // ---------- Product Display ----------
    const products = [
        {
            name: "Midnight Classic",
            image: "assets/photo1.jpg",
            alt: "Midnight Classic espresso martini",
            desc:
                "A smooth blend of premium vodka, freshly pulled espresso, and coffee liqueur. Bold, balanced, and timeless—our signature espresso martini."
        },
        {
            name: "Velvet Mocha Martini",
            image: "assets/photo2.jpg",
            alt: "Velvet Mocha Martini espresso martini",
            desc:
                "Rich chocolate undertones meet strong espresso and vanilla-infused vodka. A slightly sweeter twist for those who like depth in every sip."
        },
        {
            name: "Caramel Cold Brew Kick",
            image: "assets/photo3.jpg",
            alt: "Caramel Cold Brew Kick espresso martini",
            desc:
                "Cold brew concentrate, caramel notes, and a touch of sea salt shaken to perfection. Smooth, energizing, and dangerously easy to love."
        }
    ];

    const productImage = document.getElementById("productImage");
    const productName = document.getElementById("productName");
    const productDesc = document.getElementById("productDesc");
    const productButtons = document.querySelectorAll(".btn-tab[data-product]");

    function showProduct(index) {
        const p = products[index];
        if (!p) return;

        productImage.src = p.image;
        productImage.alt = p.alt;
        productName.textContent = p.name;
        productDesc.textContent = p.desc;

        productButtons.forEach((btn) => {
            const isCurrent = Number(btn.dataset.product) === index;
            btn.setAttribute("aria-current", isCurrent ? "true" : "false");
        });
    }

    productButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            const index = Number(btn.dataset.product);
            showProduct(index);
        });
    });

    // Default product on load
    showProduct(0);

    // ---------- Game ----------
    const gameForm = document.getElementById("gameForm");
    const guessInput = document.getElementById("guessInput");
    const guessError = document.getElementById("guessError");
    const userGuessOut = document.getElementById("userGuessOut");
    const randomOut = document.getElementById("randomOut");
    const resultMessage = document.getElementById("resultMessage");

    function setGameError(msg) {
        guessError.textContent = msg;
    }

    gameForm.addEventListener("submit", function (e) {
        e.preventDefault();
        setGameError("");

        const guessRaw = guessInput.value.trim();
        const guessNum = Number(guessRaw);

        if (!guessRaw || Number.isNaN(guessNum)) {
            setGameError("Enter a number from 1 to 10.");
            return;
        }

        if (!Number.isInteger(guessNum) || guessNum < 1 || guessNum > 10) {
            setGameError("Your guess must be a whole number between 1 and 10.");
            return;
        }

        const randomNum = Math.floor(Math.random() * 10) + 1;

        userGuessOut.textContent = String(guessNum);
        randomOut.textContent = String(randomNum);

        if (guessNum === randomNum) {
            resultMessage.textContent = "You win! Your next espresso martini is on us. 🎉";
        } else {
            resultMessage.textContent = "Not this hour—try again for a free drink!";
        }

        // Optional: clear the input after each play
        guessInput.value = "";
        guessInput.focus();
    });

    // ---------- Contact Form Validation ----------
    const contactForm = document.getElementById("contactForm");
    const thankYou = document.getElementById("thankYou");

    const fullNameEl = document.getElementById("fullName");
    const phoneEl = document.getElementById("phone");
    const emailEl = document.getElementById("email");
    const commentsEl = document.getElementById("comments");

    const nameError = document.getElementById("nameError");
    const prefError = document.getElementById("prefError");
    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");
    const commentsError = document.getElementById("commentsError");

    // Regex requirements (reasonable for class projects)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Accepts: 5555555555, (555) 555-5555, 555-555-5555, 555 555 5555
    const phoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s-]?)\d{3}[\s-]?\d{4}$/;

    function clearErrors() {
        nameError.textContent = "";
        prefError.textContent = "";
        phoneError.textContent = "";
        emailError.textContent = "";
        commentsError.textContent = "";
    }

    function getContactPreference() {
        const checked = contactForm.querySelector('input[name="contactPreference"]:checked');
        return checked ? checked.value : "";
    }

    function setError(el, msg) {
        el.textContent = msg;
    }

    function buildThankYouMessage(customer) {
        // Build a safe, readable message without injecting HTML from user
        const wrap = document.createElement("div");

        const title = document.createElement("p");
        title.innerHTML = "<strong>Thank you!</strong>";
        wrap.appendChild(title);

        const line1 = document.createElement("p");
        line1.textContent = `Thank you, ${customer.fullName}!`;
        wrap.appendChild(line1);

        const line2 = document.createElement("p");
        line2.textContent = `We received your message and will contact you by ${customer.contactPreference} soon.`;
        wrap.appendChild(line2);

        const detailsTitle = document.createElement("p");
        detailsTitle.innerHTML = "<strong>Your submission:</strong>";
        wrap.appendChild(detailsTitle);

        const list = document.createElement("ul");
        const liPref = document.createElement("li");
        liPref.textContent = `Preferred contact: ${customer.contactPreference}`;
        list.appendChild(liPref);

        const liPhone = document.createElement("li");
        liPhone.textContent = `Phone: ${customer.phone ? customer.phone : "—"}`;
        list.appendChild(liPhone);

        const liEmail = document.createElement("li");
        liEmail.textContent = `Email: ${customer.email ? customer.email : "—"}`;
        list.appendChild(liEmail);

        const liComments = document.createElement("li");
        liComments.textContent = `Comments: ${customer.comments}`;
        list.appendChild(liComments);

        wrap.appendChild(list);

        return wrap;
    }

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        clearErrors();

        const fullName = fullNameEl.value.trim();
        const phone = phoneEl.value.trim();
        const email = emailEl.value.trim();
        const comments = commentsEl.value.trim();
        const preference = getContactPreference(); // "phone" or "email"

        let isValid = true;

        // Required: name
        if (!fullName) {
            setError(nameError, "Please enter your full name.");
            isValid = false;
        }

        // Required: comments
        if (!comments) {
            setError(commentsError, "Please enter a comment so we know how to help.");
            isValid = false;
        }

        // Required: preference
        if (!preference) {
            setError(prefError, "Please choose phone or email as your preferred contact method.");
            isValid = false;
        }

        // Conditional required: phone or email based on preference
        if (preference === "phone") {
            if (!phone) {
                setError(phoneError, "Phone is required when you choose phone contact.");
                isValid = false;
            } else if (!phoneRegex.test(phone)) {
                setError(phoneError, "Please enter a valid phone number (ex: 555-555-5555).");
                isValid = false;
            }
        }

        if (preference === "email") {
            if (!email) {
                setError(emailError, "Email is required when you choose email contact.");
                isValid = false;
            } else if (!emailRegex.test(email)) {
                setError(emailError, "Please enter a valid email (ex: name@example.com).");
                isValid = false;
            }
        }

        if (!isValid) return;

        // Create the customer object from valid inputs (rubric requirement)
        const customer = {
            fullName: fullName,
            contactPreference: preference,
            phone: phone,
            email: email,
            comments: comments,
            submittedAt: new Date().toISOString()
        };

        // Show thank-you message using values pulled from the object
        thankYou.innerHTML = "";
        thankYou.appendChild(buildThankYouMessage(customer));

        // Reset the form after successful submission (rubric requirement)
        contactForm.reset();
        fullNameEl.focus();
    });
});