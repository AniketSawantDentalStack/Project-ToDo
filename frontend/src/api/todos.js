const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

function buildUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return configuredBaseUrl ? `${configuredBaseUrl}${normalizedPath}` : normalizedPath;
}

async function request(path, options = {}) {
  const { body, headers, ...rest } = options;

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers
    },
    body
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    let message = "Unable to connect to the ToDo API.";

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch (error) {
      const text = await response.text();
      if (text) {
        message = text;
      }
    }

    throw new Error(message);
  }

  return response.json();
}

export const todoApi = {
  getAll() {
    return request("/api/todos");
  },
  create(payload) {
    return request("/api/todos", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  update(id, payload) {
    return request(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  remove(id) {
    return request(`/api/todos/${id}`, {
      method: "DELETE"
    });
  }
};
