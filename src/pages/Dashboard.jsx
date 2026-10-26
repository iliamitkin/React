import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createHabit, loadHabits, setFilter, toggleHabitRemote } from '../store/habitsSlice';

const filters = ['Все', 'Сегодня', 'Выполнено'];
export default function Dashboard() {
  const dispatch = useDispatch();
  const { items, status, error, filter } = useSelector((state) => state.habits);
  const [draft, setDraft] = useState('');
  useEffect(() => { if (status === 'idle') dispatch(loadHabits()); }, [dispatch, status]);
  const done = items.filter((item) => item.completed).length;
  const visibleItems = useMemo(() => items.filter((item) => filter !== 'Выполнено' || item.completed), [items, filter]);
  const submit = async (event) => { event.preventDefault(); if (draft.trim()) { await dispatch(createHabit(draft.trim())); setDraft(''); } };

  return <section className="page-wrap">
    <div className="welcome-row"><div><div className="eyebrow">ТВОЯ НЕДЕЛЯ · 12–18 МАЯ</div><h1>Маленькие шаги.<br/><span>Большие перемены.</span></h1><p className="intro">Сегодня — отличный день, чтобы продолжить.</p></div><div className="week-card"><div className="week-heading"><span>ТВОЙ РИТМ</span><b>4 из 7 дней</b></div><div className="week-bars">{['П','В','С','Ч','П','С','В'].map((day, index) => <div className="day-column" key={index}><span className={`bar ${index < 4 ? 'bar-active' : ''}`} style={{height: `${index < 4 ? 25 + index * 8 : 12}px`}}/><small>{day}</small></div>)}</div></div></div>
    <div className="stats-grid"><article className="stat-card"><span className="stat-icon tint-mint">✦</span><div><small>СЕГОДНЯ ВЫПОЛНЕНО</small><strong>{done}<i> / {items.length || 4}</i></strong></div><span className="stat-note">{done ? 'Хороший старт!' : 'Начни с одного шага'}</span></article><article className="stat-card"><span className="stat-icon tint-lilac">↗</span><div><small>ЛУЧШАЯ СЕРИЯ</small><strong>12 <i>дней</i></strong></div><span className="stat-note">Ты в отличном ритме</span></article><article className="quote-card"><span>«</span><p>Не нужно быть идеальным.<br/>Достаточно быть последовательным.</p><small>ТВОЁ НАПОМИНАНИЕ НА СЕГОДНЯ</small></article></div>
    <div className="habits-heading"><div><div className="eyebrow">ПОНЕДЕЛЬНИК, 12 МАЯ</div><h2>Твои привычки <span className="count-pill">{items.length}</span></h2></div><div className="filters" aria-label="Фильтр привычек">{filters.map((item) => <button key={item} className={filter === item ? 'filter active-filter' : 'filter'} onClick={() => dispatch(setFilter(item))}>{item}</button>)}</div></div>
    {status === 'loading' && <div className="loading-card" role="status">Загружаем твой план…</div>}
    {status === 'failed' && <div className="loading-card" role="alert">Не удалось загрузить привычки: {error} <button onClick={() => dispatch(loadHabits())}>Повторить</button></div>}
    {error && status === 'succeeded' && <div className="loading-card" role="alert">{error}</div>}
    {status === 'succeeded' && <div className="habit-list">{visibleItems.map((habit) => <article className="habit-row" key={habit.id}><span className={`habit-icon tint-${habit.color}`}>{habit.icon}</span><div className="habit-copy"><b>{habit.title}</b><small>{habit.category} <span>·</span> серия {habit.streak} {habit.streak === 1 ? 'день' : 'дней'}</small></div><button className={`check-button ${habit.completed ? 'checked' : ''}`} aria-label={`${habit.completed ? 'Отметить невыполненной' : 'Отметить выполненной'}: ${habit.title}`} onClick={() => dispatch(toggleHabitRemote(habit.id))}>{habit.completed ? '✓' : ''}</button></article>)}</div>}
    <form className="add-form" onSubmit={submit}><span>＋</span><input aria-label="Новая привычка" placeholder="Добавить привычку на сегодня…" value={draft} onChange={(event) => setDraft(event.target.value)} /><button type="submit">Добавить</button></form>
    <footer className="page-footer"><span>Ритм складывается из повторений.</span><span>Сделано с заботой о себе <b>♥</b></span></footer>
  </section>
}
