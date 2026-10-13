/* NEXTCHAIN sample plan configuration and rendering. Demo only; no investments are processed. */
(() => {
  "use strict";

  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      min: 50,
      max: 499,
      duration: "7 days",
      description: "An entry-level sample tier for exploring the platform flow.",
      icon: "bx-seedling",
      features: ["Sample plan details", "Account activity preview", "only selection"]
    },
    {
      id: "standard",
      name: "Standard Plan",
      min: 500,
      max: 1999,
      duration: "14 days",
      description: "A mid-range sample tier with the same clear plan overview.",
      icon: "bx-layer",
      popular: true,
      features: ["Sample plan details", "Account activity preview", "only selection"]
    },
    {
      id: "premium",
      name: "Premium Plan",
      min: 2000,
      max: 4999,
      duration: "21 days",
      description: "A higher-value sample tier for previewing plan comparisons.",
      icon: "bx-diamond",
      features: ["Sample plan details", "Account activity preview", "only selection"]
    },
    {
      id: "vip",
      name: "VIP Plan",
      min: 5000,
      max: null,
      duration: "30 days",
      description: "The highest sample ",
      icon: "bx-crown",
      features: ["Sample plan details", "Account activity preview", "Demo-only selection"]
    }
  ];

  const formatUSD = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);

  function createPlanCard(plan) {
    const card = document.createElement("article");
    card.className = `plan-card${plan.popular ? " popular" : ""}`;

    if (plan.popular) {
      const badge = document.createElement("span");
      badge.className = "popular-badge";
      badge.textContent = "Popular option";
      card.appendChild(badge);
    }

    const icon = document.createElement("div");
    icon.className = "plan-icon";
    icon.setAttribute("aria-hidden", "true");
    const iconElement = document.createElement("i");
    iconElement.className = `bx ${plan.icon}`;
    icon.appendChild(iconElement);

    const title = document.createElement("h3");
    title.className = "plan-name";
    title.textContent = plan.name;

    const description = document.createElement("p");
    description.className = "plan-description";
    description.textContent = plan.description;

    const rangeLabel = document.createElement("div");
    rangeLabel.className = "plan-range-label";
    rangeLabel.textContent = "Sample amount range";

    const range = document.createElement("p");
    range.className = "plan-range";
    range.textContent = `${formatUSD(plan.min)} `;
    const rangeEnd = document.createElement("span");
    rangeEnd.textContent = plan.max === null ? "and above" : `– ${formatUSD(plan.max)}`;
    range.appendChild(rangeEnd);

    const meta = document.createElement("div");
    meta.className = "plan-meta";
    const durationBlock = document.createElement("div");
    const durationLabel = document.createElement("span");
    durationLabel.textContent = "Sample duration";
    const durationValue = document.createElement("strong");
    durationValue.textContent = plan.duration;
    durationBlock.append(durationLabel, durationValue);
    const tierBlock = document.createElement("div");
    const tierLabel = document.createElement("span");
    tierLabel.textContent = "Plan type";
    const tierValue = document.createElement("strong");
    tierValue.textContent = plan.popular ? "Popular" : "Illustrative";
    tierBlock.append(tierLabel, tierValue);
    meta.append(durationBlock, tierBlock);

    const featureList = document.createElement("ul");
    featureList.className = "plan-features";
    plan.features.forEach((feature) => {
      const item = document.createElement("li");
      const check = document.createElement("i");
      check.className = "bx bx-check-circle";
      check.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.textContent = feature;
      item.append(check, text);
      featureList.appendChild(item);
    });

    const button = document.createElement("a");
    button.className = `button plan-button ${plan.popular ? "button-primary" : "button-outline"}`;
    button.href = `auth/register.html?plan=${encodeURIComponent(plan.id)}`;
    button.append(document.createTextNode("Choose Plan "));
    const arrow = document.createElement("i");
    arrow.className = "bx bx-right-arrow-alt";
    arrow.setAttribute("aria-hidden", "true");
    button.appendChild(arrow);

    card.append(icon, title, description, rangeLabel, range, meta, featureList, button);
    return card;
  }

  function renderPlans() {
    const container = document.getElementById("planGrid");
    if (!container) return;
    const fragment = document.createDocumentFragment();
    plans.forEach((plan) => fragment.appendChild(createPlanCard(plan)));
    container.replaceChildren(fragment);
  }

  window.NEXTCHAIN_PLANS = plans.map((plan) => ({ ...plan }));
  window.NEXTCHAIN_FORMAT_USD = formatUSD;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPlans, { once: true });
  } else {
    renderPlans();
  }
})();
