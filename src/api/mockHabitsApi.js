// Встроенный mock backend: имитирует HTTP-задержку и хранит данные в памяти вкладки.
const pause = () => new Promise((resolve) => setTimeout(resolve, 250));
let habits = [
  { id: 'water', title: 'Выпить стакан воды', category: 'Здоровье', icon: '◉', color: 'mint', completed: true, streak: 5 },
  { id: 'read', title: 'Почитать 20 минут', category: 'Развитие', icon: '▤', color: 'lilac', completed: true, streak: 12 },
  { id: 'walk', title: 'Прогуляться на свежем воздухе', category: 'Здоровье', icon: '↗', color: 'peach', completed: false, streak: 3 },
  { id: 'journal', title: 'Записать мысли дня', category: 'Осознанность', icon: '✎', color: 'blue', completed: false, streak: 8 },
];

export const mockHabitsApi = {
  async list() { await pause(); return JSON.parse(JSON.stringify(habits)); },
  async create(title) {
    await pause();
    if (!title.trim()) throw new Error('Название привычки не может быть пустым');
    const habit = { id: `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`, title: title.trim(), category: 'Моё', icon: '✦', color: 'mint', completed: false, streak: 0 };
    habits = [habit, ...habits];
    return JSON.parse(JSON.stringify(habit));
  },
  async toggle(id) {
    await pause();
    const habit = habits.find((item) => item.id === id);
    if (!habit) throw new Error('Привычка не найдена');
    habit.completed = !habit.completed;
    return JSON.parse(JSON.stringify(habit));
  },
  reset() {
    habits = [
      { id: 'water', title: 'Выпить стакан воды', category: 'Здоровье', icon: '◉', color: 'mint', completed: true, streak: 5 },
      { id: 'read', title: 'Почитать 20 минут', category: 'Развитие', icon: '▤', color: 'lilac', completed: true, streak: 12 },
      { id: 'walk', title: 'Прогуляться на свежем воздухе', category: 'Здоровье', icon: '↗', color: 'peach', completed: false, streak: 3 },
      { id: 'journal', title: 'Записать мысли дня', category: 'Осознанность', icon: '✎', color: 'blue', completed: false, streak: 8 },
    ];
  },
};
