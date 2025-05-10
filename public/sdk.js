(function () {
  const script = document.currentScript;
  const clientId = script.getAttribute("data-client-id");
  const customMessage = script.getAttribute("data-message") || "Join others who signed up!";
  const baseColor = script.getAttribute("data-color") || "#4CAF50";
  const widgetPosition = script.getAttribute("data-position") || "bottom-right";
  const displayType = script.getAttribute("data-type") || "both";
  const autoDismiss = script.getAttribute("data-auto-dismiss") === "true";

  // Helper to convert hex to rgba
  function hexToRGBA(hex, opacity = 0.9) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Inject styles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInUp {
      from {opacity: 0; transform: translateY(20px);}
      to {opacity: 1; transform: translateY(0);}
    }
    .trustnet-widget {
      animation: fadeInUp 0.5s ease forwards;
      font-family: 'Segoe UI', sans-serif;
      font-size: 15px;
      line-height: 1.4;
      background-color: ${hexToRGBA(baseColor, 0.9)};
      color: white;
      padding: 12px 18px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      position: fixed;
      max-width: 280px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      backdrop-filter: blur(6px);
    }
    .trustnet-widget strong {
      font-weight: bold;
      font-size: 16px;
    }
  `;
  document.head.appendChild(style);

  function getPositionCSS(offset = 20) {
    return `
      ${widgetPosition.includes("bottom") ? `bottom: ${offset}px;` : `top: ${offset}px;`}
      ${widgetPosition.includes("right") ? "right: 20px;" : "left: 20px;"}
    `;
  }

  function createWidget(content, offset) {
    const widget = document.createElement("div");
    widget.className = "trustnet-widget";
    widget.style.cssText += getPositionCSS(offset);
    widget.innerHTML = content;
    document.body.appendChild(widget);

    // Auto dismiss after 30s
    if (autoDismiss) {
      setTimeout(() => {
        widget.remove();
      }, 30000);
    }

    return widget;
  }

  function createSignupWidget(count) {
    createWidget(`<strong>${count}</strong> – ${customMessage}`, 20);
  }

  function createLiveWidget(count) {
    createWidget(`<strong>${count}</strong> people currently viewing this page`, 70);
  }

  // WebSocket live viewer tracking
  if (displayType === "live" || displayType === "both") {
    const socket = new WebSocket(`ws://localhost:3000?client_id=${clientId}`);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "viewer_count") {
        createLiveWidget(data.count);
      }
    };

    fetch("http://localhost:3000/event/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        event_type: "pageview",
        timestamp: new Date().toISOString()
      })
    });
  }

  // Signup count widget
  if (displayType === "signup" || displayType === "both") {
    fetch(`http://localhost:3000/event/signup-count?client_id=${clientId}`)
      .then(res => res.json())
      .then(data => {
        createSignupWidget(data.signupCount || 0);
      });
  }

  // Global tracker
  window.Proof = {
    trackSignup: function () {
      fetch("http://localhost:3000/event/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          event_type: "signup",
          timestamp: new Date().toISOString()
        })
      });
    }
  };
})();
