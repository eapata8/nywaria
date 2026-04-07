const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.error
        ? payload.error
        : "Une erreur est survenue.";
    throw new Error(message);
  }

  return payload;
}

export const api = {
  getBootstrap() {
    return request("/api/bootstrap");
  },
  getAvailability(serviceId, date, staffId = "") {
    const params = new URLSearchParams({
      serviceId,
      date,
    });

    if (staffId) {
      params.set("staffId", staffId);
    }

    return request(`/api/availability?${params.toString()}`);
  },
  getAvailabilityRange(serviceId, from, days = 10, staffId = "") {
    const params = new URLSearchParams({
      serviceId,
      from,
      days: String(days),
    });

    if (staffId) {
      params.set("staffId", staffId);
    }

    return request(`/api/availability-range?${params.toString()}`);
  },
  createBooking(payload) {
    return request("/api/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  adminLogin(pin) {
    return request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ pin }),
    });
  },
  getAdminData(token) {
    return request("/api/admin/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  saveAdminData(token, payload) {
    return request("/api/admin/data", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
  updateBooking(token, bookingId, payload) {
    return request(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },
};
