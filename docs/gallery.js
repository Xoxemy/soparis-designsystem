(() => {
  const searches = [...document.querySelectorAll("[data-gallery-search]")];
  const sections = [...document.querySelectorAll("[data-gallery-section]")];
  const links = [...document.querySelectorAll("[data-gallery-link]")];
  const counts = [...document.querySelectorAll("[data-gallery-count]")];
  const empty = document.querySelector("[data-gallery-empty]");

  function filter(queryRaw) {
    const query = (queryRaw || "").toLowerCase().trim();
    let visible = 0;
    sections.forEach((section) => {
      const haystack = `${section.dataset.gallerySection} ${section.textContent}`.toLowerCase();
      const show = !query || haystack.includes(query);
      section.hidden = !show;
      if (show) visible += 1;
    });
    links.forEach((link) => {
      const id = link.getAttribute("href")?.slice(1);
      const section = sections.find((item) => item.id === id);
      link.hidden = Boolean(section?.hidden);
    });
    counts.forEach((count) => {
      count.textContent = `${visible} de ${sections.length}`;
    });
    if (empty) empty.hidden = visible !== 0;
    document.querySelectorAll(".soparis-menu__section").forEach((group) => {
      const items = [...group.querySelectorAll("[data-gallery-link]")];
      group.hidden = items.length > 0 && items.every((item) => item.hidden);
    });
  }

  function setActive(id) {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("soparis-menu__item--active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  searches.forEach((input) => {
    input.addEventListener("input", () => {
      const value = input.value;
      searches.forEach((other) => {
        if (other !== input) other.value = value;
      });
      filter(value);
    });
  });
  filter(searches[0]?.value || "");

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.25, 0.5] }
  );
  sections.forEach((section) => observer.observe(section));

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const app = document.querySelector("[data-soparis-app]");
      window.Soparis?.setNavOpen?.(app, false);
    });
  });
})();
