import axios from "axios";

const initialize = () => {
  let newUser = false;

  if (!localStorage.networkId) {
    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    localStorage.networkId = localStorage.networkId || randomString;
    newUser = true;
  }

  const queryParams = new URLSearchParams(window.location.search);

  if (
    queryParams.has("lid") &&
    queryParams.get("lid") !== localStorage.networkId
  ) {
    updateGraph({
      networkId: localStorage.networkId,
      linkId: queryParams.get("lid"),
    });
  } else if (newUser) {
    updateGraph({
      networkId: localStorage.networkId,
    });
  }

  // Generate network query parameter
  queryParams.set("lid", localStorage.networkId);
  updateUrl(queryParams.toString());
};

const updateUrl = (params) => {
  const newPath = `${window.location.pathname}?${params}`;
  window.history.pushState({ urlPath: newPath }, "", newPath);
};

const updateGraph = (networkData) => {
  console.log("req");
};

initialize();
