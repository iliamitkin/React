import { useSelector } from 'react-redux';
export default function Insights() {
  const { items } = useSelector((state) => state.habits);
  const completed = items.filter((item) => item.completed).length;
  const rate = items.length ? Math.round((completed / items.length) * 100) : 0;
  return <section className="page-wrap insights-page"><div className="eyebrow">ТВОЙ ПРОГРЕСС</div><h1>Обзор недели<span className="brand-dot">.</span></h1><p className="intro">Посмотри, как складывается твой ритм.</p><div className="insight-card"><div className="eyebrow">ПРИВЫЧКИ СЕГОДНЯ</div><strong>{rate}<i>%</i></strong><p>выполнено · {completed} из {items.length}</p><div className="progress-track"><span style={{width: `${rate}%`}}/></div></div><div className="insight-card"><div className="eyebrow">ТВОЙ ПЛАН</div>{items.map((item) => <div className="insight-line" key={item.id}><span>{item.title}</span><b>{item.streak} дн.</b></div>)}</div></section>
}
