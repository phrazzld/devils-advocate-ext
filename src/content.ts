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
  const context = text.slice(0, 5000);

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

    // Create a toast element
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = `
      <div class="toast-header">
        <strong class="mr-auto">Core Argument</strong>
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
        ${response.coreArgument}
      </div>
      <div class="toast-header" style="margin-top:10px;">
        <strong class="mr-auto">Counter Argument</strong>
      </div>
      <div class="toast-body">
        ${response.counterargument}
      </div>
    `;

    // Make close button work
    toast.querySelector(".close")?.addEventListener("click", () => {
      toast.remove();
    });

    // Append the toast element to the body
    document.body.appendChild(toast);

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
  });
};

// Add a listener for the browser action icon click event
showToast();
