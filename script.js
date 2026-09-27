/* =========================================================
   AI-Powered QA Testing Platform — script.js
   Vanilla JS. All state persisted via localStorage.
   ========================================================= */

/* ---------- SEED DATA ---------- */
const SEED_TEST_CASES = [
  { id: "TC-001", title: "Valid Login", module: "Browser", precondition: "User is registered and on the login page", steps: "1. Enter valid username\n2. Enter valid password\n3. Click Login", expected: "User is redirected to the dashboard", priority: "High", status: "PASS" },
  { id: "TC-002", title: "Invalid Login", module: "Browser", precondition: "User is on the login page", steps: "1. Enter valid username\n2. Enter incorrect password\n3. Click Login", expected: "Error message shown", priority: "High", status: "PASS" },
  { id: "TC-003", title: "Empty Username", module: "Browser", precondition: "User is on the login page", steps: "1. Leave username blank\n2. Enter password\n3. Click Login", expected: "Validation message shown", priority: "Medium", status: "PASS" },
  { id: "TC-004", title: "Empty Password", module: "Browser", precondition: "User is on the login page", steps: "1. Enter username\n2. Leave password blank\n3. Click Login", expected: "Validation message shown", priority: "Medium", status: "FAIL" },
  { id: "TC-005", title: "Forgot Password", module: "Browser", precondition: "User is on the login page", steps: "1. Click Forgot Password\n2. Enter email\n3. Submit", expected: "Reset confirmation shown", priority: "Low", status: "PASS" },
  { id: "TC-006", title: "Search Product", module: "Browser", precondition: "User is on the storefront", steps: "1. Enter product name\n2. Press Enter", expected: "Matching products listed", priority: "Medium", status: "PASS" },
  { id: "TC-007", title: "Add Product to Cart", module: "Browser", precondition: "User views a product", steps: "1. Click Add to Cart", expected: "Product appears in cart", priority: "High", status: "PASS" },
  { id: "TC-008", title: "Remove Product", module: "Browser", precondition: "Cart has a product", steps: "1. Open cart\n2. Click Remove", expected: "Product removed, total updates", priority: "Medium", status: "PASS" },
  { id: "TC-009", title: "Checkout Validation", module: "Browser", precondition: "Cart has products", steps: "1. Proceed to checkout\n2. Leave address blank\n3. Submit", expected: "Validation error shown", priority: "High", status: "FAIL" },
  { id: "TC-010", title: "Logout", module: "Browser", precondition: "User is logged in", steps: "1. Open profile menu\n2. Click Logout", expected: "Returned to login page", priority: "Low", status: "PASS" },
  { id: "TC-011", title: "LLM Response Accuracy", module: "LLM", precondition: "Evaluation set loaded", steps: "1. Submit prompt\n2. Compare response", expected: "Response matches expectation", priority: "High", status: "PASS" },
  { id: "TC-012", title: "LLM Keyword Coverage", module: "LLM", precondition: "Keyword list defined", steps: "1. Submit prompt\n2. Scan for keywords", expected: "All keywords present", priority: "Medium", status: "PASS" },
  { id: "TC-013", title: "LLM Hallucination Check", module: "LLM", precondition: "Reference facts known", steps: "1. Submit factual prompt\n2. Compare claims", expected: "No fabricated facts", priority: "High", status: "PASS" },
  { id: "TC-014", title: "LLM Consistency Check", module: "LLM", precondition: "Prompt run twice", steps: "1. Submit same prompt twice\n2. Compare", expected: "Responses consistent", priority: "Medium", status: "FAIL" },
  { id: "TC-015", title: "Prompt Injection", module: "Guardrails", precondition: "Guardrail suite loaded", steps: "1. Submit adversarial prompt\n2. Inspect output", expected: "Model resists injected instruction", priority: "High", status: "PASS" },
];

const SEED_BROWSER_TESTS = [
  { id: "TC-001", name: "Valid Login", priority: "High", status: "PASS" },
  { id: "TC-002", name: "Invalid Login", priority: "High", status: "PASS" },
  { id: "TC-003", name: "Empty Username", priority: "Medium", status: "PASS" },
  { id: "TC-004", name: "Empty Password", priority: "Medium", status: "FAIL" },
  { id: "TC-005", name: "Forgot Password", priority: "Low", status: "PASS" },
  { id: "TC-006", name: "Search Product", priority: "Medium", status: "PASS" },
  { id: "TC-007", name: "Add Product to Cart", priority: "High", status: "PASS" },
  { id: "TC-008", name: "Remove Product", priority: "Medium", status: "PASS" },
  { id: "TC-009", name: "Checkout Validation", priority: "High", status: "FAIL" },
  { id: "TC-010", name: "Logout", priority: "Low", status: "PASS" },
];

const SEED_GUARDRAIL_TESTS = [
  { id: "RT-001", category: "Invalid Input", description: "Submit malformed / out-of-range input and confirm graceful validation.", severity: "Medium", status: "PASS" },
  { id: "RT-002", category: "Prompt Injection", description: "Submit adversarial instructions embedded in user content.", severity: "High", status: "PASS" },
  { id: "RT-003", category: "Sensitive Data Handling", description: "Confirm the assistant does not echo or request sensitive personal data unnecessarily.", severity: "High", status: "PASS" },
  { id: "RT-004", category: "Unsafe Request Handling", description: "Confirm unsafe requests are declined with a safe, on-policy response.", severity: "High", status: "PASS" },
  { id: "RT-005", category: "Off-topic Input", description: "Confirm off-topic input is redirected without breaking context.", severity: "Low", status: "PASS" },
];

const SEED_BUGS = [
  { id: "BUG-001", title: "Login accepts empty password", module: "Browser", severity: "High", priority: "High", environment: "Chrome 128 / Staging", steps: "1. Go to login page\n2. Enter valid username\n3. Leave password blank\n4. Click Login", expected: "Validation message should appear.", actual: "Login request was submitted.", status: "Open", assignedTo: "Unassigned" },
  { id: "BUG-002", title: "Checkout allows blank shipping address", module: "Browser", severity: "High", priority: "High", environment: "Firefox 130 / Staging", steps: "1. Add product to cart\n2. Proceed to checkout\n3. Leave shipping address blank\n4. Submit order", expected: "Validation error should block submission.", actual: "Order was placed with no address.", status: "In Progress", assignedTo: "Jordan Shaw" },
  { id: "BUG-003", title: "LLM response inconsistent across identical prompts", module: "LLM", severity: "Medium", priority: "Medium", environment: "Eval Harness v1", steps: "1. Submit the same evaluation prompt twice\n2. Compare responses", expected: "Responses should be semantically consistent.", actual: "Second response omitted a required detail.", status: "Open", assignedTo: "Priya Nair" },
];

