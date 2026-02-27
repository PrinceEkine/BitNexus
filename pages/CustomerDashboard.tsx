
import React from 'react';
import { useStore } from '../store';
import { Clock, CheckCircle2, AlertCircle, User, FileText, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomerDashboard: React.FC = () => {
  const store = useStore();
  const myTickets = store.tickets.filter(t => t.customer_id === store.currentUser?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'assigned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in_progress': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Service Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Track your active requests and service history.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Tickets</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {myTickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed Jobs</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {myTickets.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Warranties</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {myTickets.filter(t => t.warranty_expiry && new Date(t.warranty_expiry) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tickets Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-500" />
          Active Requests
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {myTickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500">No active service requests.</p>
            </div>
          ) : (
            myTickets.filter(t => t.status !== 'completed' && t.status !== 'cancelled').map(ticket => (
              <motion.div 
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{ticket.category}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ticket.preferred_date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.preferred_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {ticket.technician_id ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Technician Assigned</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-500 font-medium italic">Assigning technician...</span>
                  )}
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* History & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Service History
          </h2>
          <div className="space-y-4">
            {myTickets.filter(t => t.status === 'completed').slice(0, 5).map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{ticket.category}</p>
                  <p className="text-xs text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Completed</span>
                  <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {myTickets.filter(t => t.status === 'completed').length === 0 && (
              <p className="text-sm text-slate-500 italic">No past services yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Warranties & Subscriptions
          </h2>
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-indigo-100 text-sm">Current Plan</p>
                <h3 className="text-2xl font-bold">Nexus Premium</h3>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                Active
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-200" />
                <span>Priority 24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-200" />
                <span>10% Discount on Spare Parts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-indigo-200" />
                <span>Free Monthly Maintenance Check</span>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
