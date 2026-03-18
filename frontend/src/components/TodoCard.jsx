import { CalendarDays, CheckCircle2, Circle, History, Pencil, Trash2 } from "lucide-react";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateTime(value) {
  if (!value) {
    return "--";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = monthNames[parsedDate.getMonth()];
  const year = String(parsedDate.getFullYear());
  const rawHours = parsedDate.getHours();
  const hours = String(((rawHours + 11) % 12) + 1).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  const meridiem = rawHours >= 12 ? "PM" : "AM";

  return `${day}-${month}-${year} \u2022 ${hours}-${minutes} ${meridiem}`;
}

function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  return (
    <article className={`todo-card panel-shell ${todo.completed ? "todo-card--completed" : ""}`}>
      <button
        className={`todo-card__toggle ${todo.completed ? "is-active" : ""}`}
        type="button"
        onClick={() => onToggle(todo)}
        aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
      >
        {todo.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>

      <div className="todo-card__content">
        <div className="todo-card__topline">
          <span className={`status-pill ${todo.completed ? "done" : "open"}`}>
            {todo.completed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            <span>{todo.completed ? "Completed" : "In progress"}</span>
          </span>
          <span className="todo-card__id">#{todo.id}</span>
        </div>

        <h3>{todo.title}</h3>
        <p>{todo.description?.trim() || "No description added yet."}</p>

        <div className="todo-card__meta">
          <span className="todo-card__meta-item">
            <CalendarDays size={14} />
            <span>Created: {formatDateTime(todo.createdAt)}</span>
          </span>
          <span className="todo-card__meta-item">
            <History size={14} />
            <span>Updated: {formatDateTime(todo.updatedAt)}</span>
          </span>
        </div>
      </div>

      <div className="todo-card__actions">
        <button className="button button--icon button--icon-edit" type="button" onClick={() => onEdit(todo)}>
          <Pencil size={15} />
          <span>Edit</span>
        </button>
        <button className="button button--icon button--icon-delete" type="button" onClick={() => onDelete(todo)}>
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
}

export default TodoCard;