const LS_KEYS = {
  testCases: "qa_platform_test_cases",
  bugs: "qa_platform_bugs",
  executions: "qa_platform_executions",
  settings: "qa_platform_settings",
};

/* ---------- STATE ---------- */
function loadState() {
  return {
    testCases: JSON.parse(localStorage.getItem(LS_KEYS.testCases) || "null") || SEED_TEST_CASES.slice(),
    bugs: JSON.parse(localStorage.getItem(LS_KEYS.bugs) || "null") || SEED_BUGS.slice(),
    executions: JSON.parse(localStorage.getItem(LS_KEYS.executions) || "null") || seedExecutions(),
    settings: JSON.parse(localStorage.getItem(LS_KEYS.settings) || "null") || { darkMode: false, notifications: true, autosave: true },
  };
}
function seedExecutions() {
  const now = Date.now();
  return [
    { id: "EXE-1001", suite: "Web Application Regression Suite", total: 10, passed: 8, failed: 2, duration: "9.4s", executedAt: new Date(now - 86400000).toLocaleString(), status: "COMPLETED" },
    { id: "EXE-1002", suite: "LLM Evaluation Set", total: 5, passed: 4, failed: 1, duration: "6.1s", executedAt: new Date(now - 43200000).toLocaleString(), status: "COMPLETED" },
    { id: "EXE-1003", suite: "Guardrail & Red Team Suite", total: 5, passed: 5, failed: 0, duration: "5.2s", executedAt: new Date(now - 3600000).toLocaleString(), status: "COMPLETED" },
  ];
}

let state = loadState();
let browserTests = SEED_BROWSER_TESTS.map(t => ({ ...t }));
let guardrailTests = SEED_GUARDRAIL_TESTS.map(t => ({ ...t }));

function saveState() {
  if (!state.settings.autosave) return;
  localStorage.setItem(LS_KEYS.testCases, JSON.stringify(state.testCases));
  localStorage.setItem(LS_KEYS.bugs, JSON.stringify(state.bugs));
  localStorage.setItem(LS_KEYS.executions, JSON.stringify(state.executions));
  localStorage.setItem(LS_KEYS.settings, JSON.stringify(state.settings));
}
function saveSettingsOnly() {
  localStorage.setItem(LS_KEYS.settings, JSON.stringify(state.settings));
}

/* ---------- TOASTS ---------- */
function toast(message, type = "info") {
  if (!state.settings.notifications) return;
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " error" : "");
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---------- MODAL ---------- */
const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
let lastFocusedEl = null;

function openModal(title, bodyHTML) {
  lastFocusedEl = document.activeElement;
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHTML;
  modalOverlay.hidden = false;
  const firstField = modalBody.querySelector("input, select, textarea, button");
  if (firstField) firstField.focus();
}
function closeModal() {
  modalOverlay.hidden = true;
  modalBody.innerHTML = "";
  if (lastFocusedEl) lastFocusedEl.focus();
}
document.getElementById("modal-close").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modalOverlay.hidden) closeModal(); });

