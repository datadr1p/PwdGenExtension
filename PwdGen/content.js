function gsp(len = 24) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>?/|~";
    let pwd = "";
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
}

function createBtn() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "Generate password";

    btn.style.width = "24px";
    btn.style.height = "24px";
    btn.style.border = "none";
    btn.style.outline = "none";
    btn.style.cursor = "pointer";
    btn.style.padding = "0";
    btn.style.position = "absolute";
    btn.style.top = "50%";
    btn.style.right = "15px";
    btn.style.transform = "translateY(-50%) scale(1)";
    btn.style.transition = "transform 0.2s, box-shadow 0.2s, background 0.2s";

    btn.style.backgroundColor = "transparent";
    btn.style.background = `url('https://static.vecteezy.com/system/resources/previews/021/013/593/non_2x/key-lock-icon-on-transparent-background-free-png.png') no-repeat center center`;
    btn.style.backgroundSize = "contain";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.fontSize = "18px";

    return btn;
}

const confirmKeywords = [
    "again", "confirm", "repeat", "verify", "passwordagain",
    "passwordconfirm", "confirmpass", "confirmpassword", "retype",
    "reenter", "passagain", "passconfirm"
];

function isConfirmField(input) {
    const props = [
        input.getAttribute("name"),
        input.getAttribute("id"),
        input.getAttribute("aria-label"),
        input.getAttribute("placeholder")
    ];

    return props.some(p => {
        if (!p) return false;
        const lower = p.toLowerCase();
        return confirmKeywords.some(k => lower.includes(k));
    });
}

function addBtns() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        if (input.dataset.hasBtn) return;
        const name = (input.getAttribute("name") || "").toLowerCase();
        const ariaLabel = (input.getAttribute("aria-label") || "").toLowerCase();
        const placeholder = (input.getAttribute("placeholder") || "").toLowerCase();

        const isPwdField = name.includes("passwd") || ariaLabel.includes("mot de passe") || placeholder.includes("mot de passe");
        if (!isPwdField) return;

        input.dataset.hasBtn = true;

        const parentStyle = window.getComputedStyle(input.parentNode);
        if (parentStyle.position === "static") {
            input.parentNode.style.position = "relative";
        }

        const btn = createBtn();
        input.parentNode.appendChild(btn);

        btn.addEventListener("click", () => {
            const password = gsp();
            input.value = password;

            inputs.forEach(i => {
                if (i === input) return;
                if (isConfirmField(i)) i.value = password;
            });

            navigator.clipboard.writeText(password);

            btn.style.background = "none";
            btn.textContent = "✔";

            setTimeout(() => {
                btn.textContent = "";
                btn.style.background = `url('https://static.vecteezy.com/system/resources/previews/021/013/593/non_2x/key-lock-icon-on-transparent-background-free-png.png') no-repeat center center`;
                btn.style.backgroundSize = "contain";
            }, 1000);
        });
    });
}

addBtns();
const observer = new MutationObserver(addBtns);
observer.observe(document.body, { childList: true, subtree: true });
