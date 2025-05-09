(function () {
    const clientId = document.currentScript.getAttribute("data-client-id");
  
    // 1. Connect via WebSocket
    const socket = new WebSocket(`ws://localhost:3000?client_id=${clientId}`);
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "viewer_count") {
        // Update your widget or DOM
        console.log("Live Viewers:", data.count);
      }
    };
  
    // 2. Track pageview event (send HTTP POST)
    fetch("http://localhost:3000/event/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        event_type: "pageview",
        timestamp: new Date().toISOString()
      })
    });
  
    // 3. Expose signup tracking globally
    window.Proof = {
      trackSignup: function (metadata) {
        fetch("http://localhost:3000/event/signups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: clientId,
            event_type: "signup",
            timestamp: new Date().toISOString(),
            metadata: metadata || {}
          })
        });
      }
    };
  })();
  