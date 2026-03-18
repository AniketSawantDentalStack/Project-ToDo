function StatCard({ label, value, hint, tone = "mint", icon: Icon }) {
  return (
    <article className={`stat-card stat-card--${tone} panel-shell`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {Icon ? (
          <span className="stat-card__icon">
            <Icon size={18} />
          </span>
        ) : null}
      </div>
      <strong className="stat-card__value">{value}</strong>
      <span className="stat-card__hint">{hint}</span>
    </article>
  );
}

export default StatCard;