const showToast = () => {
  const text = document.body.innerText
    .split("\n")
    .filter((line) => line.trim().length > 30 && line.indexOf(".") > -1)
    .join("\n");

  // Clean up the text to be sent to GPT-3
  // - Maximize signal:noise ratio
  // - Stay within context window
  // - Remove unnecessary characters
  const title = document.title;
  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");
  const context = text.slice(0, 2500);

  const coreContent = `
TITLE: ${title}\n
DESCRIPTION: ${description}\n
CONTENT: ${context}
`;

  chrome.runtime.sendMessage(coreContent, function (response) {
    console.log("response:", response);

    // Warn and quit if no response
    if (!response) {
      console.warn("No response");
      return;
    }

    // If the page does not contain an argument, say so in the toast
    if (response.containsArgument === "no") {
      const toast = document.createElement("div");
      toast.classList.add("toast");
      toast.innerHTML = `
        <div class="toast-header">
          <button
            type="button"
            class="ml-2 mb-1 close"
            data-dismiss="toast"
            style="position:absolute; top:10px; right:10px; background:transparent; border:none; cursor:pointer;"
          >
            &times;
          </button>
        </div>
        <div class="toast-body">
          No argument detected
        </div>
      `;
      document.body.appendChild(toast);

      // Make close button work
      toast.querySelector(".close")?.addEventListener("click", () => {
        toast.remove();
      });

      // Show the toast
      toast.style.position = "absolute";
      toast.style.bottom = "10px";
      toast.style.left = "10px";
      toast.style.backgroundColor = "white";
      toast.style.border = "1px solid black";
      toast.style.borderRadius = "5px";
      toast.style.padding = "10px";
      toast.style.minWidth = "30%";
      toast.style.maxWidth = "40%";
      // Give it shadow
      toast.style.boxShadow = "0 0 10px 0px rgba(0,0,0,0.5)";
      // Remove the toast after 3 seconds
      setTimeout(() => {
        toast.remove();
      }, 3000);
      return;
    }

    const toast = document.createElement("div");
    toast.classList.add("toast");

    // Create toast header
    const toastHeader = document.createElement("div");
    toastHeader.classList.add("toast-header");
    const strong = document.createElement("strong");
    strong.classList.add("mr-auto");
    strong.textContent = "Core Argument";
    const closeButton = document.createElement("button");
    closeButton.classList.add("ml-2", "mb-1", "close");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-dismiss", "toast");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => {
      toast.remove();
    });
    toastHeader.appendChild(strong);
    toastHeader.appendChild(closeButton);

    // Style the close button
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.cursor = "pointer";

    // Create toast body
    const toastBody = document.createElement("div");
    toastBody.classList.add("toast-body");
    toastBody.textContent = response.coreArgument;

    // Create counter argument header
    const counterHeader = document.createElement("div");
    counterHeader.classList.add("toast-header");
    const counterStrong = document.createElement("strong");
    counterStrong.classList.add("mr-auto");
    counterStrong.textContent = "Counter Argument";
    counterHeader.appendChild(counterStrong);

    // Style the counter argument header
    counterHeader.style.marginTop = "10px";

    // Create counter argument body
    const counterBody = document.createElement("div");
    counterBody.classList.add("toast-body");
    counterBody.textContent = response.counterargument;

    // Append all elements to the toast element
    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);
    toast.appendChild(counterHeader);
    toast.appendChild(counterBody);

    // Append the toast element to the body
    document.body.appendChild(toast);

    // Add styling to the toast element
    toast.style.position = "fixed";
    toast.style.bottom = "10px";
    toast.style.left = "10px";
    toast.style.backgroundColor = "white";
    toast.style.border = "1px solid black";
    toast.style.borderRadius = "5px";
    toast.style.padding = "10px";
    toast.style.minWidth = "30%";
    toast.style.maxWidth = "40%";
    toast.style.boxShadow = "0 0 10px 0px rgba(0,0,0,0.5)";
    toast.style.zIndex = "9999";
    // Keep the toast at the bottom of the screen even on scroll
    toast.style.position = "fixed";

  });
};

// Add a listener for the browser action icon click event
showToast();
