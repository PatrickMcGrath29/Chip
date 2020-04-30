import axios from "axios";

const graphEndpoint =
  "https://sch7bopnkk.execute-api.us-east-1.amazonaws.com/dev/links";
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
      webpage: window.location.href,
    });
  } else if (newUser) {
    addUser({
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

const addUser = async (networkId) => {
  console.log(networkId);
};

const updateGraph = async (networkData) => {
  axios.post(graphEndpoint, networkData);
};

initialize();
