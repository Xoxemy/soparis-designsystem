(() => {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  function setNavOpen(app, open) {
    if (!app) return;
    app.classList.toggle("is-nav-open", open);
    const burger = qs("[data-soparis-burger]", app);
    if (burger) burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open && window.matchMedia("(max-width: 47.9975rem)").matches ? "hidden" : "";
  }

  function initAppShell(app) {
    const burger = qs("[data-soparis-burger]", app);
    const backdrop = qs("[data-soparis-backdrop]", app);
    burger?.addEventListener("click", () => setNavOpen(app, !app.classList.contains("is-nav-open")));
    backdrop?.addEventListener("click", () => setNavOpen(app, false));
    qsa("[data-soparis-nav-close]", app).forEach((el) => {
      el.addEventListener("click", () => setNavOpen(app, false));
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNavOpen(app, false);
    });
  }

  function initDropdowns(root) {
    qsa("[data-soparis-dropdown]", root).forEach((dropdown) => {
      const trigger = qs("[data-soparis-dropdown-trigger]", dropdown);
      trigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = !dropdown.classList.contains("is-open");
        qsa("[data-soparis-dropdown].is-open", root).forEach((open) => open.classList.remove("is-open"));
        dropdown.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
      });
    });
    document.addEventListener("click", () => {
      qsa("[data-soparis-dropdown].is-open", root).forEach((open) => {
        open.classList.remove("is-open");
        qs("[data-soparis-dropdown-trigger]", open)?.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initOverlay(triggerSel, overlaySel) {
    qsa(triggerSel).forEach((trigger) => {
      const overlay = qs(trigger.getAttribute("data-soparis-target") || overlaySel);
      if (!overlay) return;
      const close = () => {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
      };
      trigger.addEventListener("click", () => {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        qs("[data-soparis-autofocus]", overlay)?.focus();
      });
      qsa("[data-soparis-close]", overlay).forEach((btn) => btn.addEventListener("click", close));
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close();
      });
    });
  }

  function initDrawer() {
    qsa("[data-soparis-drawer-open]").forEach((btn) => {
      const drawer = qs(btn.getAttribute("data-soparis-target"));
      if (!drawer) return;
      btn.addEventListener("click", () => drawer.classList.add("is-open"));
    });
    qsa("[data-soparis-drawer-close]").forEach((btn) => {
      btn.addEventListener("click", () => btn.closest(".soparis-drawer")?.classList.remove("is-open"));
    });
  }

  function initTabs(root) {
    qsa("[data-soparis-tabs]", root).forEach((tabs) => {
      const buttons = qsa('[role="tab"]', tabs);
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          buttons.forEach((other) => other.setAttribute("aria-selected", "false"));
          button.setAttribute("aria-selected", "true");
          const panelId = button.getAttribute("aria-controls");
          qsa("[data-soparis-tabpanel]", tabs.parentElement).forEach((panel) => {
            panel.hidden = panel.id !== panelId;
          });
        });
      });
    });
  }

  function toastOptions(toneOrOptions, options) {
    if (toneOrOptions && typeof toneOrOptions === "object") {
      return {
        tone: toneOrOptions.tone || "info",
        stack: toneOrOptions.stack === "down" ? "down" : "up",
      };
    }
    return {
      tone: toneOrOptions || "info",
      stack: options?.stack === "down" ? "down" : "up",
    };
  }

  function toast(message, toneOrOptions = "info", options = {}) {
    const { tone, stack: stackDir } = toastOptions(toneOrOptions, options);
    let stack = qs(`[data-soparis-toasts="${stackDir}"]`);
    if (!stack) {
      stack = document.createElement("div");
      stack.className = `soparis-toast-stack soparis-toast-stack--${stackDir}`;
      stack.dataset.soparisToasts = stackDir;
      document.body.appendChild(stack);
    }
    const item = document.createElement("div");
    item.className = "soparis-toast";
    item.setAttribute("role", "status");
    item.innerHTML = `<strong>${tone === "success" ? "Listo" : "Soparis"}</strong><p class="soparis-p soparis-p--sm" style="margin:0">${message}</p>`;
    if (stackDir === "down") stack.prepend(item);
    else stack.appendChild(item);
    setTimeout(() => item.remove(), 3600);
  }

  function initTheme() {
    const saved = localStorage.getItem("soparis-theme");
    if (saved) document.documentElement.dataset.soparisTheme = saved;
    qsa("[data-soparis-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = document.documentElement.dataset.soparisTheme === "dark" ? "light" : "dark";
        document.documentElement.dataset.soparisTheme = next;
        localStorage.setItem("soparis-theme", next);
      });
    });
  }

  window.Soparis = {
    init(root = document) {
      qsa("[data-soparis-app]", root).forEach(initAppShell);
      initDropdowns(root);
      initOverlay("[data-soparis-modal-open]", ".soparis-overlay");
      initDrawer();
      initTabs(root);
      initTheme();
      qsa("[data-soparis-toast]").forEach((btn) => {
        btn.addEventListener("click", () =>
          toast(btn.dataset.soparisToast || "Acción completada", {
            tone: btn.dataset.tone || "success",
            stack: btn.dataset.soparisToastStack === "down" ? "down" : "up",
          })
        );
      });
    },
    toast,
    setNavOpen,
  };

  document.addEventListener("DOMContentLoaded", () => window.Soparis.init());
})();
