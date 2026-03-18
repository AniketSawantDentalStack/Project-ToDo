import { FileText, Type, X } from "lucide-react";

function TodoForm({
  form,
  setForm,
  isSubmitting,
  isEditing,
  onSubmit,
  onCancel
}) {
  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  return (
    <section className="modal-form">
      <div className="modal-form__header">
        <div>
          <h2>{isEditing ? "Update Todo" : "Add Todo"}</h2>
          <p>{isEditing ? "Edit your task details." : "Create a new task."}</p>
        </div>

        <button className="modal-close" type="button" onClick={onCancel} aria-label="Close modal">
          <X size={18} />
        </button>
      </div>

      <form className="todo-form" onSubmit={onSubmit}>
        <label className="input-group">
          <span className="input-group__label">
            <Type size={16} />
            <span>Title</span>
          </span>
          <input
            type="text"
            placeholder="Enter todo title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            maxLength={120}
            required
          />
        </label>

        <label className="input-group">
          <span className="input-group__label">
            <FileText size={16} />
            <span>Description</span>
          </span>
          <textarea
            rows="5"
            placeholder="Enter description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            maxLength={500}
          />
        </label>

        <div className="form-actions">
          <button className="button button--primary" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}</span>
          </button>
          <button className="button button--secondary" type="button" onClick={onCancel}>
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default TodoForm;