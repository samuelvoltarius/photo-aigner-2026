'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';

interface Booking {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  location?: string;
  service?: string;
  budget?: string;
  message?: string;
  notes?: string;
  receivedAt?: string;
  whatsappConfirm?: boolean;
  status?: 'pending' | 'confirmed' | 'cancelled';
  brand?: 'AIGNER' | 'CHILI';
}

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  batteries?: number;
  batteryStatus?: 'full' | 'charging' | 'low';
}

interface EquipmentData {
  cameras: EquipmentItem[];
  lenses: EquipmentItem[];
  drones: EquipmentItem[];
  audio: EquipmentItem[];
  stabilization: EquipmentItem[];
  lighting: EquipmentItem[];
}

interface JobPresets {
  [key: string]: {
    name: string;
    equipment: string[];
    droneDisclaimer?: boolean;
  } | string;
}

const CORRECT_PASSWORD = 'photo2026';

const CATEGORY_LABELS: Record<keyof EquipmentData, string> = {
  cameras: '📷 Kameras',
  lenses: '🔭 Objektive',
  drones: '🚁 Drohnen',
  audio: '🎙️ Audio',
  stabilization: '🎬 Gimbal',
  lighting: '💡 Licht',
};

// Helper functions
function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }
  const euMatch = dateStr.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (euMatch) {
    return new Date(parseInt(euMatch[3]), parseInt(euMatch[2]) - 1, parseInt(euMatch[1]));
  }
  return new Date(dateStr);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

function isInWeek(date: Date, today: Date): boolean {
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return date >= startOfWeek && date <= endOfWeek;
}

function isInMonth(date: Date, today: Date): boolean {
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
}

