import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricCard } from './components/MetricCard';
import { StatusChip, TaskStatus } from './components/StatusChip';
import { RankingPage } from './components/RankingPage';
import { ExpensesPage } from './components/ExpensesPage';
import { TasksPage, Task } from './components/TasksPage';
import { AdminPage } from './components/AdminPage';
import { ProfilePage } from './components/ProfilePage';
import { AddExpensePage } from './components/AddExpensePage';
import { CheckSquare, DollarSign, TrendingUp, User } from 'lucide-react';

interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  perPerson: number;
  date: string;
}

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const houseName = 'Casa Feliz';
  const memberCount = 4;
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Limpiar la cocina', assignee: 'Alex', status: 'in progress', category: 'Limpieza', dueDate: 'Jun 15', recurrence: 'weekly' },
    { id: 2, title: 'Sacar la basura', assignee: 'Jordan', status: 'in progress', category: 'Limpieza', dueDate: 'Jun 13', recurrence: 'daily' },
    { id: 3, title: 'Hacer la compra', assignee: 'You', status: 'pending', category: 'Compras', dueDate: 'Jun 14', recurrence: 'weekly' },
    { id: 4, title: 'Regar las plantas', assignee: 'Sam', status: 'done', category: 'Jardín', dueDate: 'Jun 13', recurrence: 'daily' },
    { id: 5, title: 'Aspirar el salón', assignee: 'You', status: 'in progress', category: 'Limpieza', dueDate: 'Jun 15', recurrence: 'weekly' },
    { id: 6, title: 'Limpiar el baño', assignee: null, status: 'pending', category: 'Limpieza', dueDate: 'Jun 16', recurrence: 'weekly' },
    { id: 7, title: 'Fregar el suelo', assignee: null, status: 'pending', category: 'Limpieza', dueDate: 'Jun 17', recurrence: 'weekly' },
    { id: 8, title: 'Separar el reciclaje', assignee: null, status: 'pending', category: 'Mantenimiento', dueDate: 'Jun 13', recurrence: 'daily' },
  ]);

  const expenses: Expense[] = [
    { id: 1, description: 'Compra supermercado', amount: 156.8, paidBy: 'Alex', perPerson: 39.2, date: 'May 23' },
    { id: 2, description: 'Factura electricidad', amount: 240.0, paidBy: 'Jordan', perPerson: 60.0, date: 'May 20' },
    { id: 3, description: 'Internet', amount: 80.0, paidBy: 'You', perPerson: 20.0, date: 'May 18' },
    { id: 4, description: 'Productos limpieza', amount: 45.5, paidBy: 'Sam', perPerson: 11.38, date: 'May 16' },
  ];

  function claimTask(taskId: number) {
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, assignee: 'You', status: 'pending' } : t)
    );
  }

  function completeTask(taskId: number) {
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, status: 'pending approval' } : t)
    );
  }

  function approveTask(taskId: number) {
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, status: 'done' } : t)
    );
  }

  function addTask(data: Omit<Task, 'id' | 'assignee' | 'status'>) {
    setTasks((prev) => [
      ...prev,
      { ...data, id: Date.now(), assignee: null, status: 'pending' },
    ]);
  }

  function addExpense(_expense: { description: string; category: string; amount: number }) {
    // In a real app this would persist; here it's a no-op placeholder
  }

  const assignedTasks = tasks.filter((t) => t.assignee !== null);
  const pendingTasks = tasks.filter((t) => t.status === 'pending' && t.assignee !== null).length;
  const pendingApproval = tasks.filter((t) => t.status === 'pending approval');
  const monthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const yourShare = expenses.reduce((sum, e) => sum + e.perPerson, 0);
  const yourTasks = tasks.filter((t) => t.assignee === 'You').length;

  return (
    <div className="size-full flex bg-background">
      <Sidebar
        houseName={houseName}
        memberCount={memberCount}
        taskNotifications={pendingTasks}
        expenseNotifications={2}
        adminNotifications={pendingApproval.length}
        userAvatar="JD"
        userRole="Admin"
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="flex-1 overflow-auto">
        {activePage === 'Ranking' && <RankingPage />}
        {activePage === 'Expenses' && <ExpensesPage onNavigate={setActivePage} />}
        {activePage === 'AddExpense' && (
          <AddExpensePage onNavigate={setActivePage} onAdd={addExpense} />
        )}
        {activePage === 'Tasks' && (
          <TasksPage tasks={tasks} onClaim={claimTask} onComplete={completeTask} />
        )}
        {activePage === 'Admin' && (
          <AdminPage
            pendingApproval={pendingApproval}
            onApprove={approveTask}
            onAddTask={addTask}
            onAddExpense={addExpense}
          />
        )}
        {activePage === 'Profile' && <ProfilePage />}

        {activePage === 'Dashboard' && (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="mb-2">¡Bienvenido de nuevo!</h1>
              <p className="text-muted-foreground">
                {currentDate} · {houseName}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Tareas pendientes"
                value={pendingTasks}
                icon={CheckSquare}
                accentColor="teal"
              />
              <MetricCard
                title="Gastos del mes"
                value={`$${monthlyExpenses.toFixed(2)}`}
                subtitle={`Tu parte: $${yourShare.toFixed(2)}`}
                icon={DollarSign}
                accentColor="purple"
              />
              <MetricCard
                title="Tus tareas"
                value={yourTasks}
                subtitle={`de ${tasks.length} tareas totales`}
                icon={TrendingUp}
                accentColor="teal"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-border rounded-xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3>Tareas asignadas</h3>
                  <button
                    onClick={() => setActivePage('Tasks')}
                    className="text-sm text-[var(--color-teal)] hover:underline"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="space-y-3 flex-1">
                  {assignedTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <User size={14} className="text-muted-foreground" />
                        <div>
                          <p className="mb-0.5">{task.title}</p>
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
                      </div>
                      <StatusChip status={task.status} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3>Gastos recientes</h3>
                  <button
                    onClick={() => setActivePage('Expenses')}
                    className="text-sm text-[var(--color-purple)] hover:underline"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-3 flex-1">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="mb-1">{expense.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Pagó {expense.paidBy}</span>
                          <span>·</span>
                          <span>{expense.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>${expense.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${expense.perPerson.toFixed(2)}/ea</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
