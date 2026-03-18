import { Briefcase, ClipboardList, Home, Plus, RefreshCw, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { todoApi } from "./api/todos";
import StatCard from "./components/StatCard";
import TodoCard from "./components/TodoCard";
import TodoForm from "./components/TodoForm";

const initialForm = {
  title: "",
  description: ""
};

const quickTemplates = [
  {
    label: "Work",
    title: "Finish sprint update",
    description: "Prepare sprint progress notes and share them with the team.",
    icon: Briefcase
  },
  {
    label: "Home",
    title: "Plan home essentials",
    description: "Check important household tasks and wrap up the pending items.",
    icon: Home
  },
  {
    label: "Shopping",
    title: "Buy weekly groceries",
    description: "Create the shopping checklist and pick up the required items.",
    icon: ShoppingCart
  },
  {
    label: "Focus",
    title: "Deep work session",
    description: "Block one focused hour and complete the highest-priority task.",
    icon: Sparkles
  }
];

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const editingTodo = useMemo(
    () => todos.find((todo) => todo.id === editingId) ?? null,
    [editingId, todos]
  );

  const orderedTodos = useMemo(() => {
    return [...todos].sort((left, right) => {
      if (left.completed !== right.completed) {
        return Number(left.completed) - Number(right.completed);
      }

      return (right.id ?? 0) - (left.id ?? 0);
    });
  }, [todos]);

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    setIsLoading(true);
    setError("");

    try {
      const response = await todoApi.getAll();
      setTodos(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function openQuickCreate(template) {
    setForm({
      title: template.title,
      description: template.description
    });
    setEditingId(null);
    setIsModalOpen(true);
  }

  function openEditModal(todo) {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description ?? ""
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    resetForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      completed: editingTodo?.completed ?? false
    };

    if (!payload.title) {
      setError("Title is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (editingTodo) {
        const updatedTodo = await todoApi.update(editingTodo.id, payload);
        setTodos((current) =>
          current.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
      } else {
        const createdTodo = await todoApi.create(payload);
        setTodos((current) => [createdTodo, ...current]);
      }

      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggle(todo) {
    setError("");

    try {
      const updatedTodo = await todoApi.update(todo.id, {
        title: todo.title,
        description: todo.description ?? "",
        completed: !todo.completed
      });

      setTodos((current) => current.map((item) => (item.id === updatedTodo.id ? updatedTodo : item)));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDelete(todo) {
    const isConfirmed = window.confirm(`Delete \"${todo.title}\"?`);

    if (!isConfirmed) {
      return;
    }

    setError("");

    try {
      await todoApi.remove(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));

      if (editingId === todo.id) {
        closeModal();
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />
      <div className="ambient ambient--three" />

      <main className="simple-app">
        <section className="simple-header panel-shell">
          <div>
            <div className="title-row">
              <span className="title-row__icon">
                <ClipboardList size={28} strokeWidth={2.1} />
              </span>
              <h1>ToDo List</h1>
            </div>
            <p>Simple task manager connected to your backend API.</p>
          </div>

          <button className="button button--primary" type="button" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Add Todo</span>
          </button>
        </section>

        <section className="counts-grid">
          <StatCard label="Total" value={totalCount} hint="All tasks" tone="mint" icon={ClipboardList} />
          <StatCard label="Active" value={activeCount} hint="Still pending" tone="sun" icon={Sparkles} />
          <StatCard label="Completed" value={completedCount} hint="Done tasks" tone="sky" icon={Briefcase} />
        </section>

        <section className="quick-add-card panel-shell">
          <div className="quick-add-card__header">
            <div className="section-title">
              <span className="section-title__icon">
                <Sparkles size={18} />
              </span>
              <div>
                <h2>Quick Add</h2>
                <p>Tap a template and open the modal with details already filled in.</p>
              </div>
            </div>
          </div>

          <div className="quick-add-grid">
            {quickTemplates.map((template) => {
              const Icon = template.icon;

              return (
                <button
                  key={template.label}
                  className="quick-option"
                  type="button"
                  onClick={() => openQuickCreate(template)}
                >
                  <div className="quick-option__top">
                    <span className="quick-option__icon">
                      <Icon size={18} />
                    </span>
                    <span className="quick-option__badge">Quick use</span>
                  </div>
                  <span className="quick-option__label">{template.label}</span>
                  <span className="quick-option__text">{template.title}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="list-card panel-shell">
          <div className="list-card__header">
            <div className="section-title">
              <span className="section-title__icon">
                <ClipboardList size={18} />
              </span>
              <div>
                <h2>Tasks</h2>
              </div>
            </div>
            <button className="button button--secondary" type="button" onClick={loadTodos}>
              <RefreshCw size={17} />
              <span>Refresh</span>
            </button>
          </div>

          {error ? <div className="error-banner">{error}</div> : null}

          {isLoading ? (
            <div className="empty-state">
              <p>Loading todos...</p>
            </div>
          ) : orderedTodos.length ? (
            <div className="todo-list">
              {orderedTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No todos yet</h3>
              <p>Click Add Todo or use a quick option to create your first task.</p>
            </div>
          )}
        </section>

        {isModalOpen ? (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-card" onClick={(event) => event.stopPropagation()}>
              <TodoForm
                form={form}
                setForm={setForm}
                isSubmitting={isSubmitting}
                isEditing={Boolean(editingTodo)}
                onSubmit={handleSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}

export default App;