function formatDateGerman(date: Date): string {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function getBatteryColor(status?: string): string {
  if (status === 'full') return '#22c55e';
  if (status === 'charging') return '#f59e0b';
  if (status === 'low') return '#ef4444';
  return '#9ca3af';
}

function getBatteryIcon(status?: string): string {
  if (status === 'full') return '🟢';
  if (status === 'charging') return '🟡';
  if (status === 'low') return '🔴';
  return '⚪';
}

export default function DashboardPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [equipment, setEquipment] = useState<EquipmentData | null>(null);
  const [jobPresets, setJobPresets] = useState<JobPresets | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'equipment' | 'map'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [addEquipmentModal, setAddEquipmentModal] = useState<keyof EquipmentData | null>(null);
  const [newEquipment, setNewEquipment] = useState<{ id: string; name: string; type: string; batteries: number; batteryStatus: 'full' | 'charging' | 'low' }>({ id: '', name: '', type: '', batteries: 0, batteryStatus: 'full' });
  const [addBookingModal, setAddBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState<{
    name: string;
    email: string;
    phone: string;
    date: string;
    location: string;
    service: string;
    budget: string;
    message: string;
    brand: 'AIGNER' | 'CHILI';
  }>({
    name: '', email: '', phone: '', date: '', location: '', service: 'hochzeit', budget: '', message: '', brand: 'AIGNER'
  });
  const [addBookingLoading, setAddBookingLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState<{ index: number; notes: string } | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled'>('active');
  const [brandFilter, setBrandFilter] = useState<'ALL' | 'AIGNER' | 'CHILI'>('ALL');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  
  // E-Mail Modal States
  const [emailModal, setEmailModal] = useState<{ booking: Booking; index: number } | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Check session storage on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(() => {
    fetch('/api/bookings/list')
      .then((r) => r.json())
      .then((res) => {
        setData(res.bookings || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Fehler beim Laden');
        setLoading(false);
      });
  }, []);

  // Fetch equipment
  const fetchEquipment = useCallback(() => {
    fetch('/api/equipment')
      .then((r) => r.json())
      .then((res) => {
        if (!res.error) setEquipment(res);
      })
      .catch(console.error);
  }, []);

  // Fetch job presets
  const fetchJobPresets = useCallback(() => {
    fetch('/api/presets')
      .then((r) => r.json())
      .then((res) => {
        if (!res.error) setJobPresets(res);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetchBookings();
    fetchEquipment();
    fetchJobPresets();
  }, [isAuthenticated, fetchBookings, fetchEquipment, fetchJobPresets]);

  // Handle password submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CORRECT_PASSWORD) {
      sessionStorage.setItem('dashboard_auth', 'true');
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Falsches Passwort');
    }
  };

  // Delete booking
  const deleteBooking = async (index: number) => {
    if (!window.confirm('Wirklich löschen?')) return;
    try {
      const res = await fetch(`/api/bookings?index=${index}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBookings();
        setSelectedBookingIndex(null);
      } else {
        alert('Fehler beim Löschen');
      }
    } catch {
      alert('Fehler beim Löschen');
    }
  };

  // Update equipment battery status
  const updateBatteryStatus = async (id: string, category: keyof EquipmentData, status: 'full' | 'charging' | 'low') => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, category, updates: { batteryStatus: status } }),
      });
      if (res.ok) fetchEquipment();
    } catch (e) {
      console.error('Failed to update battery status', e);
    }
  };

  // Delete equipment
  const deleteEquipment = async (id: string, category: keyof EquipmentData) => {
    if (!window.confirm('Wirklich löschen?')) return;
    try {
      const res = await fetch(`/api/equipment?id=${id}&category=${category}`, { method: 'DELETE' });
      if (res.ok) fetchEquipment();
    } catch (e) {
      console.error('Failed to delete equipment', e);
    }
  };

  // Add equipment
  const addEquipment = async () => {
    if (!addEquipmentModal || !newEquipment.id || !newEquipment.name) return;
    try {
      const item: EquipmentItem = {
        id: newEquipment.id.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: newEquipment.name,
        type: newEquipment.type || 'Sonstig',
      };
      if (newEquipment.batteries > 0) {
        item.batteries = newEquipment.batteries;
        item.batteryStatus = newEquipment.batteryStatus;
      }
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: addEquipmentModal, item }),
      });
      if (res.ok) {
        fetchEquipment();
        setAddEquipmentModal(null);
        setNewEquipment({ id: '', name: '', type: '', batteries: 0, batteryStatus: 'full' });
      } else {
        const err = await res.json();
        alert(err.error || 'Fehler beim Hinzufügen');
      }
    } catch (e) {
      console.error('Failed to add equipment', e);
    }
  };

  // Add booking
  const addBooking = async () => {
    if (!newBooking.name || !newBooking.date) {
      alert('Name und Datum sind Pflichtfelder');
      return;
    }
    setAddBookingLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBooking,
          source: 'dashboard-manual'
        }),
      });
      if (res.ok) {
        fetchBookings();
        setAddBookingModal(false);
        setNewBooking({ 
          name: '', email: '', phone: '', date: '', location: '', service: 'hochzeit', budget: '', message: '', 
          brand: brandFilter !== 'ALL' ? brandFilter : 'AIGNER' 
        });
      } else {
        const err = await res.json();
        alert(err.error || 'Fehler beim Hinzufügen');
      }
    } catch (e) {
      console.error('Failed to add booking', e);
      alert('Fehler beim Hinzufügen');
    } finally {
      setAddBookingLoading(false);
    }
  };

  // Save notes for a booking
  const saveNotes = async (index: number, notes: string) => {
    setSavingNotes(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, notes }),
      });
      if (res.ok) {
        fetchBookings();
        setEditingNotes(null);
      } else {
        const err = await res.json();
        alert(err.error || 'Fehler beim Speichern');
      }
    } catch (e) {
      console.error('Failed to save notes', e);
      alert('Fehler beim Speichern');
    } finally {
      setSavingNotes(false);
    }
  };

  // Update status for a booking
  const updateStatus = async (index: number, status: 'pending' | 'confirmed' | 'cancelled') => {
    setUpdatingStatus(index);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, status }),
      });
      if (res.ok) {
        fetchBookings();
      } else {
        const err = await res.json();
        alert(err.error || 'Fehler beim Status-Update');
      }
    } catch (e) {
      console.error('Failed to update status', e);
      alert('Fehler beim Status-Update');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Export calendar as iCal
  const exportCalendar = () => {
    window.open('/api/bookings/ical', '_blank');
  };

  // Open email modal
  const openEmailModal = (booking: Booking, index: number) => {
    setEmailModal({ booking, index });
    setEmailTo(booking.email || '');
    setEmailSubject(`Ihre ${booking.service || 'Buchung'} am ${formatDateForSubject(booking.date)}`);
    setEmailMessage('');
    setEmailError('');
    setEmailSuccess(false);
  };

  // Format date for email subject
  const formatDateForSubject = (dateStr?: string): string => {
    if (!dateStr) return 'TBD';
    try {
      const date = parseDate(dateStr);
      if (!date) return dateStr;
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Apply email template
  const applyEmailTemplate = async (templateType: 'confirmation' | 'reminder' | 'thankyou' | 'packlist') => {
    if (!emailModal) return;
    const booking = emailModal.booking;
    
    const formattedDate = formatDateForSubject(booking.date);
    
    if (templateType === 'confirmation') {
      setEmailSubject(`Buchungsbestätigung: ${booking.service || 'Ihr Termin'} am ${formattedDate}`);
      setEmailMessage(`Liebe/r ${booking.name || 'Kunde/in'},

vielen Dank für Ihre Buchung! Wir freuen uns sehr, Ihren besonderen Moment festhalten zu dürfen.

IHRE BUCHUNGSDETAILS:
- Datum: ${formattedDate}
${booking.location ? `- Location: ${booking.location}` : ''}
${booking.service ? `- Leistung: ${booking.service}` : ''}

Ihr Termin ist bestätigt! ✓

Bei Fragen stehe ich Ihnen jederzeit gerne zur Verfügung.

Mit herzlichen Grüßen
Tobias Aigner
Photo Aigner`);
    } else if (templateType === 'reminder') {
      setEmailSubject(`Erinnerung: ${booking.service || 'Ihr Termin'} am ${formattedDate}`);
      setEmailMessage(`Liebe/r ${booking.name || 'Kunde/in'},

Ihr Termin rückt näher!

TERMINDETAILS:
- Datum: ${formattedDate}
${booking.location ? `- Location: ${booking.location}` : ''}
${booking.service ? `- Leistung: ${booking.service}` : ''}

Ich freue mich schon sehr auf unser Shooting!

Bis bald
Tobias Aigner
Photo Aigner`);
    } else if (templateType === 'thankyou') {
      setEmailSubject(`Danke für Ihr Vertrauen! - ${booking.service || 'Ihr Shooting'}`);
      setEmailMessage(`Liebe/r ${booking.name || 'Kunde/in'},

💛 Vielen Dank!

Es war mir eine große Freude, am ${formattedDate} für Sie da zu sein!
Ich hoffe, Sie haben wunderschöne Erinnerungen von diesem besonderen Tag.

An Ihren Bildern${booking.service?.toLowerCase() === 'hochzeit' ? ' und Ihrem Film' : ''} arbeite ich bereits mit viel Liebe zum Detail.

War ich eine Empfehlung wert? Eine Google-Bewertung würde mich sehr freuen! ⭐⭐⭐⭐⭐

Herzliche Grüße
Tobias Aigner
Photo Aigner`);
    } else if (templateType === 'packlist') {
      // Get equipment list
      const recommendedEquipment = getRecommendedEquipment(booking.service);
      const equipmentList = recommendedEquipment.map(e => `  ✓ ${e.name}`).join('\n');
      const droneDisclaimer = jobPresets?.droneDisclaimer as string || '';
      
      setEmailSubject(`Ihre ${booking.service || 'Reportage'} am ${formattedDate} - Wir sind bereit!`);
      setEmailMessage(`Liebe/r ${booking.name || 'Kunde/in'},

Ihr großer Tag rückt näher! Ich möchte Ihnen versichern: Wir sind bestens vorbereitet!

🎬 Alles bereit für Ihren Termin!

TERMINDETAILS:
- Datum: ${formattedDate}
${booking.location ? `- Location: ${booking.location}` : ''}
${booking.service ? `- Leistung: ${booking.service}` : ''}

EQUIPMENT-PACKLISTE:
${equipmentList || '  (Wird basierend auf Service konfiguriert)'}

${droneDisclaimer ? `\n${droneDisclaimer}\n` : ''}
Sollten Sie noch Fragen haben oder besondere Wünsche, melden Sie sich gerne jederzeit!

Ich freue mich auf Sie!
Tobias Aigner
Photo Aigner`);
    }
  };

  // Send email
  const sendEmail = async () => {
    if (!emailModal || !emailTo || !emailSubject || !emailMessage) {
      setEmailError('Bitte alle Felder ausfüllen');
      return;
    }
    
    setEmailSending(true);
    setEmailError('');
    
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          text: emailMessage,
        }),
      });
      
      if (res.ok) {
        setEmailSuccess(true);
        setTimeout(() => {
          setEmailModal(null);
          setEmailSuccess(false);
        }, 2000);
      } else {
        const err = await res.json();
        setEmailError(err.error || 'E-Mail konnte nicht gesendet werden');
      }
    } catch (e) {
      console.error('Failed to send email', e);
      setEmailError('E-Mail konnte nicht gesendet werden');
    } finally {
      setEmailSending(false);
    }
  };

  // Parse budget string to number - supports multiple formats
  const parseBudget = (budgetStr?: string): number => {
    if (!budgetStr) return 0;
    const str = budgetStr.trim().toLowerCase();
    
    // Handle range format: "1500-2000" -> average
    const rangeMatch = str.match(/(\d[\d.,]*)\s*[-–]\s*(\d[\d.,]*)/);
    if (rangeMatch) {
      const low = parseFloat(rangeMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
      const high = parseFloat(rangeMatch[2].replace(/\./g, '').replace(',', '.')) || 0;
      return Math.round((low + high) / 2);
    }
    
    // Remove prefixes like "ab", "ca", "circa", "etwa", "~"
    const cleanedStr = str.replace(/^(ab|ca\.?|circa|etwa|~)\s*/i, '');
    
    // Extract number: handles "2000", "2000€", "2.000€", "2,000", "€2000"
    const numMatch = cleanedStr.match(/[\d.,]+/);
    if (numMatch) {
      let numStr = numMatch[0];
      // German format: 2.000,50 -> remove dots, replace comma with dot
      // English format: 2,000.50 -> remove commas
      if (numStr.includes('.') && numStr.includes(',')) {
        // Determine format by position of last separator
        const lastDot = numStr.lastIndexOf('.');
        const lastComma = numStr.lastIndexOf(',');
        if (lastComma > lastDot) {
          // German: 2.000,50
          numStr = numStr.replace(/\./g, '').replace(',', '.');
        } else {
          // English: 2,000.50
          numStr = numStr.replace(/,/g, '');
        }
      } else if (numStr.includes(',')) {
        // Could be German decimal (2,5) or thousand separator (2,000)
        const parts = numStr.split(',');
        if (parts.length === 2 && parts[1].length === 3) {
          // Thousand separator: 2,000
          numStr = numStr.replace(',', '');
        } else {
          // Decimal: 2,5
          numStr = numStr.replace(',', '.');
        }
      } else if (numStr.includes('.')) {
        // Could be German thousand separator (2.000) or decimal (2.5)
        const parts = numStr.split('.');
        if (parts.length === 2 && parts[1].length === 3) {
          // Thousand separator: 2.000
          numStr = numStr.replace('.', '');
        }
        // Otherwise keep as decimal
      }
      return parseFloat(numStr) || 0;
    }
    return 0;
  };

  // Get equipment item by ID
  const getEquipmentById = useCallback((id: string): EquipmentItem | null => {
    if (!equipment) return null;
    for (const cat of Object.values(equipment)) {
      const item = cat.find((e: EquipmentItem) => e.id === id);
      if (item) return item;
    }
    return null;
  }, [equipment]);

  // Get recommended equipment for a service
  const getRecommendedEquipment = useCallback((service?: string): EquipmentItem[] => {
    if (!service || !jobPresets || !equipment) return [];
    const serviceKey = service.toLowerCase();
    const preset = jobPresets[serviceKey];
    if (!preset || typeof preset === 'string') return [];
    return preset.equipment.map(id => getEquipmentById(id)).filter(Boolean) as EquipmentItem[];
  }, [jobPresets, equipment, getEquipmentById]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = data.length;
    let upcoming = 0;
    let thisWeek = 0;
    let thisMonth = 0;
    let totalBudget = 0;
    let confirmedBudget = 0;
    let cancelledBudget = 0;
    let pendingBudget = 0;

    data.forEach((b) => {
      const date = parseDate(b.date);
      if (date) {
        if (date >= today) upcoming++;
        if (isInWeek(date, today)) thisWeek++;
        if (isInMonth(date, today)) thisMonth++;
      }
      const budget = parseBudget(b.budget);
      totalBudget += budget;
      
      if (b.status === 'confirmed') {
        confirmedBudget += budget;
      } else if (b.status === 'cancelled') {
        cancelledBudget += budget;
      } else {
        // pending or undefined
        pendingBudget += budget;
      }
    });

    const avgBudget = total > 0 ? Math.round(totalBudget / total) : 0;

    return { total, upcoming, thisWeek, thisMonth, totalBudget, avgBudget, confirmedBudget, cancelledBudget, pendingBudget };
  }, [data]);

  // Locations statistics
  const locationStats = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((b) => {
      const loc = (b.location || '').trim();
      if (loc) {
        map.set(loc, (map.get(loc) || 0) + 1);
      }
    });
    return Array.from(map.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  // Bookings grouped by date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, { booking: Booking; index: number }[]>();
    data.forEach((b, idx) => {
      const date = parseDate(b.date);
      if (date) {
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ booking: b, index: idx });
      }
    });
    return map;
  }, [data]);

  // Get bookings for a specific date
  const getBookingsForDate = useCallback((date: Date): { booking: Booking; index: number }[] => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return bookingsByDate.get(key) || [];
  }, [bookingsByDate]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.map((b, idx) => ({ booking: b, index: idx })).filter(({ booking: b }) => {
      // Status filter
      if (statusFilter === 'active' && b.status === 'cancelled') return false;
      if (statusFilter === 'cancelled' && b.status !== 'cancelled') return false;
      
      // Brand filter
      if (brandFilter !== 'ALL' && b.brand !== brandFilter) return false;
      
      if (serviceFilter && (b.service || '').toLowerCase() !== serviceFilter) return false;
      if (!q) return true;
      const hay = [b.name, b.email, b.phone, b.location, b.message, b.date, b.budget]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [data, query, serviceFilter, statusFilter]);

  // Navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  // Equipment warning component
  const EquipmentWarning = ({ items }: { items: EquipmentItem[] }) => {
    const warnings = items.filter(i => i.batteryStatus === 'low' || i.batteryStatus === 'charging');
    if (warnings.length === 0) return null;
    return (
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginTop: '0.75rem',
        fontSize: '0.85rem',
        color: '#92400e'
      }}>
        ⚠️ Achtung: {warnings.map(w => `${w.name} (${w.batteryStatus === 'charging' ? 'lädt' : 'niedrig'})`).join(', ')}
      </div>
    );
  };

  // Render recommended equipment section
  const RecommendedEquipment = ({ service }: { service?: string }) => {
    const items = getRecommendedEquipment(service);
    if (items.length === 0) return null;

    // Check if service has drone disclaimer
    const serviceKey = (service || '').toLowerCase();
    const preset = jobPresets?.[serviceKey];
    const hasDroneDisclaimer = typeof preset === 'object' && preset?.droneDisclaimer === true;
    const disclaimerText = typeof jobPresets?.droneDisclaimer === 'string' ? jobPresets.droneDisclaimer : undefined;

    return (
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '10px',
        border: '1px solid var(--color-cream-dark)'
      }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '0.75rem',
          color: 'var(--color-black)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎬 Benötigtes Equipment
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              background: 'var(--color-cream)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              color: 'var(--color-black)'
            }}>
              {item.batteries && getBatteryIcon(item.batteryStatus)}
              {item.name}
            </div>
          ))}
        </div>
        <EquipmentWarning items={items} />
        {hasDroneDisclaimer && disclaimerText && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--color-gold)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-black-soft)'
          }}>
            {disclaimerText}
          </div>
        )}
      </div>
    );
  };

  // Password Modal
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--color-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            color: 'var(--color-black)',
            marginBottom: '0.5rem'
          }}>Dashboard Login</h2>
          <p style={{
            color: 'var(--color-black-soft)',
            fontSize: '0.9rem',
            marginBottom: '2rem'
          }}>Bitte Passwort eingeben</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Passwort"
              autoFocus
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid var(--color-cream-dark)',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s',
                marginBottom: '1rem'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
            />
            {passwordError && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{passwordError}</p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                color: 'var(--color-cream)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(201, 169, 98, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-black)', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <span style={{
            color: 'var(--color-gold)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.75rem'
          }}>Admin-Bereich</span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-cream)'
          }}>Bookings Dashboard</h1>
          <div style={{
            width: '60px',
            height: '2px',
            background: 'var(--color-gold)',
            marginTop: '1.25rem'
          }} />
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {loading && <p style={{ color: 'var(--color-black-soft)' }}>Lade...</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}

        {!loading && !error && (
          <>
            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem'
            }}>
              {[
                { label: 'Gesamt Buchungen', value: stats.total, icon: '📋' },
                { label: 'Anstehende Events', value: stats.upcoming, icon: '📅' },
                { label: 'Diese Woche', value: stats.thisWeek, icon: '📆' },
                { label: 'Diesen Monat', value: stats.thisMonth, icon: '📊' },
                { label: 'Gesamt-Budget', value: `${stats.totalBudget.toLocaleString('de-DE')}€`, icon: '💰' },
                { label: 'Bestätigt', value: `${stats.confirmedBudget.toLocaleString('de-DE')}€`, icon: '✅', color: '#16a34a' },
                { label: 'Verloren', value: `${stats.cancelledBudget.toLocaleString('de-DE')}€`, icon: '❌', color: '#dc2626', isLoss: true },
                { label: 'Offen', value: `${stats.pendingBudget.toLocaleString('de-DE')}€`, icon: '⏳', color: '#f59e0b' }
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: (stat as any).isLoss ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' : 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'default',
                    borderLeft: (stat as any).color ? `4px solid ${(stat as any).color}` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                    <div>
                      <p style={{
                        fontSize: '0.8rem',
                        color: (stat as any).color || 'var(--color-black-soft)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.25rem'
                      }}>{stat.label}</p>
                      <p style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: 'var(--color-black)',
                        fontFamily: 'var(--font-serif)'
                      }}>{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Toggle + Action Buttons */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'white',
                padding: '0.5rem',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                width: 'fit-content',
                flexWrap: 'wrap'
              }}>
                {(['calendar', 'list', 'equipment', 'map'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s',
                      background: viewMode === mode
                        ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))'
                        : 'transparent',
                      color: viewMode === mode ? 'var(--color-cream)' : 'var(--color-black-soft)'
                    }}
                  >
                    {mode === 'calendar' ? '📅 Kalender' : mode === 'list' ? '📋 Liste' : mode === 'equipment' ? '🔧 Equipment' : '🗺️ Karte'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={exportCalendar}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.25rem',
                    background: 'white',
                    color: 'var(--color-black)',
                    border: '2px solid var(--color-gold)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-gold)';
                    e.currentTarget.style.color = 'var(--color-cream)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = 'var(--color-black)';
                  }}
                >
                  📅 Kalender exportieren
                </button>
                <button
                  onClick={() => setAddBookingModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 1.5rem',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>+</span>
                  Neuer Termin
                </button>
              </div>
            </div>

            {viewMode === 'calendar' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Calendar */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}>
                  {/* Month Navigation */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--color-cream-dark)'
                  }}>
                    <button
                      onClick={prevMonth}
                      style={{
                        background: 'var(--color-cream)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1.25rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: 'var(--color-black)',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-cream-dark)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-cream)'}
                    >
                      ← Zurück
                    </button>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      color: 'var(--color-black)'
                    }}>{formatDateGerman(currentMonth)}</h3>
                    <button
                      onClick={nextMonth}
                      style={{
                        background: 'var(--color-cream)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1.25rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        color: 'var(--color-black)',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-cream-dark)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-cream)'}
                    >
                      Weiter →
                    </button>
                  </div>

                  {/* Day Names */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    borderBottom: '1px solid var(--color-cream-dark)'
                  }}>
                    {dayNames.map((d) => (
                      <div
                        key={d}
                        style={{
                          padding: '1rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          color: 'var(--color-black-soft)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)'
                  }}>
                    {calendarDays.map((date, idx) => {
                      if (!date) {
                        return <div key={idx} style={{ padding: '1rem', background: 'var(--color-cream)' }} />;
                      }

                      const bookings = getBookingsForDate(date);
                      const hasBookings = bookings.length > 0;
                      const isToday = isSameDay(date, today);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedDate(date)}
                          style={{
                            padding: '0.75rem',
                            minHeight: '80px',
                            borderRight: '1px solid var(--color-cream-dark)',
                            borderBottom: '1px solid var(--color-cream-dark)',
                            cursor: hasBookings ? 'pointer' : 'default',
                            background: isSelected
                              ? 'var(--color-gold)'
                              : isToday
                                ? 'rgba(201, 169, 98, 0.1)'
                                : 'white',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'var(--color-cream)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isToday ? 'rgba(201, 169, 98, 0.1)' : 'white';
                            }
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{
                              fontWeight: isToday ? '700' : '500',
                              fontSize: '0.95rem',
                              color: isSelected ? 'var(--color-cream)' : 'var(--color-black)'
                            }}>
                              {date.getDate()}
                            </span>
                            {hasBookings && (
                              <span style={{
                                background: isSelected ? 'var(--color-cream)' : 'var(--color-gold)',
                                color: isSelected ? 'var(--color-gold)' : 'var(--color-cream)',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '10px'
                              }}>
                                {bookings.length}
                              </span>
                            )}
                          </div>
                          {hasBookings && (
                            <div style={{
                              fontSize: '0.7rem',
                              color: isSelected ? 'var(--color-cream)' : 'var(--color-black-soft)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              {bookings[0].booking.brand && (
                                <span style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: bookings[0].booking.brand === 'CHILI' ? '#00FF41' : '#C9A962',
                                  flexShrink: 0
                                }} />
                              )}
                              {bookings[0].booking.name || bookings[0].booking.service || 'Buchung'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Day Details */}
                {selectedDate && (
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: 'var(--color-black)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <span style={{
                        background: 'var(--color-gold)',
                        color: 'var(--color-cream)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}>
                        {selectedDate.getDate()}.{selectedDate.getMonth() + 1}.{selectedDate.getFullYear()}
                      </span>
                      Buchungen
                    </h3>

                    {getBookingsForDate(selectedDate).length === 0 ? (
                      <p style={{ color: 'var(--color-black-soft)', fontStyle: 'italic' }}>
                        Keine Buchungen an diesem Tag.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {getBookingsForDate(selectedDate).map(({ booking: b, index }) => (
                          <div
                            key={index}
                            style={{
                              padding: '1.25rem',
                              background: b.status === 'cancelled' ? 'rgba(254, 226, 226, 0.5)' : 'var(--color-cream)',
                              borderRadius: '12px',
                              borderLeft: `4px solid ${b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : 'var(--color-gold)'}`,
                              opacity: b.status === 'cancelled' ? 0.7 : 1
                            }}
                          >
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                                {b.brand && (
                                  <span style={{
                                    background: b.brand === 'CHILI' ? '#00FF41' : '#C9A962',
                                    color: b.brand === 'CHILI' ? '#050505' : 'white',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontWeight: '800'
                                  }}>
                                    {b.brand}
                                  </span>
                                )}
                                <strong style={{ 
                                  fontSize: '1.1rem', 
                                  color: 'var(--color-black)',
                                  textDecoration: b.status === 'cancelled' ? 'line-through' : 'none'
                                }}>
                                  {b.name || 'Unbekannt'}
                                </strong>
                                {b.service && (
                                  <span style={{
                                    background: 'var(--color-gold)',
                                    color: 'var(--color-cream)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    textTransform: 'capitalize'
                                  }}>
                                    {b.service}
                                  </span>
                                )}
                                {/* Status Badge */}
                                <span style={{
                                  background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#f3f4f6',
                                  color: b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : '#6b7280',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '20px',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  textTransform: 'uppercase'
                                }}>
                                  {b.status === 'confirmed' ? '✓ Bestätigt' : b.status === 'cancelled' ? '✗ Abgesagt' : '◷ Offen'}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {/* Status Buttons */}
                                {b.status !== 'confirmed' && (
                                  <button
                                    onClick={() => updateStatus(index, 'confirmed')}
                                    disabled={updatingStatus === index}
                                    style={{
                                      background: '#dcfce7',
                                      color: '#16a34a',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0.5rem 1rem',
                                      fontSize: '0.8rem',
                                      cursor: updatingStatus === index ? 'not-allowed' : 'pointer',
                                      fontWeight: '500',
                                      opacity: updatingStatus === index ? 0.6 : 1,
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#bbf7d0'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#dcfce7'}
                                  >
                                    ✅ Bestätigen
                                  </button>
                                )}
                                {b.status !== 'cancelled' && (
                                  <button
                                    onClick={() => updateStatus(index, 'cancelled')}
                                    disabled={updatingStatus === index}
                                    style={{
                                      background: '#fef3c7',
                                      color: '#b45309',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0.5rem 1rem',
                                      fontSize: '0.8rem',
                                      cursor: updatingStatus === index ? 'not-allowed' : 'pointer',
                                      fontWeight: '500',
                                      opacity: updatingStatus === index ? 0.6 : 1,
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#fde68a'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#fef3c7'}
                                  >
                                    ❌ Absagen
                                  </button>
                                )}
                                {b.status === 'cancelled' && (
                                  <button
                                    onClick={() => updateStatus(index, 'pending')}
                                    disabled={updatingStatus === index}
                                    style={{
                                      background: '#f3f4f6',
                                      color: '#6b7280',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0.5rem 1rem',
                                      fontSize: '0.8rem',
                                      cursor: updatingStatus === index ? 'not-allowed' : 'pointer',
                                      fontWeight: '500',
                                      opacity: updatingStatus === index ? 0.6 : 1,
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                  >
                                    ↩️ Reaktivieren
                                  </button>
                                )}
                                <button
                                  onClick={() => openEmailModal(b, index)}
                                  style={{
                                    background: '#dbeafe',
                                    color: '#1d4ed8',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = '#dbeafe'}
                                >
                                  📧 E-Mail
                                </button>
                                <button
                                  onClick={() => deleteBooking(index)}
                                style={{
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.5rem 1rem',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: '500',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                              >
                                🗑️ Löschen
                              </button>
                              </div>
                            </div>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                              gap: '0.5rem',
                              fontSize: '0.9rem',
                              color: 'var(--color-black-soft)'
                            }}>
                              {b.email && <div>📧 {b.email}</div>}
                              {b.phone && <div>📱 {b.phone}</div>}
                              {b.location && <div>📍 {b.location}</div>}
                              {b.budget && <div>💰 {b.budget}</div>}
                            </div>
                            {b.message && (
                              <p style={{
                                marginTop: '0.75rem',
                                padding: '0.75rem',
                                background: 'white',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                color: 'var(--color-black-soft)',
                                fontStyle: 'italic'
                              }}>
                                „{b.message}"
                              </p>
                            )}
                            {/* Notes Section */}
                            <div style={{
                              marginTop: '1rem',
                              padding: '1rem',
                              background: 'white',
                              borderRadius: '10px',
                              border: '1px solid var(--color-cream-dark)'
                            }}>
                              <h4 style={{
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                marginBottom: '0.75rem',
                                color: 'var(--color-black)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                📝 Notizen
                              </h4>
                              {editingNotes?.index === index ? (
                                <div>
                                  <textarea
                                    value={editingNotes.notes}
                                    onChange={(e) => setEditingNotes({ index, notes: e.target.value })}
                                    placeholder="Notizen zu diesem Termin..."
                                    rows={4}
                                    style={{
                                      width: '100%',
                                      padding: '0.75rem',
                                      border: '2px solid var(--color-gold)',
                                      borderRadius: '8px',
                                      fontSize: '0.9rem',
                                      outline: 'none',
                                      resize: 'vertical',
                                      marginBottom: '0.75rem'
                                    }}
                                  />
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                      onClick={() => setEditingNotes(null)}
                                      style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--color-cream)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Abbrechen
                                    </button>
                                    <button
                                      onClick={() => saveNotes(index, editingNotes.notes)}
                                      disabled={savingNotes}
                                      style={{
                                        padding: '0.5rem 1rem',
                                        background: savingNotes ? '#9ca3af' : 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                                        color: 'var(--color-cream)',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: savingNotes ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      {savingNotes ? 'Speichert...' : '💾 Speichern'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {b.notes ? (
                                    <p style={{
                                      fontSize: '0.9rem',
                                      color: 'var(--color-black-soft)',
                                      whiteSpace: 'pre-wrap',
                                      marginBottom: '0.75rem'
                                    }}>
                                      {b.notes}
                                    </p>
                                  ) : (
                                    <p style={{
                                      fontSize: '0.85rem',
                                      color: 'var(--color-black-soft)',
                                      opacity: 0.6,
                                      fontStyle: 'italic',
                                      marginBottom: '0.75rem'
                                    }}>
                                      Keine Notizen vorhanden
                                    </p>
                                  )}
                                  <button
                                    onClick={() => setEditingNotes({ index, notes: b.notes || '' })}
                                    style={{
                                      padding: '0.4rem 0.75rem',
                                      background: 'var(--color-cream)',
                                      border: '1px solid var(--color-cream-dark)',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-gold)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-cream-dark)'}
                                  >
                                    ✏️ Bearbeiten
                                  </button>
                                </div>
                              )}
                            </div>
                            <RecommendedEquipment service={b.service} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : viewMode === 'list' ? (
              /* List View */
              <div>
                {/* Filters */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Suche nach Name, E-Mail, Telefon, Ort, Nachricht"
                      style={{
                        flex: '1 1 300px',
                        padding: '1rem 1.25rem',
                        border: '2px solid var(--color-cream-dark)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-gold)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(201, 169, 98, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-cream-dark)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      style={{
                        flex: '0 1 200px',
                        padding: '1rem 1.25rem',
                        border: '2px solid var(--color-cream-dark)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                    >
                      <option value="">Alle Leistungen</option>
                      <option value="hochzeit">Hochzeit</option>
                      <option value="event">Event</option>
                      <option value="portrait">Portrait</option>
                      <option value="immobilien">Immobilien</option>
                    </select>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'cancelled')}
                      style={{
                        flex: '0 1 180px',
                        padding: '1rem 1.25rem',
                        border: '2px solid var(--color-cream-dark)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                    >
                      <option value="active">✓ Nur Aktive</option>
                      <option value="all">📋 Alle anzeigen</option>
                      <option value="cancelled">❌ Nur Abgesagte</option>
                    </select>
                    <select
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value as 'ALL' | 'AIGNER' | 'CHILI')}
                      style={{
                        flex: '0 1 180px',
                        padding: '1rem 1.25rem',
                        border: '2px solid var(--color-cream-dark)',
                        borderRadius: '10px',
                        fontSize: '0.95rem',
                        outline: 'none',
                        background: 'white',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                    >
                      <option value="ALL">🏢 Alle Brands</option>
                      <option value="AIGNER">📸 AIGNER</option>
                      <option value="CHILI">🌶️ CHILI</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.9rem'
                    }}>
                      <thead>
                        <tr style={{ background: 'var(--color-cream)' }}>
                          {['Eingang', 'Name', 'Kontakt', 'Datum', 'Leistung', 'Status', 'Ort/Budget', 'Aktionen'].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: '1rem',
                                textAlign: 'left',
                                fontWeight: '600',
                                color: 'var(--color-black)',
                                borderBottom: '2px solid var(--color-gold)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(({ booking: b, index }, idx) => (
                          <React.Fragment key={index}>
                            <tr
                              style={{
                                background: b.status === 'cancelled' 
                                  ? 'rgba(254, 226, 226, 0.3)' 
                                  : idx % 2 === 0 ? 'white' : 'var(--color-cream)',
                                transition: 'background 0.2s',
                                cursor: 'pointer',
                                opacity: b.status === 'cancelled' ? 0.6 : 1
                              }}
                              onClick={() => setSelectedBookingIndex(selectedBookingIndex === index ? null : index)}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201, 169, 98, 0.1)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = b.status === 'cancelled' 
                                ? 'rgba(254, 226, 226, 0.3)' 
                                : idx % 2 === 0 ? 'white' : 'var(--color-cream)'}
                            >
                              <td style={{ padding: '1rem', color: 'var(--color-black-soft)', whiteSpace: 'nowrap' }}>
                                {b.receivedAt || '-'}
                              </td>
                              <td style={{ 
                                padding: '1rem', 
                                fontWeight: '500',
                                textDecoration: b.status === 'cancelled' ? 'line-through' : 'none'
                              }}>{b.name || '-'}</td>
                              <td style={{ padding: '1rem' }}>
                                {b.email && <div style={{ color: 'var(--color-black-soft)', marginBottom: '0.25rem' }}>{b.email}</div>}
                                {b.phone && <div style={{ color: 'var(--color-black-soft)' }}>{b.phone}</div>}
                              </td>
                              <td style={{ 
                                padding: '1rem',
                                textDecoration: b.status === 'cancelled' ? 'line-through' : 'none'
                              }}>{b.date || '-'}</td>
                              <td style={{ padding: '1rem' }}>
                                {b.service && (
                                  <span style={{
                                    background: 'var(--color-gold)',
                                    color: 'var(--color-cream)',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    textTransform: 'capitalize'
                                  }}>
                                    {b.service}
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span style={{
                                    background: b.status === 'confirmed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#f3f4f6',
                                    color: b.status === 'confirmed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : '#6b7280',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    textAlign: 'center'
                                  }}>
                                    {b.status === 'confirmed' ? '✓ Bestätigt' : b.status === 'cancelled' ? '✗ Abgesagt' : '◷ Offen'}
                                  </span>
                                  {b.brand && (
                                    <span style={{
                                      background: b.brand === 'CHILI' ? '#00FF41' : '#C9A962',
                                      color: b.brand === 'CHILI' ? '#050505' : 'white',
                                      padding: '0.15rem 0.6rem',
                                      borderRadius: '4px',
                                      fontSize: '0.6rem',
                                      fontWeight: '800',
                                      textAlign: 'center',
                                      letterSpacing: '0.05em'
                                    }}>
                                      {b.brand}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--color-black-soft)' }}>
                                {b.location || '-'}
                                {b.budget && <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Budget: {b.budget}</div>}
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  {b.status !== 'confirmed' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); updateStatus(index, 'confirmed'); }}
                                      disabled={updatingStatus === index}
                                      style={{
                                        background: '#dcfce7',
                                        color: '#16a34a',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '0.4rem 0.6rem',
                                        fontSize: '0.75rem',
                                        cursor: updatingStatus === index ? 'not-allowed' : 'pointer',
                                        fontWeight: '500'
                                      }}
                                    >
                                      ✅
                                    </button>
                                  )}
                                  {b.status !== 'cancelled' && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); updateStatus(index, 'cancelled'); }}
                                      disabled={updatingStatus === index}
                                      style={{
                                        background: '#fef3c7',
                                        color: '#b45309',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '0.4rem 0.6rem',
                                        fontSize: '0.75rem',
                                        cursor: updatingStatus === index ? 'not-allowed' : 'pointer',
                                        fontWeight: '500'
                                      }}
                                    >
                                      ❌
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openEmailModal(b, index); }}
                                    style={{
                                      background: '#dbeafe',
                                      color: '#1d4ed8',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0.4rem 0.75rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      fontWeight: '500'
                                    }}
                                  >
                                    📧
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteBooking(index); }}
                                    style={{
                                      background: '#fee2e2',
                                      color: '#dc2626',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '0.4rem 0.75rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      fontWeight: '500'
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {selectedBookingIndex === index && (
                              <tr>
                                <td colSpan={8} style={{ padding: '0 1rem 1rem 1rem', background: 'var(--color-cream)' }}>
                                  {b.message && (
                                    <p style={{
                                      padding: '0.75rem',
                                      background: 'white',
                                      borderRadius: '8px',
                                      fontSize: '0.9rem',
                                      color: 'var(--color-black-soft)',
                                      fontStyle: 'italic',
                                      marginBottom: '0.5rem'
                                    }}>
                                      „{b.message}"
                                    </p>
                                  )}
                                  <RecommendedEquipment service={b.service} />
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                        {filtered.length === 0 && (
                          <tr>
                            <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-black-soft)' }}>
                              Keine Einträge gefunden.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : viewMode === 'equipment' ? (
              /* Equipment View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {equipment && (Object.keys(CATEGORY_LABELS) as (keyof EquipmentData)[]).map((category) => (
                  <div
                    key={category}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.25rem 1.5rem',
                      borderBottom: '1px solid var(--color-cream-dark)',
                      background: 'var(--color-cream)'
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        color: 'var(--color-black)'
                      }}>
                        {CATEGORY_LABELS[category]}
                      </h3>
                      <button
                        onClick={() => setAddEquipmentModal(category)}
                        style={{
                          background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                          color: 'var(--color-cream)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        + Hinzufügen
                      </button>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      {equipment[category].length === 0 ? (
                        <p style={{ color: 'var(--color-black-soft)', fontStyle: 'italic', padding: '1rem' }}>
                          Keine Einträge.
                        </p>
                      ) : (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          {equipment[category].map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                background: 'var(--color-cream)',
                                borderRadius: '10px',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(4px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                  <strong style={{ fontSize: '1rem', color: 'var(--color-black)' }}>{item.name}</strong>
                                  <span style={{
                                    background: 'white',
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    color: 'var(--color-black-soft)'
                                  }}>
                                    {item.type}
                                  </span>
                                </div>
                                {item.batteries !== undefined && (
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.85rem',
                                    color: 'var(--color-black-soft)'
                                  }}>
                                    <span style={{ color: getBatteryColor(item.batteryStatus) }}>●</span>
                                    {item.batteries} Akkus
                                    <select
                                      value={item.batteryStatus || 'full'}
                                      onChange={(e) => updateBatteryStatus(item.id, category, e.target.value as 'full' | 'charging' | 'low')}
                                      onClick={(e) => e.stopPropagation()}
                                      style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--color-cream-dark)',
                                        background: 'white',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <option value="full">🟢 Voll</option>
                                      <option value="charging">🟡 Lädt</option>
                                      <option value="low">🔴 Niedrig</option>
                                    </select>
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => deleteEquipment(item.id, category)}
                                style={{
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.5rem 0.75rem',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Map / Locations View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Locations Overview */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--color-cream-dark)',
                    background: 'var(--color-cream)'
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.5rem',
                      color: 'var(--color-black)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      🗺️ Locations-Übersicht
                    </h3>
                    <p style={{
                      color: 'var(--color-black-soft)',
                      fontSize: '0.9rem',
                      marginTop: '0.5rem'
                    }}>
                      Alle Buchungsstandorte auf einen Blick
                    </p>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    {locationStats.length === 0 ? (
                      <p style={{ color: 'var(--color-black-soft)', fontStyle: 'italic' }}>
                        Keine Locations vorhanden
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {locationStats.map(({ location, count }) => (
                          <div
                            key={location}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '1rem 1.25rem',
                              background: 'var(--color-cream)',
                              borderRadius: '12px',
                              borderLeft: '4px solid var(--color-gold)',
                              transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateX(4px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateX(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <strong style={{
                                fontSize: '1.1rem',
                                color: 'var(--color-black)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                              }}>
                                📍 {location}
                              </strong>
                              <span style={{
                                fontSize: '0.85rem',
                                color: 'var(--color-black-soft)',
                                marginTop: '0.25rem',
                                display: 'block'
                              }}>
                                {count} {count === 1 ? 'Buchung' : 'Buchungen'}
                              </span>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.6rem 1rem',
                                background: 'white',
                                color: 'var(--color-black)',
                                border: '1px solid var(--color-cream-dark)',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-gold)';
                                e.currentTarget.style.color = 'var(--color-cream)';
                                e.currentTarget.style.borderColor = 'var(--color-gold)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = 'var(--color-black)';
                                e.currentTarget.style.borderColor = 'var(--color-cream-dark)';
                              }}
                            >
                              🗺️ Google Maps
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* OpenStreetMap Embed - Austria region */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--color-cream-dark)',
                    background: 'var(--color-cream)'
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: 'var(--color-black)'
                    }}>
                      🌍 Interaktive Karte
                    </h3>
                  </div>
                  <div style={{ position: 'relative', height: '400px' }}>
                    <iframe
                      src="https://www.openstreetmap.org/export/embed.html?bbox=11.5%2C46.5%2C15.0%2C48.5&layer=mapnik"
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      title="OpenStreetMap Österreich"
                    />
                  </div>
                  <div style={{
                    padding: '1rem 1.5rem',
                    background: 'var(--color-cream)',
                    fontSize: '0.85rem',
                    color: 'var(--color-black-soft)'
                  }}>
                    💡 Tipp: Klicke auf eine Location oben, um sie in Google Maps zu öffnen
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Equipment Modal */}
      {addEquipmentModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }} onClick={() => setAddEquipmentModal(null)}>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: 'var(--color-black)'
            }}>
              {CATEGORY_LABELS[addEquipmentModal]} hinzufügen
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                placeholder="ID (z.B. fx6)"
                value={newEquipment.id}
                onChange={(e) => setNewEquipment({ ...newEquipment, id: e.target.value })}
                style={{
                  padding: '0.875rem 1rem',
                  border: '2px solid var(--color-cream-dark)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
              />
              <input
                placeholder="Name (z.B. Sony FX6)"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                style={{
                  padding: '0.875rem 1rem',
                  border: '2px solid var(--color-cream-dark)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
              />
              <input
                placeholder="Typ (z.B. Cinema)"
                value={newEquipment.type}
                onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
                style={{
                  padding: '0.875rem 1rem',
                  border: '2px solid var(--color-cream-dark)',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="number"
                  placeholder="Akkus (0 = keine)"
                  value={newEquipment.batteries || ''}
                  onChange={(e) => setNewEquipment({ ...newEquipment, batteries: parseInt(e.target.value) || 0 })}
                  style={{
                    flex: 1,
                    padding: '0.875rem 1rem',
                    border: '2px solid var(--color-cream-dark)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                />
                <select
                  value={newEquipment.batteryStatus}
                  onChange={(e) => setNewEquipment({ ...newEquipment, batteryStatus: e.target.value as 'full' | 'charging' | 'low' })}
                  style={{
                    flex: 1,
                    padding: '0.875rem 1rem',
                    border: '2px solid var(--color-cream-dark)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="full">🟢 Voll</option>
                  <option value="charging">🟡 Lädt</option>
                  <option value="low">🔴 Niedrig</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setAddEquipmentModal(null)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'var(--color-cream)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={addEquipment}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                    color: 'var(--color-cream)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Hinzufügen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {addBookingModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
          overflowY: 'auto'
        }} onClick={() => setAddBookingModal(false)}>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '550px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              margin: '2rem 0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: 'var(--color-black)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              Neuen Termin hinzufügen
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name + Date Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Name *
                  </label>
                  <input
                    placeholder="Max Mustermann"
                    value={newBooking.name}
                    onChange={(e) => setNewBooking({ ...newBooking, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Datum *
                  </label>
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>
              </div>

              {/* Email + Phone Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    E-Mail
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    placeholder="+43 ..."
                    value={newBooking.phone}
                    onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>
              </div>

              {/* Service + Location Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Service
                  </label>
                  <select
                    value={newBooking.service}
                    onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="hochzeit">🎊 Hochzeit</option>
                    <option value="event">🎉 Event</option>
                    <option value="portrait">📷 Portrait</option>
                    <option value="immobilien">🏠 Immobilien</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Brand
                  </label>
                  <select
                    value={newBooking.brand}
                    onChange={(e) => setNewBooking({ ...newBooking, brand: e.target.value as 'AIGNER' | 'CHILI' })}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="AIGNER">📸 AIGNER</option>
                    <option value="CHILI">🌶️ CHILI</option>
                  </select>
                </div>
              </div>

              {/* Location Row */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                  Location / Ort
                </label>
                <input
                  placeholder="z.B. Salzburg"
                  value={newBooking.location}
                  onChange={(e) => setNewBooking({ ...newBooking, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid var(--color-cream-dark)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                />
              </div>

              {/* Budget */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                  Budget / Paketwunsch
                </label>
                <input
                  placeholder="z.B. 8h Reportage, Drohne"
                  value={newBooking.budget}
                  onChange={(e) => setNewBooking({ ...newBooking, budget: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid var(--color-cream-dark)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                />
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                  Nachricht / Notizen
                </label>
                <textarea
                  placeholder="Zusätzliche Infos..."
                  value={newBooking.message}
                  onChange={(e) => setNewBooking({ ...newBooking, message: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid var(--color-cream-dark)',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => setAddBookingModal(false)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'var(--color-cream)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Abbrechen
                </button>
                <button
                  onClick={addBooking}
                  disabled={addBookingLoading}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: addBookingLoading
                      ? '#9ca3af'
                      : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: addBookingLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {addBookingLoading ? 'Wird gespeichert...' : '✓ Termin speichern'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-Mail Modal */}
      {emailModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
          overflowY: 'auto'
        }} onClick={() => setEmailModal(null)}>
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              margin: '2rem 0'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: 'var(--color-black)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              E-Mail senden
            </h3>

            {emailSuccess ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#16a34a'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>E-Mail erfolgreich gesendet!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Template Buttons */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-black-soft)' }}>
                    📋 Vorlage wählen
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      { type: 'confirmation' as const, label: '✓ Bestätigung', color: '#22c55e' },
                      { type: 'reminder' as const, label: '⏰ Reminder', color: '#f59e0b' },
                      { type: 'thankyou' as const, label: '💛 Danke', color: '#ec4899' },
                      { type: 'packlist' as const, label: '🎬 Packliste', color: '#3b82f6' },
                    ].map(({ type, label, color }) => (
                      <button
                        key={type}
                        onClick={() => applyEmailTemplate(type)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: `${color}15`,
                          color: color,
                          border: `1px solid ${color}40`,
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${color}25`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `${color}15`;
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* To */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    An *
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Betreff *
                  </label>
                  <input
                    placeholder="Betreff der E-Mail"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.4rem', color: 'var(--color-black-soft)' }}>
                    Nachricht *
                  </label>
                  <textarea
                    placeholder="Ihre Nachricht..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={10}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid var(--color-cream-dark)',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      lineHeight: '1.5'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--color-cream-dark)'}
                  />
                </div>

                {/* Error */}
                {emailError && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    {emailError}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setEmailModal(null)}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'var(--color-cream)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={sendEmail}
                    disabled={emailSending}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: emailSending
                        ? '#9ca3af'
                        : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: emailSending ? 'not-allowed' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {emailSending ? 'Wird gesendet...' : '📤 Senden'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