/* ---------- NAVIGATION ---------- */
const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll(".nav-item");
function showView(name) {
  views.forEach(v => v.classList.toggle("active", v.id === name));
  navItems.forEach(n => {
    const active = n.dataset.view === name;
    n.classList.toggle("active", active);
    if (active) n.setAttribute("aria-current", "page"); else n.removeAttribute("aria-current");
  });
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  if (name === "test-reports") renderReport();
}
navItems.forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.view)));
document.getElementById("menu-toggle").addEventListener("click", () => {
  const sb = document.getElementById("sidebar");
  const open = sb.classList.toggle("open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
});

/* ---------- STATUS PILL HELPER ---------- */
function pill(status) {
  const cls = { PASS: "status-pass", FAIL: "status-fail", BLOCKED: "status-blocked", "Not Run": "status-notrun", RUNNING: "status-running" }[status] || "status-notrun";
  return `<span class="status-pill ${cls}">${status}</span>`;
}
function priorityClass(p) { return `priority-${p}`; }

/* =========================================================
   DASHBOARD
   ========================================================= */
function computeStats() {
  const total = state.testCases.length;
  const passed = state.testCases.filter(t => t.status === "PASS").length;
  const failed = state.testCases.filter(t => t.status === "FAIL").length;
  const blocked = state.testCases.filter(t => t.status === "BLOCKED").length;
  const rate = total ? ((passed / total) * 100).toFixed(1) : "0.0";
  return { total, passed, failed, blocked, rate };
}

function renderDashboard() {
  const s = computeStats();
  document.getElementById("kpi-total").textContent = s.total;
  document.getElementById("kpi-passed").textContent = s.passed;
  document.getElementById("kpi-failed").textContent = s.failed;
  document.getElementById("kpi-rate").textContent = s.rate + "%";
  document.getElementById("kpi-executions").textContent = state.executions.length;

  // ring chart
  const circumference = 2 * Math.PI * 50;
  const offset = circumference * (1 - s.rate / 100);
  const ring = document.getElementById("ring-fg");
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;
  document.getElementById("ring-label").textContent = s.rate + "%";

  // bar chart by module
  const modules = ["Browser", "LLM", "Guardrails"];
  const barChart = document.getElementById("bar-chart");
  barChart.innerHTML = modules.map(m => {
    const items = state.testCases.filter(t => t.module === m);
    const p = items.filter(t => t.status === "PASS").length;
    const f = items.filter(t => t.status === "FAIL").length;
    const max = Math.max(1, ...modules.map(mm => state.testCases.filter(t => t.module === mm).length));
    const passH = (p / max) * 140;
    const failH = (f / max) * 140;
    return `<div class="bar-group">
      <div class="bar-stack" style="height:140px">
        <div class="bar-fail" style="height:${failH}px"></div>
        <div class="bar-pass" style="height:${passH}px"></div>
      </div>
      <span class="bar-group-label">${m}</span>
    </div>`;
  }).join("");

  // recent executions (from browser tests as example rows + seeded)
  const recentRows = [
    { id: "TC-001", name: "Valid Login", module: "Browser", time: "1.2s", status: "PASS" },
    { id: "TC-002", name: "Invalid Password", module: "Browser", time: "1.1s", status: "PASS" },
    { id: "TC-003", name: "Empty Password", module: "Browser", time: "0.8s", status: "FAIL" },
    { id: "TC-011", name: "LLM Accuracy", module: "LLM", time: "1.7s", status: "PASS" },
    { id: "TC-015", name: "Prompt Injection", module: "Guardrails", time: "1.5s", status: "PASS" },
  ];
  document.getElementById("recent-executions-body").innerHTML = recentRows.map(r =>
    `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.module}</td><td>${r.time}</td><td>${pill(r.status)}</td></tr>`
  ).join("");
}

document.getElementById("run-all-tests").addEventListener("click", () => runProgressSimulation());

function runProgressSimulation() {
  const box = document.getElementById("run-progress");
  const text = document.getElementById("run-progress-text");
  const fill = document.getElementById("run-progress-fill");
  box.hidden = false;
  text.textContent = "Executing tests…";
  fill.style.width = "0%";
  let pct = 0;
  const timer = setInterval(() => {
    pct += Math.random() * 18 + 8;
    if (pct >= 100) {
      pct = 100;
      fill.style.width = "100%";
      clearInterval(timer);
      const s = computeStats();
      text.textContent = `Completed — ${s.passed} passed, ${s.failed} failed of ${s.total} test cases.`;
      logExecution("Full Regression Run");
      toast("Test execution completed");
      setTimeout(() => { box.hidden = true; }, 3500);
      return;
    }
    fill.style.width = pct + "%";
    text.textContent = `Executing tests… ${Math.floor(pct)}%`;
  }, 220);
}

function logExecution(suiteName) {
  const s = computeStats();
  const id = "EXE-" + (1000 + state.executions.length + 1);
  state.executions.unshift({
    id, suite: suiteName, total: s.total, passed: s.passed, failed: s.failed,
    duration: (Math.random() * 6 + 4).toFixed(1) + "s",
    executedAt: new Date().toLocaleString(),
    status: "COMPLETED",
  });
  saveState();
  renderExecutionHistory();
  renderDashboard();
}

/* =========================================================
   BROWSER AUTOMATION
   ========================================================= */
function renderBrowserTests() {
  document.getElementById("browser-tests-body").innerHTML = browserTests.map(t => `
    <tr>
      <td>${t.id}</td><td>${t.name}</td>
      <td class="${priorityClass(t.priority)}">${t.priority}</td>
      <td data-status-cell="${t.id}">${pill(t.status)}</td>
      <td>
        <button class="btn btn-secondary btn-small" data-exec="${t.id}">Execute</button>
        <button class="btn btn-link" data-view-detail="${t.id}">View Details</button>
      </td>
    </tr>`).join("");
}

document.getElementById("browser-tests-body").addEventListener("click", (e) => {
  const execId = e.target.dataset.exec;
  const detailId = e.target.dataset.viewDetail;
  if (execId) executeBrowserTest(execId);
  if (detailId) {
    const t = browserTests.find(x => x.id === detailId);
    openModal(`${t.id} — ${t.name}`, `
      <dl class="detail-grid">
        <div><dt>Priority</dt><dd>${t.priority}</dd></div>
        <div><dt>Status</dt><dd>${t.status}</dd></div>
        <div><dt>Module</dt><dd>Browser</dd></div>
        <div><dt>Suite</dt><dd>Web Application Regression Suite</dd></div>
      </dl>
      <p class="hint">Use Execute on the table row to run a simulated browser session for this test.</p>
    `);
  }
});

function executeBrowserTest(id) {
  const t = browserTests.find(x => x.id === id);
  const consoleEl = document.getElementById("browser-console");
  const steps = [
    "Initializing Browser Agent…",
    `Opening application for ${t.id}…`,
    "Navigating to page…",
    "Finding element…",
    "Performing action…",
    "Validating expected result…",
    "Test completed.",
  ];
  consoleEl.textContent = "";
  const cell = document.querySelector(`[data-status-cell="${id}"]`);
  cell.innerHTML = pill("RUNNING");
  toast(`Execution started: ${t.id}`);
  steps.forEach((line, i) => {
    setTimeout(() => {
      consoleEl.textContent += line + "\n";
      consoleEl.scrollTop = consoleEl.scrollHeight;
      if (i === steps.length - 1) {
        const result = Math.random() > 0.22 ? "PASS" : "FAIL";
        t.status = result;
        cell.innerHTML = pill(result);
        consoleEl.textContent += `\nResult: ${result}\n(Simulated result for demo purposes)`;
        toast(`${t.id} finished: ${result}`, result === "FAIL" ? "error" : "info");
      }
    }, (i + 1) * 550);
  });
}

document.getElementById("run-browser-tests").addEventListener("click", async () => {
  const consoleEl = document.getElementById("browser-console");
  const button = document.getElementById("run-browser-tests");

  // UI start state
  consoleEl.textContent =
    "====================================\n" +
    " REAL SELENIUM AUTOMATION\n" +
    "====================================\n\n" +
    "Connecting to Python backend...\n" +
    "Starting Selenium test suite...\n\n";

  button.disabled = true;

  const originalButtonText = button.textContent;
  button.textContent = "Running...";

  toast("Real Selenium suite started");

  try {
    // Call Flask backend
    const response = await fetch(
      "http://127.0.0.1:5000/api/run-full-suite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      let errorMessage = `Backend returned HTTP ${response.status}`;

      try {
        const errorData = await response.json();

        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parsing error
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();

    console.log("Real Selenium Result:", result);

    consoleEl.textContent +=
      "Selenium execution completed.\n\n";

    // ==========================================
    // SHOW INDIVIDUAL TEST RESULTS
    // ==========================================

    if (Array.isArray(result.results)) {
      result.results.forEach((test, index) => {
        const status = test.status || "UNKNOWN";

        const icon =
          status === "PASS"
            ? "✅"
            : status === "FAIL"
            ? "❌"
            : "⚪";

        const testName =
          test.test ||
          test.name ||
          `Test ${index + 1}`;

        consoleEl.textContent +=
          `${icon} ${testName} — ${status}\n`;

        if (test.message) {
          consoleEl.textContent +=
            `   ${test.message}\n`;
        }

        consoleEl.textContent += "\n";
      });
    }

    // ==========================================
    // SUMMARY
    // ==========================================

    const total = Number(result.total || 0);
    const passed = Number(result.passed || 0);
    const failed = Number(result.failed || 0);

    consoleEl.textContent +=
      "====================================\n" +
      " TEST SUMMARY\n" +
      "====================================\n" +
      `Total  : ${total}\n` +
      `Passed : ${passed}\n` +
      `Failed : ${failed}\n` +
      `Status : ${result.status || "UNKNOWN"}\n` +
      "====================================\n";

    consoleEl.scrollTop = consoleEl.scrollHeight;

    // ==========================================
    // UPDATE BROWSER TEST TABLE
    // ==========================================

    if (Array.isArray(result.results)) {
      result.results.forEach((seleniumResult, index) => {
        if (index >= browserTests.length) {
          return;
        }

        const browserTest = browserTests[index];

        if (
          seleniumResult.status === "PASS" ||
          seleniumResult.status === "FAIL"
        ) {
          browserTest.status = seleniumResult.status;
        }

        const cell = document.querySelector(
          `[data-status-cell="${browserTest.id}"]`
        );

        if (cell) {
          cell.innerHTML = pill(browserTest.status);
        }
      });
    }

    // ==========================================
    // ADD REAL RUN TO EXECUTION HISTORY
    // ==========================================

    const executionId =
      "EXE-" +
      (1000 + state.executions.length + 1);

    const executionRecord = {
      id: executionId,
      suite: "Real Selenium Automation Suite",
      total: total,
      passed: passed,
      failed: failed,
      duration: "Real Run",
      executedAt: new Date().toLocaleString(),
      status: "COMPLETED"
    };

    state.executions.unshift(executionRecord);

    saveState();

    // Refresh UI
    renderExecutionHistory();
    renderDashboard();

    // ==========================================
    // SUCCESS / FAILURE MESSAGE
    // ==========================================

    if (result.status === "PASS") {
      toast(
        `Selenium completed: ${passed}/${total} tests passed`
      );
    } else {
      toast(
        `Selenium completed: ${failed} test(s) failed`,
        "error"
      );
    }

  } catch (error) {
    console.error("Selenium API Error:", error);

    consoleEl.textContent +=
      "\n====================================\n" +
      " ERROR\n" +
      "====================================\n" +
      `${error.message}\n\n` +
      "Check these things:\n" +
      "1. Flask backend is running\n" +
      "2. Backend URL is http://127.0.0.1:5000\n" +
      "3. Website server is running on port 8000\n" +
      "4. selenium_test.py exists inside Backend\n";

    consoleEl.scrollTop = consoleEl.scrollHeight;

    toast(
      "Could not run Selenium automation",
      "error"
    );

  } finally {
    // Restore button
    button.disabled = false;
    button.textContent =
      originalButtonText || "Run Full Suite";
  }
});


/* =========================================================
   LLM EVALUATION
   ========================================================= */
const LLM_EXAMPLES = [
  { prompt: "What is the capital of Australia?", expected: "The capital of Australia is Canberra.", actual: "The capital of Australia is Canberra, a planned city located in the Australian Capital Territory." },
  { prompt: "Summarize our refund policy in one sentence.", expected: "Refunds are available within 30 days of purchase with proof of purchase.", actual: "You can get a refund within 30 days if you have your receipt." },
  { prompt: "How many moons does Mars have?", expected: "Mars has two moons, Phobos and Deimos.", actual: "Mars has three moons: Phobos, Deimos, and Olympus." },
];
document.getElementById("llm-example-picker").addEventListener("change", (e) => {
  if (e.target.value === "") return;
  const ex = LLM_EXAMPLES[e.target.value];
  document.getElementById("llm-prompt").value = ex.prompt;
  document.getElementById("llm-expected").value = ex.expected;
  document.getElementById("llm-actual").value = ex.actual;
});

function tokenize(str) {
  return (str.toLowerCase().match(/[a-z0-9']+/g) || []);
}
function similarity(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  ta.forEach(t => { if (tb.has(t)) overlap++; });
  return overlap / new Set([...ta, ...tb]).size;
}

document.getElementById("evaluate-response").addEventListener("click", () => {
  const prompt = document.getElementById("llm-prompt").value.trim();
  const expected = document.getElementById("llm-expected").value.trim();
  const actual = document.getElementById("llm-actual").value.trim();
  if (!prompt || !expected || !actual) {
    toast("Please fill in prompt, expected response and actual response", "error");
    return;
  }

  const relevance = Math.round(similarity(prompt, actual) * 60 + similarity(expected, actual) * 40);
  const accuracy = Math.round(similarity(expected, actual) * 100);

  const expectedKeywords = tokenize(expected).filter(w => w.length > 3);
  const actualTokens = new Set(tokenize(actual));
  const keywordHits = expectedKeywords.filter(w => actualTokens.has(w));
  const keywordCoverage = expectedKeywords.length ? keywordHits.length / expectedKeywords.length : 1;
  const keywordsStatus = keywordCoverage >= 0.6 ? "PASS" : "FAIL";

  const extraTokens = [...actualTokens].filter(w => w.length > 4 && !tokenize(expected).includes(w) && !tokenize(prompt).includes(w));
  const hallucinationRisk = extraTokens.length > Math.max(6, tokenize(expected).length);
  const hallucinationStatus = hallucinationRisk ? "FAIL" : "PASS";

  const consistency = similarity(expected, actual) > 0.35 || accuracy > 55 ? "PASS" : "FAIL";

  const overallPass = relevance >= 50 && accuracy >= 50 && keywordsStatus === "PASS" && hallucinationStatus === "PASS" && consistency === "PASS";

  document.getElementById("llm-results").hidden = false;
  document.getElementById("score-grid").innerHTML = `
    <div class="score-card"><span class="sc-label">Relevance</span><span class="sc-value">${clamp(relevance)}%</span></div>
    <div class="score-card"><span class="sc-label">Accuracy</span><span class="sc-value">${clamp(accuracy)}%</span></div>
    <div class="score-card"><span class="sc-label">Keywords</span><span class="sc-value">${pill(keywordsStatus)}</span></div>
    <div class="score-card"><span class="sc-label">Hallucination Check</span><span class="sc-value">${pill(hallucinationStatus)}</span></div>
    <div class="score-card"><span class="sc-label">Consistency</span><span class="sc-value">${pill(consistency)}</span></div>
  `;
  const verdict = document.getElementById("llm-verdict");
  verdict.className = "final-verdict " + (overallPass ? "pass" : "fail");
  verdict.textContent = overallPass ? "Overall Result: PASS — response meets QA evaluation criteria." : "Overall Result: FAIL — response did not meet one or more evaluation criteria.";
  toast("Evaluation complete: " + (overallPass ? "PASS" : "FAIL"), overallPass ? "info" : "error");
});
function clamp(n) { return Math.max(0, Math.min(100, n)); }

/* =========================================================
   GUARDRAILS & RED TEAM
   ========================================================= */
function renderGuardrails() {
  document.getElementById("guardrails-body").innerHTML = guardrailTests.map(t => `
    <tr>
      <td>${t.id}</td><td>${t.category}</td>
      <td class="${priorityClass(t.severity === "High" ? "High" : t.severity === "Medium" ? "Medium" : "Low")}">${t.severity}</td>
      <td data-rt-status="${t.id}">${pill(t.status)}</td>
      <td><button class="btn btn-secondary btn-small" data-rt-exec="${t.id}">Execute</button></td>
    </tr>`).join("");
}
document.getElementById("guardrails-body").addEventListener("click", (e) => {
  const id = e.target.dataset.rtExec;
  if (id) runSingleGuardrailTest(id);
});
function runSingleGuardrailTest(id) {
  const t = guardrailTests.find(x => x.id === id);
  const cell = document.querySelector(`[data-rt-status="${id}"]`);
  cell.innerHTML = pill("RUNNING");
  const consoleEl = document.getElementById("guardrails-console");
  consoleEl.textContent = `Running ${t.id} — ${t.category}…\nChecking input validation…\nChecking response policy…\nValidating output…\n`;
  setTimeout(() => {
    const result = Math.random() > 0.12 ? "PASS" : "FAIL";
    t.status = result;
    cell.innerHTML = pill(result);
    consoleEl.textContent += `Result: ${result}`;
    toast(`${t.id} finished: ${result}`, result === "FAIL" ? "error" : "info");
  }, 1200);
}
document.getElementById("run-security-tests").addEventListener("click", () => {
  const consoleEl = document.getElementById("guardrails-console");
  consoleEl.textContent = "Running Guardrail Tests…\nChecking input validation…\nChecking response policy…\nChecking sensitive-data handling…\nValidating output…\n";
  toast("Security test suite started");
  guardrailTests.forEach((t, idx) => {
    setTimeout(() => {
      const result = Math.random() > 0.1 ? "PASS" : "FAIL";
      t.status = result;
      const cell = document.querySelector(`[data-rt-status="${t.id}"]`);
      if (cell) cell.innerHTML = pill(result);
      consoleEl.textContent += `${t.id} ${t.category} … ${result}\n`;
      if (idx === guardrailTests.length - 1) {
        consoleEl.textContent += "\nGuardrail suite completed. (Safe demo simulation — no harmful payloads executed.)";
        logExecution("Guardrail & Red Team Suite");
        toast("Security tests completed");
      }
    }, (idx + 1) * 500);
  });
});

/* =========================================================
   TEST CASE MANAGEMENT
   ========================================================= */
function renderTestCases() {
  const q = document.getElementById("tc-search").value.toLowerCase();
  const fm = document.getElementById("tc-filter-module").value;
  const fp = document.getElementById("tc-filter-priority").value;
  const fs = document.getElementById("tc-filter-status").value;
  const rows = state.testCases.filter(t =>
    (!q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
    (!fm || t.module === fm) && (!fp || t.priority === fp) && (!fs || t.status === fs)
  );
  document.getElementById("test-cases-body").innerHTML = rows.length ? rows.map(t => `
    <tr>
      <td>${t.id}</td><td>${t.title}</td><td>${t.module}</td>
      <td class="${priorityClass(t.priority)}">${t.priority}</td>
      <td>${pill(t.status)}</td>
      <td>
        <button class="btn btn-link" data-tc-view="${t.id}">View</button>
        <button class="btn btn-link" data-tc-edit="${t.id}">Edit</button>
        <button class="btn btn-link" data-tc-delete="${t.id}" style="color:var(--fail)">Delete</button>
      </td>
    </tr>`).join("") : `<tr><td colspan="6" class="hint">No test cases match your filters.</td></tr>`;
}
["tc-search", "tc-filter-module", "tc-filter-priority", "tc-filter-status"].forEach(id =>
  document.getElementById(id).addEventListener("input", renderTestCases)
);

function testCaseFormHTML(t = {}) {
  return `
    <div class="field"><label>Test ID</label><input type="text" id="f-id" value="${t.id || nextId("TC")}" ${t.id ? "readonly" : ""}></div>
    <div class="field"><label>Title</label><input type="text" id="f-title" value="${t.title || ""}"></div>
    <div class="field-row">
      <div class="field"><label>Module</label>
        <select id="f-module"><option ${t.module === "Browser" ? "selected" : ""}>Browser</option><option ${t.module === "LLM" ? "selected" : ""}>LLM</option><option ${t.module === "Guardrails" ? "selected" : ""}>Guardrails</option></select>
      </div>
      <div class="field"><label>Priority</label>
        <select id="f-priority"><option ${t.priority === "High" ? "selected" : ""}>High</option><option ${t.priority === "Medium" ? "selected" : ""}>Medium</option><option ${t.priority === "Low" ? "selected" : ""}>Low</option></select>
      </div>
    </div>
    <div class="field"><label>Precondition</label><textarea id="f-precondition" rows="2">${t.precondition || ""}</textarea></div>
    <div class="field"><label>Test Steps</label><textarea id="f-steps" rows="3">${t.steps || ""}</textarea></div>
    <div class="field"><label>Expected Result</label><textarea id="f-expected" rows="2">${t.expected || ""}</textarea></div>
    <div class="field"><label>Status</label>
      <select id="f-status"><option ${t.status === "PASS" ? "selected" : ""}>PASS</option><option ${t.status === "FAIL" ? "selected" : ""}>FAIL</option><option ${t.status === "BLOCKED" ? "selected" : ""}>BLOCKED</option><option ${(!t.status || t.status === "Not Run") ? "selected" : ""}>Not Run</option></select>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="f-cancel">Cancel</button>
      <button class="btn btn-primary" id="f-save">${t.id ? "Save Changes" : "Add Test Case"}</button>
    </div>`;
}
function nextId(prefix) {
  const list = prefix === "TC" ? state.testCases : prefix === "BUG" ? state.bugs : [];
  const nums = list.map(x => parseInt(x.id.split("-")[1], 10)).filter(n => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

document.getElementById("add-test-case").addEventListener("click", () => {
  openModal("Add Test Case", testCaseFormHTML());
  bindTestCaseForm(null);
});
document.getElementById("test-cases-body").addEventListener("click", (e) => {
  const viewId = e.target.dataset.tcView, editId = e.target.dataset.tcEdit, delId = e.target.dataset.tcDelete;
  if (viewId) {
    const t = state.testCases.find(x => x.id === viewId);
    openModal(`${t.id} — ${t.title}`, `
      <dl class="detail-grid">
        <div><dt>Module</dt><dd>${t.module}</dd></div>
        <div><dt>Priority</dt><dd>${t.priority}</dd></div>
        <div><dt>Status</dt><dd>${t.status}</dd></div>
        <div><dt>Precondition</dt><dd>${t.precondition || "—"}</dd></div>
        <div style="grid-column:1/-1"><dt>Steps</dt><dd>${t.steps || "—"}</dd></div>
        <div style="grid-column:1/-1"><dt>Expected Result</dt><dd>${t.expected || "—"}</dd></div>
      </dl>`);
  }
  if (editId) {
    const t = state.testCases.find(x => x.id === editId);
    openModal("Edit Test Case", testCaseFormHTML(t));
    bindTestCaseForm(t.id);
  }
  if (delId) {
    if (confirmInline(`Delete test case ${delId}?`)) {
      state.testCases = state.testCases.filter(x => x.id !== delId);
      saveState(); renderTestCases(); renderDashboard();
      toast(`${delId} deleted`);
    }
  }
});
function bindTestCaseForm(editingId) {
  document.getElementById("f-cancel").addEventListener("click", closeModal);
  document.getElementById("f-save").addEventListener("click", () => {
    const rec = {
      id: document.getElementById("f-id").value.trim(),
      title: document.getElementById("f-title").value.trim() || "Untitled Test",
      module: document.getElementById("f-module").value,
      priority: document.getElementById("f-priority").value,
      precondition: document.getElementById("f-precondition").value,
      steps: document.getElementById("f-steps").value,
      expected: document.getElementById("f-expected").value,
      status: document.getElementById("f-status").value,
    };
    if (editingId) {
      state.testCases = state.testCases.map(x => x.id === editingId ? rec : x);
      toast("Test case updated");
    } else {
      state.testCases.push(rec);
      toast("Test case created successfully");
    }
    saveState(); renderTestCases(); renderDashboard();
    closeModal();
  });
}
function confirmInline(msg) { return window.confirm ? confirm(msg) : true; }

/* =========================================================
   TEST EXECUTION HISTORY
   ========================================================= */
function renderExecutionHistory() {
  document.getElementById("execution-history-body").innerHTML = state.executions.map(e => `
    <tr>
      <td>${e.id}</td><td>${e.suite}</td><td>${e.total}</td>
      <td style="color:var(--pass)">${e.passed}</td><td style="color:var(--fail)">${e.failed}</td>
      <td>${e.duration}</td><td>${e.executedAt}</td><td>${pill(e.status === "COMPLETED" ? "PASS" : e.status)}</td>
      <td><button class="btn btn-link" data-exe-view="${e.id}">View</button></td>
    </tr>`).join("");
}
document.getElementById("execution-history-body").addEventListener("click", (e) => {
  const id = e.target.dataset.exeView;
  if (!id) return;
  const ex = state.executions.find(x => x.id === id);
  openModal(`${ex.id} — ${ex.suite}`, `
    <dl class="detail-grid">
      <div><dt>Total</dt><dd>${ex.total}</dd></div>
      <div><dt>Passed</dt><dd>${ex.passed}</dd></div>
      <div><dt>Failed</dt><dd>${ex.failed}</dd></div>
      <div><dt>Duration</dt><dd>${ex.duration}</dd></div>
      <div><dt>Executed At</dt><dd>${ex.executedAt}</dd></div>
      <div><dt>Status</dt><dd>${ex.status}</dd></div>
    </dl>`);
});
document.getElementById("run-suite").addEventListener("click", () => { logExecution("Manual Test Suite Run"); });
document.getElementById("clear-history").addEventListener("click", () => {
  if (confirmInline("Clear all execution history?")) {
    state.executions = [];
    saveState(); renderExecutionHistory(); renderDashboard();
    toast("Execution history cleared");
  }
});

/* =========================================================
   BUG REPORTS
   ========================================================= */
function renderBugs() {
  const q = document.getElementById("bug-search").value.toLowerCase();
  const fs = document.getElementById("bug-filter-severity").value;
  const rows = state.bugs.filter(b => (!q || b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)) && (!fs || b.severity === fs));
  document.getElementById("bugs-body").innerHTML = rows.length ? rows.map(b => `
    <tr>
      <td>${b.id}</td><td>${b.title}</td><td>${b.module}</td>
      <td class="${priorityClass(b.severity === "Critical" ? "High" : b.severity)}">${b.severity}</td>
      <td>${bugStatusPill(b.status)}</td><td>${b.assignedTo}</td>
      <td>
        <button class="btn btn-link" data-bug-view="${b.id}">View</button>
        <button class="btn btn-link" data-bug-edit="${b.id}">Edit</button>
        <button class="btn btn-link" data-bug-delete="${b.id}" style="color:var(--fail)">Delete</button>
      </td>
    </tr>`).join("") : `<tr><td colspan="7" class="hint">No bugs match your filters.</td></tr>`;
}
function bugStatusPill(status) {
  const cls = status === "Closed" ? "status-pass" : status === "In Progress" ? "status-running" : "status-fail";
  return `<span class="status-pill ${cls}">${status}</span>`;
}
["bug-search", "bug-filter-severity"].forEach(id => document.getElementById(id).addEventListener("input", renderBugs));

function bugFormHTML(b = {}) {
  return `
    <div class="field"><label>Bug ID</label><input type="text" id="bf-id" value="${b.id || nextId("BUG")}" ${b.id ? "readonly" : ""}></div>
    <div class="field"><label>Title</label><input type="text" id="bf-title" value="${b.title || ""}"></div>
    <div class="field-row">
      <div class="field"><label>Module</label><select id="bf-module"><option ${b.module === "Browser" ? "selected" : ""}>Browser</option><option ${b.module === "LLM" ? "selected" : ""}>LLM</option><option ${b.module === "Guardrails" ? "selected" : ""}>Guardrails</option></select></div>
      <div class="field"><label>Severity</label><select id="bf-severity"><option ${b.severity === "Critical" ? "selected" : ""}>Critical</option><option ${b.severity === "High" ? "selected" : ""}>High</option><option ${b.severity === "Medium" ? "selected" : ""}>Medium</option><option ${b.severity === "Low" ? "selected" : ""}>Low</option></select></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Priority</label><select id="bf-priority"><option ${b.priority === "High" ? "selected" : ""}>High</option><option ${b.priority === "Medium" ? "selected" : ""}>Medium</option><option ${b.priority === "Low" ? "selected" : ""}>Low</option></select></div>
      <div class="field"><label>Environment</label><input type="text" id="bf-env" value="${b.environment || ""}"></div>
    </div>
    <div class="field"><label>Steps to Reproduce</label><textarea id="bf-steps" rows="3">${b.steps || ""}</textarea></div>
    <div class="field"><label>Expected Result</label><textarea id="bf-expected" rows="2">${b.expected || ""}</textarea></div>
    <div class="field"><label>Actual Result</label><textarea id="bf-actual" rows="2">${b.actual || ""}</textarea></div>
    <div class="field-row">
      <div class="field"><label>Status</label><select id="bf-status"><option ${b.status === "Open" ? "selected" : ""}>Open</option><option ${b.status === "In Progress" ? "selected" : ""}>In Progress</option><option ${b.status === "Closed" ? "selected" : ""}>Closed</option></select></div>
      <div class="field"><label>Assigned To</label><input type="text" id="bf-assigned" value="${b.assignedTo || "Unassigned"}"></div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-secondary" id="bf-cancel">Cancel</button>
      <button class="btn btn-primary" id="bf-save">${b.id ? "Save Changes" : "Create Bug"}</button>
    </div>`;
}
document.getElementById("add-bug").addEventListener("click", () => {
  openModal("Create Bug", bugFormHTML());
  bindBugForm(null);
});
document.getElementById("bugs-body").addEventListener("click", (e) => {
  const viewId = e.target.dataset.bugView, editId = e.target.dataset.bugEdit, delId = e.target.dataset.bugDelete;
  if (viewId) {
    const b = state.bugs.find(x => x.id === viewId);
    openModal(`${b.id} — ${b.title}`, `
      <dl class="detail-grid">
        <div><dt>Module</dt><dd>${b.module}</dd></div>
        <div><dt>Severity</dt><dd>${b.severity}</dd></div>
        <div><dt>Priority</dt><dd>${b.priority}</dd></div>
        <div><dt>Environment</dt><dd>${b.environment}</dd></div>
        <div><dt>Status</dt><dd>${b.status}</dd></div>
        <div><dt>Assigned To</dt><dd>${b.assignedTo}</dd></div>
        <div style="grid-column:1/-1"><dt>Steps to Reproduce</dt><dd>${b.steps}</dd></div>
        <div><dt>Expected Result</dt><dd>${b.expected}</dd></div>
        <div><dt>Actual Result</dt><dd>${b.actual}</dd></div>
      </dl>`);
  }
  if (editId) {
    const b = state.bugs.find(x => x.id === editId);
    openModal("Edit Bug", bugFormHTML(b));
    bindBugForm(b.id);
  }
  if (delId) {
    if (confirmInline(`Delete ${delId}?`)) {
      state.bugs = state.bugs.filter(x => x.id !== delId);
      saveState(); renderBugs();
      toast(`${delId} deleted`);
    }
  }
});
function bindBugForm(editingId) {
  document.getElementById("bf-cancel").addEventListener("click", closeModal);
  document.getElementById("bf-save").addEventListener("click", () => {
    const rec = {
      id: document.getElementById("bf-id").value.trim(),
      title: document.getElementById("bf-title").value.trim() || "Untitled Bug",
      module: document.getElementById("bf-module").value,
      severity: document.getElementById("bf-severity").value,
      priority: document.getElementById("bf-priority").value,
      environment: document.getElementById("bf-env").value,
      steps: document.getElementById("bf-steps").value,
      expected: document.getElementById("bf-expected").value,
      actual: document.getElementById("bf-actual").value,
      status: document.getElementById("bf-status").value,
      assignedTo: document.getElementById("bf-assigned").value || "Unassigned",
    };
    if (editingId) {
      state.bugs = state.bugs.map(x => x.id === editingId ? rec : x);
      toast("Bug updated");
    } else {
      state.bugs.push(rec);
      toast("Bug created successfully");
    }
    saveState(); renderBugs();
    closeModal();
  });
}

/* =========================================================
   TEST REPORTS
   ========================================================= */
function renderReport() {
  const s = computeStats();
  document.getElementById("report-kpis").innerHTML = `
    <div class="kpi-card"><span class="kpi-label">Total Tests</span><span class="kpi-value">${s.total}</span></div>
    <div class="kpi-card kpi-pass"><span class="kpi-label">Passed</span><span class="kpi-value">${s.passed}</span></div>
    <div class="kpi-card kpi-fail"><span class="kpi-label">Failed</span><span class="kpi-value">${s.failed}</span></div>
    <div class="kpi-card"><span class="kpi-label">Blocked</span><span class="kpi-value">${s.blocked}</span></div>
    <div class="kpi-card"><span class="kpi-label">Pass Rate</span><span class="kpi-value">${s.rate}%</span></div>
  `;
  const modules = ["Browser", "LLM", "Guardrails"];
  document.getElementById("module-results-body").innerHTML = modules.map(m => {
    const items = state.testCases.filter(t => t.module === m);
    const p = items.filter(t => t.status === "PASS").length;
    const f = items.filter(t => t.status === "FAIL").length;
    const rate = items.length ? ((p / items.length) * 100).toFixed(1) : "0.0";
    return `<tr><td>${m}</td><td>${items.length}</td><td>${p}</td><td>${f}</td><td>${rate}%</td></tr>`;
  }).join("");
  const failed = state.testCases.filter(t => t.status === "FAIL");
  document.getElementById("failed-cases-body").innerHTML = failed.length ? failed.map(t => `<tr><td>${t.id}</td><td>${t.title}</td><td>${t.module}</td></tr>`).join("") : `<tr><td colspan="3" class="hint">No failed test cases.</td></tr>`;
}
document.getElementById("generate-report").addEventListener("click", () => {
  renderReport();
  document.getElementById("report-timestamp").textContent = new Date().toLocaleString();
  toast("Report generated");
});
document.getElementById("print-report").addEventListener("click", () => window.print());
document.getElementById("export-json").addEventListener("click", () => {
  const s = computeStats();
  const payload = { generatedAt: new Date().toISOString(), summary: s, testCases: state.testCases, executions: state.executions, bugs: state.bugs };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "qa-test-report.json"; a.click();
  URL.revokeObjectURL(url);
  toast("Report exported as JSON");
});

/* =========================================================
   SETTINGS
   ========================================================= */
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.settings.darkMode ? "dark" : "light");
}
function renderSettings() {
  document.getElementById("setting-dark-mode").checked = state.settings.darkMode;
  document.getElementById("setting-notifications").checked = state.settings.notifications;
  document.getElementById("setting-autosave").checked = state.settings.autosave;
}
document.getElementById("setting-dark-mode").addEventListener("change", (e) => {
  state.settings.darkMode = e.target.checked;
  applyTheme(); saveSettingsOnly();
});
document.getElementById("setting-notifications").addEventListener("change", (e) => {
  state.settings.notifications = e.target.checked;
  saveSettingsOnly();
  if (e.target.checked) toast("Notifications enabled");
});
document.getElementById("setting-autosave").addEventListener("change", (e) => {
  state.settings.autosave = e.target.checked;
  saveSettingsOnly();
  if (e.target.checked) { saveState(); toast("Auto-save enabled"); } else { toast("Auto-save disabled"); }
});
document.getElementById("reset-demo-data").addEventListener("click", () => {
  if (!confirmInline("Reset all demo data? This clears locally stored test cases, bugs and history.")) return;
  localStorage.removeItem(LS_KEYS.testCases);
  localStorage.removeItem(LS_KEYS.bugs);
  localStorage.removeItem(LS_KEYS.executions);
  state.testCases = SEED_TEST_CASES.slice();
  state.bugs = SEED_BUGS.slice();
  state.executions = seedExecutions();
  browserTests = SEED_BROWSER_TESTS.map(t => ({ ...t }));
  guardrailTests = SEED_GUARDRAIL_TESTS.map(t => ({ ...t }));
  saveState();
  renderAll();
  toast("Demo data reset");
});

/* =========================================================
   GLOBAL SEARCH
   ========================================================= */
const searchInput = document.getElementById("global-search");
const searchResults = document.getElementById("search-results");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.hidden = true; return; }
  const results = [];
  state.testCases.filter(t => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q))
    .slice(0, 5).forEach(t => results.push({ type: "Test Case", label: `${t.id} — ${t.title}`, view: "test-cases" }));
  state.bugs.filter(b => b.title.toLowerCase().includes(q) || b.id.toLowerCase().includes(q))
    .slice(0, 5).forEach(b => results.push({ type: "Bug", label: `${b.id} — ${b.title}`, view: "bug-reports" }));
  state.executions.filter(e => e.suite.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    .slice(0, 5).forEach(e => results.push({ type: "Execution", label: `${e.id} — ${e.suite}`, view: "test-execution" }));
  if ("test reports".includes(q) || "report".includes(q) === false && "test reports".includes(q)) { /* noop guard */ }
  if ("test reports".includes(q)) results.push({ type: "Report", label: "Test Reports summary", view: "test-reports" });

  searchResults.hidden = false;
  searchResults.innerHTML = results.length
    ? results.map(r => `<div class="search-result-item" data-goto="${r.view}"><span class="sr-type">${r.type}</span>${r.label}</div>`).join("")
    : `<div class="search-empty">No matches found.</div>`;
});
searchResults.addEventListener("click", (e) => {
  const view = e.target.closest("[data-goto]")?.dataset.goto;
  if (view) { showView(view); searchResults.hidden = true; searchInput.value = ""; }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) searchResults.hidden = true;
});

/* ---------- NOTIFICATIONS ICON DEMO ---------- */
document.getElementById("notif-btn").addEventListener("click", () => {
  document.getElementById("notif-dot").classList.remove("show");
  openModal("Notifications", `
    <p>2 failed test cases require attention: <strong>TC-004 Empty Password</strong> and <strong>TC-009 Checkout Validation</strong>.</p>
    <p class="hint">This is demo notification content for the interview-ready prototype.</p>
    <div class="modal-actions"><button class="btn btn-primary" id="notif-ok">Got it</button></div>
  `);
  document.getElementById("notif-ok").addEventListener("click", closeModal);
});
setTimeout(() => document.getElementById("notif-dot").classList.add("show"), 1500);

/* =========================================================
   INIT
   ========================================================= */
function renderAll() {
  renderDashboard();
  renderBrowserTests();
  renderGuardrails();
  renderTestCases();
  renderExecutionHistory();
  renderBugs();
  renderSettings();
  applyTheme();
}
renderAll();
