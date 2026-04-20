import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Footprints, Waves, Trees, Dumbbell, CalendarDays, BookOpen, ChefHat, Briefcase, Plane, Martini, Brain, Trophy } from "lucide-react";

const checklistItems = [
  { key: "walk", label: "Caminata", points: 1, icon: Footprints },
  { key: "peru", label: "Perú 17–19", points: 1, icon: Briefcase },
  { key: "eatWell", label: "Comer bien", points: 1, icon: ChefHat },
  { key: "meditation", label: "Meditación", points: 1, icon: Brain },
];

const activityOptions = [
  { value: "remo", label: "Remo", points: 2, icon: Waves },
  { value: "jardin", label: "Jardín", points: 2, icon: Trees },
  { value: "golf9", label: "Golf 9", points: 2, icon: Dumbbell },
  { value: "golf18", label: "Golf 18", points: 3, icon: Dumbbell },
  { value: "ejercicio", label: "Ejercicio", points: 2, icon: Dumbbell },
  { value: "cocina", label: "Cocinar", points: 1, icon: ChefHat },
  { value: "lectura", label: "Lectura", points: 1, icon: BookOpen },
  { value: "jardinLight", label: "Jardín suave", points: 1, icon: Trees },
  { value: "caminataLarga", label: "Caminata larga", points: 1, icon: Footprints },
  { value: "descanso", label: "Descanso activo", points: 0, icon: CalendarDays },
];

const activityMap = Object.fromEntries(activityOptions.map((opt) => [opt.value, opt]));

const rewards = [
  { threshold: 40, label: "Premio pequeño" },
  { threshold: 55, label: "Restaurante bueno" },
  { threshold: 70, label: "Premio grande" },
];

const initialDays = [
  {
    date: "2026-04-21",
    title: "Llegada a Virginia",
    event: "Llegas a casa aprox. 16:00",
    checks: {},
    activities: ["caminataLarga"],
    alcohol: "1-4",
    mood: "yellow",
    notes: "Llegada + jet lag. Caminar suave y dormir temprano.",
  },
  {
    date: "2026-04-22",
    title: "Adaptación",
    event: "Jet lag",
    checks: {},
    activities: ["caminataLarga", "jardinLight"],
    alcohol: "1-4",
    mood: "yellow",
    notes: "Caminar, jardín suave y Perú ligero.",
  },
  {
    date: "2026-04-23",
    title: "Arranque",
    event: "Día 3",
    checks: {},
    activities: ["remo"],
    alcohol: "0",
    mood: "green",
    notes: "Primer remo 20 min.",
  },
  {
    date: "2026-05-01",
    title: "Visita Ceci + Alberto",
    event: "1–3 mayo",
    checks: {},
    activities: ["descanso"],
    alcohol: "1-4",
    mood: "yellow",
    notes: "Más social.",
  },
  {
    date: "2026-05-05",
    title: "Viaje a Philadelphia",
    event: "5–7 mayo",
    checks: {},
    activities: ["descanso"],
    alcohol: "1-4",
    mood: "yellow",
    notes: "Pasaporte italiano.",
  },
  {
    date: "2026-05-11",
    title: "Posible viaje a Colombia",
    event: "11–13 mayo",
    checks: {},
    activities: ["descanso"],
    alcohol: "1-4",
    mood: "yellow",
    notes: "Por confirmar.",
  },
  {
    date: "2026-05-20",
    title: "Directorio",
    event: "Valtx + Tgestiona 8:30–14:00",
    checks: {},
    activities: ["caminataLarga"],
    alcohol: "0",
    mood: "green",
    notes: "Día mental, no físico.",
  },
];

function formatDate(dateStr) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(dateStr + "T12:00:00"));
}

