"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // Smooth scroll focus
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            setTimeout(() => {
                targetEl.setAttribute("tabindex", "-1");
                targetEl.focus({ preventScroll: true });
                setTimeout(() => targetEl.removeAttribute("tabindex"), 250);
            }, 0);
        });
    });

    // Theme toggle
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

    // Product display
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
            showProduct(Number(btn.dataset.product));
        });
    });

    showProduct(0);

    // Game
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

        resultMessage.textContent =
            guessNum === randomNum
                ? "You win! Your next espresso martini is on us. 🎉"
                : "Not this hour—try again for a free drink!";

        guessInput.value = "";
        guessInput.focus();
    });

    // Contact form
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    function buildThankYouMessage(customer) {
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
        const preference = getContactPreference();

        let isValid = true;

        if (!fullName) {
            nameError.textContent = "Please enter your full name.";
            isValid = false;
        }

        if (!comments) {
            commentsError.textContent = "Please enter a comment so we know how to help.";
            isValid = false;
        }

        if (!preference) {
            prefError.textContent = "Please choose phone or email as your preferred contact method.";
            isValid = false;
        }

        if (preference === "phone") {
            if (!phone) {
                phoneError.textContent = "Phone is required when you choose phone contact.";
                isValid = false;
            } else if (!phoneRegex.test(phone)) {
                phoneError.textContent = "Please enter a valid phone number (ex: 555-555-5555).";
                isValid = false;
            }
        }

        if (preference === "email") {
            if (!email) {
                emailError.textContent = "Email is required when you choose email contact.";
                isValid = false;
            } else if (!emailRegex.test(email)) {
                emailError.textContent = "Please enter a valid email (ex: name@example.com).";
                isValid = false;
            }
        }

        if (!isValid) return;

        const customer = {
            fullName: fullName,
            contactPreference: preference,
            phone: phone,
            email: email,
            comments: comments,
            submittedAt: new Date().toISOString()
        };

        thankYou.innerHTML = "";
        thankYou.appendChild(buildThankYouMessage(customer));

        contactForm.reset();
        fullNameEl.focus();
    });
});