// Landing page: numbered references in the sample answer open the cited passage.
// Static page: no requests, no AI calls, nothing stored.

const TAB_STEPS = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

function nextTab(index, key, count) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  const step = TAB_STEPS[key];
  return step ? (index + step + count) % count : index;
}

if (typeof document !== "undefined") {
  const tabs = Array.from(document.querySelectorAll('.source-tabs [role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const cites = Array.from(document.querySelectorAll(".cite"));
  const sourcePage = document.getElementById("fonte");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stacked = window.matchMedia("(max-width: 860px)");

  function showSource(source, { focusTab = false, bringIntoView = false } = {}) {
    tabs.forEach((tab, index) => {
      const selected = tab.dataset.source === source;
      const panel = panels[index];
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
      panel.classList.remove("is-lit");
      if (!selected) return;
      void panel.offsetWidth; // restart the highlight on every selection
      panel.classList.add("is-lit");
      if (focusTab) tab.focus();
    });
    cites.forEach((cite) => cite.classList.toggle("is-active", cite.dataset.source === source));
    if (bringIntoView && stacked.matches) {
      sourcePage.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showSource(tab.dataset.source));
    tab.addEventListener("keydown", (event) => {
      const target = nextTab(index, event.key, tabs.length);
      if (target === index) return;
      event.preventDefault();
      showSource(tabs[target].dataset.source, { focusTab: true });
    });
  });

  cites.forEach((cite) => {
    cite.addEventListener("click", () => showSource(cite.dataset.source, { bringIntoView: true }));
  });

  // The one orchestrated moment: the decisive clause of article 67 is highlighted after load.
  window.setTimeout(() => showSource("1"), reduceMotion.matches ? 0 : 700);

  const dialog = document.getElementById("risposta-completa");
  document.querySelectorAll('[data-open="risposta-completa"]').forEach((button) => {
    button.addEventListener("click", () => dialog.showModal());
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}