function weekLabel(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  const start = new Date(d);
  const day = (d.getDay() + 6) % 7;
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function alcoholPoints(value) {
  if (value === "0") return 3; // dry day
  if (value === "1-4") return 1; // moderate
  if (value === "5+") return -3; // over
  return 0;
}

function alcoholLabel(value) {
  if (value === "0") return "Dry day";
  if (value === "1-4") return "1–4 copas";
  if (value === "5+") return "5+ copas";
  return "Sin marcar";
}

function moodConfig(mood) {
  if (mood === "green") return { emoji: "🟢", label: "Buen día" };
  if (mood === "red") return { emoji: "🔴", label: "Desordenado" };
  return { emoji: "🟡", label: "Normal" };
}

function dayPoints(day) {
  const base = checklistItems.reduce((acc, item) => acc + (day.checks?.[item.key] ? item.points : 0), 0);
  const acts = (day.activities || []).reduce((acc, value) => acc + (activityMap[value]?.points || 0), 0);
  return base + acts + alcoholPoints(day.alcohol);
}

function todaySummary(day) {
  const list = [];
  if (day.checks?.walk) list.push("🚶 Caminata");
  if (day.checks?.peru) list.push("🇵🇪 Perú");
  if (day.checks?.eatWell) list.push("🍽️ Comer bien");
  if (day.checks?.meditation) list.push("🧘 Meditación");
  (day.activities || []).forEach((value) => {
    const label = activityMap[value]?.label;
    if (label) list.push(label === "Cocinar" ? "🍳 Cocinar" : label === "Remo" ? "🚣 Remo" : label === "Jardín" || label === "Jardín suave" ? "🌿 " + label : label.startsWith("Golf") ? "⛳ " + label : label);
  });
  if (day.alcohol === "0") list.push("✨ Dry day");
  if (day.alcohol === "5+") list.push("🍷 Pasado de 4");
  return list;
}

export default function VirginiaRoutineTracker() {
  const [days, setDays] = useState(initialDays);
  const [selectedDate, setSelectedDate] = useState(initialDays[0].date);
  const [newDate, setNewDate] = useState("");

  const selectedDay = days.find((d) => d.date === selectedDate) || days[0];
  const selectedMood = moodConfig(selectedDay.mood);
  const selectedPoints = dayPoints(selectedDay);

  const updateDay = (date, patch) => {
    setDays((prev) => prev.map((d) => (d.date === date ? { ...d, ...patch } : d)));
  };

  const toggleActivity = (activity) => {
    const current = selectedDay.activities || [];
    const active = current.includes(activity);
    const next = active ? current.filter((v) => v !== activity) : [...current, activity];
    updateDay(selectedDay.date, { activities: next });
  };

  const weeklySummary = useMemo(() => {
    const grouped = {};
    for (const day of days) {
      const label = weekLabel(day.date);
      if (!grouped[label]) {
        grouped[label] = {
          points: 0,
          rowed: 0,
          golf: 0,
          walks: 0,
          meditation: 0,
          dryDays: 0,
          peru: 0,
        };
      }
      grouped[label].points += dayPoints(day);
      if (day.activities?.includes("remo")) grouped[label].rowed += 1;
      if (day.activities?.includes("golf9") || day.activities?.includes("golf18")) grouped[label].golf += 1;
      if (day.checks?.walk) grouped[label].walks += 1;
      if (day.checks?.meditation) grouped[label].meditation += 1;
      if (day.checks?.peru) grouped[label].peru += 1;
      if (day.alcohol === "0") grouped[label].dryDays += 1;
    }
    return grouped;
  }, [days]);

  const weeklyRewards = useMemo(() => {
    return Object.entries(weeklySummary).map(([label, data]) => {
      const achieved = [...rewards].reverse().find((r) => data.points >= r.threshold);
      const next = rewards.find((r) => data.points < r.threshold);
      return {
        label,
        ...data,
        achieved: achieved?.label || "Sin premio aún",
        nextLabel: next?.label || "Máximo logrado",
        nextGap: next ? next.threshold - data.points : 0,
      };
    });
  }, [weeklySummary]);

  const totalPoints = days.reduce((acc, d) => acc + dayPoints(d), 0);

  const addDay = () => {
    if (!newDate) return;
    if (days.some((d) => d.date === newDate)) return;
    const next = {
      date: newDate,
      title: "Día normal",
      event: "",
      checks: {},
      activities: [],
      alcohol: "1-4",
      mood: "yellow",
      notes: "",
    };
    setDays((prev) => [...prev, next].sort((a, b) => a.date.localeCompare(b.date)));
    setSelectedDate(newDate);
    setNewDate("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Virginia Tracker</CardTitle>
                  <p className="mt-2 text-sm text-slate-600">Tu versión simple: día, puntos, estado, alcohol y progreso semanal.</p>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">Total: {totalPoints} pts</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl border-0 bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500">Hoy</p>
                  <p className="mt-1 text-3xl font-semibold">{selectedPoints} pts</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500">Estado</p>
                  <p className="mt-1 text-2xl font-semibold">{selectedMood.emoji} {selectedMood.label}</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-0 bg-white shadow-sm">
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500">Alcohol</p>
                  <p className="mt-1 text-xl font-semibold">{alcoholLabel(selectedDay.alcohol)}</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Agregar día</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              <Button className="w-full rounded-2xl" onClick={addDay}>Agregar</Button>
              <p className="text-xs text-slate-500">Añade cualquier fecha y úsala como tracker diario.</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Fechas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setSelectedDate(day.date)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${selectedDate === day.date ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium capitalize">{formatDate(day.date)}</p>
                      <p className={`text-xs ${selectedDate === day.date ? "text-slate-200" : "text-slate-500"}`}>{day.title}</p>
                    </div>
                    <Badge variant={selectedDate === day.date ? "secondary" : "outline"} className="rounded-full">{dayPoints(day)} pts</Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl capitalize">{formatDate(selectedDay.date)}</CardTitle>
                    <p className="mt-1 text-sm text-slate-600">{selectedDay.title}</p>
                  </div>
                  {selectedDay.event ? <Badge className="rounded-full px-3 py-1"><Plane className="mr-1 h-3.5 w-3.5" /> {selectedDay.event}</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Base del día</h3>
                  {checklistItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <label key={item.key} className="flex items-center gap-3 rounded-2xl border p-3">
                        <Checkbox
                          checked={!!selectedDay.checks?.[item.key]}
                          onCheckedChange={(checked) => updateDay(selectedDay.date, { checks: { ...selectedDay.checks, [item.key]: !!checked } })}
                        />
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">{item.label}</span>
                        <span className="ml-auto text-xs text-slate-500">+{item.points}</span>
                      </label>
                    );
                  })}

                  <div>
                    <h3 className="mb-2 font-medium">Estado del día</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "green", label: "🟢 Bueno" },
                        { value: "yellow", label: "🟡 Normal" },
                        { value: "red", label: "🔴 Mal" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateDay(selectedDay.date, { mood: opt.value })}
                          className={`rounded-2xl border p-3 text-sm ${selectedDay.mood === opt.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Actividades</h3>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {activityOptions.map((opt) => {
                        const Icon = opt.icon;
                        const active = selectedDay.activities?.includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            onClick={() => toggleActivity(opt.value)}
                            className={`flex items-center gap-2 rounded-2xl border p-3 text-sm transition ${active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                          >
                            <Icon className="h-4 w-4" />
                            {opt.label}
                            <span className="ml-auto text-xs opacity-80">{opt.points > 0 ? `+${opt.points}` : "0"}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Alcohol</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "0", label: "Dry", delta: "+3" },
                        { value: "1-4", label: "1–4", delta: "+1" },
                        { value: "5+", label: "5+", delta: "-3" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => updateDay(selectedDay.date, { alcohol: opt.value })}
                          className={`rounded-2xl border p-3 text-sm ${selectedDay.alcohol === opt.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                        >
                          <div className="font-medium">{opt.label}</div>
                          <div className="text-xs opacity-80">{opt.delta}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Notas</h3>
                    <Textarea
                      value={selectedDay.notes}
                      onChange={(e) => updateDay(selectedDay.date, { notes: e.target.value })}
                      placeholder="Cómo fue el día, qué mejorar mañana..."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Resumen visual del día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {todaySummary(selectedDay).length ? (
                    todaySummary(selectedDay).map((item) => (
                      <Badge key={item} variant="secondary" className="rounded-full px-3 py-1">{item}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Aún no marcaste nada.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Semanas y premios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 xl:grid-cols-2">
                  {weeklyRewards.map((week) => {
                    const topThreshold = rewards[rewards.length - 1].threshold;
                    const pct = Math.max(0, Math.min(100, Math.round((week.points / topThreshold) * 100)));
                    return (
                      <Card key={week.label} className="rounded-2xl border bg-white shadow-sm">
                        <CardContent className="space-y-3 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{week.label}</p>
                            <Badge variant="outline" className="rounded-full">{week.points} pts</Badge>
                          </div>
                          <Progress value={pct} />
                          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                            <div className="rounded-xl bg-slate-50 p-2">🚣 Remo: <strong>{week.rowed}</strong></div>
                            <div className="rounded-xl bg-slate-50 p-2">⛳ Golf: <strong>{week.golf}</strong></div>
                            <div className="rounded-xl bg-slate-50 p-2">🚶 Caminatas: <strong>{week.walks}</strong></div>
                            <div className="rounded-xl bg-slate-50 p-2">🧘 Meditación: <strong>{week.meditation}</strong></div>
                            <div className="rounded-xl bg-slate-50 p-2">✨ Dry days: <strong>{week.dryDays}</strong></div>
                            <div className="rounded-xl bg-slate-50 p-2">🇵🇪 Perú: <strong>{week.peru}</strong></div>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                            <div className="flex items-center gap-2 font-medium"><Trophy className="h-4 w-4" /> Premio actual: {week.achieved}</div>
                            <div className="mt-1 text-slate-600">
                              {week.nextGap > 0 ? `Te faltan ${week.nextGap} puntos para ${week.nextLabel}.` : "Ya alcanzaste el máximo premio."}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
