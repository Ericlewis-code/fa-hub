/* FA Hub — personal portfolio demo. Sample data and placeholder links only. */
(function () {
  "use strict";

  var TZ = "America/Los_Angeles";
  var FLEET_SIZE = 2200;
  var PAGE_SIZE = 25;
  var KEYS = {
    theme: "fahub-theme",
    favs: "fahub-favorites",
    recentTools: "fahub-recent-tools",
    shift: "fahub-shift",
    recentRobots: "fahub-recent-robots",
    activity: "fahub-activity",
    vanSession: "fahub-van-session",
    queue: "fahub-offline-queue"
  };

  var CATEGORIES = ["All", "Communication", "HR & Pay", "Ops", "Security", "Docs"];

  var TOOLS = [
    { id: "rippling", name: "Rippling", purpose: "HR, pay, and clock in/out", category: "HR & Pay", href: "https://example.com/rippling" },
    { id: "slack", name: "Slack", purpose: "Shift chat and team channels", category: "Communication", href: "https://example.com/slack" },
    { id: "notion", name: "Notion", purpose: "Docs, playbooks, and wiki", category: "Docs", href: "https://example.com/notion" },
    { id: "jira", name: "Jira", purpose: "Tickets and end-of-shift notes", category: "Ops", href: "https://example.com/jira" },
    { id: "samsara", name: "Samsara", purpose: "Vehicle and driver status", category: "Ops", href: "https://example.com/samsara" },
    { id: "driver-auth", name: "Driver Authenticator", purpose: "Verify a driver session", category: "Security", href: "https://example.com/driver-authenticator" },
    { id: "ramp", name: "Ramp", purpose: "Expenses and cards", category: "HR & Pay", href: "https://example.com/ramp" },
    { id: "meet", name: "Google Meet", purpose: "Video calls and huddles", category: "Communication", href: "https://example.com/meet" },
    { id: "gmail", name: "Gmail", purpose: "Mail and shift notices", category: "Communication", href: "https://example.com/gmail" },
    { id: "gdocs", name: "Google Docs", purpose: "Shared documents", category: "Docs", href: "https://example.com/docs" },
    { id: "authenticator", name: "Authenticator", purpose: "Two-factor codes", category: "Security", href: "https://example.com/authenticator" },
    { id: "tailscale", name: "Tailscale", purpose: "VPN for internal tools", category: "Security", href: "https://example.com/tailscale" },
    { id: "robots", name: "Robot Commands", purpose: "Look up a unit and send emotes", category: "Ops", href: "#robots", internal: true },
    { id: "locations", name: "FA Locations", purpose: "See which van each FA is signed into", category: "Ops", href: "#locations", internal: true }
  ];

  var SHIFT_SECTIONS = [
    {
      id: "start",
      title: "Start of shift",
      items: [
        { id: "start-vpn", label: "Connect Tailscale so internal tools are reachable" },
        { id: "start-clock", label: "Clock in on Rippling" },
        { id: "start-slack", label: "Check the shift Slack channel for handoff notes" },
        { id: "start-auth", label: "Confirm Authenticator is ready for sign-in" },
        { id: "start-fleet", label: "Scan the demo fleet for low-battery or offline units" },
        { id: "start-checkin", label: "Sign into my van (on shift only)" }
      ]
    },
    {
      id: "mid",
      title: "Mid shift",
      items: [
        { id: "mid-slack", label: "Watch Slack for new pings and recoveries" },
        { id: "mid-samsara", label: "Check Samsara for vehicle or driver issues" },
        { id: "mid-robots", label: "Look up any unit that needs an emote or bin command" },
        { id: "mid-jira", label: "Open or update a Jira ticket if a unit needs a tech" },
        { id: "mid-loc", label: "Sign into a different van if I switch vehicles" }
      ]
    },
    {
      id: "end",
      title: "End of shift",
      items: [
        { id: "end-jira", label: "Write end-of-shift notes in Jira" },
        { id: "end-flags", label: "Confirm flagged or offline units are documented" },
        { id: "end-clock", label: "Clock out on Rippling" },
        { id: "end-vpn", label: "Disconnect Tailscale" }
      ]
    }
  ];

  var COMMANDS = [
    { id: "smile", label: "Smile", risky: false },
    { id: "thanks", label: "Thanks", risky: false },
    { id: "excuse-me", label: "Excuse me", risky: false },
    { id: "unlock-bin", label: "Unlock bin", risky: true },
    { id: "lock-bin", label: "Lock bin", risky: false }
  ];

  var ZONE_LETTERS = ["A", "B", "C", "D", "E"];
  var ZONES = ["Depot"].concat(
    ZONE_LETTERS.reduce(function (acc, letter) {
      for (var n = 1; n <= 8; n++) acc.push(letter + n);
      return acc;
    }, [])
  );

  /* Positions are viewBox units on the Cedar Grid SVG (0 0 100 66). */
  var VANS = [
    { id: "VAN-01", status: "moving", x: 20, y: 24, heading: 25, lastMin: 0 },
    { id: "VAN-02", status: "parked", x: 22, y: 41, heading: 0, lastMin: 18 },
    { id: "VAN-03", status: "moving", x: 50, y: 26, heading: 200, lastMin: 0 },
    { id: "VAN-04", status: "offline", x: 80, y: 24, heading: 0, lastMin: 140 },
    { id: "VAN-05", status: "parked", x: 50, y: 41, heading: 0, lastMin: 7 },
    { id: "VAN-06", status: "moving", x: 80, y: 41, heading: 150, lastMin: 0 },
    { id: "VAN-07", status: "parked", x: 16, y: 58, heading: 0, lastMin: 33 },
    { id: "VAN-08", status: "moving", x: 38, y: 58, heading: 340, lastMin: 0 },
    { id: "VAN-09", status: "parked", x: 60, y: 58, heading: 0, lastMin: 12 },
    { id: "VAN-10", status: "offline", x: 82, y: 58, heading: 0, lastMin: 260 }
  ];

  var FAS = [
    { id: "je", name: "Jordan Ellis", initials: "JE", vanId: "VAN-01" },
    { id: "so", name: "Sam Okada", initials: "SO", vanId: "VAN-02" },
    { id: "ps", name: "Priya Shah", initials: "PS", vanId: "VAN-03" },
    { id: "ml", name: "Morgan Lee", initials: "ML", vanId: "VAN-03" },
    { id: "tb", name: "Taylor Brooks", initials: "TB", vanId: "VAN-05" },
    { id: "rk", name: "Riley Kim", initials: "RK", vanId: "VAN-06" },
    { id: "cp", name: "Casey Patel", initials: "CP", vanId: "VAN-07" },
    { id: "do", name: "Dana Ortiz", initials: "DO", vanId: "VAN-08" },
    { id: "ar", name: "Alex Rivera", initials: "AR", vanId: null },
    { id: "cn", name: "Chris Nguyen", initials: "CN", vanId: null },
    { id: "qa", name: "Quinn Adeyemi", initials: "QA", vanId: null }
  ];

  var ME = { id: "me", name: "You (demo)", initials: "YO" };

  /* ---------- utilities ---------- */
  function $(id) { return document.getElementById(id); }

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function todayKey() {
    return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }

  function formatDateLong(date) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric"
    }).format(date) + " PT";
  }

  function formatTime(date, withSeconds) {
    var opts = { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true };
    if (withSeconds) opts.second = "2-digit";
    return new Intl.DateTimeFormat("en-US", opts).format(date) + " PT";
  }

  function formatLastSeen(date) {
    var now = Date.now();
    var diff = now - date.getTime();
    var mins = Math.round(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + " min ago";
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours + " hr ago";
    var days = Math.round(hours / 24);
    return days + " day" + (days === 1 ? "" : "s") + " ago";
  }

  function formatLastSeenFull(date) {
    return formatLastSeen(date) + " · " + new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true
    }).format(date) + " PT";
  }

  function mulberry32(seed) {
    return function () {
      var t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function iconSvg(name) {
    var icons = {
      rippling: '<path d="M12 4v16M6 9h12M6 15h12"/>',
      slack: '<path d="M8 5v10M16 9v10M5 8h10M9 16h10"/>',
      notion: '<path d="M7 5h8l4 14H10L7 5zM10 5v14M9 19h10"/>',
      jira: '<path d="M12 4l7 7-7 7-7-7 7-7z"/><path d="M12 10l-2 2 2 2 2-2-2-2z"/>',
      samsara: '<circle cx="12" cy="12" r="7"/><path d="M12 8v5l3 2"/>',
      "driver-auth": '<rect x="7" y="11" width="10" height="8" rx="2"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>',
      ramp: '<path d="M4 17l5-9 3 5 2-3 6 7H4z"/>',
      meet: '<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10l6-3v10l-6-3V10z"/>',
      gmail: '<path d="M4 7l8 6 8-6v10H4V7z"/><path d="M4 7l8 6 8-6"/>',
      gdocs: '<path d="M8 4h6l4 4v12H8V4z"/><path d="M14 4v4h4M10 12h6M10 16h6"/>',
      authenticator: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>',
      tailscale: '<circle cx="7" cy="12" r="2.2"/><circle cx="17" cy="8" r="2.2"/><circle cx="17" cy="16" r="2.2"/><path d="M9.1 11.2l5.6-2.5M9.1 12.8l5.6 2.5"/>',
      robots: '<rect x="7" y="7" width="10" height="9" rx="1.8"/><circle cx="10" cy="11.2" r="1.05" fill="currentColor" stroke="none"/><circle cx="14" cy="11.2" r="1.05" fill="currentColor" stroke="none"/><path d="M12 7V4.2M10.6 4.2h2.8M9 16v2.4M15 16v2.4"/>',
      locations: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>'
    };
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || "") + "</svg>";
  }

  function categoryClass(cat) {
    if (cat === "HR & Pay") return "cat-HR";
    if (cat === "Field") return "cat-Field";
    return "cat-" + cat.replace(/\s+/g, "");
  }

  /* ---------- theme ---------- */
  function currentTheme() {
    var stored = null;
    try { stored = localStorage.getItem(KEYS.theme); } catch (e) {}
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(KEYS.theme, theme); } catch (e) {}
    var btn = $("theme-toggle");
    if (btn) btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f3f5f8" : "#0c1017");
  }

  /* ---------- toast + modal ---------- */
  var toastTimer = null;
  function showToast(message) {
    var el = $("toast");
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2800);
  }

  var pendingConfirm = null;
  function openConfirm(title, body, onYes) {
    pendingConfirm = onYes;
    $("modal-title").textContent = title;
    $("modal-body").textContent = body;
    $("modal-root").hidden = false;
    $("modal-confirm").focus();
  }

  function closeModal() {
    pendingConfirm = null;
    $("modal-root").hidden = true;
  }

  /* ---------- router ---------- */
  var currentView = "home";

  function parseHash() {
    var hash = (location.hash || "#home").replace(/^#/, "");
    var parts = hash.split("/");
    var view = parts[0] || "home";
    if (["home", "shift", "robots", "locations"].indexOf(view) === -1) view = "home";
    return { view: view, robotId: parts[1] ? decodeURIComponent(parts[1]).toUpperCase() : null };
  }

  function showView(view) {
    currentView = view;
    ["home", "shift", "robots", "locations"].forEach(function (name) {
      var section = $("view-" + name);
      if (section) section.hidden = name !== view;
    });
    document.querySelectorAll(".tab").forEach(function (tab) {
      tab.classList.toggle("is-active", tab.getAttribute("data-nav") === view);
    });
    if (view === "robots") renderRobots();
    if (view === "locations") renderLocations();
    if (view === "shift") renderShift();
    window.scrollTo(0, 0);
  }

  /* ---------- home / launcher ---------- */
  var activeCategory = "All";
  var favorites = load(KEYS.favs, []);
  var recentTools = load(KEYS.recentTools, []);

  function toolById(id) {
    for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i];
    return null;
  }

  function toggleFavorite(id, ev) {
    if (ev) ev.preventDefault();
    if (ev) ev.stopPropagation();
    var idx = favorites.indexOf(id);
    if (idx >= 0) favorites.splice(idx, 1);
    else favorites.unshift(id);
    save(KEYS.favs, favorites);
    renderHome();
  }

  function openTool(tool) {
    recentTools = [tool.id].concat(recentTools.filter(function (id) { return id !== tool.id; })).slice(0, 6);
    save(KEYS.recentTools, recentTools);
    if (tool.internal) {
      location.hash = tool.href;
      return;
    }
    renderHome();
    window.open(tool.href, "_blank", "noopener,noreferrer");
  }

  function renderHome() {
    var q = ($("tool-search").value || "").trim().toLowerCase();
    var chips = $("category-chips");
    chips.innerHTML = CATEGORIES.map(function (cat) {
      var active = cat === activeCategory;
      return '<button type="button" class="chip' + (active ? " is-active" : "") + '" role="tab" aria-selected="' + active + '" data-cat="' + escapeHtml(cat) + '">' + escapeHtml(cat) + "</button>";
    }).join("");

    var list = TOOLS.filter(function (t) {
      if (activeCategory !== "All" && t.category !== activeCategory) return false;
      if (!q) return true;
      return (t.name + " " + t.purpose + " " + t.category).toLowerCase().indexOf(q) !== -1;
    }).slice();

    list.sort(function (a, b) {
      var af = favorites.indexOf(a.id) >= 0 ? 0 : 1;
      var bf = favorites.indexOf(b.id) >= 0 ? 0 : 1;
      if (af !== bf) return af - bf;
      return 0;
    });

    var grid = $("tile-grid");
    grid.innerHTML = list.map(function (t) {
      var fav = favorites.indexOf(t.id) >= 0;
      var extra = t.internal
        ? 'href="' + t.href + '" data-open="' + t.id + '"'
        : 'href="' + t.href + '" target="_blank" rel="noopener noreferrer" data-open="' + t.id + '"';
      return (
        '<div class="tile-wrap" role="listitem">' +
          '<a class="tile" ' + extra + ">" +
            '<span class="tile-icon ' + categoryClass(t.category) + '">' + iconSvg(t.id) + "</span>" +
            '<span class="tile-body"><p class="tile-name">' + escapeHtml(t.name) + "</p>" +
            '<p class="tile-purpose">' + escapeHtml(t.purpose) + "</p>" +
            '<span class="tile-cat">' + escapeHtml(t.category) + "</span></span>" +
          "</a>" +
          '<button type="button" class="fav-btn' + (fav ? " is-on" : "") + '" data-fav="' + t.id + '" aria-label="' + (fav ? "Remove from favorites" : "Add to favorites") + '" aria-pressed="' + fav + '">' +
            (fav
              ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.6l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.2 7.2 18.5l.9-5.4L4.2 9.3l5.4-.8L12 3.6z"/></svg>'
              : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3.6l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.2 7.2 18.5l.9-5.4L4.2 9.3l5.4-.8L12 3.6z"/></svg>') +
          "</button>" +
        "</div>"
      );
    }).join("");

    $("empty-state").hidden = list.length > 0;
    $("tools-heading").textContent = activeCategory === "All" ? "All tools" : activeCategory;

    var recents = recentTools.map(toolById).filter(Boolean);
    var recentBlock = $("recent-block");
    if (!recents.length) {
      recentBlock.hidden = true;
    } else {
      recentBlock.hidden = false;
      $("recent-row").innerHTML = recents.map(function (t) {
        if (t.internal) {
          return '<button type="button" class="recent-chip" data-open="' + t.id + '">' + escapeHtml(t.name) + "</button>";
        }
        return '<a class="recent-chip" href="' + t.href + '" target="_blank" rel="noopener noreferrer" data-open="' + t.id + '">' + escapeHtml(t.name) + "</a>";
      }).join("");
    }
  }

  /* ---------- my shift ---------- */
  function getShiftState() {
    var state = load(KEYS.shift, null);
    var today = todayKey();
    if (!state || state.date !== today) {
      state = { date: today, checked: {} };
      save(KEYS.shift, state);
    }
    return state;
  }

  function allShiftItems() {
    var items = [];
    SHIFT_SECTIONS.forEach(function (s) { items = items.concat(s.items); });
    return items;
  }

  function renderShift() {
    var state = getShiftState();
    $("shift-date").textContent = formatDateLong(new Date());
    var items = allShiftItems();
    var done = items.filter(function (it) { return state.checked[it.id]; }).length;
    $("shift-progress").textContent = done + " of " + items.length;
    $("shift-progress-fill").style.width = Math.round((done / items.length) * 100) + "%";

    $("shift-sections").innerHTML = SHIFT_SECTIONS.map(function (section) {
      var rows = section.items.map(function (it) {
        var checked = !!state.checked[it.id];
        return (
          '<label class="shift-item' + (checked ? " is-done" : "") + '">' +
            '<input type="checkbox" data-shift="' + it.id + '"' + (checked ? " checked" : "") + " />" +
            "<span>" + escapeHtml(it.label) + "</span>" +
          "</label>"
        );
      }).join("");
      return '<section class="shift-section"><h3>' + escapeHtml(section.title) + "</h3>" + rows + "</section>";
    }).join("");
  }

  /* ---------- robots ---------- */
  var fleet = [];
  var fleetById = Object.create(null);
  var fleetStats = { total: 0, Online: 0, Charging: 0, Returning: 0, Maintenance: 0, Offline: 0 };
  var robotPage = 1;
  var selectedRobotId = null;
  var recentRobots = load(KEYS.recentRobots, []);
  var activity = load(KEYS.activity, []);

  function pickStatus(r) {
    var x = r();
    if (x < 0.68) return "Online";
    if (x < 0.80) return "Charging";
    if (x < 0.86) return "Returning";
    if (x < 0.94) return "Maintenance";
    return "Offline";
  }

  function batteryFor(status, r) {
    if (status === "Charging") return Math.floor(r() * 50) + 4;
    if (status === "Offline") return Math.floor(r() * 22);
    if (status === "Maintenance") return Math.floor(r() * 80) + 8;
    if (status === "Returning") return Math.floor(r() * 36) + 8;
    var b = Math.floor(r() * 70) + 28;
    if (r() < 0.06) b = Math.floor(r() * 18) + 5;
    return b;
  }

  function lastSeenFor(status, r) {
    var now = Date.now();
    var ms;
    if (status === "Online") ms = (1 + r() * 18) * 60000;
    else if (status === "Charging") ms = (2 + r() * 40) * 60000;
    else if (status === "Returning") ms = (1 + r() * 12) * 60000;
    else if (status === "Maintenance") ms = (30 + r() * 600) * 60000;
    else ms = (2 + r() * 70) * 3600000;
    return new Date(now - ms);
  }

  function zoneFor(status, r) {
    if (status === "Charging" || status === "Maintenance") {
      return r() < 0.72 ? "Depot" : ZONES[Math.floor(r() * ZONES.length)];
    }
    return ZONES[Math.floor(r() * ZONES.length)];
  }

  function buildFleet() {
    var rand = mulberry32(20261122);
    fleet = [];
    fleetStats = { total: FLEET_SIZE, Online: 0, Charging: 0, Returning: 0, Maintenance: 0, Offline: 0 };
    for (var i = 1; i <= FLEET_SIZE; i++) {
      var id = "DEMO-" + String(i).padStart(4, "0");
      var status = pickStatus(rand);
      var robot = {
        id: id,
        num: i,
        status: status,
        battery: batteryFor(status, rand),
        zone: zoneFor(status, rand),
        lastSeen: lastSeenFor(status, rand)
      };
      fleet.push(robot);
      fleetById[id] = robot;
      fleetStats[status]++;
    }
  }

  function normalizeQuery(q) {
    return (q || "").trim().toUpperCase().replace(/\s+/g, "");
  }

  function idMatches(robot, q) {
    if (!q) return true;
    if (robot.id.indexOf(q) !== -1) return true;
    var numeric = q.replace(/^DEMO-/, "").replace(/^0+/, "");
    if (!numeric) return robot.id.indexOf(q) !== -1;
    var idNum = String(robot.num);
    if (q.indexOf("DEMO-") === 0) return idNum.indexOf(numeric) === 0 || robot.id.indexOf(q) !== -1;
    return idNum.indexOf(numeric) !== -1 || String(robot.num).padStart(4, "0").indexOf(q) !== -1;
  }

  function batteryFilterMatch(battery, filter) {
    if (!filter) return true;
    if (filter === "critical") return battery <= 10;
    if (filter === "low") return battery <= 20;
    if (filter === "mid") return battery >= 21 && battery <= 60;
    if (filter === "high") return battery >= 61;
    return true;
  }

  function getFilters() {
    return {
      q: normalizeQuery($("robot-search").value),
      status: $("robot-status-filter").value,
      battery: $("robot-battery-filter").value,
      zone: $("robot-zone-filter").value,
      sort: $("robot-sort").value
    };
  }

  function filteredFleet() {
    var f = getFilters();
    var list = fleet.filter(function (r) {
      if (!idMatches(r, f.q)) return false;
      if (f.status && r.status !== f.status) return false;
      if (f.zone && r.zone !== f.zone) return false;
      if (!batteryFilterMatch(r.battery, f.battery)) return false;
      return true;
    });

    var statusOrder = { Online: 0, Charging: 1, Returning: 2, Maintenance: 3, Offline: 4 };
    list.sort(function (a, b) {
      switch (f.sort) {
        case "id-desc": return b.num - a.num;
        case "battery-asc": return a.battery - b.battery || a.num - b.num;
        case "battery-desc": return b.battery - a.battery || a.num - b.num;
        case "status": return (statusOrder[a.status] - statusOrder[b.status]) || a.num - b.num;
        case "zone": return a.zone < b.zone ? -1 : a.zone > b.zone ? 1 : a.num - b.num;
        case "seen-desc": return b.lastSeen - a.lastSeen;
        case "seen-asc": return a.lastSeen - b.lastSeen;
        default: return a.num - b.num;
      }
    });
    return list;
  }

  function rememberRobot(id) {
    recentRobots = [id].concat(recentRobots.filter(function (x) { return x !== id; })).slice(0, 8);
    save(KEYS.recentRobots, recentRobots);
  }

  function selectRobot(id, pushHash) {
    if (!fleetById[id]) return;
    selectedRobotId = id;
    rememberRobot(id);
    if (pushHash && location.hash !== "#robots/" + id) {
      if (history.replaceState) history.replaceState(null, "", "#robots/" + id);
      else location.hash = "robots/" + id;
    }
    renderRobots();
  }

  function renderRecentRobots() {
    var block = $("recent-robots-block");
    var valid = recentRobots.filter(function (id) { return fleetById[id]; });
    if (!valid.length) {
      block.hidden = true;
      return;
    }
    block.hidden = false;
    $("recent-robots-row").innerHTML = valid.map(function (id) {
      return '<button type="button" class="recent-chip" data-robot="' + id + '">' + escapeHtml(id) + "</button>";
    }).join("");
  }

  function renderFleetStats() {
    var order = ["total", "Online", "Charging", "Returning", "Maintenance", "Offline"];
    var labels = { total: "Fleet", Online: "Online", Charging: "Charging", Returning: "Returning", Maintenance: "Maintenance", Offline: "Offline" };
    var current = $("robot-status-filter").value;
    $("fleet-stats").innerHTML = order.map(function (key) {
      var count = key === "total" ? fleetStats.total : fleetStats[key];
      var active = (key === "total" && !current) || (key !== "total" && current === key);
      return (
        '<button type="button" class="stat-chip status-' + key + (active ? " is-active" : "") + '" data-stat="' + key + '">' +
          "<strong>" + count.toLocaleString("en-US") + "</strong>" +
          "<span>" + labels[key] + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function pageButtons(page, pages) {
    var html = "";
    function btn(label, target, disabled, current) {
      return '<button type="button" class="page-btn' + (current ? " is-current" : "") + '" data-page="' + target + '"' + (disabled ? " disabled" : "") + ">" + label + "</button>";
    }
    html += btn("Prev", page - 1, page <= 1, false);
    var start = Math.max(1, page - 2);
    var end = Math.min(pages, start + 4);
    start = Math.max(1, end - 4);
    if (start > 1) html += btn("1", 1, false, page === 1);
    if (start > 2) html += '<span class="page-btn" style="border:0;background:transparent;cursor:default">…</span>';
    for (var p = start; p <= end; p++) html += btn(String(p), p, false, p === page);
    if (end < pages - 1) html += '<span class="page-btn" style="border:0;background:transparent;cursor:default">…</span>';
    if (end < pages) html += btn(String(pages), pages, false, page === pages);
    html += btn("Next", page + 1, page >= pages, false);
    return html;
  }

  function batteryClass(pct) {
    if (pct <= 20) return "is-low";
    if (pct <= 60) return "is-mid";
    return "";
  }

  function renderActivity(robotId) {
    var entries = activity.filter(function (e) { return e.robotId === robotId; });
    var ol = $("activity-log");
    if (!entries.length) {
      ol.innerHTML = '<li class="log-empty">No simulated commands yet for this robot.</li>';
      return;
    }
    ol.innerHTML = entries.map(function (e) {
      var tag = e.queued ? ' <span class="queued-tag">Queued offline</span>' : "";
      return "<li><time>" + escapeHtml(e.when) + "</time>" + escapeHtml(e.robotId) + " — " + escapeHtml(e.command) + " (simulated)" + tag + "</li>";
    }).join("");
  }

  function renderDetail(robot) {
    var empty = $("detail-empty");
    var panel = $("detail-panel");
    var aside = $("robot-detail");
    if (!robot) {
      empty.hidden = false;
      panel.hidden = true;
      aside.classList.remove("is-open");
      return;
    }
    empty.hidden = true;
    panel.hidden = false;
    aside.classList.add("is-open");
    $("detail-id").textContent = robot.id;
    var statusEl = $("detail-status");
    statusEl.textContent = robot.status;
    statusEl.className = "status-pill status-" + robot.status;
    $("detail-meta").innerHTML =
      "<dt>Battery</dt><dd>" + robot.battery + "%</dd>" +
      "<dt>Zone</dt><dd>" + escapeHtml(robot.zone) + "</dd>" +
      "<dt>Last seen</dt><dd>" + escapeHtml(formatLastSeenFull(robot.lastSeen)) + "</dd>" +
      "<dt>Mode</dt><dd>Simulated sample robot</dd>";
    $("command-row").innerHTML = COMMANDS.map(function (cmd) {
      return (
        '<button type="button" class="cmd-btn' + (cmd.risky ? " cmd-risky" : "") + (cmd.id.indexOf('bin') >= 0 ? " cmd-bin" : "") + '" data-cmd="' + cmd.id + '">' +
          escapeHtml(cmd.label) +
        "</button>"
      );
    }).join("");
    renderActivity(robot.id);
  }

  function renderRobots() {
    if (!$("robot-zone-filter").dataset.filled) {
      $("robot-zone-filter").innerHTML =
        '<option value="">All zones</option>' +
        ZONES.map(function (z) { return '<option value="' + z + '">' + z + "</option>"; }).join("");
      $("robot-zone-filter").dataset.filled = "1";
    }

    renderFleetStats();
    renderRecentRobots();

    var list = filteredFleet();
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (robotPage > pages) robotPage = pages;
    if (robotPage < 1) robotPage = 1;

    if (selectedRobotId) {
      var idx = -1;
      for (var i = 0; i < list.length; i++) if (list[i].id === selectedRobotId) { idx = i; break; }
      if (idx >= 0) robotPage = Math.floor(idx / PAGE_SIZE) + 1;
    }

    var start = (robotPage - 1) * PAGE_SIZE;
    var pageRows = list.slice(start, start + PAGE_SIZE);

    $("robot-results-count").textContent =
      list.length.toLocaleString("en-US") + " of " + FLEET_SIZE.toLocaleString("en-US") + " robots" +
      (list.length ? " · page " + robotPage + " of " + pages : "");
    $("robot-pagination").innerHTML = list.length ? pageButtons(robotPage, pages) : "";

    var tbody = $("robot-tbody");
    tbody.innerHTML = pageRows.map(function (r) {
      var selected = r.id === selectedRobotId;
      return (
        '<tr data-robot="' + r.id + '"' + (selected ? ' class="is-selected"' : "") + ">" +
          '<td class="id-cell" data-label="ID">' + r.id + "</td>" +
          '<td data-label="Status"><span class="status-pill status-' + r.status + '">' + r.status + "</span></td>" +
          '<td data-label="Battery"><span class="battery ' + batteryClass(r.battery) + '"><span class="battery-bar"><i style="width:' + r.battery + '%"></i></span>' + r.battery + "%</span></td>" +
          '<td data-label="Zone">' + escapeHtml(r.zone) + "</td>" +
          '<td data-label="Last seen">' + escapeHtml(formatLastSeen(r.lastSeen)) + "</td>" +
        "</tr>"
      );
    }).join("");

    $("robot-empty").hidden = list.length > 0;
    renderDetail(selectedRobotId ? fleetById[selectedRobotId] : null);
    var selectedRow = tbody.querySelector("tr.is-selected");
    if (selectedRow && selectedRow.scrollIntoView) {
      selectedRow.scrollIntoView({ block: "nearest" });
    }
  }

  function isOnline() {
    return navigator.onLine !== false;
  }

  function setOfflineBanner() {
    var banner = $("offline-banner");
    if (banner) banner.hidden = isOnline();
  }

  function enqueue(type, payload) {
    var q = load(KEYS.queue, []);
    q.push({ id: Date.now() + "-" + Math.random().toString(16).slice(2), type: type, payload: payload, ts: Date.now() });
    save(KEYS.queue, q);
    if (navigator.serviceWorker && navigator.serviceWorker.ready && window.SyncManager) {
      navigator.serviceWorker.ready.then(function (reg) {
        if (reg.sync) return reg.sync.register("fahub-queue");
      }).catch(function () {});
    }
  }

  function flushQueue() {
    if (!isOnline()) return;
    var q = load(KEYS.queue, []);
    if (!q.length) return;
    var hadCommands = false;
    var hadVan = false;
    q.forEach(function (item) {
      if (item.type === "command" && item.payload && item.payload.ts) {
        activity.forEach(function (entry) {
          if (entry.ts === item.payload.ts && entry.robotId === item.payload.robotId) entry.queued = false;
        });
        hadCommands = true;
      }
      if (item.type === "van-session" || item.type === "checkin") {
        var session = load(KEYS.vanSession, null);
        if (session && session.queued) {
          session.queued = false;
          save(KEYS.vanSession, session);
        }
        hadVan = true;
      }
    });
    save(KEYS.queue, []);
    if (hadCommands) {
      save(KEYS.activity, activity);
      if (selectedRobotId) renderActivity(selectedRobotId);
    }
    if (hadVan && currentView === "locations") renderLocations();
    var n = q.length;
    showToast(n + " queued " + (n === 1 ? "action" : "actions") + " synced (demo — no server)");
  }

  function logCommand(robot, commandLabel) {
    var offline = !isOnline();
    var entry = {
      robotId: robot.id,
      command: commandLabel,
      when: formatTime(new Date(), true),
      ts: Date.now(),
      queued: offline
    };
    activity.unshift(entry);
    activity = activity.slice(0, 200);
    save(KEYS.activity, activity);
    if (offline) enqueue("command", { robotId: robot.id, command: commandLabel, ts: entry.ts });
    renderActivity(robot.id);
    showToast(offline
      ? commandLabel + " queued for " + robot.id + " (offline)"
      : commandLabel + " sent to " + robot.id + " (simulated)");
  }

  function runCommand(cmdId) {
    var robot = selectedRobotId && fleetById[selectedRobotId];
    if (!robot) return;
    var cmd = null;
    for (var i = 0; i < COMMANDS.length; i++) if (COMMANDS[i].id === cmdId) cmd = COMMANDS[i];
    if (!cmd) return;
    if (cmd.risky) {
      openConfirm(
        "Unlock bin?",
        "Unlock the bin on " + robot.id + "? This is a simulated command and will only be recorded in the activity log. No real robot is contacted.",
        function () { logCommand(robot, cmd.label); }
      );
      return;
    }
    logCommand(robot, cmd.label);
  }

  /* ---------- locations ---------- */
  var selectedVanId = null;
  var mapReady = false;
  var VAN_MIN_X = 16;
  var VAN_MAX_X = 86;
  var VAN_MIN_Y = 20;
  var VAN_MAX_Y = 58;

  function vanById(id) {
    for (var i = 0; i < VANS.length; i++) if (VANS[i].id === id) return VANS[i];
    return null;
  }

  function vanSession() {
    var data = load(KEYS.vanSession, null);
    if (!data || !data.vanId || !vanById(data.vanId)) return null;
    return data;
  }

  function initVans() {
    var now = Date.now();
    VANS.forEach(function (van) {
      van.updatedAt = now - van.lastMin * 60000;
    });
    try { localStorage.removeItem("fahub-my-checkin"); } catch (e) {}
  }

  function statusLabel(status) {
    if (status === "moving") return "Moving";
    if (status === "parked") return "Parked";
    return "Offline";
  }

  function formatAge(ts) {
    var sec = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (sec < 10) return "Just now";
    if (sec < 60) return sec + " sec ago";
    var mins = Math.round(sec / 60);
    if (mins < 60) return mins === 1 ? "1 min ago" : mins + " min ago";
    var hours = Math.round(mins / 60);
    if (hours < 24) return hours === 1 ? "1 hr ago" : hours + " hr ago";
    var days = Math.round(hours / 24);
    return days + " day" + (days === 1 ? "" : "s") + " ago";
  }

  function faFirst(person) {
    if (person.isYou || person.name === ME.name) return "You";
    return String(person.name).split(" ")[0];
  }

  function vanQuery() {
    var input = $("van-search");
    return ((input && input.value) || "").trim().toLowerCase();
  }

  function peopleInVan(vanId) {
    var list = FAS.filter(function (f) { return f.vanId === vanId; }).map(function (f) {
      return { id: f.id, name: f.name, initials: f.initials, isYou: false };
    });
    var session = vanSession();
    if (session && session.vanId === vanId) {
      list.push({ id: ME.id, name: ME.name, initials: ME.initials, isYou: true });
    }
    return list;
  }

  function unassignedPeople() {
    var list = [];
    if (!vanSession()) {
      list.push({ id: ME.id, name: ME.name, initials: ME.initials, isYou: true });
    }
    FAS.forEach(function (f) {
      if (!f.vanId) list.push({ id: f.id, name: f.name, initials: f.initials, isYou: false });
    });
    return list;
  }

  function personMatches(person, q) {
    if (!q) return true;
    if (person.name.toLowerCase().indexOf(q) !== -1) return true;
    if (person.initials.toLowerCase().indexOf(q) !== -1) return true;
    return false;
  }

  function vanMatches(van, q) {
    if (!q) return true;
    if (van.id.toLowerCase().indexOf(q) !== -1) return true;
    var people = peopleInVan(van.id);
    for (var i = 0; i < people.length; i++) {
      if (personMatches(people[i], q)) return true;
    }
    return false;
  }

  function filteredVans() {
    var q = vanQuery();
    return VANS.filter(function (van) { return vanMatches(van, q); });
  }

  function ensureMap() {
    if (mapReady) return;
    var zoneLabels = "";
    var letters = ZONE_LETTERS;
    var originX = 10, originY = 8, cellW = 17, cellH = 7;
    for (var c = 0; c < letters.length; c++) {
      for (var r = 0; r < 8; r++) {
        var x = originX + c * cellW + 1.2;
        var y = originY + r * cellH + 2.3;
        zoneLabels += '<text x="' + x + '" y="' + y + '" font-size="2" font-family="system-ui,sans-serif" fill="#6b788c">' + letters[c] + (r + 1) + "</text>";
      }
    }
    var gridLines = "";
    for (var gx = 0; gx <= 5; gx++) {
      var xx = originX + gx * cellW;
      gridLines += '<line x1="' + xx + '" y1="' + originY + '" x2="' + xx + '" y2="' + (originY + 8 * cellH) + '" stroke="#243044" stroke-width="0.25"/>';
    }
    for (var gy = 0; gy <= 8; gy++) {
      var yy = originY + gy * cellH;
      gridLines += '<line x1="' + originX + '" y1="' + yy + '" x2="' + (originX + 5 * cellW) + '" y2="' + yy + '" stroke="#243044" stroke-width="0.25"/>';
    }
    $("map-svg-wrap").innerHTML =
      '<svg viewBox="0 0 100 66" aria-hidden="true" focusable="false">' +
        '<rect width="100" height="66" fill="#0e1a16"/>' +
        '<rect x="0" y="0" width="100" height="7" fill="#163047"/>' +
        '<text x="3" y="4.7" font-size="2.3" font-family="system-ui,sans-serif" fill="#8b98ad">North Channel (sample water)</text>' +
        gridLines +
        zoneLabels +
      "</svg>";
    mapReady = true;
  }

  function markerLabelHtml(people) {
    if (!people.length) return '<span class="van-marker-who is-empty">Empty</span>';
    if (people.length === 1) {
      return '<span class="van-marker-who">' + escapeHtml(faFirst(people[0])) + "</span>";
    }
    if (people.length === 2) {
      return '<span class="van-marker-who">' + escapeHtml(faFirst(people[0])) + "</span>" +
        '<span class="van-marker-who">' + escapeHtml(faFirst(people[1])) + "</span>";
    }
    return '<span class="van-marker-who">' + escapeHtml(faFirst(people[0])) + " +" + (people.length - 1) + "</span>";
  }

  function markerAria(van, people) {
    var who = people.length
      ? people.map(function (p) { return p.name; }).join(", ")
      : "no one signed in";
    return van.id + ", " + statusLabel(van.status) + ", " + who + ". Updated " + formatAge(van.updatedAt) + ".";
  }

  function renderVanSelect() {
    var sel = $("van-select");
    if (!sel || sel.dataset.filled) return;
    sel.innerHTML = VANS.map(function (van) {
      return '<option value="' + van.id + '">' + van.id + " · " + statusLabel(van.status) + "</option>";
    }).join("");
    sel.dataset.filled = "1";
    var session = vanSession();
    if (session) sel.value = session.vanId;
  }

  function renderSigninControl() {
    var session = vanSession();
    var status = $("van-session-status");
    var outBtn = $("van-signout-btn");
    if (session) {
      outBtn.hidden = false;
      status.textContent = "You're signed into " + session.vanId + ". Your pin is on that van." +
        (session.queued ? " Saved on this device while offline." : "");
    } else {
      outBtn.hidden = true;
      status.textContent = "You are not on the map until you sign into a van.";
    }
  }

  function renderVanMarkers() {
    var wrap = $("van-markers");
    if (!wrap) return;
    var vans = filteredVans();
    var existing = Object.create(null);
    wrap.querySelectorAll(".van-marker").forEach(function (el) {
      existing[el.getAttribute("data-van")] = el;
    });
    var seen = Object.create(null);
    vans.forEach(function (van) {
      seen[van.id] = true;
      var people = peopleInVan(van.id);
      var el = existing[van.id];
      if (!el) {
        el = document.createElement("button");
        el.type = "button";
        el.className = "van-marker";
        el.setAttribute("data-van", van.id);
        wrap.appendChild(el);
      }
      var you = people.some(function (p) { return p.isYou; });
      var sig = van.status + "|" + (van.id === selectedVanId ? "1" : "0") + "|" + (you ? "y" : "n") + "|" +
        people.map(function (p) { return p.id; }).join(",");
      el.style.left = van.x + "%";
      el.style.top = (van.y / 66 * 100) + "%";
      el.dataset.x = String(Math.round(van.x * 100) / 100);
      el.dataset.y = String(Math.round(van.y * 100) / 100);
      el.dataset.status = van.status;
      el.setAttribute("aria-label", markerAria(van, people));
      if (el.dataset.sig !== sig) {
        el.dataset.sig = sig;
        el.className = "van-marker is-" + van.status +
          (you ? " is-you" : "") +
          (van.id === selectedVanId ? " is-selected" : "");
        el.setAttribute("aria-pressed", van.id === selectedVanId ? "true" : "false");
        el.innerHTML = markerLabelHtml(people) + '<span class="van-marker-id">' + escapeHtml(van.id) + "</span>";
      }
    });
    Object.keys(existing).forEach(function (id) {
      if (!seen[id]) existing[id].parentNode.removeChild(existing[id]);
    });
    var empty = $("van-map-empty");
    if (empty) empty.hidden = vans.length > 0;
    if (!wrap.classList.contains("is-live")) {
      requestAnimationFrame(function () { wrap.classList.add("is-live"); });
    }
  }

  function renderVanCard() {
    var card = $("van-card");
    if (!card) return;
    var van = selectedVanId ? vanById(selectedVanId) : null;
    var q = vanQuery();
    if (!van || !vanMatches(van, q)) {
      selectedVanId = null;
      card.hidden = true;
      return;
    }
    card.hidden = false;
    $("van-card-id").textContent = van.id;
    var pill = $("van-card-status");
    pill.textContent = statusLabel(van.status);
    pill.className = "status-pill status-" + van.status;
    $("van-card-updated").textContent = "Last update · " + formatAge(van.updatedAt);
    var people = peopleInVan(van.id);
    var list = $("van-card-fas");
    if (!people.length) {
      list.innerHTML = '<li class="fa-empty">No one is signed into this van.</li>';
      return;
    }
    list.innerHTML = people.map(function (p) {
      return (
        '<li data-fa="' + p.id + '">' +
          '<span class="fa-avatar' + (p.isYou ? " is-you" : "") + '">' + escapeHtml(p.initials) + "</span>" +
          '<span class="fa-name">' + escapeHtml(p.name) + (p.isYou ? ' <span class="you-tag">You</span>' : "") + "</span>" +
        "</li>"
      );
    }).join("");
  }

  function updateVanCardTime() {
    if (!selectedVanId || !$("van-card") || $("van-card").hidden) return;
    var van = vanById(selectedVanId);
    if (!van) return;
    $("van-card-updated").textContent = "Last update · " + formatAge(van.updatedAt);
  }

  function renderUnassigned() {
    var q = vanQuery();
    var people = unassignedPeople().filter(function (p) { return personMatches(p, q); });
    var list = $("fa-unassigned");
    var empty = $("fa-unassigned-empty");
    if (!people.length) {
      list.innerHTML = "";
      empty.hidden = false;
      empty.textContent = q ? "No one outside a van matches that search." : "Everyone is signed into a van.";
      return;
    }
    empty.hidden = true;
    list.innerHTML = people.map(function (p) {
      return (
        '<li data-fa="' + p.id + '">' +
          '<span class="fa-avatar' + (p.isYou ? " is-you" : "") + '">' + escapeHtml(p.initials) + "</span>" +
          '<span><span class="fa-name">' + escapeHtml(p.name) + (p.isYou ? ' <span class="you-tag">You</span>' : "") + "</span>" +
          '<span class="fa-sub">Not signed into a van</span></span>' +
        "</li>"
      );
    }).join("");
  }

  function renderVanCount() {
    var q = vanQuery();
    var vans = filteredVans();
    var people = unassignedPeople().filter(function (p) { return personMatches(p, q); });
    var vanText = q
      ? vans.length + (vans.length === 1 ? " van matches" : " vans match")
      : vans.length + " vans";
    var peopleText = people.length + " not in a van";
    $("van-count").textContent = vanText + " · " + peopleText;
  }

  function renderLocations() {
    ensureMap();
    renderVanSelect();
    renderSigninControl();
    renderVanCard();
    renderVanMarkers();
    renderUnassigned();
    renderVanCount();
  }

  function doSignIn() {
    var vanId = $("van-select").value;
    if (!vanById(vanId)) return;
    var current = vanSession();
    if (current && current.vanId === vanId) {
      showToast("You're already signed into " + vanId + ".");
      selectedVanId = vanId;
      renderLocations();
      return;
    }
    if ($("van-search")) $("van-search").value = "";
    var offline = !isOnline();
    var data = { vanId: vanId, ts: Date.now(), queued: offline };
    save(KEYS.vanSession, data);
    if (offline) enqueue("van-session", data);
    selectedVanId = vanId;
    renderLocations();
    showToast(offline
      ? "Signed into " + vanId + " on this device (offline)."
      : "Signed into " + vanId + ". Your pin moved to that van.");
  }

  function doSignOut() {
    if (!vanSession()) {
      showToast("You're not signed into a van.");
      return;
    }
    if ($("van-search")) $("van-search").value = "";
    var offline = !isOnline();
    try { localStorage.removeItem(KEYS.vanSession); } catch (e) {}
    if (offline) enqueue("van-session", { vanId: null, ts: Date.now() });
    renderLocations();
    showToast(offline
      ? "Signed out on this device (offline). You're no longer on the map."
      : "Signed out. You're no longer on the map.");
  }

  function clampVan(van) {
    van.x = Math.max(VAN_MIN_X, Math.min(VAN_MAX_X, van.x));
    van.y = Math.max(VAN_MIN_Y, Math.min(VAN_MAX_Y, van.y));
  }

  function separateVans() {
    var minDist = 17;
    for (var i = 0; i < VANS.length; i++) {
      for (var j = i + 1; j < VANS.length; j++) {
        var a = VANS[i];
        var b = VANS[j];
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        if (dist >= minDist) continue;
        var overlap = minDist - dist;
        var ux = dx / dist;
        var uy = dy / dist;
        if (a.status === "moving" && b.status === "moving") {
          a.x -= ux * overlap / 2;
          a.y -= uy * overlap / 2;
          b.x += ux * overlap / 2;
          b.y += uy * overlap / 2;
        } else if (a.status === "moving") {
          a.x -= ux * overlap;
          a.y -= uy * overlap;
        } else if (b.status === "moving") {
          b.x += ux * overlap;
          b.y += uy * overlap;
        }
      }
    }
    VANS.forEach(function (van) {
      if (van.status === "moving") clampVan(van);
    });
  }

  function nudgeVans() {
    VANS.forEach(function (van) {
      if (van.status !== "moving") return;
      van.heading += (Math.random() - 0.5) * 28;
      var rad = van.heading * Math.PI / 180;
      var nx = van.x + Math.cos(rad) * 1.35;
      var ny = van.y + Math.sin(rad) * 0.95;
      if (nx < VAN_MIN_X || nx > VAN_MAX_X) {
        van.heading = 180 - van.heading;
        nx = Math.max(VAN_MIN_X, Math.min(VAN_MAX_X, nx));
      }
      if (ny < VAN_MIN_Y || ny > VAN_MAX_Y) {
        van.heading = -van.heading;
        ny = Math.max(VAN_MIN_Y, Math.min(VAN_MAX_Y, ny));
      }
      van.x = nx;
      van.y = ny;
      van.updatedAt = Date.now();
    });
    separateVans();
  }

  function tickVans() {
    nudgeVans();
    if (currentView !== "locations") return;
    renderVanMarkers();
    updateVanCardTime();
  }

  /* ---------- events ---------- */
  function onHash() {
    var parsed = parseHash();
    if (parsed.robotId && fleetById[parsed.robotId]) {
      selectedRobotId = parsed.robotId;
      rememberRobot(parsed.robotId);
    }
    showView(parsed.view);
  }

  function initEvents() {
    $("theme-toggle").addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    $("tool-search").addEventListener("input", renderHome);

    $("category-chips").addEventListener("click", function (e) {
      var chip = e.target.closest("[data-cat]");
      if (!chip) return;
      activeCategory = chip.getAttribute("data-cat");
      renderHome();
    });

    $("view-home").addEventListener("click", function (e) {
      var fav = e.target.closest("[data-fav]");
      if (fav) {
        toggleFavorite(fav.getAttribute("data-fav"), e);
        return;
      }
      var open = e.target.closest("[data-open]");
      if (!open) return;
      var tool = toolById(open.getAttribute("data-open"));
      if (!tool) return;
      if (tool.internal) {
        e.preventDefault();
        openTool(tool);
      } else {
        recentTools = [tool.id].concat(recentTools.filter(function (id) { return id !== tool.id; })).slice(0, 6);
        save(KEYS.recentTools, recentTools);
        renderHome();
      }
    });

    $("shift-sections").addEventListener("change", function (e) {
      var box = e.target.closest("[data-shift]");
      if (!box) return;
      var state = getShiftState();
      if (box.checked) state.checked[box.getAttribute("data-shift")] = true;
      else delete state.checked[box.getAttribute("data-shift")];
      save(KEYS.shift, state);
      renderShift();
    });

    $("reset-shift").addEventListener("click", function () {
      save(KEYS.shift, { date: todayKey(), checked: {} });
      renderShift();
      showToast("Today's checklist was reset.");
    });

    ["robot-search", "robot-status-filter", "robot-battery-filter", "robot-zone-filter", "robot-sort"].forEach(function (id) {
      var el = $(id);
      var ev = id === "robot-search" ? "input" : "change";
      el.addEventListener(ev, function () {
        robotPage = 1;
        renderRobots();
      });
    });

    $("robot-search").addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var list = filteredFleet();
      var q = normalizeQuery($("robot-search").value);
      var exact = fleetById[q] || (q && fleetById["DEMO-" + q.replace(/^DEMO-/, "").padStart(4, "0")]);
      if (exact) selectRobot(exact.id, true);
      else if (list.length === 1) selectRobot(list[0].id, true);
    });

    $("fleet-stats").addEventListener("click", function (e) {
      var chip = e.target.closest("[data-stat]");
      if (!chip) return;
      var key = chip.getAttribute("data-stat");
      $("robot-status-filter").value = key === "total" ? "" : key;
      robotPage = 1;
      renderRobots();
    });

    $("recent-robots-row").addEventListener("click", function (e) {
      var chip = e.target.closest("[data-robot]");
      if (!chip) return;
      selectRobot(chip.getAttribute("data-robot"), true);
    });

    $("robot-pagination").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-page]");
      if (!btn || btn.disabled) return;
      robotPage = parseInt(btn.getAttribute("data-page"), 10);
      selectedRobotId = selectedRobotId; /* keep selection, but do not force page jump from selection after manual paging */
      /* If user pages manually, don't snap back to selected robot's page. Temporarily clear the snap by remembering page. */
      renderRobotsManualPage();
    });

    $("robot-tbody").addEventListener("click", function (e) {
      var row = e.target.closest("[data-robot]");
      if (!row) return;
      selectRobot(row.getAttribute("data-robot"), true);
    });

    $("detail-close").addEventListener("click", function () {
      selectedRobotId = null;
      $("robot-detail").classList.remove("is-open");
      if (history.replaceState) history.replaceState(null, "", "#robots");
      renderRobots();
    });

    $("command-row").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cmd]");
      if (!btn) return;
      runCommand(btn.getAttribute("data-cmd"));
    });

    $("clear-log").addEventListener("click", function () {
      if (!selectedRobotId) return;
      activity = activity.filter(function (e) { return e.robotId !== selectedRobotId; });
      save(KEYS.activity, activity);
      renderActivity(selectedRobotId);
    });

    $("van-search").addEventListener("input", function () {
      renderLocations();
    });

    $("van-signin-btn").addEventListener("click", doSignIn);
    $("van-signout-btn").addEventListener("click", doSignOut);

    $("van-markers").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-van]");
      if (!btn) return;
      var id = btn.getAttribute("data-van");
      selectedVanId = selectedVanId === id ? null : id;
      renderVanMarkers();
      renderVanCard();
      var card = $("van-card");
      if (selectedVanId && card && card.scrollIntoView) card.scrollIntoView({ block: "nearest" });
    });

    $("van-card-close").addEventListener("click", function () {
      selectedVanId = null;
      renderVanMarkers();
      renderVanCard();
    });

    $("modal-confirm").addEventListener("click", function () {
      var fn = pendingConfirm;
      closeModal();
      if (fn) fn();
    });

    $("modal-root").addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close-modal")) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (!$("modal-root").hidden) {
        closeModal();
        return;
      }
      if (selectedVanId) {
        selectedVanId = null;
        if (currentView === "locations") {
          renderVanMarkers();
          renderVanCard();
        }
      }
    });

    window.addEventListener("hashchange", onHash);
  }

  var holdPage = false;
  function renderRobotsManualPage() {
    holdPage = true;
    var savedId = selectedRobotId;
    selectedRobotId = null;
    var page = robotPage;
    selectedRobotId = savedId;
    /* render without snapping to selected row's page */
    var list = filteredFleet();
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (page > pages) page = pages;
    if (page < 1) page = 1;
    robotPage = page;

    renderFleetStats();
    renderRecentRobots();

    var start = (robotPage - 1) * PAGE_SIZE;
    var pageRows = list.slice(start, start + PAGE_SIZE);
    $("robot-results-count").textContent =
      list.length.toLocaleString("en-US") + " of " + FLEET_SIZE.toLocaleString("en-US") + " robots" +
      (list.length ? " · page " + robotPage + " of " + pages : "");
    $("robot-pagination").innerHTML = list.length ? pageButtons(robotPage, pages) : "";
    $("robot-tbody").innerHTML = pageRows.map(function (r) {
      var selected = r.id === selectedRobotId;
      return (
        '<tr data-robot="' + r.id + '"' + (selected ? ' class="is-selected"' : "") + ">" +
          '<td class="id-cell" data-label="ID">' + r.id + "</td>" +
          '<td data-label="Status"><span class="status-pill status-' + r.status + '">' + r.status + "</span></td>" +
          '<td data-label="Battery"><span class="battery ' + batteryClass(r.battery) + '"><span class="battery-bar"><i style="width:' + r.battery + '%"></i></span>' + r.battery + "%</span></td>" +
          '<td data-label="Zone">' + escapeHtml(r.zone) + "</td>" +
          '<td data-label="Last seen">' + escapeHtml(formatLastSeen(r.lastSeen)) + "</td>" +
        "</tr>"
      );
    }).join("");
    $("robot-empty").hidden = list.length > 0;
    renderDetail(selectedRobotId ? fleetById[selectedRobotId] : null);
    holdPage = false;
  }

  function syncHeaderOffset() {
    var header = document.querySelector(".app-header");
    if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("./sw.js").then(function () {
      /* registered */
    }).catch(function () {
      /* file:// or unsupported — the app still works without install/offline cache */
    });
    navigator.serviceWorker.addEventListener("message", function (event) {
      if (event.data && event.data.type === "flush-queue") flushQueue();
    });
  }

  function init() {
    applyTheme(currentTheme());
    syncHeaderOffset();
    window.addEventListener("resize", syncHeaderOffset);
    window.addEventListener("online", function () {
      setOfflineBanner();
      flushQueue();
    });
    window.addEventListener("offline", setOfflineBanner);
    setOfflineBanner();
    registerServiceWorker();
    buildFleet();
    initVans();
    initEvents();
    renderHome();
    renderShift();
    onHash();
    syncHeaderOffset();
    setInterval(tickVans, 3000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
