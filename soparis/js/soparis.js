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

  function setAsideCollapsed(app, collapsed) {
    if (!app) return;
    app.classList.toggle("is-aside-collapsed", collapsed);
    localStorage.setItem("soparis-aside-collapsed", collapsed ? "1" : "0");
    qsa("[data-soparis-aside-collapse]", app).forEach((btn) => {
      btn.setAttribute("aria-expanded", String(!collapsed));
      btn.setAttribute("aria-label", collapsed ? "Expandir menú" : "Colapsar menú");
      const icon = qs(".material-symbols-outlined, .soparis-icon", btn);
      if (icon) icon.textContent = collapsed ? "left_panel_open" : "left_panel_close";
    });
  }

  function prepareMenuItems(root = document) {
    qsa(".soparis-menu__item", root).forEach((item) => {
      if (item.querySelector(".soparis-menu__text")) return;
      const icon = qs(":scope > .soparis-icon, :scope > .material-symbols-outlined, :scope > svg", item);
      const badge = qs(":scope > .soparis-menu__badge", item);
      const label = Array.from(item.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || "")
        .join(" ")
        .trim() || (item.textContent || "").trim();
      if (!label) return;
      item.title = item.title || label;
      [...item.childNodes].forEach((node) => {
        if (node !== icon && node !== badge) node.remove();
      });
      const abbrev = document.createElement("span");
      abbrev.className = "soparis-menu__abbrev";
      abbrev.setAttribute("aria-hidden", "true");
      abbrev.textContent = label.charAt(0).toUpperCase();
      const text = document.createElement("span");
      text.className = "soparis-menu__text";
      text.textContent = label;
      if (icon) item.prepend(icon);
      item.append(abbrev, text);
      if (badge) item.append(badge);
    });
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

    prepareMenuItems(app);
    const stored = localStorage.getItem("soparis-aside-collapsed") === "1";
    setAsideCollapsed(app, stored);
    qsa("[data-soparis-aside-collapse]", app).forEach((btn) => {
      btn.addEventListener("click", () => {
        setAsideCollapsed(app, !app.classList.contains("is-aside-collapsed"));
      });
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

  const TOAST_MAX = 5;
  const TOAST_MS = 4200;
  const TOAST_LEAVE_MS = 220;
  const TOAST_TONES = new Set(["info", "success", "warning", "danger"]);
  const TOAST_TITLES = {
    info: "Información",
    success: "Listo",
    warning: "Atención",
    danger: "Error",
  };
  const TOAST_ICONS = {
    info: '<span class="soparis-icon material-symbols-outlined" aria-hidden="true">info</span>',
    success: '<span class="soparis-icon material-symbols-outlined" aria-hidden="true">check_circle</span>',
    warning: '<span class="soparis-icon material-symbols-outlined" aria-hidden="true">warning</span>',
    danger: '<span class="soparis-icon material-symbols-outlined" aria-hidden="true">error</span>',
  };
  const TOAST_CLOSE_ICON =
    '<span class="soparis-icon material-symbols-outlined" aria-hidden="true">close</span>';

  function toastOptions(toneOrOptions, options) {
    const fromObject =
      toneOrOptions && typeof toneOrOptions === "object" ? toneOrOptions : null;
    const toneRaw = fromObject
      ? fromObject.tone || "info"
      : toneOrOptions || "info";
    const tone = TOAST_TONES.has(toneRaw) ? toneRaw : "info";
    const opts = fromObject || options || {};
    return {
      tone,
      title: opts.title || TOAST_TITLES[tone],
      stack: opts.stack === "down" ? "down" : "up",
      duration: Number.isFinite(opts.duration) ? opts.duration : TOAST_MS,
      dismissible: opts.dismissible !== false,
    };
  }

  function getFrontToast(stack, stackDir) {
    const items = qsa(".soparis-toast", stack).filter(
      (el) => !el.classList.contains("is-leaving")
    );
    if (!items.length) return null;
    return stackDir === "down" ? items[0] : items[items.length - 1];
  }

  function refreshToastStack(stack, stackDir) {
    const visible = qsa(".soparis-toast", stack).filter(
      (el) => !el.classList.contains("is-leaving")
    );
    visible.forEach((el, i) => {
      const index = stackDir === "down" ? i : visible.length - 1 - i;
      el.dataset.stackIndex = String(index);
      el.style.setProperty("--soparis-toast-i", String(index));
    });
    armFrontToast(stack, stackDir);
  }

  function armFrontToast(stack, stackDir) {
    const front = getFrontToast(stack, stackDir);
    if (!front || front.classList.contains("is-leaving") || front.dataset.toastArmed === "1") {
      return;
    }

    front.dataset.toastArmed = "1";
    const duration = Number(front.dataset.duration || TOAST_MS);
    const progress = qs(".soparis-toast__progress", front);

    if (progress && duration > 0) {
      progress.style.animation = "none";
      void progress.offsetWidth;
      progress.style.animation = "";
      progress.style.animationDuration = `${duration}ms`;
      progress.style.animationPlayState = "running";
    }

    if (duration > 0) {
      front._toastTimer = window.setTimeout(
        () => dismissToast(front, stack, stackDir),
        duration
      );
    }
  }

  function dismissToast(item, stack, stackDir) {
    if (!item?.isConnected || item.classList.contains("is-leaving")) return;
    if (item._toastTimer) {
      window.clearTimeout(item._toastTimer);
      item._toastTimer = null;
    }
    item.classList.add("is-leaving");
    window.setTimeout(() => {
      item.remove();
      if (stack?.isConnected) refreshToastStack(stack, stackDir);
    }, TOAST_LEAVE_MS);
  }

  function toast(message, toneOrOptions = "info", options = {}) {
    const { tone, title, stack: stackDir, duration, dismissible } = toastOptions(
      toneOrOptions,
      options
    );
    let stack = qs(`[data-soparis-toasts="${stackDir}"]`);
    if (!stack) {
      stack = document.createElement("div");
      stack.className = `soparis-toast-stack soparis-toast-stack--${stackDir}`;
      stack.dataset.soparisToasts = stackDir;
      stack.setAttribute("aria-live", "polite");
      stack.setAttribute("aria-relevant", "additions");
      document.body.appendChild(stack);
    }

    // Máximo 5: las nuevas no se muestran si la cola está llena.
    const active = qsa(".soparis-toast", stack).filter(
      (el) => !el.classList.contains("is-leaving")
    );
    if (active.length >= TOAST_MAX) return null;

    const item = document.createElement("div");
    item.className = "soparis-toast";
    item.dataset.duration = String(duration);
    item.setAttribute("role", tone === "danger" || tone === "warning" ? "alert" : "status");

    const closeBtn = dismissible
      ? `<button class="soparis-button-icon soparis-button-icon--sm soparis-alert__close" type="button" aria-label="Cerrar notificación">${TOAST_CLOSE_ICON}</button>`
      : "";
    const progress =
      duration > 0 ? `<span class="soparis-toast__progress"></span>` : "";

    item.innerHTML = `
      <div class="soparis-alert soparis-alert--${tone} soparis-alert--md">
        <span class="soparis-alert__icon">${TOAST_ICONS[tone]}</span>
        <div class="soparis-alert__body">
          <p class="soparis-alert__title">${title}</p>
          <p class="soparis-alert__message">${message}</p>
        </div>
        ${closeBtn}
        ${progress}
      </div>
    `;

    // Cola FIFO: la de delante se va; las nuevas se almacenan detrás.
    if (stackDir === "down") stack.appendChild(item);
    else stack.prepend(item);

    const close = qs(".soparis-alert__close", item);
    close?.addEventListener("click", () => {
      dismissToast(item, stack, stackDir);
    });

    refreshToastStack(stack, stackDir);
    return item;
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

  const THEME_MAP = {
    primary: "--soparis-theme-primary",
    primaryOn: "--soparis-theme-primary-on",
    secondary: "--soparis-theme-secondary",
    secondarySoft: "--soparis-theme-secondary-soft",
    secondaryOn: "--soparis-theme-secondary-on",
    accent: "--soparis-theme-accent",
    accentOn: "--soparis-theme-accent-on",
    success: "--soparis-theme-success",
    warning: "--soparis-theme-warning",
    danger: "--soparis-theme-danger",
    info: "--soparis-theme-info",
    premium: "--soparis-theme-premium",
    spaceUnit: "--soparis-theme-space-unit",
    controlHMd: "--soparis-theme-control-h-md",
    controlPxMd: "--soparis-theme-control-px-md",
    iconMd: "--soparis-theme-icon-md",
    radiusMd: "--soparis-theme-radius-md",
    fontMd: "--soparis-theme-font-md",
    duration: "--soparis-theme-duration",
  };

  function setThemeVars(vars = {}, root = document.documentElement) {
    Object.entries(vars).forEach(([key, value]) => {
      const cssVar = THEME_MAP[key] || (key.startsWith("--") ? key : `--soparis-theme-${key}`);
      if (value == null || value === "") root.style.removeProperty(cssVar);
      else root.style.setProperty(cssVar, String(value));
    });
    return vars;
  }

  function resetThemeVars(root = document.documentElement) {
    Object.values(THEME_MAP).forEach((cssVar) => root.style.removeProperty(cssVar));
  }

  function initThemeStudio(root = document) {
    qsa("[data-soparis-theme-var]", root).forEach((input) => {
      const cssVar = input.dataset.soparisThemeVar;
      if (!cssVar) return;
      const apply = () => {
        const value =
          input.type === "range"
            ? `${input.value}${input.dataset.unit || "rem"}`
            : input.value;
        document.documentElement.style.setProperty(cssVar, value);
      };
      input.addEventListener("input", apply);
    });
    qsa("[data-soparis-theme-reset]", root).forEach((btn) => {
      btn.addEventListener("click", () => {
        resetThemeVars();
        qsa("[data-soparis-theme-var]", root).forEach((input) => {
          if (input.dataset.default != null) input.value = input.dataset.default;
        });
      });
    });
  }

  function initSelects(root = document) {
    qsa("[data-soparis-select]", root).forEach((wrap) => {
      if (wrap.dataset.soparisSelectReady === "1") return;
      const native = qs("select", wrap);
      if (!native) return;

      const multiple =
        wrap.hasAttribute("data-multiple") ||
        native.multiple ||
        wrap.classList.contains("soparis-input-select--multiple");
      const searchable =
        wrap.hasAttribute("data-searchable") ||
        wrap.classList.contains("soparis-input-select--searchable");
      const placeholder =
        wrap.dataset.placeholder ||
        native.getAttribute("data-placeholder") ||
        (native.options[0] && native.options[0].value === ""
          ? native.options[0].textContent
          : "Seleccionar…");

      native.multiple = multiple;
      native.classList.add("soparis-input-select__native");
      wrap.classList.add("soparis-input-select");
      if (multiple) wrap.classList.add("soparis-input-select--multiple");
      if (searchable) wrap.classList.add("soparis-input-select--searchable");

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "soparis-input-select__trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");

      const valueEl = document.createElement("span");
      valueEl.className = "soparis-input-select__value";
      trigger.appendChild(valueEl);

      const panel = document.createElement("div");
      panel.className = "soparis-input-select__panel";
      panel.hidden = true;

      let searchInput = null;
      if (searchable) {
        searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.className = "soparis-input-select__search";
        searchInput.placeholder = "Buscar…";
        searchInput.setAttribute("aria-label", "Buscar opciones");
        panel.appendChild(searchInput);
      }

      const list = document.createElement("ul");
      list.className = "soparis-input-select__list";
      list.setAttribute("role", "listbox");
      if (multiple) list.setAttribute("aria-multiselectable", "true");
      panel.appendChild(list);

      const empty = document.createElement("div");
      empty.className = "soparis-input-select__empty";
      empty.textContent = "Sin resultados";
      empty.hidden = true;
      panel.appendChild(empty);

      wrap.appendChild(trigger);
      wrap.appendChild(panel);
      wrap.dataset.soparisSelectReady = "1";

      const optionButtons = [];

      function selectedValues() {
        return qsa("option", native)
          .filter((opt) => opt.selected && opt.value !== "")
          .map((opt) => opt.value);
      }

      function selectedLabels() {
        return qsa("option", native)
          .filter((opt) => opt.selected && opt.value !== "")
          .map((opt) => opt.textContent.trim());
      }

      function syncTrigger() {
        const labels = selectedLabels();
        valueEl.innerHTML = "";
        if (!labels.length) {
          valueEl.innerHTML = `<span class="soparis-input-select__placeholder">${placeholder}</span>`;
          return;
        }
        if (!multiple) {
          valueEl.textContent = labels[0];
          return;
        }
        const chips = document.createElement("div");
        chips.className = "soparis-input-select__chips";
        labels.forEach((label, index) => {
          const value = selectedValues()[index];
          const chip = document.createElement("span");
          chip.className = "soparis-input-select__chip";
          chip.innerHTML = `<span>${label}</span>`;
          const remove = document.createElement("button");
          remove.type = "button";
          remove.className = "soparis-input-select__chip-remove material-symbols-outlined";
          remove.setAttribute("aria-label", `Quitar ${label}`);
          remove.textContent = "close";
          remove.addEventListener("click", (event) => {
            event.stopPropagation();
            const opt = qsa("option", native).find((o) => o.value === value);
            if (opt) opt.selected = false;
            syncFromNative();
            native.dispatchEvent(new Event("change", { bubbles: true }));
          });
          chip.appendChild(remove);
          chips.appendChild(chip);
        });
        valueEl.appendChild(chips);
      }

      function syncOptions() {
        optionButtons.forEach((btn) => {
          const selected = selectedValues().includes(btn.dataset.value);
          btn.classList.toggle("is-selected", selected);
          btn.setAttribute("aria-selected", String(selected));
        });
      }

      function syncFromNative() {
        syncTrigger();
        syncOptions();
      }

      function filterOptions(query) {
        const q = query.trim().toLowerCase();
        let visible = 0;
        const visibleBtns = [];
        optionButtons.forEach((btn) => {
          const match = !q || btn.textContent.toLowerCase().includes(q);
          btn.classList.toggle("is-hidden", !match);
          btn.classList.remove("is-first-visible", "is-last-visible");
          if (match) {
            visible += 1;
            visibleBtns.push(btn);
          }
        });
        if (visibleBtns.length) {
          visibleBtns[0].classList.add("is-first-visible");
          visibleBtns[visibleBtns.length - 1].classList.add("is-last-visible");
        }
        empty.hidden = visible > 0;
      }

      function close() {
        wrap.classList.remove("is-open");
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        if (searchInput) {
          searchInput.value = "";
          filterOptions("");
        }
      }

      function open() {
        qsa("[data-soparis-select].is-open", root).forEach((other) => {
          if (other !== wrap) other.classList.remove("is-open");
        });
        wrap.classList.add("is-open");
        panel.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        if (searchInput) {
          window.requestAnimationFrame(() => searchInput.focus());
        }
      }

      qsa("option", native).forEach((opt) => {
        if (opt.value === "" && !multiple) return;
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "soparis-input-select__option";
        btn.dataset.value = opt.value;
        btn.setAttribute("role", "option");
        btn.disabled = opt.disabled;
        if (multiple) {
          btn.innerHTML = `<span class="soparis-input-select__check material-symbols-outlined" aria-hidden="true">check</span><span>${opt.textContent}</span>`;
        } else {
          btn.textContent = opt.textContent;
        }
        btn.addEventListener("click", (event) => {
          event.stopPropagation();
          if (multiple) {
            opt.selected = !opt.selected;
          } else {
            qsa("option", native).forEach((o) => {
              o.selected = o === opt;
            });
            close();
          }
          syncFromNative();
          native.dispatchEvent(new Event("change", { bubbles: true }));
        });
        optionButtons.push(btn);
        li.appendChild(btn);
        list.appendChild(li);
      });

      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        if (wrap.classList.contains("is-open")) close();
        else open();
      });

      searchInput?.addEventListener("input", () => filterOptions(searchInput.value));
      searchInput?.addEventListener("click", (event) => event.stopPropagation());

      document.addEventListener("click", (event) => {
        if (!wrap.contains(event.target)) close();
      });

      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && wrap.classList.contains("is-open")) close();
      });

      native.addEventListener("change", syncFromNative);
      syncFromNative();
      filterOptions("");
    });
  }

  function initKanban(root = document) {
    qsa("[data-soparis-kanban]", root).forEach((board) => {
      if (board.dataset.soparisKanbanReady === "1") return;
      board.dataset.soparisKanbanReady = "1";

      const updateCounts = () => {
        qsa(".soparis-kanban__column", board).forEach((column) => {
          const body = qs(".soparis-kanban__column-body", column);
          const count = qs("[data-soparis-kanban-count]", column);
          if (!body || !count) return;
          const n = qsa(".soparis-kanban__card", body).length;
          count.textContent = String(n);
        });
      };

      let dragCard = null;

      qsa(".soparis-kanban__card", board).forEach((card) => {
        card.setAttribute("draggable", "true");
        card.tabIndex = 0;

        card.addEventListener("dragstart", (event) => {
          dragCard = card;
          card.classList.add("is-dragging");
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", card.id || "card");
        });

        card.addEventListener("dragend", () => {
          card.classList.remove("is-dragging");
          qsa(".soparis-kanban__column", board).forEach((col) =>
            col.classList.remove("is-drop-target")
          );
          dragCard = null;
          updateCounts();
        });
      });

      qsa(".soparis-kanban__column-body", board).forEach((body) => {
        const column = body.closest(".soparis-kanban__column");

        body.addEventListener("dragover", (event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          column?.classList.add("is-drop-target");

          if (!dragCard) return;
          const after = getDragAfterElement(body, event.clientY);
          if (!after) body.appendChild(dragCard);
          else body.insertBefore(dragCard, after);
        });

        body.addEventListener("dragleave", (event) => {
          if (!body.contains(event.relatedTarget)) {
            column?.classList.remove("is-drop-target");
          }
        });

        body.addEventListener("drop", (event) => {
          event.preventDefault();
          column?.classList.remove("is-drop-target");
          updateCounts();
          board.dispatchEvent(
            new CustomEvent("soparis:kanban-change", {
              bubbles: true,
              detail: { board, column, card: dragCard },
            })
          );
        });
      });

      updateCounts();
    });
  }

  function getDragAfterElement(container, y) {
    const cards = [
      ...container.querySelectorAll(".soparis-kanban__card:not(.is-dragging)"),
    ];
    return cards.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  }

  function initPasswords(root = document) {
    qsa("[data-soparis-password]", root).forEach((wrap) => {
      const input = qs("input", wrap);
      const toggle = qs("[data-soparis-password-toggle]", wrap);
      if (!input || !toggle) return;
      toggle.addEventListener("click", () => {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        toggle.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
        const icon = qs(".material-symbols-outlined, .soparis-icon", toggle);
        if (icon) icon.textContent = show ? "visibility_off" : "visibility";
      });
    });
  }

  function initClocks(root = document) {
    qsa("[data-soparis-clock]", root).forEach((el) => {
      const tick = () => {
        const now = new Date();
        el.textContent = now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      };
      tick();
      window.setInterval(tick, 1000);
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
      initThemeStudio(root);
      initSelects(root);
      initKanban(root);
      initPasswords(root);
      initClocks(root);
      qsa("[data-soparis-toast]").forEach((btn) => {
        btn.addEventListener("click", () =>
          toast(btn.dataset.soparisToast || "Acción completada", {
            tone: btn.dataset.tone || "success",
            title: btn.dataset.title || undefined,
            stack: btn.dataset.soparisToastStack === "down" ? "down" : "up",
          })
        );
      });
    },
    toast,
    setThemeVars,
    resetThemeVars,
    setNavOpen,
    setAsideCollapsed,
    initSelects,
    initKanban,
    initPasswords,
    initClocks,
  };

  document.addEventListener("DOMContentLoaded", () => window.Soparis.init());
})();
