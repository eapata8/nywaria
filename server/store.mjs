import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DATA_PATH = path.resolve(process.cwd(), "server", "data", "store.json");
const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const DAY_LABELS = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};
const ACTIVE_BOOKING_STATUSES = new Set(["pending", "confirmed", "completed"]);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJsonFile() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function writeJsonFile(value) {
  fs.writeFileSync(DATA_PATH, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ensureId(item, prefix) {
  if (item?.id) {
    return String(item.id);
  }
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function cleanText(value) {
  return String(value ?? "").trim();
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseTimeToMinutes(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function formatCurrency(amount, currency = "CAD") {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function todayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayKey(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return DAY_KEYS[date.getDay()];
}

function normalizeSite(site = {}) {
  return {
    brandName: cleanText(site.brandName),
    tagline: cleanText(site.tagline),
    city: cleanText(site.city),
    headline: cleanText(site.headline),
    subheadline: cleanText(site.subheadline),
    heroPrimaryCta: cleanText(site.heroPrimaryCta),
    heroSecondaryCta: cleanText(site.heroSecondaryCta),
    bookingPanelTitle: cleanText(site.bookingPanelTitle),
    aboutTitle: cleanText(site.aboutTitle),
    aboutBody: cleanText(site.aboutBody),
    addressTitle: cleanText(site.addressTitle),
    addressLine1: cleanText(site.addressLine1),
    addressLine2: cleanText(site.addressLine2),
    phone: cleanText(site.phone),
    email: cleanText(site.email),
    instagram: cleanText(site.instagram),
    copyright: cleanText(site.copyright),
  };
}

function normalizeSettings(settings = {}) {
  return {
    currency: cleanText(settings.currency || "CAD") || "CAD",
    slotIntervalMinutes: Math.max(15, toNumber(settings.slotIntervalMinutes, 30)),
    bookingWindowDays: Math.max(7, toNumber(settings.bookingWindowDays, 45)),
    bookingLeadMinutes: Math.max(0, toNumber(settings.bookingLeadMinutes, 120)),
    autoConfirmBookings: Boolean(settings.autoConfirmBookings),
    adminPin: cleanText(settings.adminPin || "2407") || "2407",
    timezone: cleanText(settings.timezone || "America/Toronto") || "America/Toronto",
  };
}

function normalizeCategories(categories = []) {
  return categories
    .map((category) => ({
      id: ensureId(category, slugify(category.name || "category") || "category"),
      name: cleanText(category.name),
      description: cleanText(category.description),
    }))
    .filter((category) => category.name);
}

function normalizeStaff(staff = []) {
  return staff
    .map((member) => ({
      id: ensureId(member, slugify(member.name || "staff") || "staff"),
      name: cleanText(member.name),
      role: cleanText(member.role),
      bio: cleanText(member.bio),
      rating: Number(Number(member.rating || 0).toFixed(1)),
      reviewCount: Math.max(0, toNumber(member.reviewCount, 0)),
      initials: cleanText(member.initials).slice(0, 3).toUpperCase(),
      active: member.active !== false,
    }))
    .filter((member) => member.name);
}

function normalizeServices(services = [], staff = []) {
  const validStaffIds = new Set(staff.map((member) => member.id));

  return services
    .map((service) => ({
      id: ensureId(service, slugify(service.name || "service") || "service"),
      categoryId: cleanText(service.categoryId),
      name: cleanText(service.name),
      description: cleanText(service.description),
      durationMinutes: Math.max(15, toNumber(service.durationMinutes, 60)),
      price: Math.max(0, toNumber(service.price, 0)),
      featured: Boolean(service.featured),
      staffIds: Array.isArray(service.staffIds)
        ? service.staffIds.filter((staffId) => validStaffIds.has(staffId))
        : [],
      active: service.active !== false,
    }))
    .filter((service) => service.name);
}

function normalizePortfolio(portfolio = [], services = []) {
  const validServiceIds = new Set(services.map((service) => service.id));

  return portfolio
    .map((item) => ({
      id: ensureId(item, "portfolio"),
      title: cleanText(item.title),
      imageUrl: cleanText(item.imageUrl),
      serviceId: validServiceIds.has(item.serviceId) ? item.serviceId : "",
      featured: Boolean(item.featured),
    }))
    .filter((item) => item.title && item.imageUrl);
}

function normalizeReviews(reviews = []) {
  return reviews
    .map((review) => ({
      id: ensureId(review, "review"),
      author: cleanText(review.author),
      rating: Math.max(0, Math.min(5, Number(review.rating || 0))),
      comment: cleanText(review.comment),
      createdAt: cleanText(review.createdAt) || new Date().toISOString(),
    }))
    .filter((review) => review.author && review.comment);
}

function normalizeOpeningHours(openingHours = {}) {
  return DAY_KEYS.reduce((accumulator, dayKey) => {
    const value = openingHours[dayKey] || {};
    const breaks = Array.isArray(value.breaks)
      ? value.breaks
          .map((entry) => ({
            start: cleanText(entry.start),
            end: cleanText(entry.end),
          }))
          .filter((entry) => entry.start && entry.end)
      : [];

    accumulator[dayKey] = {
      enabled: Boolean(value.enabled),
      open: cleanText(value.open || "09:00") || "09:00",
      close: cleanText(value.close || "18:00") || "18:00",
      breaks,
    };

    return accumulator;
  }, {});
}

function normalizeBlackoutPeriods(periods = []) {
  return periods
    .map((period) => ({
      id: ensureId(period, "blackout"),
      date: cleanText(period.date),
      start: cleanText(period.start || "00:00") || "00:00",
      end: cleanText(period.end || "23:59") || "23:59",
      label: cleanText(period.label),
    }))
    .filter((period) => period.date && period.start && period.end);
}

function normalizeBookings(bookings = [], services = [], staff = []) {
  const serviceMap = new Map(services.map((service) => [service.id, service]));
  const staffMap = new Map(staff.map((member) => [member.id, member]));

  return bookings
    .map((booking) => {
      const fallbackService = serviceMap.get(booking.serviceId);
      const fallbackStaff = staffMap.get(booking.staffId);
      return {
        id: ensureId(booking, "booking"),
        serviceId: cleanText(booking.serviceId),
        serviceName: cleanText(booking.serviceName || fallbackService?.name),
        categoryId: cleanText(booking.categoryId || fallbackService?.categoryId),
        durationMinutes: Math.max(
          15,
          toNumber(booking.durationMinutes, fallbackService?.durationMinutes || 60),
        ),
        price: Math.max(0, toNumber(booking.price, fallbackService?.price || 0)),
        staffId: cleanText(booking.staffId),
        staffName: cleanText(booking.staffName || fallbackStaff?.name),
        date: cleanText(booking.date),
        time: cleanText(booking.time),
        status: cleanText(booking.status || "pending") || "pending",
        customer: {
          name: cleanText(booking.customer?.name),
          phone: cleanText(booking.customer?.phone),
          email: cleanText(booking.customer?.email),
          instagram: cleanText(booking.customer?.instagram),
        },
        notes: cleanText(booking.notes),
        adminNotes: cleanText(booking.adminNotes),
        createdAt: cleanText(booking.createdAt) || new Date().toISOString(),
        updatedAt: cleanText(booking.updatedAt) || new Date().toISOString(),
      };
    })
    .filter((booking) => booking.serviceId && booking.date && booking.time && booking.customer.name);
}

function normalizeStore(store) {
  const site = normalizeSite(store.site);
  const settings = normalizeSettings(store.settings);
  const categories = normalizeCategories(store.categories);
  const staff = normalizeStaff(store.staff);
  const services = normalizeServices(store.services, staff);
  const portfolio = normalizePortfolio(store.portfolio, services);
  const reviews = normalizeReviews(store.reviews);
  const openingHours = normalizeOpeningHours(store.openingHours);
  const blackoutPeriods = normalizeBlackoutPeriods(store.blackoutPeriods);
  const bookings = normalizeBookings(store.bookings, services, staff);

  return {
    site,
    settings,
    categories,
    staff,
    services,
    portfolio,
    reviews,
    openingHours,
    blackoutPeriods,
    bookings,
  };
}

export function readStore() {
  return normalizeStore(readJsonFile());
}

export function writeStore(store) {
  const normalized = normalizeStore(store);
  writeJsonFile(normalized);
  return normalized;
}

function getBreakConflicts(dayConfig, slotStart, slotEnd) {
  return (dayConfig.breaks || []).some((entry) => {
    const breakStart = parseTimeToMinutes(entry.start);
    const breakEnd = parseTimeToMinutes(entry.end);
    if (breakStart == null || breakEnd == null) {
      return false;
    }

    return overlaps(slotStart, slotEnd, breakStart, breakEnd);
  });
}

function getBlackoutConflicts(store, date, slotStart, slotEnd) {
  return (store.blackoutPeriods || []).some((period) => {
    if (period.date !== date) {
      return false;
    }

    const blockedStart = parseTimeToMinutes(period.start);
    const blockedEnd = parseTimeToMinutes(period.end);
    if (blockedStart == null || blockedEnd == null) {
      return false;
    }

    return overlaps(slotStart, slotEnd, blockedStart, blockedEnd);
  });
}

function getServiceMap(store) {
  return new Map(store.services.map((service) => [service.id, service]));
}

function getStaffMap(store) {
  return new Map(store.staff.map((member) => [member.id, member]));
}

function getBookingsForDate(store, date) {
  return store.bookings.filter(
    (booking) => booking.date === date && ACTIVE_BOOKING_STATUSES.has(booking.status),
  );
}

function isBookingInFuture(booking) {
  const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
  return bookingDateTime.getTime() >= Date.now();
}

function getCustomerKey(customer) {
  return cleanText(customer.phone || customer.email || customer.name).toLowerCase();
}

function getEligibleStaff(service, store, preferredStaffId) {
  const activeStaff = store.staff.filter((member) => member.active !== false);
  const allowedIds = service.staffIds?.length
    ? new Set(service.staffIds)
    : new Set(activeStaff.map((member) => member.id));

  const eligible = activeStaff.filter((member) => allowedIds.has(member.id));

  if (preferredStaffId) {
    return eligible.filter((member) => member.id === preferredStaffId);
  }

  return eligible;
}

function isSlotBlockedForStaff(store, date, slotStart, slotEnd, staffId) {
  return getBookingsForDate(store, date).some((booking) => {
    if (booking.staffId !== staffId) {
      return false;
    }

    const bookingStart = parseTimeToMinutes(booking.time);
    const bookingEnd = bookingStart + Math.max(15, toNumber(booking.durationMinutes, 60));
    return overlaps(slotStart, slotEnd, bookingStart, bookingEnd);
  });
}

function resolveStaffForSlot(store, service, date, slotStart, preferredStaffId = "") {
  const eligibleStaff = getEligibleStaff(service, store, preferredStaffId);

  for (const member of eligibleStaff) {
    if (!isSlotBlockedForStaff(store, date, slotStart, slotStart + service.durationMinutes, member.id)) {
      return member;
    }
  }

  return null;
}

function slotDateTime(date, time) {
  return new Date(`${date}T${time}:00`);
}

function violatesLeadTime(store, date, time) {
  const slot = slotDateTime(date, time);
  const leadMilliseconds = store.settings.bookingLeadMinutes * 60 * 1000;
  return slot.getTime() < Date.now() + leadMilliseconds;
}

function getDailyConfig(store, date) {
  return store.openingHours[getDayKey(date)] || {
    enabled: false,
    open: "09:00",
    close: "18:00",
    breaks: [],
  };
}

export function getAvailabilityForDate(store, serviceId, date, preferredStaffId = "") {
  const service = store.services.find((entry) => entry.id === serviceId && entry.active !== false);

  if (!service) {
    throw new Error("Service introuvable.");
  }

  if (!date) {
    throw new Error("Date invalide.");
  }

  const dateLimit = addDays(todayString(), store.settings.bookingWindowDays);
  if (date < todayString() || date > dateLimit) {
    return {
      date,
      service,
      slots: [],
      reason: "outside-window",
    };
  }

  const dayConfig = getDailyConfig(store, date);
  if (!dayConfig.enabled) {
    return {
      date,
      service,
      slots: [],
      reason: "closed-day",
    };
  }

  const openMinutes = parseTimeToMinutes(dayConfig.open);
  const closeMinutes = parseTimeToMinutes(dayConfig.close);
  if (openMinutes == null || closeMinutes == null || closeMinutes <= openMinutes) {
    return {
      date,
      service,
      slots: [],
      reason: "invalid-hours",
    };
  }

  const slots = [];
  const interval = Math.max(15, store.settings.slotIntervalMinutes);

  for (
    let candidateStart = openMinutes;
    candidateStart + service.durationMinutes <= closeMinutes;
    candidateStart += interval
  ) {
    const candidateEnd = candidateStart + service.durationMinutes;
    const candidateTime = formatMinutes(candidateStart);

    if (violatesLeadTime(store, date, candidateTime)) {
      continue;
    }

    if (getBreakConflicts(dayConfig, candidateStart, candidateEnd)) {
      continue;
    }

    if (getBlackoutConflicts(store, date, candidateStart, candidateEnd)) {
      continue;
    }

    const assignedStaff = resolveStaffForSlot(
      store,
      service,
      date,
      candidateStart,
      preferredStaffId,
    );

    if (!assignedStaff) {
      continue;
    }

    slots.push({
      time: candidateTime,
      staffId: assignedStaff.id,
      staffName: assignedStaff.name,
    });
  }

  return {
    date,
    service,
    slots,
    reason: slots.length ? "ok" : "no-slots",
  };
}

export function getAvailabilityRange(
  store,
  serviceId,
  fromDate = todayString(),
  days = 10,
  preferredStaffId = "",
) {
  const safeDays = Math.min(Math.max(1, toNumber(days, 10)), store.settings.bookingWindowDays);
  const items = [];

  for (let index = 0; index < safeDays; index += 1) {
    const date = addDays(fromDate, index);
    const availability = getAvailabilityForDate(store, serviceId, date, preferredStaffId);
    items.push({
      date,
      slotCount: availability.slots.length,
      firstSlot: availability.slots[0] || null,
      reason: availability.reason,
    });
  }

  return items;
}

function getOpenStatus(store) {
  const now = new Date();
  const currentDate = todayString();
  const currentDayKey = DAY_KEYS[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayConfig = store.openingHours[currentDayKey];

  const isBlockedToday = (store.blackoutPeriods || []).some((period) => {
    if (period.date !== currentDate) {
      return false;
    }

    const blockedStart = parseTimeToMinutes(period.start);
    const blockedEnd = parseTimeToMinutes(period.end);
    if (blockedStart == null || blockedEnd == null) {
      return false;
    }

    return blockedStart === 0 && blockedEnd >= 23 * 60 + 59;
  });

  const hasLiveBreak = dayConfig?.breaks?.some((entry) => {
    const breakStart = parseTimeToMinutes(entry.start);
    const breakEnd = parseTimeToMinutes(entry.end);
    if (breakStart == null || breakEnd == null) {
      return false;
    }
    return currentMinutes >= breakStart && currentMinutes < breakEnd;
  });

  if (dayConfig?.enabled && !isBlockedToday) {
    const openMinutes = parseTimeToMinutes(dayConfig.open);
    const closeMinutes = parseTimeToMinutes(dayConfig.close);
    if (
      openMinutes != null &&
      closeMinutes != null &&
      currentMinutes >= openMinutes &&
      currentMinutes < closeMinutes &&
      !hasLiveBreak
    ) {
      return {
        isOpen: true,
        label: `Ouvert jusqu'a ${dayConfig.close}`,
      };
    }
  }

  for (let offset = 0; offset < 7; offset += 1) {
    const date = addDays(currentDate, offset);
    const dayKey = getDayKey(date);
    const candidate = store.openingHours[dayKey];

    if (!candidate?.enabled) {
      continue;
    }

    const isFullyBlocked = (store.blackoutPeriods || []).some((period) => {
      if (period.date !== date) {
        return false;
      }

      const blockedStart = parseTimeToMinutes(period.start);
      const blockedEnd = parseTimeToMinutes(period.end);
      if (blockedStart == null || blockedEnd == null) {
        return false;
      }
      return blockedStart === 0 && blockedEnd >= 23 * 60 + 59;
    });

    if (isFullyBlocked) {
      continue;
    }

    if (offset === 0 && parseTimeToMinutes(candidate.open) <= currentMinutes) {
      continue;
    }

    return {
      isOpen: false,
      label: offset === 0
        ? `Ouvre aujourd'hui a ${candidate.open}`
        : `Ouvre ${DAY_LABELS[dayKey].toLowerCase()} a ${candidate.open}`,
    };
  }

  return {
    isOpen: false,
    label: "Horaires a definir",
  };
}

export function buildCustomers(store) {
  const byCustomer = new Map();

  for (const booking of store.bookings) {
    const key = getCustomerKey(booking.customer);
    if (!key) {
      continue;
    }

    if (!byCustomer.has(key)) {
      byCustomer.set(key, {
        id: key,
        name: booking.customer.name,
        phone: booking.customer.phone,
        email: booking.customer.email,
        instagram: booking.customer.instagram,
        totalBookings: 0,
        completedBookings: 0,
        upcomingBookings: 0,
        totalSpent: 0,
        favoriteServices: {},
        lastVisit: "",
        nextVisit: "",
      });
    }

    const customer = byCustomer.get(key);
    customer.totalBookings += 1;
    customer.favoriteServices[booking.serviceName] =
      (customer.favoriteServices[booking.serviceName] || 0) + 1;

    if (booking.status === "completed") {
      customer.completedBookings += 1;
      customer.totalSpent += booking.price;
      if (!customer.lastVisit || booking.date > customer.lastVisit) {
        customer.lastVisit = booking.date;
      }
    }

    if (ACTIVE_BOOKING_STATUSES.has(booking.status) && isBookingInFuture(booking)) {
      customer.upcomingBookings += 1;
      if (!customer.nextVisit || booking.date < customer.nextVisit) {
        customer.nextVisit = booking.date;
      }
    }
  }

  return [...byCustomer.values()]
    .map((customer) => ({
      ...customer,
      favoriteServices: Object.entries(customer.favoriteServices)
        .sort((left, right) => right[1] - left[1])
        .slice(0, 2)
        .map(([serviceName]) => serviceName),
    }))
    .sort((left, right) => {
      const leftPivot = left.nextVisit || left.lastVisit || "";
      const rightPivot = right.nextVisit || right.lastVisit || "";
      return rightPivot.localeCompare(leftPivot);
    });
}

export function buildMetrics(store) {
  const customers = buildCustomers(store);
  const totalRating = store.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  const reviewCount = store.reviews.length;
  const averageRating = reviewCount ? Number((totalRating / reviewCount).toFixed(1)) : 0;
  const upcomingBookings = store.bookings.filter(
    (booking) => ACTIVE_BOOKING_STATUSES.has(booking.status) && isBookingInFuture(booking),
  ).length;
  const completedBookings = store.bookings.filter((booking) => booking.status === "completed").length;
  const returningClients = customers.filter((customer) => customer.totalBookings > 1).length;
  const totalRevenue = store.bookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + toNumber(booking.price, 0), 0);

  return {
    averageRating,
    reviewCount,
    upcomingBookings,
    completedBookings,
    returningClients,
    totalRevenue,
    formattedRevenue: formatCurrency(totalRevenue, store.settings.currency),
  };
}

export function buildNextAvailability(store) {
  const services = store.services.filter((service) => service.active !== false);

  for (const service of services) {
    const availability = getAvailabilityRange(store, service.id, todayString(), 14);
    const firstAvailableDay = availability.find((entry) => entry.slotCount > 0 && entry.firstSlot);

    if (firstAvailableDay?.firstSlot) {
      return {
        serviceId: service.id,
        serviceName: service.name,
        date: firstAvailableDay.date,
        time: firstAvailableDay.firstSlot.time,
        staffName: firstAvailableDay.firstSlot.staffName,
      };
    }
  }

  return null;
}

export function buildPublicData(store) {
  const metrics = buildMetrics(store);
  return {
    site: deepClone(store.site),
    settings: {
      currency: store.settings.currency,
      slotIntervalMinutes: store.settings.slotIntervalMinutes,
      bookingWindowDays: store.settings.bookingWindowDays,
      bookingLeadMinutes: store.settings.bookingLeadMinutes,
      autoConfirmBookings: store.settings.autoConfirmBookings,
      timezone: store.settings.timezone,
    },
    categories: deepClone(store.categories),
    staff: deepClone(store.staff.filter((member) => member.active !== false)),
    services: deepClone(store.services.filter((service) => service.active !== false)),
    portfolio: deepClone(store.portfolio),
    reviews: deepClone(store.reviews).sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    openingHours: deepClone(store.openingHours),
    metrics,
    openStatus: getOpenStatus(store),
    nextAvailability: buildNextAvailability(store),
  };
}

export function buildAdminData(store) {
  return {
    site: deepClone(store.site),
    settings: deepClone(store.settings),
    categories: deepClone(store.categories),
    staff: deepClone(store.staff),
    services: deepClone(store.services),
    portfolio: deepClone(store.portfolio),
    reviews: deepClone(store.reviews),
    openingHours: deepClone(store.openingHours),
    blackoutPeriods: deepClone(store.blackoutPeriods),
    bookings: deepClone(store.bookings).sort((left, right) => {
      const leftDateTime = `${left.date}T${left.time}`;
      const rightDateTime = `${right.date}T${right.time}`;
      return rightDateTime.localeCompare(leftDateTime);
    }),
    customers: buildCustomers(store),
    metrics: buildMetrics(store),
    openStatus: getOpenStatus(store),
    nextAvailability: buildNextAvailability(store),
  };
}

function assertBookingPayload(payload) {
  if (!payload.serviceId) {
    throw new Error("Selectionne une prestation.");
  }

  if (!payload.date || !payload.time) {
    throw new Error("Selectionne un jour et une heure.");
  }

  if (!cleanText(payload.customer?.name) || !cleanText(payload.customer?.phone)) {
    throw new Error("Le nom et le telephone sont obligatoires.");
  }
}

export function createBooking(payload) {
  assertBookingPayload(payload);

  const store = readStore();
  const service = store.services.find((entry) => entry.id === payload.serviceId && entry.active !== false);
  if (!service) {
    throw new Error("Service introuvable.");
  }

  const availability = getAvailabilityForDate(
    store,
    payload.serviceId,
    payload.date,
    cleanText(payload.staffId),
  );
  const selectedSlot = availability.slots.find((slot) => slot.time === payload.time);

  if (!selectedSlot) {
    throw new Error("Ce creneau n'est plus disponible.");
  }

  const staff = getStaffMap(store).get(selectedSlot.staffId);
  const createdAt = new Date().toISOString();
  const booking = {
    id: `booking-${crypto.randomUUID().slice(0, 8)}`,
    serviceId: service.id,
    serviceName: service.name,
    categoryId: service.categoryId,
    durationMinutes: service.durationMinutes,
    price: service.price,
    staffId: selectedSlot.staffId,
    staffName: staff?.name || selectedSlot.staffName,
    date: cleanText(payload.date),
    time: cleanText(payload.time),
    status: store.settings.autoConfirmBookings ? "confirmed" : "pending",
    customer: {
      name: cleanText(payload.customer.name),
      phone: cleanText(payload.customer.phone),
      email: cleanText(payload.customer.email),
      instagram: cleanText(payload.customer.instagram),
    },
    notes: cleanText(payload.notes),
    adminNotes: "",
    createdAt,
    updatedAt: createdAt,
  };

  const nextStore = {
    ...store,
    bookings: [...store.bookings, booking],
  };

  writeStore(nextStore);

  return {
    booking,
    confirmation: {
      id: booking.id,
      serviceName: booking.serviceName,
      date: booking.date,
      time: booking.time,
      staffName: booking.staffName,
      status: booking.status,
      total: formatCurrency(booking.price, store.settings.currency),
    },
  };
}

export function saveAdminData(payload) {
  const current = readStore();
  const next = {
    ...current,
    site: payload.site ?? current.site,
    settings: payload.settings ?? current.settings,
    categories: payload.categories ?? current.categories,
    staff: payload.staff ?? current.staff,
    services: payload.services ?? current.services,
    portfolio: payload.portfolio ?? current.portfolio,
    reviews: payload.reviews ?? current.reviews,
    openingHours: payload.openingHours ?? current.openingHours,
    blackoutPeriods: payload.blackoutPeriods ?? current.blackoutPeriods,
    bookings: current.bookings,
  };

  const stored = writeStore(next);
  return buildAdminData(stored);
}

export function updateBooking(bookingId, patch) {
  const store = readStore();
  const index = store.bookings.findIndex((booking) => booking.id === bookingId);
  if (index === -1) {
    throw new Error("Rendez-vous introuvable.");
  }

  const booking = store.bookings[index];
  const nextStatus = cleanText(patch.status || booking.status) || booking.status;
  const nextAdminNotes = cleanText(patch.adminNotes ?? booking.adminNotes);
  const nextDate = cleanText(patch.date || booking.date) || booking.date;
  const nextTime = cleanText(patch.time || booking.time) || booking.time;

  const updatedBooking = {
    ...booking,
    status: nextStatus,
    adminNotes: nextAdminNotes,
    date: nextDate,
    time: nextTime,
    updatedAt: new Date().toISOString(),
  };

  const nextStore = {
    ...store,
    bookings: store.bookings.map((entry, entryIndex) => (entryIndex === index ? updatedBooking : entry)),
  };

  writeStore(nextStore);
  return updatedBooking;
}
